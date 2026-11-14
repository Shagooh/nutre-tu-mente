import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import BellotaRoble from '../components/BellotaRoble';
import { Barra, Boton, Escala, Opcion, Pantalla, Tarjeta, Texto, Titulo } from '../components/ui';
import { ESTILOS, MOMENTOS, OBJETIVOS, SLOTS } from '../content';
import { BIENVENIDA } from '../content/bienvenida';
import { fraseDelDia, horaTexto, hoyISO } from '../logic';
import { color } from '../theme';

const TOTAL = 9;

export default function Onboarding({ onTerminar, nubeActiva, onTengoCuenta }) {
  const [paso, setPaso] = useState(0);
  const [intro, setIntro] = useState(0);
  const [enBienvenida, setEnBienvenida] = useState(true);
  const [acepto, setAcepto] = useState(false);
  const [nombre, setNombre] = useState('');
  const [objetivo, setObjetivo] = useState(null);
  const [momento, setMomento] = useState(null);
  const [recordatorios, setRecordatorios] = useState(SLOTS.map((s) => ({ id: s.id, h: s.h, m: s.m, activo: false })));
  const [estilo, setEstilo] = useState('autocuidado');
  const [espacio, setEspacio] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const enviando = useRef(false);
  const scroll = useRef(null);

  const ir = (destino) => {
    setPaso(destino);
    setError('');
    scroll.current?.scrollTo({ y: 0, animated: false });
  };
  const siguiente = () => ir(paso + 1);
  const atras = () => ir(Math.max(0, paso - 1));

  const elegirMomento = (id) => {
    setMomento(id);
    // Solo orienta el acompañamiento. Los recordatorios requieren elección propia.
  };

  const alternar = (id) =>
    setRecordatorios((rs) => rs.map((r) => (r.id === id ? { ...r, activo: !r.activo } : r)));

  const terminar = async () => {
    if (enviando.current) return;
    enviando.current = true;
    setGuardando(true);
    setError('');
    try {
      await onTerminar(
      {
        nombre: nombre.trim() || 'tú',
        objetivo,
        momento,
        estilo,
        // Contrato histórico de especie, compatible con el perfil y las reglas actuales.
        flor: 'roble',
        recordatorios,
        consentimiento: hoyISO(),
        creado: hoyISO(),
      },
      espacio
      );
    } catch {
      setError('No pudimos guardar en este dispositivo. Tus respuestas siguen aquí. Inténtalo de nuevo.');
    } finally {
      enviando.current = false;
      setGuardando(false);
    }
  };

  let contenido;
  let puedeSeguir = true;

  if (enBienvenida) {
    const pagina = BIENVENIDA.pantallas[intro];
    contenido = (
      <>
        <Text style={s.marca}>NUTRIMIND</Text>
        <View style={s.semilla}><BellotaRoble size={intro === 3 ? 116 : 178} /></View>
        <Texto suave style={s.contador}>{intro + 1} de {BIENVENIDA.pantallas.length}</Texto>
        <Titulo>{pagina.titulo}</Titulo>
        {pagina.texto ? <Texto style={{ marginTop: 12 }}>{pagina.texto}</Texto> : null}
        {pagina.funciones?.map(([titulo, texto]) => (
          <Tarjeta key={titulo} style={{ marginTop: 10, marginBottom: 0 }}>
            <Texto style={{ fontWeight: '600' }}>{titulo}</Texto>
            <Texto suave>{texto}</Texto>
          </Tarjeta>
        ))}
        <Texto suave style={s.borrador}>Vista previa · Contenido en revisión. El bosque está en desarrollo.</Texto>
      </>
    );
  } else if (paso === 0) {
    puedeSeguir = acepto;
    contenido = (
      <>
        <BellotaRoble size={120} />
        <Titulo>Antes de empezar</Titulo>
        <Texto suave style={{ marginBottom: 18 }}>
          Esta app acompaña, no reemplaza la atención profesional.
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
          accessibilityLabel="Tu nombre o apodo"
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
  } else if (paso === 7) {
    contenido = (
      <>
        <Texto suave style={s.contador}>TU ÁRBOL</Texto>
        <Titulo>Todo empieza con una bellota</Titulo>
        <Texto suave style={{ marginTop: 8, marginBottom: 20 }}>Por ahora, tu árbol será un roble.</Texto>
        <View accessible accessibilityRole="radio" accessibilityLabel="Roble, única especie disponible" accessibilityState={{ checked: true }} style={s.roble}>
          <Text style={s.seleccion}>✓ Seleccionado</Text>
          <BellotaRoble size={210} />
          <Text style={s.robleNombre}>Roble</Text>
          <Texto suave>Empieza como una semilla.</Texto>
        </View>
        <Texto suave style={s.borrador}>Tu roble crece una vez por cada día de check-in, también sin cuenta ni conexión.</Texto>
      </>
    );
  } else {
    contenido = (
      <>
        <View style={s.semilla}><BellotaRoble size={210} /></View>
        <Titulo>Listo, {nombre.trim() || 'tú'}.</Titulo>
        <Texto style={{ marginTop: 12 }}>Tu roble empieza con una bellota.</Texto>
        <Texto suave style={{ marginTop: 12 }}>No necesitas venir todos los días: cada hoja cuenta.</Texto>
      </>
    );
  }

  const ultimo = !enBienvenida && paso === TOTAL - 1;

  const accion = () => {
    if (enBienvenida) {
      if (intro === BIENVENIDA.pantallas.length - 1) setEnBienvenida(false);
      else setIntro(intro + 1);
      scroll.current?.scrollTo({ y: 0, animated: false });
    } else if (ultimo) return terminar();
    else siguiente();
  };

  return (
    <Pantalla scroll={false} edges={['top', 'bottom']} contentStyle={s.pantalla}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ marginBottom: 20 }}>
          <Barra paso={enBienvenida ? intro + 1 : paso + 1} total={enBienvenida ? BIENVENIDA.pantallas.length : TOTAL} />
        </View>
        <ScrollView ref={scroll} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
          {contenido}
        </ScrollView>
        {error ? <Text accessibilityRole="alert" style={s.error}>{error}</Text> : null}
        <View style={{ gap: 6, paddingTop: 12 }}>
          <Boton
            titulo={guardando ? 'Guardando…' : ultimo ? 'Empezar' : !enBienvenida && paso === 0 ? 'Acepto y continúo' : 'Continuar'}
            onPress={accion}
            disabled={!puedeSeguir || guardando}
          />
          {!enBienvenida && paso > 0 ? <Boton titulo="Atrás" variante="texto" onPress={atras} disabled={guardando} /> : null}
          {enBienvenida ? <Boton titulo="Saltar bienvenida" variante="texto" onPress={() => { setEnBienvenida(false); scroll.current?.scrollTo({ y: 0, animated: false }); }} /> : null}
          {enBienvenida && intro > 0 ? <Boton titulo="Atrás" variante="texto" onPress={() => { setIntro(intro - 1); scroll.current?.scrollTo({ y: 0, animated: false }); }} /> : null}
          {(enBienvenida || paso === 0) && nubeActiva ? (
            <Boton titulo="Ya tengo una cuenta" variante="texto" onPress={onTengoCuenta} />
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </Pantalla>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, paddingBottom: 12 },
  marca: { fontSize: 12, letterSpacing: 3, color: color.primario, fontWeight: '700', textAlign: 'center', marginTop: 10 },
  semilla: { alignSelf: 'center', backgroundColor: color.primarioClaro, borderRadius: 140, marginVertical: 18 },
  contador: { color: color.primario, fontSize: 13, letterSpacing: 1, marginBottom: 12 },
  borrador: { fontSize: 13, lineHeight: 20, marginTop: 20 },
  error: { color: '#A33A2A', fontSize: 15, marginTop: 8 },
  roble: { padding: 20, borderRadius: 24, borderWidth: 2, borderColor: color.primario, backgroundColor: color.primarioClaro, alignItems: 'center' },
  seleccion: { color: color.primario, fontWeight: '600', fontSize: 14, alignSelf: 'flex-end' },
  robleNombre: { color: color.texto, fontWeight: '700', fontSize: 24, marginBottom: 8 },
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
});
