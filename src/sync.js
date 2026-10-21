import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { COLECCIONES, limpiar } from './fusion';

const LOTE = 400; // Firestore admite hasta 500 operaciones por lote

// Estructura en Firestore (todo bajo el usuario, y solo él puede leerlo):
//   users/{uid}                     → perfil, lecciones leídas, retornos
//   users/{uid}/checkins/{id}
//   users/{uid}/cuestas/{id}        ("Me está costando")
//   users/{uid}/mental/{id}         (espacio mental)
export async function sincronizar(uid, d) {
  // 1) Subir lo pendiente
  const lote = [];
  COLECCIONES.forEach((col) =>
    (d[col] || []).filter((it) => !it._s).forEach((it) => lote.push({ col, it }))
  );
  for (let i = 0; i < lote.length; i += LOTE) {
    const b = writeBatch(db);
    lote.slice(i, i + LOTE).forEach(({ col, it }) => {
      b.set(doc(db, 'users', uid, col, it.id), { ...limpiar(it), actualizado: serverTimestamp() });
    });
    await b.commit();
  }
  const subidos = {};
  lote.forEach(({ col, it }) => {
    subidos[col] = [...(subidos[col] || []), it.id];
  });

  let perfilSubido = null;
  if (d.perfilSucio && d.perfil) {
    await setDoc(doc(db, 'users', uid), {
      perfil: limpiar(d.perfil),
      retornos: d.retornos || 0,
      lecciones: d.lecciones || [],
      perfilActualizado: d.perfilActualizado,
      actualizado: serverTimestamp(),
    });
    perfilSubido = { perfilActualizado: d.perfilActualizado };
  }

  // 2) Bajar lo nuevo (solo lo modificado desde la última sincronización, para gastar pocas lecturas)
  const desde = d.ultimaSync ? Timestamp.fromMillis(Math.max(0, d.ultimaSync - 1000)) : null;
  const remoto = { checkins: [], cuestas: [], mental: [] };
  let maxMs = d.ultimaSync || 0;

  for (const col of COLECCIONES) {
    const ref = collection(db, 'users', uid, col);
    const snap = await getDocs(desde ? query(ref, where('actualizado', '>=', desde)) : ref);
    snap.forEach((s) => {
      const { actualizado, ...resto } = s.data();
      remoto[col].push({ ...resto, id: s.id });
      const ms = actualizado && actualizado.toMillis ? actualizado.toMillis() : 0;
      if (ms > maxMs) maxMs = ms;
    });
  }

  const u = await getDoc(doc(db, 'users', uid));
  if (u.exists()) {
    const x = u.data();
    remoto.perfil = x.perfil;
    remoto.perfilActualizado = x.perfilActualizado;
    remoto.retornos = x.retornos || 0;
    remoto.lecciones = x.lecciones || [];
    const ms = x.actualizado && x.actualizado.toMillis ? x.actualizado.toMillis() : 0;
    if (ms > maxMs) maxMs = ms;
  }
  remoto.ultimaSync = maxMs;

  return { remoto, subidos, perfilSubido };
}

// Borra TODO lo que hay en la nube de esta persona (sus registros y su perfil).
export async function borrarNube(uid) {
  for (const col of COLECCIONES) {
    const snap = await getDocs(collection(db, 'users', uid, col));
    const docs = snap.docs;
    for (let i = 0; i < docs.length; i += LOTE) {
      const b = writeBatch(db);
      docs.slice(i, i + LOTE).forEach((s) => b.delete(s.ref));
      await b.commit();
    }
  }
  await deleteDoc(doc(db, 'users', uid));
}
