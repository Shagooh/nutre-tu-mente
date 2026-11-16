import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';
import { color } from '../theme';

// Día 0 de roble/Oak.tsx: mismos trazos y paleta, encuadrados para móvil.
// Sin React DOM, recursos remotos, rostro ni crecimiento simulado por puntos.
function BellotaRoble({ size = 184, etiqueta = false }) {
  return (
    <View style={s.caja}>
      <View accessible accessibilityRole="image" accessibilityLabel="Bellota de roble, semilla antes del primer check-in">
        <Svg width={size} height={size} viewBox="410 725 150 150" accessible={false}>
          <Ellipse cx="489" cy="847" rx="61" ry="8" fill="#526238" opacity={0.16} />
          <Path d="M448 792Q479 778 522 793C529 815 506 839 484 844Q467 846 462 833Q446 822 448 792Z" fill="#d19a61" stroke="#373d2c" strokeWidth={4} />
          <Path d="M456 803Q458 827 476 836" stroke="#f4cc8c" strokeWidth={5} fill="none" strokeLinecap="round" />
          <Path d="M445 804C443 781 458 767 482 766C507 764 525 778 527 793Q491 817 445 804Z" fill="#786144" stroke="#373d2c" strokeWidth={4} />
          <Path d="M456 789l6 -5 6 2m6 -10 7 -4 6 3m7 8 7 -4 7 3M480 768Q472 754 478 750Q485 747 485 766" fill="#896942" stroke="#564a35" strokeWidth={3} strokeLinecap="round" />
        </Svg>
      </View>
      {etiqueta ? <Text style={s.nombre}>Roble · Bellota</Text> : null}
    </View>
  );
}

export default memo(BellotaRoble);

const s = StyleSheet.create({
  caja: { alignItems: 'center', marginVertical: 6 },
  nombre: { color: color.suave, fontSize: 14, marginTop: 8 },
});
