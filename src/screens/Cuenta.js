import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Boton, Pantalla, Tarjeta, Texto, Titulo } from '../components/ui';
import { entrar, recuperar, registrar } from '../cuenta';
import { correoValido, mensajeError } from '../errores';
import { color } from '../theme';

// Acceso con correo y contraseña. Es opcional: la app funciona sin cuenta.
export default function Cuenta({ usuario, estadoSync, conflicto, onCerrar, onSalir, onSincronizar, onEliminar }) {
  const [modo, setModo] = useState('entrar'); // 'entrar' | 'crear' | 'recuperar'
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [clave2, setClave2] = useState('');
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [cargando, setCargando] = useState(false);
  const [confirmarBorrar, setConfirmarBorrar] = useState(false);
  const [claveBorrar, setClaveBorrar] = useState('');

  const ejecutar = async (fn) => {
    setError('');
    setAviso('');
    setCargando(true);
    try {
      await fn();
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setCargando(false);
    }
  };

  const enviar = () => {
    if (!correoValido(correo)) return setError('Revisa que el correo esté bien escrito.');
    if (modo === 'recuperar') {
      return ejecutar(async () => {
        await recuperar(correo);
        setAviso('Si ese correo tiene una cuenta, te enviamos un mensaje para crear una contraseña nueva.');
      });
    }
    if (clave.length < 8) return setError('La contraseña debe tener al menos 8 caracteres.');
    if (modo === 'crear' && clave !== clave2) return setError('Las contraseñas no coinciden.');
    return ejecutar(async () => {
      if (modo === 'crear') await registrar(correo, clave);
      else await entrar(correo, clave);
      setClave('');
      setClave2('');
    });
  };

  const borrar = () =>
    ejecutar(async () => {
      await onEliminar(claveBorrar);
      setConfirmarBorrar(false);
      setClaveBorrar('');
    });

  const cabecera = (
    <Pressable onPress={onCerrar} accessibilityRole="button" style={{ marginBottom: 12 }}>
      <Text style={s.volver}>‹ Cerrar</Text>
    </Pressable>
  );

  // ----- Con sesión iniciada -----
  if (usuario) {
    const sync =
      estadoSync.estado === 'sincronizando'
        ? 'Guardando en la nube…'
        : estadoSync.estado === 'error'
        ? 'No pudimos sincronizar ahora. Se reintentará cuando haya conexión.'
        : estadoSync.cuando
        ? 'Todo guardado en la nube ✓'
        : 'Aún no se ha sincronizado.';
    const pista =
      estadoSync.estado !== 'error'
        ? ''
        : estadoSync.codigo === 'permission-denied'
        ? 'Firestore rechazó el guardado. Revisa que las reglas de firestore.rules estén publicadas.'
        : estadoSync.codigo === 'unavailable'
        ? 'No hay conexión con Firestore en este momento.'
        : estadoSync.codigo
        ? `Detalle técnico: ${estadoSync.codigo}`
        : '';
    return (
      <Pantalla edges={['top', 'bottom']}>
        {cabecera}
        <Titulo>Mi cuenta</Titulo>
        <Texto suave style={{ marginBottom: 14 }}>{usuario.email}</Texto>

        <Tarjeta tono="verde">
          <Texto style={{ fontWeight: '600' }}>{sync}</Texto>
          <Texto suave style={{ fontSize: 14, marginTop: 4 }}>
            Tu progreso queda guardado para que no se pierda si cambias de teléfono.
          </Texto>
          {pista ? <Texto style={{ fontSize: 14, marginTop: 8, color: '#A33A2A' }}>{pista}</Texto> : null}
        </Tarjeta>
        <Boton titulo="Sincronizar ahora" variante="suave" onPress={onSincronizar} style={{ marginBottom: 10 }} />
        <Boton titulo="Cerrar sesión" variante="suave" onPress={onSalir} style={{ marginBottom: 20 }} />

        <Tarjeta>
          <Text style={s.etiqueta}>ELIMINAR MI CUENTA</Text>
          <Texto suave style={{ fontSize: 14, marginBottom: 12 }}>
            Borra tu cuenta y todo lo guardado en la nube. Tus datos seguirán en este teléfono hasta que los borres
            desde Ajustes.
          </Texto>
          {confirmarBorrar ? (
            <>
              <Texto style={{ marginBottom: 8 }}>Escribe tu contraseña para confirmar. Esto no se puede deshacer.</Texto>
              <TextInput
                style={s.input}
                value={claveBorrar}
                onChangeText={setClaveBorrar}
                secureTextEntry
                placeholder="Tu contraseña"
                placeholderTextColor={color.suave}
                autoCapitalize="none"
              />
              {error ? <Text style={s.error}>{error}</Text> : null}
              <Boton titulo="Sí, eliminar mi cuenta" variante="acento" disabled={cargando || !claveBorrar} onPress={borrar} style={{ marginTop: 12 }} />
              <Boton titulo="Mejor no" variante="texto" onPress={() => setConfirmarBorrar(false)} />
            </>
          ) : (
            <Boton titulo="Eliminar mi cuenta" variante="suave" onPress={() => setConfirmarBorrar(true)} />
          )}
        </Tarjeta>
      </Pantalla>
    );
  }

  // ----- Sin sesión -----
  const titulo = modo === 'crear' ? 'Crear cuenta' : modo === 'recuperar' ? 'Recuperar contraseña' : 'Iniciar sesión';
  return (
    <Pantalla edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {cabecera}
        <Titulo>{titulo}</Titulo>
        <Texto suave style={{ marginBottom: 14 }}>
          {modo === 'crear'
            ? 'Opcional. Tu progreso se guarda en la nube para que no se pierda si cambias de teléfono. Puedes eliminarlo cuando quieras.'
            : modo === 'recuperar'
            ? 'Te enviaremos un enlace para crear una contraseña nueva.'
            : 'Entra para recuperar tu progreso en este teléfono.'}
        </Texto>

        {conflicto ? (
          <Tarjeta tono="acento">
            <Texto>
              Este teléfono ya tiene datos de otra cuenta. Para proteger tu privacidad no los mezclamos. Si quieres
              usar esta cuenta aquí, borra primero los datos locales desde Ajustes.
            </Texto>
          </Tarjeta>
        ) : null}

        <TextInput
          style={s.input}
          value={correo}
          onChangeText={setCorreo}
          placeholder="Tu correo"
          placeholderTextColor={color.suave}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
        />
        {modo !== 'recuperar' ? (
          <TextInput
            style={[s.input, { marginTop: 10 }]}
            value={clave}
            onChangeText={setClave}
            placeholder="Contraseña (mínimo 8 caracteres)"
            placeholderTextColor={color.suave}
            secureTextEntry
            autoCapitalize="none"
            autoComplete={modo === 'crear' ? 'new-password' : 'current-password'}
          />
        ) : null}
        {modo === 'crear' ? (
          <TextInput
            style={[s.input, { marginTop: 10 }]}
            value={clave2}
            onChangeText={setClave2}
            placeholder="Repite la contraseña"
            placeholderTextColor={color.suave}
            secureTextEntry
            autoCapitalize="none"
          />
        ) : null}

        {error ? <Text style={s.error}>{error}</Text> : null}
        {aviso ? <Text style={s.aviso}>{aviso}</Text> : null}

        <Boton
          titulo={cargando ? 'Un momento…' : modo === 'crear' ? 'Crear cuenta' : modo === 'recuperar' ? 'Enviar enlace' : 'Entrar'}
          onPress={enviar}
          disabled={cargando}
          style={{ marginTop: 16 }}
        />

        <View style={s.enlaces}>
          {modo !== 'entrar' ? (
            <Boton titulo="Ya tengo cuenta" variante="texto" onPress={() => { setModo('entrar'); setError(''); setAviso(''); }} />
          ) : null}
          {modo !== 'crear' ? (
            <Boton titulo="Crear una cuenta" variante="texto" onPress={() => { setModo('crear'); setError(''); setAviso(''); }} />
          ) : null}
          {modo === 'entrar' ? (
            <Boton titulo="Olvidé mi contraseña" variante="texto" onPress={() => { setModo('recuperar'); setError(''); setAviso(''); }} />
          ) : null}
        </View>

        <Texto suave style={s.legal}>
          Guardamos solo lo que anotas en la app (sin peso, calorías ni fotos). Nutre tu mente no reemplaza la
          atención de un profesional.
        </Texto>
      </KeyboardAvoidingView>
    </Pantalla>
  );
}

const s = StyleSheet.create({
  volver: { color: color.primario, fontSize: 16, fontWeight: '600' },
  etiqueta: { fontSize: 12, letterSpacing: 1, color: color.suave, fontWeight: '600', marginBottom: 10 },
  input: {
    backgroundColor: color.tarjeta,
    borderWidth: 1.5,
    borderColor: color.borde,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: color.texto,
  },
  error: { color: '#A33A2A', marginTop: 10, fontSize: 14 },
  aviso: { color: color.primario, marginTop: 10, fontSize: 14 },
  enlaces: { marginTop: 8 },
  legal: { fontSize: 13, textAlign: 'center', marginTop: 16 },
});
