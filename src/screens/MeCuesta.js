import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Respiracion from '../components/Respiracion';
import { Boton, Chip, Escala, Opcion, Pantalla, Tarjeta, Texto, Titulo } from '../components/ui';
import { NECESIDADES, TIPOS_HAMBRE, TRATOS } from '../content';
import { hoyISO } from '../logic';
import { color } from '../theme';

// Flujo: calma antes → respirar → ¿hambre física o emocional? → ¿qué necesito? → ¿cómo me trato? → calma después
export default function MeCuesta({ onGuardar, onCerrar }) {
  const [paso, setPaso] = useState(0);
  const [calmaAntes, setCalmaAntes] = useState(null);
  const [respiro, setRespiro] = useState(false);
  const [hambre, setHambre] = useState(null);
  const [necesidad, setNecesidad] = useState(null);
  const [trato, setTrato] = useState(null);
  const [calmaDespues, setCalmaDespues] = useState(null);
  const [apoyo, setApoyo] = useState(false);

  const tipo = TIPOS_HAMBRE.find((t) => t.id === hambre);
  const accion = NECESIDADES.find((n) => n.id === necesidad);

  const terminar = () => {
    onGuardar({
      fecha: hoyISO(),
      hora: new Date().toTimeString().slice(0, 5),
      calmaAntes,
      calmaDespues,
      respiro,
      hambre,
      necesidad,
      trato,
    });
    onCerrar();
  };

  if (apoyo) {
    return (
      <Pantalla edges={['top', 'bottom']}>
        <Text style={s.hero}>🤍</Text>
        <Titulo style={{ textAlign: 'center' }}>Gracias por avisar</Titulo>
        <Texto style={{ marginBottom: 14 }}>
          Lo que sientes importa, y no tienes que pasarlo sola. Si sientes que esto te supera, si los atracones se
          repiten con frecuencia o estás en una crisis emocional, hablar con un profesional puede ayudarte mucho.
        </Texto>
        <Tarjeta tono="verde">
          <Texto>
            Contacta a tu nutricionista o psicóloga/o de confianza. Si estás en peligro o necesitas ayuda urgente,
            llama a los servicios de emergencia de tu país.
          </Texto>
        </Tarjeta>
        <Texto suave style={{ marginBottom: 20 }}>Nutre tu mente no reemplaza la atención profesional.</Texto>
        <Boton titulo="Volver" onPress={() => setApoyo(false)} />
      </Pantalla>
    );
  }

  let contenido;
  let puedeSeguir = true;
  let textoBoton = 'Continuar';

  if (paso === 0) {
    puedeSeguir = !!calmaAntes;
    contenido = (
      <>
        <Titulo>Estoy aquí contigo</Titulo>
        <Texto style={{ marginBottom: 6 }}>No tienes que hacerlo perfecto. Vamos de a poco.</Texto>
        <Texto style={s.pregunta}>¿Qué tan en calma te sientes ahora?</Texto>
        <Escala valor={calmaAntes} onCambio={setCalmaAntes} izquierda="Nada en calma" derecha="Muy en calma" />
      </>
    );
  } else if (paso === 1) {
    textoBoton = 'Continuar';
    contenido = (
      <>
        <Titulo>Respiremos un minuto</Titulo>
        <Respiracion segundos={60} onTerminar={() => setRespiro(true)} />
        {respiro ? <Texto style={{ textAlign: 'center' }}>Muy bien 🌿 Lo hiciste.</Texto> : null}
        <Texto suave style={{ textAlign: 'center', fontSize: 14, marginTop: 8 }}>
          Si hoy no puedes, puedes continuar sin respirar.
        </Texto>
      </>
    );
  } else if (paso === 2) {
    puedeSeguir = !!hambre;
    contenido = (
      <>
        <Titulo>¿Es hambre física o emocional?</Titulo>
        <Texto suave style={{ marginBottom: 14 }}>Sin respuestas correctas.</Texto>
        {TIPOS_HAMBRE.map((t) => (
          <Opcion key={t.id} titulo={t.titulo} detalle={t.detalle} activo={hambre === t.id} onPress={() => setHambre(t.id)} />
        ))}
        {tipo ? (
          <Tarjeta tono="verde">
            <Texto>{tipo.tip}</Texto>
          </Tarjeta>
        ) : null}
      </>
    );
  } else if (paso === 3) {
    puedeSeguir = !!necesidad;
    contenido = (
      <>
        <Titulo>¿Qué necesitas ahora?</Titulo>
        <View style={s.chips}>
          {NECESIDADES.map((n) => (
            <Chip key={n.id} texto={n.texto} activo={necesidad === n.id} onPress={() => setNecesidad(n.id)} />
          ))}
        </View>
        {accion ? (
          <Tarjeta tono="verde">
            <Texto style={{ fontWeight: '600', marginBottom: 4 }}>Una pequeña acción</Texto>
            <Texto>{accion.accion}</Texto>
          </Tarjeta>
        ) : null}
      </>
    );
  } else if (paso === 4) {
    puedeSeguir = !!trato;
    contenido = (
      <>
        <Titulo>¿Cómo te quieres tratar ahora?</Titulo>
        <Texto suave style={{ marginBottom: 14 }}>
          Decidas lo que decidas, no hay castigo. Si igual comes, no pasa nada: puedes hacerlo con presencia,
          notando el sabor y cómo se siente tu cuerpo.
        </Texto>
        <View style={s.chips}>
          {TRATOS.map((t) => (
            <Chip key={t} texto={t} activo={trato === t} onPress={() => setTrato(t)} />
          ))}
        </View>
      </>
    );
  } else {
    puedeSeguir = !!calmaDespues;
    textoBoton = 'Listo';
    contenido = (
      <>
        <Titulo>¿Y ahora, cómo te sientes?</Titulo>
        <Texto suave style={{ marginBottom: 6 }}>Cualquier respuesta sirve.</Texto>
        <Texto style={s.pregunta}>¿Qué tan en calma te sientes?</Texto>
        <Escala valor={calmaDespues} onCambio={setCalmaDespues} izquierda="Nada en calma" derecha="Muy en calma" />
        <Tarjeta tono="acento" style={{ marginTop: 20 }}>
          <Texto>Pedir un momento para ti ya fue cuidarte. Gracias por quedarte aquí 🤍</Texto>
        </Tarjeta>
      </>
    );
  }

  return (
    <Pantalla edges={['top', 'bottom']}>
      <View style={s.cabecera}>
        <Pressable onPress={onCerrar} accessibilityRole="button">
          <Text style={s.volver}>‹ Salir</Text>
        </Pressable>
        <Pressable onPress={() => setApoyo(true)} accessibilityRole="button">
          <Text style={s.supera}>Esto me supera</Text>
        </Pressable>
      </View>
      {contenido}
      <View style={{ marginTop: 18 }}>
        <Boton
          titulo={textoBoton}
          disabled={!puedeSeguir}
          onPress={() => (paso === 5 ? terminar() : setPaso(paso + 1))}
        />
        {paso === 1 && !respiro ? (
          <Boton titulo="Saltar la respiración" variante="texto" onPress={() => setPaso(2)} />
        ) : null}
      </View>
    </Pantalla>
  );
}

const s = StyleSheet.create({
  hero: { fontSize: 64, textAlign: 'center', marginTop: 20, marginBottom: 10 },
  cabecera: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  volver: { color: color.primario, fontSize: 16, fontWeight: '600' },
  supera: { color: color.acento, fontSize: 15, fontWeight: '600' },
  pregunta: { fontSize: 18, fontWeight: '600', marginTop: 18, marginBottom: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
});
