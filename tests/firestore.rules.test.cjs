const { readFileSync } = require('node:fs');
const { before, after, beforeEach, test } = require('node:test');
const assert = require('node:assert/strict');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } = require('firebase/firestore');
let env;
const projectId = 'demo-nutrimind';
before(async () => {
  assert.ok(process.env.FIRESTORE_EMULATOR_HOST, 'Solo se ejecuta contra el emulador');
  env = await initializeTestEnvironment({ projectId, firestore: { rules: readFileSync('firestore.rules', 'utf8') } });
});
after(async () => { if (env) await env.cleanup(); });
beforeEach(async () => { await env.clearFirestore(); });
const db = (uid) => uid ? env.authenticatedContext(uid).firestore() : env.unauthenticatedContext().firestore();
const control = (d) => doc(d, 'syncControls/A');
const registro = (d) => doc(d, 'users/A/checkins/id1');
const activo = { estado: 'activo', generacion: 'g1', operacion: null };
const checkin = () => ({ id: 'id1', fecha: '2026-11-07', hora: '10:00', animo: 3, necesidades: [], cuidado: '', generacion: 'g1', actualizado: serverTimestamp() });

test('propietaria permitida; B y anónimo no leen ni escriben A', async () => {
  const a = db('A');
  await assertSucceeds(setDoc(control(a), activo));
  await assertSucceeds(setDoc(registro(a), checkin()));
  for (const uid of ['B', null]) {
    await assertFails(getDoc(registro(db(uid))));
    await assertFails(setDoc(registro(db(uid)), checkin()));
    await assertFails(getDoc(control(db(uid))));
  }
  await assertFails(setDoc(doc(a, 'users/A/arboles/mes'), { especie: 'roble' }));
});
test('datos inmutables y validación de campos/tipos/largos', async () => {
  const a = db('A');
  await setDoc(control(a), activo);
  await assertFails(setDoc(registro(a), { ...checkin(), peso: 80 }));
  await assertFails(setDoc(registro(a), { ...checkin(), animo: 6 }));
  await assertFails(setDoc(registro(a), { ...checkin(), cuidado: 'a'.repeat(281) }));
  await assertFails(setDoc(registro(a), { ...checkin(), hora: { peso: 80 } }));
  await assertFails(setDoc(registro(a), { ...checkin(), necesidades: [{ calorias: 100 }] }));
  await setDoc(registro(a), checkin());
  await assertFails(updateDoc(registro(a), { animo: 4, actualizado: serverTimestamp() }));
  await assertFails(deleteDoc(registro(a)));
});
test('barrera remota impide resubidas y generación vieja tras reiniciar', async () => {
  const a = db('A');
  await setDoc(control(a), activo);
  await setDoc(registro(a), checkin());
  await updateDoc(control(a), { estado: 'eliminando', operacion: 'op1' });
  await assertFails(setDoc(doc(a, 'users/A/checkins/id2'), { ...checkin(), id: 'id2' }));
  await assertSucceeds(deleteDoc(registro(a)));
  await updateDoc(control(a), { estado: 'borrado' });
  await assertFails(setDoc(registro(a), checkin()));
  await assertFails(deleteDoc(control(a)));
  await assertFails(updateDoc(control(a), { estado: 'activo', operacion: null }));
  await assertSucceeds(setDoc(control(a), { ...activo, generacion: 'g2' }));
  await assertFails(setDoc(registro(a), checkin()));
  await assertSucceeds(setDoc(registro(a), { ...checkin(), generacion: 'g2' }));
});
test('perfil solo permite revisión consecutiva y generación vigente', async () => {
  const a = db('A');
  await setDoc(control(a), activo);
  const perfil = { perfil: { nombre: 'A', recordatorios: [] }, retornos: 0, lecciones: [], perfilActualizado: '2026-11-07', revision: 1, generacion: 'g1', actualizado: serverTimestamp() };
  const ref = doc(a, 'users/A');
  await assertSucceeds(setDoc(ref, perfil));
  await assertFails(setDoc(ref, perfil));
  await assertSucceeds(setDoc(ref, { ...perfil, revision: 2 }));
  await assertFails(setDoc(ref, { ...perfil, revision: 3, perfil: { ...perfil.perfil, peso: 60 } }));
  await assertFails(setDoc(ref, { ...perfil, revision: 3, perfil: { ...perfil.perfil, recordatorios: [{ id: 'tarde', h: 18, m: 0, activo: true, peso: 60 }] } }));
  await assertFails(setDoc(ref, { ...perfil, revision: 3, perfil: { ...perfil.perfil, objetivo: { peso: 60 } } }));
});
test('registros legados solo admiten añadir metadato generación', async () => {
  const a = db('A');
  await setDoc(control(a), activo);
  await env.withSecurityRulesDisabled(async (ctx) => {
    const { generacion, ...legacy } = checkin();
    await setDoc(registro(ctx.firestore()), legacy);
  });
  await assertFails(updateDoc(registro(a), { generacion: 'g1', cuidado: 'cambio' }));
  await assertSucceeds(updateDoc(registro(a), { generacion: 'g1' }));
  await assertFails(updateDoc(registro(a), { actualizado: serverTimestamp() }));
});
