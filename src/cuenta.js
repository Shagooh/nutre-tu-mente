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
export async function reautenticar(clave) {
  const u = auth.currentUser;
  const credencial = EmailAuthProvider.credential(u.email, clave);
  await reauthenticateWithCredential(u, credencial);
}

export const eliminarUsuario = () => deleteUser(auth.currentUser);
