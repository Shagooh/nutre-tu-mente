import { StyleSheet, Text, View } from 'react-native';
import Planta from '../components/Planta';
import { Boton, Escala, Pantalla, Tarjeta, Texto, Titulo } from '../components/ui';
import { cambioCalma, diasDesde, hoyISO, logros, puntos, ultimos7 } from '../logic';
import { color } from '../theme';
import { useState } from 'react';

export default function Progreso({ datos, onEspacioMental }) {
  const { perfil } = datos;
  const dias = ultimos7(datos);
  const calma = cambioCalma(datos);
  const lista = logros(datos);
  const mental = datos.mental;
  const ultimo = mental[mental.length - 1];
  const toca = !ultimo || diasDesde(ultimo.fecha) >= 30;
  const [valor, setValor] = useState(null);

  return (
    <Pantalla>
      <Titulo>Tu progreso</Titulo>
      <Texto suave style={{ marginBottom: 6 }}>Un recorrido amable, sin números que exigir.</Texto>

      <Planta flor={perfil.flor} pts={puntos(datos)} grande />

      <Tarjeta>
        <Text style={s.etiqueta}>ÚLTIMOS 7 DÍAS · ¿CÓMO ESTUVE?</Text>
        <View style={s.fila}>
          {dias.map((d) => (
            <View key={d.fecha} style={s.dia}>
              <View style={[s.punto, d.emoji && s.puntoOn]}>
                <Text style={{ fontSize: 22 }}>{d.emoji || ''}</Text>
              </View>
              <Text style={s.diaTexto}>{d.etiqueta}</Text>
            </View>
          ))}
        </View>
        <Texto suave style={{ fontSize: 14, marginTop: 8 }}>
          Los días en blanco son solo días en que descansaste de la app.
        </Texto>
      </Tarjeta>

      <Tarjeta>
        <Text style={s.etiqueta}>CUANDO TE ESTÁ COSTANDO</Text>
        {calma ? (
          calma.promedio > 0 ? (
            <Texto>
              Después de usar "Me está costando", tu calma subió en promedio {calma.promedio} punto
              {calma.promedio === 1 ? '' : 's'} (en {calma.veces} {calma.veces === 1 ? 'vez' : 'veces'}). 🌬️
            </Texto>
          ) : (
            <Texto>
              A veces la calma llega después. Haber parado ya es un cuidado, y sigue siendo valioso aunque hoy no se note.
            </Texto>
          )
        ) : (
          <Texto suave>Cuando uses "Me está costando", aquí verás cómo te acompaña.</Texto>
        )}
      </Tarjeta>

      <Tarjeta>
        <Text style={s.etiqueta}>ESPACIO MENTAL</Text>
        {mental.length ? (
          <View style={s.fila}>
            {mental.slice(-6).map((m) => (
              <View key={m.fecha} style={s.dia}>
                <View style={[s.barra, { height: 14 + m.valor * 10 }]} />
                <Text style={s.diaTexto}>{m.valor}</Text>
              </View>
            ))}
          </View>
        ) : null}
        {toca ? (
          <>
            <Texto style={{ marginVertical: 12 }}>¿Cuánto espacio ocupa hoy la comida en tu cabeza?</Texto>
            <Escala valor={valor} onCambio={setValor} izquierda="Muy poco" derecha="Muchísimo" />
            <Boton
              titulo="Guardar"
              disabled={!valor}
              style={{ marginTop: 14 }}
              onPress={() => {
                onEspacioMental(valor);
                setValor(null);
              }}
            />
          </>
        ) : (
          <Texto suave style={{ marginTop: 8 }}>Te lo volveremos a preguntar en unas semanas.</Texto>
        )}
      </Tarjeta>

      <Tarjeta>
        <Text style={s.etiqueta}>TUS LOGROS</Text>
        {lista.map((l) => (
          <View key={l.id} style={s.logro}>
            <Text style={{ fontSize: 24, opacity: l.ok ? 1 : 0.25 }}>{l.emoji}</Text>
            <Text style={[s.logroTexto, !l.ok && { color: color.suave }]}>{l.texto}</Text>
            {l.ok ? <Text style={{ color: color.primario, fontWeight: '700' }}>✓</Text> : null}
          </View>
        ))}
      </Tarjeta>
    </Pantalla>
  );
}

const s = StyleSheet.create({
  etiqueta: { fontSize: 12, letterSpacing: 1, color: color.suave, fontWeight: '600', marginBottom: 12 },
  fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  dia: { alignItems: 'center', flex: 1 },
  punto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: color.borde,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  puntoOn: { borderStyle: 'solid', backgroundColor: color.primarioClaro, borderColor: color.primarioClaro },
  diaTexto: { marginTop: 6, fontSize: 12, color: color.suave },
  barra: { width: 18, borderRadius: 9, backgroundColor: color.primario },
  logro: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  logroTexto: { flex: 1, fontSize: 15, color: color.texto },
});
