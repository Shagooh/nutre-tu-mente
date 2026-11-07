import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { escucharSesion, salir, reautenticar, eliminarUsuario } from './cuenta';
import { nubeActiva } from './firebase';
import { activarNube, borrarNube, sincronizar, obtenerPerfil, obtenerControl } from './sync';
import { aplicarSync, desvincular, hayPendientes, nuevoId } from './fusion';
import { crearCercaSesion } from './sesion';
import { codigoSeguro, detenerReportes, reportarError } from './reportes';
import { cancelarRecordatorios } from './notifications';

export function useNube({ datos, actualizar, borrarTodo, leerActual }) {
  const [usuario, setUsuario] = useState(null);
  const [estadoSync, setEstadoSync] = useState({ estado: 'inactivo', cuando: null });
  const [conflicto, setConflicto] = useState(false);
  const cerca = useRef(crearCercaSesion());
  const cuenta = useRef(null);
  const trabajo = useRef(null);
  const eliminando = useRef(false);
  useEffect(() => escucharSesion((u) => {
    cerca.current.cambiar(u?.uid || null);
    cuenta.current = u;
    setUsuario(u);
    setEstadoSync({ estado: 'inactivo', cuando: null });
  }), []);
  const cerrarSesion = useCallback(async () => {
    cerca.current.cambiar(null);
    cuenta.current = null;
    setUsuario(null);
    await salir();
  }, []);

  const sincronizarAhora = useCallback(async () => {
    let d = leerActual();
    const u = cuenta.current;
    if (!nubeActiva || !u || !d || d.borrado || eliminando.current || trabajo.current) return;
    if (d.cuentaUid && d.cuentaUid !== u.uid) {
      setConflicto(true);
      await cerrarSesion();
      return;
    }
    if (d.requiereVincular) {
      setEstadoSync({ estado: 'error', codigo: 'sync/link-required', cuando: null });
      return;
    }
    const vigente = cerca.current.capturar();
    setEstadoSync({ estado: 'sincronizando', cuando: null });
    const tarea = (async () => {
      try {
        // Vincular el UID antes de tocar red; sobrevive a un fallo/reinicio.
        if (!d.cuentaUid) d = await actualizar(() => ({ cuentaUid: u.uid }), vigente);
        if (!vigente()) return;
        if (!d.nubeGeneracion) {
          const generacion = await activarNube(u.uid, nuevoId());
          if (!vigente()) return;
          d = await actualizar(() => ({ nubeGeneracion: generacion }), vigente);
        }
        const resultado = await sincronizar(u.uid, d);
        if (!vigente()) return;
        await actualizar((actual) => ({ ...aplicarSync(actual, resultado), ultimaSync: resultado.remoto.ultimaSync }), vigente);
        if (vigente()) setEstadoSync({ estado: 'ok', cuando: Date.now() });
      } catch (e) {
        if (vigente()) {
          reportarError(e, e.code || 'sincronizar');
          setEstadoSync({ estado: 'error', codigo: codigoSeguro(e.code), cuando: null });
        }
      }
    })();
    trabajo.current = tarea;
    try { await tarea; } finally { if (trabajo.current === tarea) trabajo.current = null; }
  }, [actualizar, leerActual, cerrarSesion]);

  useEffect(() => {
    if (!usuario || !datos || datos.borrado) return;
    const t = setTimeout(sincronizarAhora, hayPendientes(datos) ? 2000 : 0);
    // No hacer pull de nuevo al guardar solo marcas de sincronización.
    return () => clearTimeout(t);
  }, [usuario, Boolean(datos), datos?.perfilActualizado, datos?.checkins.length, datos?.cuestas.length, datos?.mental.length, datos?.borrado, sincronizarAhora]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => { if (s === 'active') sincronizarAhora(); });
    return () => sub.remove();
  }, [sincronizarAhora]);

  const eliminar = useCallback(async (tipo, clave) => {
    if (eliminando.current) return;
    const u = cuenta.current;
    const d = leerActual();
    if (d.cuentaUid && (!u || u.uid !== d.cuentaUid)) throw new Error('sync/session-required');
    eliminando.current = true;
    cerca.current.bloquear();
    const comprobarSesion = () => {
      if (u && cuenta.current?.uid !== u.uid) throw new Error('sync/session-required');
    };
    try {
      if (tipo === 'cuenta') {
        await reautenticar(clave, u.uid);
        comprobarSesion();
      }
      // Una escritura local ya iniciada termina primero; después se instala
      // el marcador durable y ya no se acepta ninguna sincronización vieja.
      if (trabajo.current) await trabajo.current;
      comprobarSesion();
      let op = leerActual().borrado;
      if (!op) {
        const control = u ? await obtenerControl(u.uid) : null;
        comprobarSesion();
        op = { id: control?.estado === 'eliminando' ? control.operacion : nuevoId(), uid: u?.uid || null, tipo, generacion: control?.generacion || leerActual().nubeGeneracion || nuevoId(), fase: 'remoto' };
        await actualizar(() => ({ borrado: op }));
      }
      if (op.uid && op.fase === 'remoto') {
        await borrarNube(op.uid, op);
        comprobarSesion();
        await actualizar(() => ({ borrado: { ...op, fase: 'local' } }));
      }
      if (op.tipo === 'cuenta') {
        comprobarSesion();
        await eliminarUsuario(op.uid);
        await actualizar((actual) => desvincular(actual));
      } else {
        comprobarSesion();
        detenerReportes();
        await cancelarRecordatorios();
        await borrarTodo();
      }
      if (u && cuenta.current?.uid === u.uid) await cerrarSesion();
      setEstadoSync({ estado: 'inactivo', cuando: null });
    } finally {
      eliminando.current = false;
      cerca.current.desbloquear();
    }
  }, [actualizar, borrarTodo, leerActual, cerrarSesion]);

  const vincular = useCallback(async () => {
    const u = cuenta.current;
    if (!u || trabajo.current || eliminando.current || leerActual().borrado) return;
    if (leerActual().cuentaUid && leerActual().cuentaUid !== u.uid) throw new Error('sync/session-required');
    const vigente = cerca.current.capturar();
    const generacion = await activarNube(u.uid, nuevoId(), true);
    await actualizar(() => ({ cuentaUid: u.uid, requiereVincular: false, nubeGeneracion: generacion }), vigente);
    await sincronizarAhora();
  }, [actualizar, leerActual, sincronizarAhora]);
  const usarPerfilNube = useCallback(async () => {
    const u = cuenta.current;
    if (!u || trabajo.current || leerActual().borrado) return;
    if (leerActual().cuentaUid && leerActual().cuentaUid !== u.uid) throw new Error('sync/session-required');
    const vigente = cerca.current.capturar();
    const remoto = await obtenerPerfil(u.uid);
    await actualizar(() => ({ perfil: remoto.perfil, perfilBase: remoto.perfil, perfilRevision: remoto.revision || 0, perfilSucio: false }), vigente);
    await sincronizarAhora();
  }, [actualizar, leerActual, sincronizarAhora]);
  const recuperarCopiaLocal = useCallback(async () => {
    const d = leerActual();
    // Solo liberar el teléfono si la eliminación remota ya fue confirmada.
    // No afirmar que Firebase Auth eliminó la identidad si se perdió su respuesta.
    if (cuenta.current || d.borrado?.tipo !== 'cuenta' || d.borrado.fase !== 'local') throw new Error('sync/session-required');
    await actualizar((actual) => desvincular(actual));
  }, [actualizar, leerActual]);
  return { usuario, estadoSync, conflicto, sincronizarAhora, cerrarSesion, vincular, usarPerfilNube, recuperarCopiaLocal, borrar: () => eliminar('todo'), eliminarCuenta: (clave) => eliminar('cuenta', clave) };
}
