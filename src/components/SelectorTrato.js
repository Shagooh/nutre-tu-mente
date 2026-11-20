import { Pressable, View } from 'react-native';
import { Texto, Titulo } from './ui';
import { OPCIONES_TRATO, tratoValido } from '../trato-personal';
import { color } from '../theme';

export default function SelectorTrato({ valor, onCambio, disabled = false }) {
  return <View style={{ gap: 10 }}>
    <Titulo>¿Cómo prefieres que te hablemos?</Titulo>
    <Texto suave>Puedes cambiarlo cuando quieras desde Perfil. Neutro usa frases sin género.</Texto>
    {!tratoValido(valor) ? <Texto>Sin elegir · usamos lenguaje neutro</Texto> : null}
    {OPCIONES_TRATO.map((opcion) => <Pressable key={opcion.id} accessibilityRole="radio"
      accessibilityLabel={opcion.texto} accessibilityState={{ checked: valor === opcion.id, disabled }}
      aria-checked={valor === opcion.id} aria-disabled={disabled}
      disabled={disabled} onPress={() => onCambio(opcion.id)} style={{ minHeight: 52, padding: 16,
        borderRadius: 16, borderWidth: 2, borderColor: valor === opcion.id ? color.primario : color.borde,
        backgroundColor: valor === opcion.id ? color.primarioClaro : color.tarjeta }}>
      <Texto>{opcion.texto}{valor === opcion.id ? ' ✓' : ''}</Texto>
    </Pressable>)}
  </View>;
}
