export function crearCercaSesion() {
  /** @type {string|null} */
  let uid = null;
  let generacion = 0;
  let bloqueada = false;
  return {
    /** @param {string|null} siguiente */
    cambiar(siguiente) { uid = siguiente; generacion += 1; },
    bloquear() { bloqueada = true; generacion += 1; },
    desbloquear() { bloqueada = false; generacion += 1; },
    capturar() {
      const token = generacion;
      const cuenta = uid;
      return () => !bloqueada && token === generacion && cuenta === uid;
    },
  };
}
