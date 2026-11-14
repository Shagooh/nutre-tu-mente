// Propuesta visual basada en los nombres de color de §8. Pendiente de revisión.
// Separada de las seis paletas históricas del laboratorio para no migrar sus árboles.
export const emotionalPalettes = {
  tranquila: { label: 'Tranquila', base: '#7fa768', shadow: '#527d50', highlight: '#ccdd8c', vein: '#385c43' },
  contenta: { label: 'Contenta', base: '#e5b84d', shadow: '#b38835', highlight: '#ffe49c', vein: '#65532a' },
  cansada: { label: 'Cansada', base: '#c6b2db', shadow: '#a38bbd', highlight: '#e9def3', vein: '#665477' },
  ansiosa: { label: 'Ansiosa', base: '#e89c56', shadow: '#b77436', highlight: '#ffcf9d', vein: '#79502f' },
  estresada: { label: 'Estresada', base: '#9470ad', shadow: '#71528a', highlight: '#cbb0dd', vein: '#50375f' },
  triste: { label: 'Triste', base: '#88afc4', shadow: '#61859c', highlight: '#c7dfdf', vein: '#405e73' },
  enojada: { label: 'Enojada o frustrada', base: '#d77871', shadow: '#ac5551', highlight: '#f1b2a8', vein: '#7b3937' },
  aburrida: { label: 'Aburrida', base: '#c9b799', shadow: '#a18d70', highlight: '#e8ddc7', vein: '#6d5e48' },
  sola: { label: 'Sola', base: '#638dc3', shadow: '#446da1', highlight: '#acc9eb', vein: '#354e73' },
  'no-se': { label: 'No sé', base: '#eeeae1', shadow: '#c6c1b7', highlight: '#fffdf6', vein: '#777267' },
};
export type Emotion = keyof typeof emotionalPalettes;
