import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { color } from '../theme';
import { etapaPlanta } from '../logic';

// La planta crece con el cuidado. Nunca se debilita si un día no entras.
export default function Planta({ flor, pts, grande }) {
  const etapa = etapaPlanta(pts, flor);
  const [escala] = useState(() => new Animated.Value(etapa.escala));
  const [balanceo] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.spring(escala, { toValue: etapa.escala, bounciness: 12, useNativeDriver: true }).start();
  }, [etapa.escala, escala]);

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(balanceo, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(balanceo, { toValue: -1, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [balanceo]);

  const giro = balanceo.interpolate({ inputRange: [-1, 1], outputRange: ['-5deg', '5deg'] });
  const tam = grande ? 88 : 64;

  return (
    <View style={s.caja}>
      <View style={[s.suelo, { height: tam * 1.9, width: tam * 1.9, borderRadius: tam }]}>
        <Animated.View style={{ transform: [{ scale: escala }, { rotate: giro }] }}>
          <Text style={{ fontSize: tam }} accessibilityLabel={`Tu ${etapa.flor.nombre}, etapa ${etapa.nombre}`}>
            {etapa.emoji}
          </Text>
        </Animated.View>
      </View>
      <Text style={s.nombre}>{etapa.flor.nombre} · {etapa.nombre}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  caja: { alignItems: 'center', marginVertical: 6 },
  suelo: { backgroundColor: color.primarioClaro, alignItems: 'center', justifyContent: 'center' },
  nombre: { marginTop: 8, color: color.suave, fontSize: 14 },
});
