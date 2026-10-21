import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Barra, Boton, Escala, Opcion, Pantalla, Tarjeta, Texto, Titulo } from '../components/ui';
import { ESTILOS, FLORES, MOMENTOS, OBJETIVOS, SLOTS } from '../content';
import { fraseDelDia, horaTexto, hoyISO } from '../logic';
import { color } from '../theme';

const TOTAL = 9;

const INTRO = [
  { emoji: '🤍', titulo: 'Un lugar sin juicios', texto: 'Aquí no hay calorías, peso ni metas que cumplir. Solo un espacio para acompañarte.' },
  { emoji: '🌬️', titulo: 'Cuando te cuesta', texto: 'Si aparece el desborde, toca "Me está costando". Respiramos juntas un minuto y decides qué necesitas.' },
  { emoji: '🌱', titulo: 'Tu planta crece contigo', texto: 'Cada vez que te cuidas, crece un poco. Y si un día no entras, no pasa nada: nunca se debilita.' },
];

export default function Onboarding({ onTerminar, nubeActiva, onTengoCuenta }) {
  const [paso, setPaso] = useState(0);
  const [intro, setIntro] = useState(0);
  const [acepto, setAcepto] = useState(false);
  const [nombre, setNombre] = useState('');
  const [objetivo, setObjetivo] = useState(null);
  const [momento, setMomento] = useState(null);
  const [recordatorios, setRecordatorios] = useState(SLOTS.map((s) => ({ id: s.id, h: s.h, m: s.m, activo: false })));
  const [estilo, setEstilo] = useState('autocuidado');
  const [flor, setFlor] = useState('girasol');
  const [espacio, setEspacio] = useState(null);

  const siguiente = () => setPaso((p) => p + 1);
  const atras = () => setPaso((p) => Math.max(0, p - 1));

  const elegirMomento = (id) => {
    setMomento(id);
    // Sugerencia amable: activamos el recordatorio del momento que más le cuesta.
    setRecordatorios((rs) => rs.map((r) => ({ ...r, activo: r.id === id })));
  };

  const alternar = (id) =>
    setRecordatorios((rs) => rs.map((r) => (r.id === id ? { ...r, activo: !r.activo } : r)));

  const terminar = () => {
    onTerminar(
      {
        nombre: nombre.trim() || 'tú',
        objetivo,
        momento,
        estilo,
        flor,
        recordatorios,
        consentimiento: hoyISO(),
        creado: hoyISO(),
      },
      espacio
    );
  };

  let contenido;
  let puedeSeguir = true;

  if (paso === 0) {
    puedeSeguir = acepto;
    contenido = (
      <>
        <Text style={s.hero}>🌱</Text>
        <Titulo>Nutre tu mente</Titulo>
        <Texto suave style={{ marginBottom: 18 }}>
          Una compañera en el bolsillo para los momentos en que más te cuesta contigo misma.
        </Texto>
        <Tarjeta tono="acento">
          <Texto style={{ fontWeight: '600', marginBottom: 6 }}>Antes de empezar</Texto>
          <Texto>
            Esta app no reemplaza la atención de un profesional, no diagnostica ni trata trastornos de la conducta
            alimentaria. Si estás pasando por algo grave o sientes que estás en crisis, busca ayuda profesional.
          </Texto>
        </Tarjeta>
        <Texto suave style={{ marginBottom: 14 }}>
          {nubeActiva
            ? 'Por defecto guardamos todo solo en tu teléfono: tu apodo, tus respuestas, tus check-ins y tus horarios. Si más adelante creas una cuenta (es opcional), también guardaremos una copia en la nube de Google (Firebase) para que no la pierdas. No guardamos peso, medidas, fotos ni calorías. Puedes borrar todo cuando quieras desde Ajustes.'
            : 'Guardamos solo en tu teléfono: tu apodo, tus respuestas, tus check-ins y tus horarios. No guardamos peso, medidas, fotos ni calorías. Puedes borrar todo cuando quieras desde Ajustes.'}
        </Texto>
        <Pressable style={s.consentimiento} onPress={() => setAcepto(!acepto)} accessibilityRole="checkbox" accessibilityState={{ checked: acepto }}>
          <View style={[s.caja, acepto && s.cajaOn]}>{acepto ? <Text style={s.tic}>✓</Text> : null}</View>
          <Text style={[s.consTexto]}>Entiendo cómo funciona y acepto el uso de mis datos.</Text>
        </Pressable>
      </>
    );
  } else if (paso === 1) {
    contenido = (
      <>
        <Titulo>¿Cómo quieres que te llamemos?</Titulo>
        <Texto suave style={{ marginBottom: 14 }}>Puede ser tu nombre o un apodo.</Texto>
        <TextInput
          style={s.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Tu nombre o apodo"
          placeholderTextColor={color.suave}
          maxLength={30}
          autoFocus
        />
      </>
    );
  } else if (paso === 2) {
    puedeSeguir = !!objetivo;
    contenido = (
      <>
        <Titulo>¿Qué te gustaría lograr?</Titulo>
        <Texto suave style={{ marginBottom: 14 }}>Elige lo que más resuena hoy.</Texto>
        {OBJETIVOS.map((o) => (
          <Opcion key={o.id} titulo={o.texto} activo={objetivo === o.id} onPress={() => setObjetivo(o.id)} />
        ))}
      </>
    );
  } else if (paso === 3) {
    puedeSeguir = !!momento;
    contenido = (
      <>
        <Titulo>¿Cuándo te cuesta más?</Titulo>
        <Texto suave style={{ marginBottom: 14 }}>Así sabemos cuándo acompañarte mejor.</Texto>
        {MOMENTOS.map((m) => (
          <Opcion key={m.id} titulo={m.texto} activo={momento === m.id} onPress={() => elegirMomento(m.id)} />
        ))}
      </>
    );
  } else if (paso === 4) {
    contenido = (
      <>
        <Titulo>¿Quieres recordatorios?</Titulo>
        <Texto suave style={{ marginBottom: 14 }}>
          Tú eliges cuáles. Son invitaciones, nunca exigencias, y puedes pausarlos cuando quieras.
        </Texto>
        {recordatorios.map((r) => {
          const slot = SLOTS.find((x) => x.id === r.id);
          return (
            <Opcion
              key={r.id}
              titulo={`${slot.nombre} · ${horaTexto(r.h, r.m)}`}
              detalle={slot.titulo}
              activo={r.activo}
              onPress={() => alternar(r.id)}
            />
          );
        })}
        <Texto suave style={{ fontSize: 14 }}>Puedes cambiar los horarios después, en Ajustes.</Texto>
      </>
    );
  } else if (paso === 5) {
    contenido = (
      <>
        <Titulo>¿Qué frases prefieres?</Titulo>
        <Texto suave style={{ marginBottom: 14 }}>Recibirás una frase al día en este estilo.</Texto>
        {ESTILOS.map((e) => (
          <Opcion key={e.id} titulo={e.texto} detalle={fraseDelDia(e.id)} activo={estilo === e.id} onPress={() => setEstilo(e.id)} />
        ))}
      </>
    );
  } else if (paso === 6) {
    contenido = (
      <>
        <Titulo>Elige tu flor</Titulo>
        <Texto suave style={{ marginBottom: 14 }}>Crecerá a medida que te cuides.</Texto>
        <View style={s.flores}>
          {FLORES.map((f) => (
            <Pressable
              key={f.id}
              accessibilityRole="button"
              accessibilityLabel={f.nombre}
              accessibilityState={{ selected: flor === f.id }}
              onPress={() => setFlor(f.id)}
              style={[s.flor, flor === f.id && s.florOn]}
            >
              <Text style={{ fontSize: 40 }}>{f.final}</Text>
              <Text style={s.florNombre}>{f.nombre}</Text>
            </Pressable>
          ))}
        </View>
      </>
    );
  } else if (paso === 7) {
    puedeSeguir = !!espacio;
    contenido = (
      <>
        <Titulo>Una última pregunta</Titulo>
        <Texto style={{ marginBottom: 18 }}>¿Cuánto espacio ocupa hoy la comida en tu cabeza?</Texto>
        <Escala valor={espacio} onCambio={setEspacio} izquierda="Muy poco" derecha="Muchísimo" />
        <Texto suave style={{ marginTop: 18, fontSize: 14 }}>
          No hay respuesta correcta. Te lo volveremos a preguntar en un tiempo, solo para que veas tu propio camino.
        </Texto>
      </>
    );
  } else {
    const it = INTRO[intro];
    contenido = (
      <>
        <Text style={s.hero}>{it.emoji}</Text>
        <Titulo>{intro === 0 ? `Bienvenida, ${nombre.trim() || 'tú'}` : it.titulo}</Titulo>
        {intro === 0 ? <Text style={s.sub}>{it.titulo}</Text> : null}
        <Texto style={{ marginBottom: 16 }}>{it.texto}</Texto>
        <Texto suave>{intro + 1} de {INTRO.length}</Texto>
      </>
    );
  }

  const enIntro = paso === TOTAL - 1;
  const ultimo = enIntro && intro === INTRO.length - 1;

  const accion = () => {
    if (enIntro) {
      if (ultimo) terminar();
      else setIntro(intro + 1);
    } else siguiente();
  };

  return (
    <Pantalla scroll={false} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ marginBottom: 20 }}>
          <Barra paso={paso + 1} total={TOTAL} />
        </View>
        <View style={{ flex: 1 }}>{contenido}</View>
        <View style={{ gap: 6 }}>
          <Boton
            titulo={ultimo ? 'Empezar' : paso === 0 ? 'Comenzar' : 'Continuar'}
            onPress={accion}
            disabled={!puedeSeguir}
          />
          {paso > 0 && !enIntro ? <Boton titulo="Atrás" variante="texto" onPress={atras} /> : null}
          {paso === 0 && nubeActiva ? (
            <Boton titulo="Ya tengo una cuenta" variante="texto" onPress={onTengoCuenta} />
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </Pantalla>
  );
}

const s = StyleSheet.create({
  hero: { fontSize: 64, textAlign: 'center', marginTop: 10, marginBottom: 14 },
  sub: { fontSize: 18, color: color.primario, fontWeight: '600', marginBottom: 12 },
  input: {
    backgroundColor: color.tarjeta,
    borderWidth: 1.5,
    borderColor: color.borde,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: color.texto,
  },
  consentimiento: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  caja: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: color.primario,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cajaOn: { backgroundColor: color.primario },
  tic: { color: color.blanco, fontWeight: '700' },
  consTexto: { flex: 1, fontSize: 15, color: color.texto },
  flores: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  flor: {
    width: '30%',
    flexGrow: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: color.borde,
    backgroundColor: color.tarjeta,
  },
  florOn: { borderColor: color.primario, backgroundColor: color.primarioClaro },
  florNombre: { marginTop: 4, fontSize: 13, color: color.texto, textAlign: 'center' },
});
