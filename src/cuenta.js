import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth, nubeActiva } from './firebase';

export function escucharSesion(callback) {
  if (!nubeActiva) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, (u) => callback(u ? { uid: u.uid, email: u.email } : null));
}

export const registrar = (email, clave) =>
  createUserWithEmailAndPassword(auth, email.trim(), clave);

export const entrar = (email, clave) => signInWithEmailAndPassword(auth, email.trim(), clave);

export const salir = () => (nubeActiva ? signOut(auth) : Promise.resolve());

export const recuperar = (email) => sendPasswordResetEmail(auth, email.trim());

// Para borrar la cuenta Firebase exige una contraseña reciente.
export async function reautenticar(clave, uid = auth.currentUser?.uid) {
  const u = auth.currentUser;
  if (!u || u.uid !== uid) throw Object.assign(new Error('sync/session-required'), { code: 'sync/session-required' });
  const credencial = EmailAuthProvider.credential(u.email, clave);
  await reauthenticateWithCredential(u, credencial);
}

export const eliminarUsuario = (uid = auth.currentUser?.uid) => {
  const usuario = auth.currentUser;
  if (!usuario || usuario.uid !== uid) throw Object.assign(new Error('sync/session-required'), { code: 'sync/session-required' });
  return deleteUser(usuario);
};
