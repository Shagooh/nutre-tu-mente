import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Estos valores NO son secretos (identifican el proyecto; la seguridad está en las reglas de Firestore).
// Se leen de variables EXPO_PUBLIC_* (archivo .env en local, y variables de GitHub/Cloud Build en CI).
// Deben escribirse como "process.env.EXPO_PUBLIC_..." literal para que Expo las incluya al compilar.
const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

// Sin configuración la app funciona 100 % en modo local (sin cuentas ni nube).
export const nubeActiva = Boolean(config.apiKey && config.projectId && config.appId);

let app = null;
let auth = null;
let db = null;

if (nubeActiva) {
  app = getApps()[0] || initializeApp(config);
  try {
    // En móvil la sesión se guarda en AsyncStorage; en web, en el navegador.
    auth =
      Platform.OS === 'web'
        ? FirebaseAuth.initializeAuth(app, { persistence: FirebaseAuth.browserLocalPersistence })
        : FirebaseAuth.initializeAuth(app, {
            persistence: FirebaseAuth.getReactNativePersistence(AsyncStorage),
          });
  } catch (e) {
    // Con la recarga en caliente (fast refresh) Auth ya puede estar inicializado.
    auth = FirebaseAuth.getAuth(app);
  }
  db = getFirestore(app);
}

export { app, auth, db };
