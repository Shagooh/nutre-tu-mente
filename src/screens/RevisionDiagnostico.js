import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { perfilDiagnostico, seleccionarRespuesta } from '../contrato-incorporacion';
import { color } from '../theme';
import { Barra, Boton, Opcion, Pantalla, Texto, Titulo } from '../components/ui';
import { DIAGNOSTICO, PREFERENCIAS } from '../content/incorporacion';
import { BIENVENIDA } from '../content/bienvenida';

const preguntas = [...DIAGNOSTICO.preguntas, ...PREFERENCIAS.preguntas];
const pasos = ['inicio'];
for (const pregunta of DIAGNOSTICO.preguntas) {
  pasos.push(pregunta.id);
  if (DIAGNOSTICO.validaciones[pregunta.id]) pasos.push('tras-' + pregunta.id);
}
pasos.push('nombre', 'resultado', ...PREFERENCIAS.preguntas.map(p => p.id), 'fin');

// La ruta de desarrollo inyecta una sesión aislada hasta la revisión de 5.1.
export default function RevisionDiagnostico({ onTerminar }) {
  const [indice, ir] = useState(0);
  const [respuestas, responder] = useState({});
  const [bloqueo, bloquear] = useState('');
  const [nombre, nombrar] = useState('');
  const [error, mostrarError] = useState('');
  const paso = pasos[indice];
  const pregunta = preguntas.find(p => p.id === paso);
  const seleccion = respuestas[paso] ?? [];
  const avanzar = () => ir(indice + 1);
  const guardar = valor => responder(prev => ({ ...prev, [paso]: valor }));
  const reiniciar = () => { responder({}); nombrar(''); mostrarError(''); bloquear(''); ir(0); };
  const terminar = async () => {
    const recoger = catalogo => Object.fromEntries(catalogo.preguntas.map(p => [p.id, respuestas[p.id]]));
    try {
      await onTerminar(nombre.trim(), { schemaVersion: 1, diagnostico: recoger(DIAGNOSTICO), preferencias: recoger(PREFERENCIAS) });
    } catch {
      mostrarError('Revisa las respuestas antes de continuar.');
    }
  };
  let contenido;
  if (bloqueo || paso === 'fin') {
    contenido = <>
      <Titulo>{bloqueo || 'Tu roble empieza con una bellota.'}</Titulo>
      {!bloqueo && <Boton titulo="Ir a Inicio" onPress={terminar} />}
      {error ? <Texto>{error}</Texto> : null}
      {bloqueo ? <Boton titulo="Volver a la pregunta" onPress={() => bloquear('')} /> : null}
      <Boton titulo="Reiniciar con respuestas vacías" onPress={reiniciar} />
    </>;
  } else if (pregunta) {
    const diagnostico = paso.startsWith('diag-');
    const numero = Number(paso.split('-')[1]);
    const total = diagnostico ? DIAGNOSTICO.preguntas.length : PREFERENCIAS.preguntas.length;
    const continuar = () => {
      if (paso === 'diag-12' && !seleccion.includes('ninguna')) bloquear('Derivación pendiente de revisión clínica');
      else if (paso === 'pref-2' && seleccion.includes('menor-18')) bloquear('Orientación para menores pendiente de revisión clínica');
      else avanzar();
    };
    contenido = <>
      <Texto>{diagnostico ? 'Diagnóstico' : 'Preferencias'} · {numero} de {total}</Texto>
      <Barra paso={numero} total={total} />
      <Titulo>{pregunta.texto}</Titulo>
      <Texto suave>{pregunta.tipo}</Texto>
      {pregunta.opciones.map(o => <Opcion key={o.id} titulo={o.texto} activo={seleccion.includes(o.id)}
        onPress={() => responder(prev => ({ ...prev, [paso]: seleccionarRespuesta(pregunta, prev[paso] ?? [], o.id) }))} />)}
      <Boton titulo="Continuar" disabled={!seleccion.length} onPress={continuar} />
      {(pregunta.omisible || pregunta.tipo.includes('opcional')) &&
        <Boton titulo="Saltar" variante="texto" onPress={() => { guardar(null); avanzar(); }} />}
    </>;
  } else if (paso === 'resultado') {
    const perfil = perfilDiagnostico(respuestas);
    const momentos = respuestas['diag-4'] ?? [];
    const momento = DIAGNOSTICO.preguntas.find(p => p.id === 'diag-4').opciones.find(o => o.id === momentos[0]);
    const mensaje = perfil === 'Conciencia' && momentos.length !== 1
      ? 'Texto pendiente de revisión editorial para el momento omitido o múltiple.'
      : DIAGNOSTICO.resultados[perfil].replace('[momento]', momento?.texto.toLowerCase() ?? '').replace('[Nombre]', () => nombre.trim());
    contenido = <>
      <Titulo>{perfil}</Titulo><Texto>{mensaje}</Texto>
      <Texto>{DIAGNOSTICO.tituloFunciones}</Texto>
      <Texto>Check-in diario · Frases diarias · Me está costando</Texto>
      <Boton titulo={DIAGNOSTICO.botonResultado} onPress={avanzar} />
    </>;
  } else {
    const mensaje = paso === 'inicio' ? BIENVENIDA.transicion : paso === 'nombre'
      ? DIAGNOSTICO.nombre.titulo : DIAGNOSTICO.validaciones[paso.slice(5)];
    contenido = <>
      <Titulo>{mensaje}</Titulo>
      {paso === 'nombre' && <TextInput accessibilityLabel="Apodo ficticio" placeholder="Apodo ficticio"
        maxLength={30} value={nombre} onChangeText={nombrar}
        style={{ padding: 14, fontSize: 18, color: color.texto, borderWidth: 1, borderColor: color.borde, borderRadius: 12 }} />}
      <Boton titulo={paso === 'inicio' ? 'Probar con datos ficticios' : 'Continuar'}
        disabled={paso === 'nombre' && !nombre.trim()} onPress={avanzar} />
    </>;
  }
  return <Pantalla key={bloqueo || paso}>
    <View style={{ width: '100%', maxWidth: 540, alignSelf: 'center', gap: 10 }}>
      <Texto suave>Revisión local · Usa respuestas ficticias. Se descartan al recargar.</Texto>
      {contenido}
      {indice > 0 && !bloqueo && <Boton titulo="Atrás" variante="texto" onPress={() => ir(indice - 1)} />}
    </View>
  </Pantalla>;
}
