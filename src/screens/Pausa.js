import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Respiracion from '../components/Respiracion';
import { Boton, Pantalla, Texto, Titulo } from '../components/ui';
import { color } from '../theme';

export default function Pausa({ onCerrar }) {
  const [fin, setFin] = useState(false);
  return (
    <Pantalla edges={['top', 'bottom']}>
      <Pressable onPress={onCerrar} accessibilityRole="button" style={{ marginBottom: 14 }}>
        <Text style={s.volver}>‹ Cerrar</Text>
      </Pressable>
      <Titulo>Pausa de 1 minuto</Titulo>
      <Texto suave>Solo respirar. Nada más que hacer.</Texto>
      <Respiracion segundos={60} onTerminar={() => setFin(true)} />
      {fin ? (
        <>
          <Texto style={{ textAlign: 'center', marginBottom: 14 }}>Gracias por darte este momento 🌿</Texto>
          <Boton titulo="Volver" onPress={onCerrar} />
        </>
      ) : null}
    </Pantalla>
  );
}

const s = StyleSheet.create({
  volver: { color: color.primario, fontSize: 16, fontWeight: '600' },
});
