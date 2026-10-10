import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Boton, Chip, Pantalla, Tarjeta, Texto, Titulo } from '../components/ui';
import { ANIMOS, NECESIDADES } from '../content';
import { hoyISO } from '../logic';
import { color } from '../theme';

export default function CheckIn({ onGuardar, onCerrar }) {
  const [animo, setAnimo] = useState(null);
  const [necesidades, setNecesidades] = useState([]);
  const [cuidado, setCuidado] = useState('');
  const [listo, setListo] = useState(false);

  const alternar = (id) =>
    setNecesidades((n) => (n.includes(id) ? n.filter((x) => x !== id) : [...n, id]));

  const guardar = () => {
    onGuardar({
      fecha: hoyISO(),
      hora: new Date().toTimeString().slice(0, 5),
      animo,
      necesidades,
      cuidado: cuidado.trim(),
    });
    setListo(true);
  };

  const sugerencias = NECESIDADES.filter((n) => necesidades.includes(n.id));

  if (listo) {
    return (
      <Pantalla edges={['top', 'bottom']}>
        <Text style={s.hero}>🌿</Text>
        <Titulo style={{ textAlign: 'center' }}>Gracias por detenerte</Titulo>
        <Texto style={{ textAlign: 'center', marginBottom: 20 }}>
          Escucharte ya es una forma de cuidarte. Tu planta creció un poquito.
        </Texto>
        {sugerencias[0] ? (
          <Tarjeta tono="verde">
            <Texto style={{ fontWeight: '600', marginBottom: 4 }}>Una idea para ahora</Texto>
            <Texto>{sugerencias[0].accion}</Texto>
          </Tarjeta>
        ) : null}
        <Boton titulo="Volver" onPress={onCerrar} />
      </Pantalla>
    );
  }

  return (
    <Pantalla edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable onPress={onCerrar} accessibilityRole="button" style={{ marginBottom: 10 }}>
          <Text style={s.volver}>‹ Cerrar</Text>
        </Pressable>
        <Titulo>Check-in</Titulo>

        <Texto style={s.pregunta}>¿Cómo estoy?</Texto>
        <View style={s.animos}>
          {ANIMOS.map((a) => (
            <Pressable
              key={a.valor}
              accessibilityRole="button"
              accessibilityLabel={a.texto}
              accessibilityState={{ selected: animo === a.valor }}
              onPress={() => setAnimo(a.valor)}
              style={[s.animo, animo === a.valor && s.animoOn]}
            >
              <Text style={{ fontSize: 30 }}>{a.emoji}</Text>
              <Text style={s.animoTexto}>{a.texto}</Text>
            </Pressable>
          ))}
        </View>

        <Texto style={s.pregunta}>¿Qué necesito?</Texto>
        <View style={s.chips}>
          {NECESIDADES.map((n) => (
            <Chip key={n.id} texto={n.texto} activo={necesidades.includes(n.id)} onPress={() => alternar(n.id)} />
          ))}
        </View>

        <Texto style={s.pregunta}>¿Cómo me puedo cuidar ahora?</Texto>
        {sugerencias.length ? (
          <Tarjeta tono="verde">
            {sugerencias.slice(0, 2).map((n) => (
              <Texto key={n.id} style={{ marginBottom: 4 }}>• {n.accion}</Texto>
            ))}
          </Tarjeta>
        ) : null}
        <TextInput
          style={s.input}
          value={cuidado}
          onChangeText={setCuidado}
          placeholder="Si quieres, escríbelo aquí (opcional)"
          placeholderTextColor={color.suave}
          multiline
          maxLength={280}
        />

        <Boton titulo="Guardar" onPress={guardar} disabled={!animo} style={{ marginTop: 18 }} />
      </KeyboardAvoidingView>
    </Pantalla>
  );
}

const s = StyleSheet.create({
  hero: { fontSize: 64, textAlign: 'center', marginTop: 30, marginBottom: 10 },
  volver: { color: color.primario, fontSize: 16, fontWeight: '600' },
  pregunta: { fontSize: 18, fontWeight: '600', marginTop: 18, marginBottom: 10 },
  animos: { flexDirection: 'row', justifyContent: 'space-between' },
  animo: {
    width: '18.5%',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: color.borde,
    backgroundColor: color.tarjeta,
  },
  animoOn: { borderColor: color.primario, backgroundColor: color.primarioClaro },
  animoTexto: { fontSize: 11, color: color.suave, marginTop: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  input: {
    backgroundColor: color.tarjeta,
    borderWidth: 1.5,
    borderColor: color.borde,
    borderRadius: 14,
    padding: 14,
    minHeight: 80,
    fontSize: 16,
    color: color.texto,
    textAlignVertical: 'top',
  },
});
