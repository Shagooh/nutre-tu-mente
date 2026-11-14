import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Boton, Chip, Pantalla, Texto, Titulo } from '../components/ui';
import { EMOCIONES_CHECKIN, INTENSIDADES_CHECKIN, NECESIDADES_CHECKIN } from '../content/checkin';
import { relojBosque } from '../reloj-bosque';
import { nuevoId } from '../fusion';
import { validarCalendario } from '../contrato-bosque';
import { color } from '../theme';
import CuidadoCheckin from '../components/CuidadoCheckin';

export default function CheckIn({ onGuardar, onCerrar, onAbrirCuidado }) {
  const [emocion, setEmocion] = useState(null);
  const [intensidad, setIntensidad] = useState(null);
  const [necesidad, setNecesidad] = useState(null);
  const [cuidado, setCuidado] = useState('');
  const [listo, setListo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const captura = useRef(null);
  const ocupado = useRef(false);
  const completa = Boolean(emocion && intensidad && necesidad);

  const guardar = async () => {
    if (ocupado.current || listo) return;
    if (!completa) { setError('Elige una emoción, su intensidad y una necesidad para guardar.'); return; }
    ocupado.current = true;
    setGuardando(true);
    setError('');
    try {
      // Fecha e identidad estables incluso si el primer intento de disco falla.
      captura.current ??= { ...relojBosque.capturar(), id: nuevoId() };
      const registro = { ...captura.current, schemaVersion: 2, emocion, intensidad, necesidad, cuidado: cuidado.trim() };
      if (!validarCalendario(registro)) throw new Error('storage/invalid');
      await onGuardar(registro);
      setListo(true);
    } catch {
      setError('No pudimos guardar. Tus respuestas siguen aquí. Intenta otra vez.');
    } finally { ocupado.current = false; setGuardando(false); }
  };

  const elegida = EMOCIONES_CHECKIN.find((e) => e.id === emocion);
  if (listo) return (
    <Pantalla edges={['top', 'bottom']}>
      <Text style={s.hero}>{elegida.icono}</Text>
      <Titulo style={{ textAlign: 'center' }}>Gracias por mirarte hoy.</Titulo>
      <Texto style={{ textAlign: 'center', marginBottom: 20 }}>Tu registro está guardado.</Texto>
      <CuidadoCheckin registro={{ emocion, necesidad, intensidad }} onAbrirCuidado={onAbrirCuidado} />
      <Boton titulo="Volver" onPress={onCerrar} />
    </Pantalla>
  );

  return (
    <Pantalla edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable onPress={onCerrar} disabled={guardando} accessibilityRole="button" style={{ minHeight: 44, justifyContent: 'center' }}>
          <Text style={s.volver}>‹ Cerrar</Text>
        </Pressable>
        <Titulo>Check-in</Titulo>
        <Texto suave>Contenido y colores provisionales · en revisión clínica</Texto>
        <Texto style={s.pregunta}>¿Cómo estoy?</Texto>
        <View style={s.emociones}>
          {EMOCIONES_CHECKIN.map((e) => (
            <Pressable key={e.id} accessibilityRole="radio" accessibilityLabel={e.texto}
              accessibilityState={{ checked: emocion === e.id, disabled: guardando }} disabled={guardando}
              onPress={() => setEmocion(e.id)} style={[s.emocion, emocion === e.id && s.elegida]}>
              <Text style={{ fontSize: 28 }}>{e.icono}</Text>
              <Text style={s.etiqueta}>{e.texto}</Text>
            </Pressable>
          ))}
        </View>
        <Texto style={s.pregunta}>¿Con qué intensidad?</Texto>
        <View style={s.chips}>
          {INTENSIDADES_CHECKIN.map((i) => <Chip key={i.valor} texto={i.texto} activo={intensidad === i.valor} onPress={() => { if (!ocupado.current) setIntensidad(i.valor); }} />)}
        </View>
        <Texto style={s.pregunta}>¿Qué necesito?</Texto>
        <Texto suave>Elige una opción.</Texto>
        <View style={s.chips}>
          {NECESIDADES_CHECKIN.map((n) => <Chip key={n.id} texto={n.texto} activo={necesidad === n.id} onPress={() => { if (!ocupado.current) setNecesidad(n.id); }} />)}
        </View>
        <Texto style={s.pregunta}>¿Cómo me puedo cuidar ahora?</Texto>
        <TextInput accessibilityLabel="Cómo me puedo cuidar ahora, opcional" style={s.input}
          value={cuidado} onChangeText={setCuidado} editable={!guardando}
          placeholder="Si quieres, escríbelo aquí (opcional)" placeholderTextColor={color.suave}
          multiline maxLength={280} />
        {error ? <Text accessibilityRole="alert" style={{ color: color.texto, marginTop: 12 }}>{error}</Text> : null}
        <Boton titulo={guardando ? 'Guardando…' : 'Guardar'} onPress={guardar} disabled={!completa || guardando} style={{ marginTop: 18 }} />
      </KeyboardAvoidingView>
    </Pantalla>
  );
}

const s = StyleSheet.create({
  hero: { fontSize: 64, textAlign: 'center', marginTop: 30, marginBottom: 10 },
  volver: { color: color.primario, fontSize: 16, fontWeight: '600' },
  pregunta: { fontSize: 18, fontWeight: '600', marginTop: 18, marginBottom: 10 },
  emociones: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emocion: { width: '47%', flexGrow: 1, alignItems: 'center', padding: 12, minHeight: 82, borderRadius: 16, borderWidth: 1.5, borderColor: color.borde, backgroundColor: color.tarjeta },
  elegida: { borderColor: color.primario, backgroundColor: color.primarioClaro },
  etiqueta: { fontSize: 16, color: color.texto, marginTop: 4, textAlign: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  input: { backgroundColor: color.tarjeta, borderWidth: 1.5, borderColor: color.borde, borderRadius: 14, padding: 14, minHeight: 80, fontSize: 16, color: color.texto, textAlignVertical: 'top' },
});
