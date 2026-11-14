import { router } from 'expo-router';
import Onboarding from '../screens/Onboarding';
import { useEstadoApp } from '../estado-app';
import { nubeActiva } from '../firebase';

export default function BienvenidaRoute() {
  const { terminarOnboarding } = useEstadoApp();
  return <Onboarding onTerminar={terminarOnboarding} nubeActiva={nubeActiva} onTengoCuenta={() => router.push('/cuenta')} />;
}
