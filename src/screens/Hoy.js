import { Pressable, StyleSheet, Text, View } from 'react-native';
import Planta from '../components/Planta';
import { Boton, Pantalla, Tarjeta, Texto } from '../components/ui';
import { LECCIONES, OBJETIVOS } from '../content';
import { cuestasUltimaSemana, fraseDelDia, hoyISO, puntos, saludo } from '../logic';
import { color } from '../theme';

export default function Hoy({ datos, vuelve, onCerrarVuelve, onAbrir, onIrALecciones }) {
  const { perfil } = datos;
  const hoy = hoyISO();
  const hechoHoy = datos.checkins.some((c) => c.fecha === hoy);
  const objetivo = OBJETIVOS.find((o) => o.id === perfil.objetivo);
  const sugerida = LECCIONES.find((l) => l.id === objetivo?.leccion && !datos.lecciones.includes(l.id))
    || LECCIONES.find((l) => !datos.lecciones.includes(l.id));
  const muchasVeces = cuestasUltimaSemana(datos) >= 5;

  return (
    <Pantalla>
      <Text style={s.saludo}>{saludo()}, {perfil.nombre}</Text>

      {vuelve ? (
        <Tarjeta tono="verde">
          <Texto style={{ fontWeight: '600' }}>Qué bueno verte de nuevo 🤍</Texto>
          <Texto suave>Aquí estamos, sin prisa. Tu planta te estuvo esperando.</Texto>
          <Pressable onPress={onCerrarVuelve} accessibilityRole="button">
            <Text style={s.cerrar}>Gracias</Text>
          </Pressable>
        </Tarjeta>
      ) : null}

      <Tarjeta>
        <Text style={s.etiqueta}>FRASE DEL DÍA</Text>
        <Text style={s.frase}>“{fraseDelDia(perfil.estilo)}”</Text>
      </Tarjeta>

      <Planta flor={perfil.flor} pts={puntos(datos)} grande />

      <Boton titulo="Me está costando" variante="acento" onPress={() => onAbrir('cuesta')} style={s.grande} />
      <Texto suave style={s.nota}>Respiramos juntas, sin juicio.</Texto>

      <Tarjeta style={{ marginTop: 14 }}>
        <Text style={s.etiqueta}>CHECK-IN</Text>
        {hechoHoy ? (
          <>
            <Texto>Hoy ya te escuchaste 🌿 Gracias por detenerte.</Texto>
            <Boton titulo="Hacer otro" variante="texto" onPress={() => onAbrir('checkin')} />
          </>
        ) : (
          <>
            <Texto style={{ marginBottom: 12 }}>¿Cómo estoy? ¿Qué necesito? ¿Cómo me puedo cuidar ahora?</Texto>
            <Boton titulo="Hacer mi check-in" onPress={() => onAbrir('checkin')} />
          </>
        )}
      </Tarjeta>

      <Boton titulo="Pausa de 1 minuto" variante="suave" onPress={() => onAbrir('pausa')} style={{ marginBottom: 14 }} />

      {sugerida ? (
        <Tarjeta>
          <Text style={s.etiqueta}>¿QUÉ QUIERES TRABAJAR HOY?</Text>
          <Texto style={{ fontWeight: '600' }}>{sugerida.titulo}</Texto>
          <Texto suave style={{ marginBottom: 10 }}>{sugerida.tema} · {sugerida.minutos} min</Texto>
          <Boton titulo="Ver lección" variante="suave" onPress={() => onIrALecciones(sugerida.id)} />
        </Tarjeta>
      ) : null}

      {muchasVeces ? (
        <Tarjeta tono="acento">
          <Texto style={{ fontWeight: '600' }}>Esta semana ha sido intensa 🤍</Texto>
          <Texto>
            Has usado "Me está costando" varias veces. Hacerlo habla de que te estás cuidando. Si sientes que es
            demasiado, hablarlo con tu nutricionista o con un profesional puede acompañarte mejor.
          </Texto>
        </Tarjeta>
      ) : null}

      <Texto suave style={s.aviso}>Nutre tu mente no reemplaza la atención profesional.</Texto>
    </Pantalla>
  );
}

const s = StyleSheet.create({
  saludo: { fontSize: 26, fontWeight: '700', color: color.texto, marginBottom: 14 },
  etiqueta: { fontSize: 12, letterSpacing: 1, color: color.suave, fontWeight: '600', marginBottom: 8 },
  frase: { fontSize: 20, lineHeight: 28, color: color.texto, fontStyle: 'italic' },
  grande: { paddingVertical: 20 },
  nota: { textAlign: 'center', marginTop: 6, fontSize: 14 },
  cerrar: { marginTop: 8, color: color.primario, fontWeight: '600', fontSize: 15 },
  aviso: { textAlign: 'center', fontSize: 13, marginTop: 10 },
});
