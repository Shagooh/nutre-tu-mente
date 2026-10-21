// Mensajes de error de la cuenta: cálidos, claros y sin revelar si un correo existe o no.
export function mensajeError(e) {
  // Firebase a veces añade texto al código (ej. "auth/api-key-not-valid.-please-pass-...").
  if (e && typeof e.code === 'string' && e.code.startsWith('auth/api-key-not-valid')) {
    return 'La configuración de la nube no es válida. Avisa al equipo.';
  }
  switch (e && e.code) {
    case 'auth/invalid-email':
      return 'Revisa que el correo esté bien escrito.';
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con ese correo. Prueba iniciar sesión.';
    case 'auth/weak-password':
      return 'Elige una contraseña un poco más larga (mínimo 8 caracteres).';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-login-credentials':
      return 'El correo o la contraseña no coinciden.';
    case 'auth/too-many-requests':
      return 'Hubo muchos intentos. Espera unos minutos y vuelve a probar.';
    case 'auth/network-request-failed':
      return 'Parece que no hay conexión. Inténtalo cuando tengas internet.';
    case 'auth/requires-recent-login':
      return 'Por seguridad, vuelve a escribir tu contraseña para continuar.';
    case 'auth/operation-not-allowed':
      return 'El acceso con correo aún no está activado en el proyecto.';
    case 'auth/api-key-not-valid':
    case 'auth/invalid-api-key':
      return 'La configuración de la nube no es válida. Avisa al equipo.';
    default:
      return 'Algo no salió bien. Inténtalo de nuevo en un momento.';
  }
}

export const correoValido = (c) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((c || '').trim());
