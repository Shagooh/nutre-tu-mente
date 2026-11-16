import { canonico, fusionarPerfil } from '../contratos-sync';
import { aplicarSync } from '../fusion';
test('contenido canónico no depende del orden de claves', () => {
  expect(canonico({ a: 1, b: [2] })).toBe(canonico({ b: [2], a: 1 }));
});
test('fusiona campos disjuntos sin usar relojes locales', () => {
  const base = { nombre: 'Ana', estilo: 'calma' };
  expect(fusionarPerfil(base, { ...base, nombre: 'A' }, { ...base, estilo: 'otro' })).toEqual({ nombre: 'A', estilo: 'otro' });
});
test('conflicto visible en el mismo campo', () => {
  expect(() => fusionarPerfil({ nombre: 'A' }, { nombre: 'B' }, { nombre: 'C' })).toThrow('sync/profile-conflict');
});
test('sin base no sobreescribe un perfil remoto diferente', () => {
  expect(() => fusionarPerfil(null, { nombre: 'B' }, { nombre: 'C' })).toThrow('sync/profile-conflict');
});
test('una edición durante sync conserva su cambio sin deshacer campos remotos', () => {
  const base = { nombre: 'A', estilo: 'calma' };
  const d = { perfil: { ...base, nombre: 'nuevo' }, perfilOperacion: 'op2', perfilActualizado: 'mismo-ms', perfilSucio: true, lecciones: [], retornos: 0 };
  const remoto = { perfil: { ...base, estilo: 'autocuidado' }, revision: 3, lecciones: [], retornos: 0 };
  const res = aplicarSync(d, { remoto, subidos: {}, perfilSubido: { local: base, operacion: 'op1', perfilActualizado: 'mismo-ms' } });
  expect(res.perfil).toEqual({ nombre: 'nuevo', estilo: 'autocuidado' });
  expect(res.perfilSucio).toBe(true);
});
