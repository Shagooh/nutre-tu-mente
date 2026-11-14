import { memo, useEffect, useMemo, useState } from 'react';
import { AppState, Pressable, Text, View } from 'react-native';
import Svg, { G, Path, Ellipse, Text as SvgText } from 'react-native-svg';
import { Oak } from '../../roble/OakScene';
import { proyectarRoble } from '../roble-mensual';
import { relojBosque } from '../reloj-bosque';
import { diaDelBosque } from '../contrato-bosque';
import { ANIMOS, NECESIDADES } from '../content';
import { EMOCIONES_CHECKIN, NECESIDADES_CHECKIN, INTENSIDADES_CHECKIN } from '../content/checkin';
import { CALENDARIO_BOSQUE } from '../content/calendario-bosque';
import { Boton, Chip } from './ui';
import BellotaRoble from './BellotaRoble';
import { color } from '../theme';
import { emotionalPalettes } from '../../roble/emotions';
import CuidadoCheckin from './CuidadoCheckin';

function Grupo({ onClick, style, 'data-day': dia, ...props }) {
  return <G {...props} onPress={onClick} />;
}
const elementos = { Svg, Group: Grupo, Path, Ellipse, Title: () => null };
const vacios = [];

function RobleMensual({ bosqueId, checkins = vacios, grande, archivo = false, onAbrirCuidado }) {
  const [hoy, setHoy] = useState(() => relojBosque.hoy());
  const [consultando, setConsultando] = useState(archivo);
  const [mesElegido, setMesElegido] = useState(null);
  const [fechaElegida, setFechaElegida] = useState(null);
  useEffect(() => {
    const refrescar = () => setHoy(relojBosque.hoy());
    const timer = setInterval(refrescar, 60000);
    const sub = AppState.addEventListener('change', (estado) => { if (estado === 'active') refrescar(); });
    return () => { clearInterval(timer); sub.remove(); };
  }, []);
  const mes = consultando && mesElegido ? mesElegido : hoy.slice(0, 7);
  const roble = useMemo(() => proyectarRoble(bosqueId, checkins, mes + '-01'), [bosqueId, checkins, mes]);
  const meses = useMemo(() => [...new Set([hoy.slice(0, 7), ...checkins.map(diaDelBosque).filter(Boolean).map((d) => d.slice(0, 7))])].sort().reverse(), [hoy, checkins]);
  const hoja = roble?.hojas.find((h) => h.fecha === fechaElegida);
  const etiqueta = roble?.dias ? 'Roble · ' + roble.mes + ' · ' + roble.dias + (roble.dias === 1 ? ' día registrado' : ' días registrados') : 'Roble · Bellota';
  return (
    <View style={{ alignItems: 'center', marginVertical: 6, width: '100%' }}>
      <View accessible accessibilityRole="image" accessibilityLabel={etiqueta} accessibilityHint="Consulta cada hoja en la lista de días de tu árbol.">
        {roble?.dias ? <Oak tree={roble.tree} size={grande ? 260 : 160} elements={elementos} LeafSymbol={SvgText}
          selected={roble.hojas.findIndex((h) => h.fecha === fechaElegida) + 1}
          onSelect={(dia) => { setConsultando(true); setFechaElegida(roble.hojas[dia - 1].fecha); }} small /> : <BellotaRoble size={grande ? 190 : 140} etiqueta />}
      </View>
      {roble?.dias ? <Text style={{ color: color.suave }}>{etiqueta}</Text> : null}
      {roble?.dias ? <View style={{ alignSelf: 'stretch', marginTop: 10 }}>
        <Text style={{ color: color.suave, marginBottom: 6 }}>Colores e iconos provisionales</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {EMOCIONES_CHECKIN.map((e) => <View key={e.id} accessible accessibilityLabel={`${e.texto} · ${e.color}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, padding: 4 }}>
            <View style={{ width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: color.suave, backgroundColor: emotionalPalettes[e.id].base }} />
            <Text style={{ color: color.texto, fontSize: 14 }}>{e.icono} {e.texto}</Text>
          </View>)}
        </View>
      </View> : null}
      {!archivo ? <Boton titulo={consultando ? 'Cerrar días de mi árbol' : 'Ver días de mi árbol'} variante="texto" onPress={() => { setConsultando(!consultando); setFechaElegida(null); setMesElegido(null); }} /> : null}
      {consultando ? <View style={{ alignSelf: 'stretch' }}>
        <Text style={{ color: color.suave, marginBottom: 8 }}>Información de fechas · texto en revisión</Text>
        <Text style={{ color: color.texto, marginBottom: 12 }}>{CALENDARIO_BOSQUE.explicacion}</Text>
        {roble?.resumen.length ? <View style={{ marginBottom: 12 }}>
          <Text accessibilityRole="header" style={{ color: color.texto, fontSize: 18 }}>Emociones de {mes}</Text>
          {roble.resumen.map((r) => <Text key={r.emocion} style={{ color: color.texto, fontSize: 16 }}>
            {EMOCIONES_CHECKIN.find((e) => e.id === r.emocion).icono} {EMOCIONES_CHECKIN.find((e) => e.id === r.emocion).texto} · {r.dias} {r.dias === 1 ? 'día' : 'días'}
          </Text>)}
        </View> : <Text style={{ color: color.texto, marginBottom: 12 }}>Este mes aún no tiene emociones registradas. Los registros históricos conservan su ánimo original.</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {meses.map((m) => <Chip key={m} texto={m} activo={mes === m} onPress={() => { setMesElegido(m); setFechaElegida(null); }} />)}
        </View>
        {roble?.hojas.length ? roble.hojas.map((h) => {
          const e = EMOCIONES_CHECKIN.find((item) => item.id === h.emocion);
          const abierto = hoja?.fecha === h.fecha;
          return <View key={h.fecha}>
            <Pressable accessibilityRole="button" accessibilityLabel={`${h.fecha} · ${e?.texto || 'Registro histórico'} · ${h.provisional ? 'Fecha provisional' : 'Fecha confirmada'} · ${h.sincronizada ? 'Sincronizado' : 'Solo en este teléfono'}`}
              accessibilityState={{ expanded: abierto, selected: abierto }}
              accessibilityHint="Muestra el registro de este día debajo del botón."
              onPress={() => setFechaElegida(abierto ? null : h.fecha)}
              style={{ minHeight: 48, padding: 14, marginVertical: 4, borderRadius: 14, borderWidth: abierto ? 2 : 1, borderColor: color.primario, backgroundColor: color.primarioClaro }}>
              <Text style={{ color: color.texto, fontSize: 16 }}>{h.fecha} · {e ? e.icono + ' ' + e.texto : 'Registro histórico'}</Text>
              <Text style={{ color: color.texto }}>{h.provisional ? 'Fecha provisional' : 'Fecha confirmada'} · {h.sincronizada ? 'Sincronizado' : 'Solo en este teléfono'}</Text>
            </Pressable>
            {abierto ? <DetalleHoja hoja={h} registros={checkins.filter((c) => diaDelBosque(c) === h.fecha)} onAbrirCuidado={onAbrirCuidado} /> : null}
          </View>;
        }) : <Text style={{ color: color.texto }}>Este mes aún no tiene registros.</Text>}
      </View> : null}
    </View>
  );
}

function DetalleHoja({ hoja, registros, onAbrirCuidado }) {
  const elegido = registros.find((c) => c.id === hoja.registroId);
  const emocion = EMOCIONES_CHECKIN.find((e) => e.id === hoja.emocion);
  return <View style={{ paddingVertical: 16, gap: 8 }}>
    <View accessible accessibilityLiveRegion="polite" style={{ gap: 8 }}>
      <Text accessibilityRole="header" style={{ color: color.texto, fontSize: 18 }}>Registro de {hoja.fecha}</Text>
      {elegido ? <>
        <Text style={{ color: color.texto }}>Emoción: {emocion?.texto} · Intensidad: {INTENSIDADES_CHECKIN.find((i) => i.valor === hoja.intensidad)?.texto}</Text>
        <Text style={{ color: color.texto }}>Necesidad: {NECESIDADES_CHECKIN.find((n) => n.id === hoja.necesidad)?.texto}</Text>
        {elegido.cuidado ? <Text style={{ color: color.texto }}>Cuidado que escribiste: {elegido.cuidado}</Text> : null}
      </> : registros.map((c) => <View key={c.id}>
        <Text style={{ color: color.texto }}>Ánimo original: {c.animo}{ANIMOS.find((a) => a.valor === c.animo) ? ' · ' + ANIMOS.find((a) => a.valor === c.animo).texto : ''}</Text>
        {(c.necesidades || []).map((id) => <Text key={id} style={{ color: color.texto }}>{NECESIDADES.find((n) => n.id === id)?.texto || id}</Text>)}
        {c.cuidado ? <Text style={{ color: color.texto }}>Cuidado que escribiste: {c.cuidado}</Text> : null}
      </View>)}
      <Text style={{ color: color.texto }}>{hoja.provisional ? 'Fecha provisional' : 'Fecha confirmada'} · {hoja.sincronizada ? 'Sincronizado' : 'Solo en este teléfono'}</Text>
    </View>
    {elegido ? <CuidadoCheckin registro={elegido} onAbrirCuidado={onAbrirCuidado} /> : null}
  </View>;
}
export default memo(RobleMensual);
