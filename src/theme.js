import { Platform } from 'react-native';

export const color = {
  fondo: '#FBF7F0',
  tarjeta: '#FFFFFF',
  texto: '#2B3A33',
  suave: '#66756D',
  primario: '#4C7A59',
  primarioClaro: '#E4EEE4',
  acento: '#D98E5F',
  acentoClaro: '#FBEADF',
  borde: '#E6DFD2',
  blanco: '#FFFFFF',
};

export const radio = 18;

export const sombra = Platform.select({
  ios: { shadowColor: '#2B3A33', shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  android: { elevation: 2 },
  default: { boxShadow: '0 4px 14px rgba(43,58,51,0.08)' },
});
