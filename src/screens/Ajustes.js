import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Boton, Chip, Pantalla, Tarjeta, Texto, Titulo } from '../components/ui';
import { ESTILOS, FLORES, SLOTS } from '../content';
import { horaTexto } from '../logic';
import { color } from '../theme';

export default function Ajustes({
  perfil,
  nubeActiva,
  usuario,
  onAbrirCuenta,
  onCambiarPerfil,
  onCambiarRecordatorios,
  onBorrar,
}) {
  const [confirmar, setConfirmar] = useState(false);
  const [errorBorrar, setErrorBorrar] = useState('');

  const mover = (id, minutos) => {
    onCambiarRecordatorios(
      perfil.recordatorios.map((r) => {
        if (r.id !== id) return r;
        const total = (r.h * 60 + r.m + minutos + 1440) % 1440;
        return { ...r, h: Math.floor(total / 60), m: total % 60 };
      })
    );
  };

  const alternar = (id) =>
    onCambiarRecordatorios(perfil.recordatorios.map((r) => (r.id === id ? { ...r, activo: !r.activo } : r)));

  return (
    <Pantalla>
      <Titulo>Ajustes</Titulo>
      <Texto suave style={{ marginBottom: 16 }}>Hola, {perfil.nombre}. Aquí decides cómo te acompañamos.</Texto>

      {nubeActiva ? (
        <Tarjeta>
          <Text style={s.etiqueta}>MI CUENTA</Text>
          {usuario ? (
            <>
              <Texto style={{ marginBottom: 4 }}>{usuario.email}</Texto>
              <Texto suave style={{ fontSize: 14, marginBottom: 12 }}>Tu progreso se guarda en la nube.</Texto>
              <Boton titulo="Administrar mi cuenta" variante="suave" onPress={onAbrirCuenta} />
            </>
          ) : (
            <>
              <Texto suave style={{ fontSize: 14, marginBottom: 12 }}>
                Hoy tu progreso vive solo en este teléfono. Si quieres, crea una cuenta para no perderlo.
              </Texto>
              <Boton titulo="Crear cuenta o iniciar sesión" variante="suave" onPress={onAbrirCuenta} />
            </>
          )}
        </Tarjeta>
      ) : null}

      <Tarjeta>
        <Text style={s.etiqueta}>RECORDATORIOS</Text>
        <Texto suave style={{ fontSize: 14, marginBottom: 8 }}>
          Son invitaciones. Elige cuáles y a qué hora; apágalos cuando quieras.
        </Texto>
        {perfil.recordatorios.map((r) => {
          const slot = SLOTS.find((x) => x.id === r.id);
          return (
            <View key={r.id} style={s.recordatorio}>
              <Pressable
                onPress={() => alternar(r.id)}
                accessibilityRole="switch"
                accessibilityState={{ checked: r.activo }}
                style={[s.interruptor, r.activo && s.interruptorOn]}
              >
                <View style={[s.bola, r.activo && s.bolaOn]} />
              </Pressable>
              <View style={{ flex: 1 }}>
                <Text style={s.recNombre}>{slot.nombre}</Text>
                <Text style={s.recDetalle}>{slot.titulo}</Text>
              </View>
              <Pressable onPress={() => mover(r.id, -30)} accessibilityRole="button" accessibilityLabel="30 minutos antes" style={s.paso}>
                <Text style={s.pasoTexto}>−</Text>
              </Pressable>
              <Text style={s.hora}>{horaTexto(r.h, r.m)}</Text>
              <Pressable onPress={() => mover(r.id, 30)} accessibilityRole="button" accessibilityLabel="30 minutos después" style={s.paso}>
                <Text style={s.pasoTexto}>+</Text>
              </Pressable>
            </View>
          );
        })}
      </Tarjeta>

      <Tarjeta>
        <Text style={s.etiqueta}>ESTILO DE FRASES</Text>
        <View style={s.chips}>
          {ESTILOS.map((e) => (
            <Chip key={e.id} texto={e.texto} activo={perfil.estilo === e.id} onPress={() => onCambiarPerfil({ estilo: e.id })} />
          ))}
        </View>
      </Tarjeta>

      <Tarjeta>
        <Text style={s.etiqueta}>MI FLOR</Text>
        <View style={s.chips}>
          {FLORES.map((f) => (
            <Chip key={f.id} texto={`${f.final} ${f.nombre}`} activo={perfil.flor === f.id} onPress={() => onCambiarPerfil({ flor: f.id })} />
          ))}
        </View>
      </Tarjeta>

      <Tarjeta>
        <Text style={s.etiqueta}>TUS DATOS</Text>
        <Texto suave style={{ fontSize: 14, marginBottom: 12 }}>
          Todo se guarda solo en este teléfono. No guardamos peso, medidas, fotos ni calorías.
        </Texto>
        {confirmar ? (
          <>
            <Texto style={{ marginBottom: 10 }}>
              {usuario
                ? 'Se borrarán tus respuestas, check-ins y tu planta, también los guardados en la nube, y se cerrará tu sesión. Esto no se puede deshacer. ¿Seguro?'
                : 'Se borrarán tus respuestas, check-ins y tu planta. Esto no se puede deshacer. ¿Seguro?'}
            </Texto>
            {errorBorrar ? <Texto style={{ color: '#A33A2A', marginBottom: 10 }}>{errorBorrar}</Texto> : null}
            <Boton
              titulo="Sí, borrar todo"
              variante="acento"
              onPress={async () => {
                setErrorBorrar('');
                try {
                  await onBorrar();
                } catch (e) {
                  setErrorBorrar('No pudimos borrar tu copia en la nube (¿sin conexión?). No se borró nada. Inténtalo con internet.');
                }
              }}
            />
            <Boton titulo="Mejor no" variante="texto" onPress={() => { setConfirmar(false); setErrorBorrar(''); }} />
          </>
        ) : (
          <Boton titulo="Borrar todos mis datos" variante="suave" onPress={() => setConfirmar(true)} />
        )}
      </Tarjeta>

      <Texto suave style={s.aviso}>
        Nutre tu mente no diagnostica ni reemplaza la atención de un profesional. Si estás en crisis, contacta a un
        profesional de salud o a los servicios de emergencia de tu país.
      </Texto>
    </Pantalla>
  );
}

const s = StyleSheet.create({
  etiqueta: { fontSize: 12, letterSpacing: 1, color: color.suave, fontWeight: '600', marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  recordatorio: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 8 },
  recNombre: { fontSize: 16, fontWeight: '600', color: color.texto },
  recDetalle: { fontSize: 13, color: color.suave },
  hora: { fontSize: 16, fontWeight: '600', color: color.texto, minWidth: 48, textAlign: 'center' },
  paso: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: color.primarioClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pasoTexto: { fontSize: 20, color: color.primario, fontWeight: '700', lineHeight: 22 },
  interruptor: { width: 46, height: 28, borderRadius: 14, backgroundColor: color.borde, padding: 3, justifyContent: 'center' },
  interruptorOn: { backgroundColor: color.primario },
  bola: { width: 22, height: 22, borderRadius: 11, backgroundColor: color.blanco },
  bolaOn: { alignSelf: 'flex-end' },
  aviso: { fontSize: 13, textAlign: 'center', marginTop: 4 },
});
