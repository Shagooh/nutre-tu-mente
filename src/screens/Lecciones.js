import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Boton, Pantalla, Tarjeta, Texto, Titulo } from '../components/ui';
import { LECCIONES, OBJETIVOS } from '../content';
import { color } from '../theme';

export default function Lecciones({ datos, abrirId, onLeida }) {
  const [abierta, setAbierta] = useState(abrirId || null);

  useEffect(() => {
    if (abrirId) setAbierta(abrirId);
  }, [abrirId]);

  const objetivo = OBJETIVOS.find((o) => o.id === datos.perfil.objetivo);
  const orden = [...LECCIONES].sort((a, b) => (b.id === objetivo?.leccion) - (a.id === objetivo?.leccion));

  if (abierta) {
    const l = LECCIONES.find((x) => x.id === abierta);
    const leida = datos.lecciones.includes(l.id);
    return (
      <Pantalla>
        <Pressable onPress={() => setAbierta(null)} accessibilityRole="button" style={{ marginBottom: 12 }}>
          <Text style={s.volver}>‹ Lecciones</Text>
        </Pressable>
        <Text style={s.tema}>{l.tema.toUpperCase()} · {l.minutos} MIN</Text>
        <Titulo>{l.titulo}</Titulo>
        <View style={{ marginTop: 10 }}>
          {l.parrafos.map((p, i) => (
            <Texto key={i} style={{ marginBottom: 14 }}>{p}</Texto>
          ))}
        </View>
        <Tarjeta tono="verde">
          <Text style={s.tema}>PARA PRACTICAR</Text>
          <Texto>{l.ejercicio}</Texto>
        </Tarjeta>
        {leida ? (
          <Texto style={{ textAlign: 'center', color: color.primario, fontWeight: '600' }}>Leída ✓</Texto>
        ) : (
          <Boton titulo="Marcar como leída" onPress={() => onLeida(l.id)} />
        )}
      </Pantalla>
    );
  }

  return (
    <Pantalla>
      <Titulo>Mini lecciones</Titulo>
      <Texto suave style={{ marginBottom: 16 }}>¿Qué quieres trabajar hoy? Elige a tu ritmo.</Texto>
      {orden.map((l) => {
        const leida = datos.lecciones.includes(l.id);
        const sugerida = l.id === objetivo?.leccion && !leida;
        return (
          <Pressable key={l.id} onPress={() => setAbierta(l.id)} accessibilityRole="button">
            <Tarjeta tono={sugerida ? 'verde' : undefined}>
              <Text style={s.tema}>{l.tema.toUpperCase()} · {l.minutos} MIN</Text>
              <Texto style={{ fontWeight: '600', fontSize: 17 }}>{l.titulo}</Texto>
              {sugerida ? <Texto suave style={s.nota}>Pensada para lo que quieres lograr</Texto> : null}
              {leida ? <Texto style={[s.nota, { color: color.primario }]}>Leída ✓</Texto> : null}
            </Tarjeta>
          </Pressable>
        );
      })}
    </Pantalla>
  );
}

const s = StyleSheet.create({
  volver: { color: color.primario, fontSize: 16, fontWeight: '600' },
  tema: { fontSize: 12, letterSpacing: 1, color: color.suave, fontWeight: '600', marginBottom: 6 },
  nota: { fontSize: 14, marginTop: 4 },
});
