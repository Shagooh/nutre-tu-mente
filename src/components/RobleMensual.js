import { memo, useMemo } from 'react';
import { Text, View } from 'react-native';
import Svg, { G, Path, Ellipse } from 'react-native-svg';
import { Oak } from '../../roble/OakScene';
import { proyectarRoble } from '../roble-mensual';
import { relojBosque } from '../reloj-bosque';
import BellotaRoble from './BellotaRoble';
import { color } from '../theme';

const elementos = { Svg, Group: G, Path, Ellipse, Title: () => null };

function RobleMensual({ uid, checkins, grande }) {
  const hoy = relojBosque.hoyFiable();
  const roble = useMemo(() => proyectarRoble(uid, checkins || [], hoy), [uid, checkins, hoy]);
  if (!roble?.dias) return <BellotaRoble size={grande ? 190 : 140} etiqueta />;
  const etiqueta = 'Roble · ' + roble.mes + ' · ' + roble.dias + (roble.dias === 1 ? ' día registrado' : ' días registrados');
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={etiqueta} style={{ alignItems: 'center', marginVertical: 6 }}>
      <Oak tree={roble.tree} size={grande ? 260 : 160} elements={elementos} small />
      <Text style={{ color: color.suave }}>{etiqueta}</Text>
    </View>
  );
}
export default memo(RobleMensual);
