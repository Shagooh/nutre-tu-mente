import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
import { color } from '../theme';

const CICLO = 10; // 4 s inhalando + 6 s exhalando

// Círculo que se expande y se contrae, con una vibración suave en cada cambio.
export default function Respiracion({ segundos = 60, onTerminar }) {
  const [activa, setActiva] = useState(false);
  const [t, setT] = useState(0);
  const escala = useRef(new Animated.Value(1)).current;

  const pos = t % CICLO;
  const inhalando = pos < 4;

  useEffect(() => {
    if (!activa) return;
    const id = setInterval(() => setT((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [activa]);

  useEffect(() => {
    if (!activa) return;
    if (t >= segundos) {
      setActiva(false);
      onTerminar && onTerminar();
      return;
    }
    try {
      Vibration.vibrate(25);
    } catch (e) {}
    Animated.timing(escala, {
      toValue: inhalando ? 1.55 : 1,
      duration: inhalando ? 4000 : 6000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [activa, inhalando, t >= segundos]);

  const restante = Math.max(0, segundos - t);

  return (
    <View style={s.caja}>
      <View style={s.zona}>
        <Animated.View style={[s.circulo, { transform: [{ scale: escala }] }]} />
        <Pressable
          style={s.centro}
          disabled={activa}
          onPress={() => {
            setT(0);
            setActiva(true);
          }}
          accessibilityRole="button"
          accessibilityLabel={activa ? 'Respiración en curso' : 'Comenzar respiración'}
        >
          <Text style={s.centroTexto}>
            {!activa ? 'Toca para\ncomenzar' : inhalando ? 'Inhala' : 'Exhala'}
          </Text>
        </Pressable>
      </View>
      <Text style={s.ayuda}>
        {activa ? 'Por la nariz, y suelta despacio.' : 'Un minuto, a tu ritmo.'}
      </Text>
      {activa ? <Text style={s.tiempo}>{restante} s</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  caja: { alignItems: 'center', marginVertical: 12 },
  zona: { width: 260, height: 260, alignItems: 'center', justifyContent: 'center' },
  circulo: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: color.primarioClaro,
    borderWidth: 2,
    borderColor: color.primario,
  },
  centro: { width: 150, height: 150, borderRadius: 75, alignItems: 'center', justifyContent: 'center' },
  centroTexto: { fontSize: 20, fontWeight: '600', color: color.primario, textAlign: 'center' },
  ayuda: { marginTop: 8, fontSize: 15, color: color.suave },
  tiempo: { marginTop: 4, fontSize: 14, color: color.suave },
});
