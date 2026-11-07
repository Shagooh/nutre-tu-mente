/** @param {{ getItem: (key: string) => Promise<string|null>, setItem: (key: string, value: string) => Promise<unknown> }} storage
 * @param {string} key
 * @param {(value: unknown) => Record<string, any>} preparar */
export function crearPersistencia(storage, key, preparar) {
  /** @type {Record<string, any>|null} */
  let actual = null;
  let cola = Promise.resolve();
  /** @type {Set<(datos: Record<string, any>) => void>} */
  const oyentes = new Set();
  return {
    /** @param {(datos: Record<string, any>) => void} fn */
    escuchar(fn) { oyentes.add(fn); return () => { oyentes.delete(fn); }; },
    leerActual: () => actual,
    async cargar() {
      const raw = await storage.getItem(key);
      const siguiente = preparar(raw === null ? null : JSON.parse(raw));
      actual = siguiente;
      oyentes.forEach((fn) => fn(siguiente));
      return siguiente;
    },
    /** @param {(datos: Record<string, any>) => Record<string, any>} fn
     * @param {() => boolean} [vigente]
     * @param {boolean} [reemplazar] */
    actualizar(fn, vigente = () => true, reemplazar = false) {
      const tarea = cola.then(async () => {
        if (!actual) throw new Error('storage/not-loaded');
        if (!vigente()) throw new Error('storage/stale');
        const cambios = fn(actual);
        const siguiente = reemplazar ? cambios : { ...actual, ...cambios };
        await storage.setItem(key, JSON.stringify(siguiente));
        // El escritor es único: un cambio de sesión se encola después, nunca
        // se permite que otra escritura termine antes de esta.
        actual = siguiente;
        if (vigente()) oyentes.forEach((listener) => listener(siguiente));
        return siguiente;
      });
      cola = tarea.then(() => undefined, () => undefined);
      return tarea;
    },
  };
}
