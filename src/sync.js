import { collection, doc, getDoc, getDocs, runTransaction, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { COLECCIONES, limpiar } from './fusion';
import { conflicto, fusionarPerfil, iguales } from './contratos-sync';

import { relojBosque } from './reloj-bosque';

const controlRef = (uid) => doc(db, 'syncControls', uid);
const asegurarControl = (snap, generacion) => {
  const c = snap.data();
  if (!c || c.estado !== 'activo') throw conflicto('sync/deleting');
  if (c.generacion !== generacion) throw conflicto('sync/generation');
};

// Inicializar solo después de vincular el almacenamiento local al UID.
// Un tombstone nunca se libera por un reintento automático.
export async function activarNube(uid, generacion, reiniciar = false) {
  return runTransaction(db, async (tx) => {
    const ref = controlRef(uid);
    const s = await tx.get(ref);
    if (!s.exists() || (reiniciar && s.data().estado === 'borrado')) {
      tx.set(ref, { estado: 'activo', generacion, operacion: null });
      return generacion;
    }
    if (s.data().estado !== 'activo') throw conflicto('sync/deleting');
    return s.data().generacion;
  });
}

export async function obtenerPerfil(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) throw conflicto();
  return snap.data();
}
export async function obtenerControl(uid) {
  return (await getDoc(controlRef(uid))).data() || null;
}

export async function sincronizar(uid, d) {
  const generacion = d.nubeGeneracion;
  if (!generacion) throw conflicto('sync/generation');
  const subidos = {};
  for (const col of COLECCIONES) {
    for (const it of (d[col] || []).filter((x) => !x._s)) {
      await runTransaction(db, async (tx) => {
        const control = await tx.get(controlRef(uid));
        asegurarControl(control, generacion);
        const ref = doc(db, 'users', uid, col, it.id);
        const existente = await tx.get(ref);
        const cuerpo = { ...limpiar(it), generacion };
        if (existente.exists()) {
          const { actualizado, confirmadoEn, generacion: anterior, ...guardado } = existente.data();
          if (!iguales(limpiar(it), guardado) || (anterior && anterior !== generacion)) throw conflicto();
          if (!anterior) tx.update(ref, { generacion });
        } else {
          if (col === 'checkins' && relojBosque.reciente(it._captura)) cuerpo.confirmadoEn = serverTimestamp();
          tx.set(ref, { ...cuerpo, actualizado: serverTimestamp() });
        }
      });
      (subidos[col] ||= []).push(it.id);
    }
  }
  let perfilSubido = null;
  if (d.perfilSucio && d.perfil) {
    perfilSubido = await runTransaction(db, async (tx) => {
      asegurarControl(await tx.get(controlRef(uid)), generacion);
      const ref = doc(db, 'users', uid);
      const snap = await tx.get(ref);
      const remoto = snap.exists() ? snap.data() : null;
      const perfil = fusionarPerfil(d.perfilBase, limpiar(d.perfil), remoto?.perfil);
      if (d.perfilOperacion && remoto?.ultimaOperacion === d.perfilOperacion) {
        if (!iguales(perfil, remoto.perfil)) throw conflicto('sync/profile-conflict');
        return { perfilActualizado: d.perfilActualizado, operacion: d.perfilOperacion, local: d.perfil, perfil: remoto.perfil, revision: remoto.revision };
      }
      const revision = (remoto?.revision || 0) + 1;
      tx.set(ref, {
        perfil, revision, generacion,
        ultimaOperacion: d.perfilOperacion || null,
        lecciones: [...new Set([...(remoto?.lecciones || []), ...d.lecciones])],
        retornos: Math.max(remoto?.retornos || 0, d.retornos || 0),
        perfilActualizado: d.perfilActualizado, actualizado: serverTimestamp(),
      });
      return { perfilActualizado: d.perfilActualizado, operacion: d.perfilOperacion, local: d.perfil, perfil, revision };
    });
  }
  const remoto = { checkins: [], cuestas: [], mental: [] };
  // Pull completo: un cursor global por colecciones distintas puede saltarse
  // una escritura concurrente. Optimizar solo con cursores independientes.
  for (const col of COLECCIONES) {
    const snap = await getDocs(collection(db, 'users', uid, col));
    snap.forEach((s) => {
      const { actualizado, confirmadoEn, generacion: g, ...resto } = s.data();
      if (g && g !== generacion) return;
      const ms = confirmadoEn?.toMillis?.();
      if (col === 'checkins' && Number.isFinite(ms) && !s.metadata?.hasPendingWrites) {
        resto._confirmadoMs = ms;
      }
      remoto[col].push({ ...resto, id: s.id });
    });
  }
  const perfil = await getDoc(doc(db, 'users', uid));
  if (perfil.exists()) Object.assign(remoto, perfil.data());
  asegurarControl(await getDoc(controlRef(uid)), generacion);
  remoto.ultimaSync = Date.now();
  return { remoto, subidos, perfilSubido };
}

// La barrera permanece en borrado tras el último lote. Para empezar otra copia
// se necesita una confirmación explícita y una generación nueva.
export async function borrarNube(uid, operacion) {
  const ref = controlRef(uid);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const c = snap.data();
    if (c?.estado === 'borrado' && c.generacion === operacion.generacion) return;
    if (c && c.generacion !== operacion.generacion) throw conflicto('sync/generation');
    if (c?.estado === 'eliminando' && c.operacion !== operacion.id) throw conflicto('sync/deleting');
    if (c?.estado === 'eliminando') return;
    tx.set(ref, { estado: 'eliminando', generacion: operacion.generacion, operacion: operacion.id });
  });
  const estado = (await getDoc(ref)).data();
  if (estado.estado === 'borrado') return;
  for (const col of COLECCIONES) {
    const snap = await getDocs(collection(db, 'users', uid, col));
    for (let i = 0; i < snap.docs.length; i += 400) {
      const lote = writeBatch(db);
      snap.docs.slice(i, i + 400).forEach((s) => lote.delete(s.ref));
      await lote.commit();
    }
  }
  await runTransaction(db, async (tx) => {
    const s = await tx.get(ref);
    if (s.data().operacion !== operacion.id || s.data().estado !== 'eliminando') throw conflicto('sync/deleting');
    tx.delete(doc(db, 'users', uid));
    tx.set(ref, { ...s.data(), estado: 'borrado' });
  });
}
