import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, radio, sombra } from '../theme';

export function Pantalla({ children, scroll = true, style, edges = ['top'] }) {
  return (
    <SafeAreaView style={[s.pantalla, style]} edges={edges}>
      {scroll ? (
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={s.scroll}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function Titulo({ children, style }) {
  return <Text style={[s.titulo, style]} accessibilityRole="header">{children}</Text>;
}

export function Texto({ children, style, suave }) {
  return <Text style={[s.texto, suave && { color: color.suave }, style]}>{children}</Text>;
}

export function Tarjeta({ children, style, tono }) {
  return (
    <View
      style={[
        s.tarjeta,
        tono === 'verde' && { backgroundColor: color.primarioClaro },
        tono === 'acento' && { backgroundColor: color.acentoClaro },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Boton({ titulo, onPress, variante = 'primario', disabled, style }) {
  const v = {
    primario: { bg: color.primario, fg: color.blanco, borde: color.primario },
    acento: { bg: color.acento, fg: '#3A2412', borde: color.acento },
    suave: { bg: color.primarioClaro, fg: color.primario, borde: color.primarioClaro },
    texto: { bg: 'transparent', fg: color.suave, borde: 'transparent' },
  }[variante];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        s.boton,
        { backgroundColor: v.bg, borderColor: v.borde, opacity: disabled ? 0.45 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      <Text style={[s.botonTexto, { color: v.fg }]}>{titulo}</Text>
    </Pressable>
  );
}

export function Chip({ texto, activo, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!activo }}
      onPress={onPress}
      style={[s.chip, activo && s.chipActivo]}
    >
      <Text style={[s.chipTexto, activo && { color: color.blanco }]}>{texto}</Text>
    </Pressable>
  );
}

export function Opcion({ titulo, detalle, activo, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!activo }}
      onPress={onPress}
      style={[s.opcion, activo && s.opcionActiva]}
    >
      <Text style={[s.opcionTitulo, activo && { color: color.primario }]}>{titulo}</Text>
      {detalle ? <Text style={s.opcionDetalle}>{detalle}</Text> : null}
    </Pressable>
  );
}

// Escala simple de 1 a 5 con etiquetas en los extremos.
export function Escala({ valor, onCambio, izquierda, derecha }) {
  return (
    <View>
      <View style={s.escala}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable
            key={n}
            accessibilityRole="button"
            accessibilityLabel={`${n} de 5`}
            onPress={() => onCambio(n)}
            style={[s.escalaBtn, valor === n && s.escalaBtnActivo]}
          >
            <Text style={[s.escalaNum, valor === n && { color: color.blanco }]}>{n}</Text>
          </Pressable>
        ))}
      </View>
      <View style={s.escalaEtiquetas}>
        <Text style={s.escalaEtiqueta}>{izquierda}</Text>
        <Text style={s.escalaEtiqueta}>{derecha}</Text>
      </View>
    </View>
  );
}

export function Barra({ paso, total }) {
  return (
    <View style={s.barra}>
      <View style={[s.barraRelleno, { width: `${(paso / total) * 100}%` }]} />
    </View>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: color.fondo },
  scroll: { padding: 20, paddingBottom: 40, flexGrow: 1 },
  titulo: { fontSize: 26, fontWeight: '700', color: color.texto, marginBottom: 6 },
  texto: { fontSize: 16, lineHeight: 24, color: color.texto },
  tarjeta: {
    backgroundColor: color.tarjeta,
    borderRadius: radio,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: color.borde,
    ...sombra,
  },
  boton: {
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonTexto: { fontSize: 16, fontWeight: '600' },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: color.borde,
    backgroundColor: color.tarjeta,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActivo: { backgroundColor: color.primario, borderColor: color.primario },
  chipTexto: { fontSize: 15, color: color.texto },
  opcion: {
    backgroundColor: color.tarjeta,
    borderRadius: radio,
    borderWidth: 1.5,
    borderColor: color.borde,
    padding: 16,
    marginBottom: 10,
  },
  opcionActiva: { borderColor: color.primario, backgroundColor: color.primarioClaro },
  opcionTitulo: { fontSize: 16, fontWeight: '600', color: color.texto },
  opcionDetalle: { fontSize: 14, color: color.suave, marginTop: 2 },
  escala: { flexDirection: 'row', justifyContent: 'space-between' },
  escalaBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: color.borde,
    backgroundColor: color.tarjeta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  escalaBtnActivo: { backgroundColor: color.primario, borderColor: color.primario },
  escalaNum: { fontSize: 18, fontWeight: '600', color: color.texto },
  escalaEtiquetas: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  escalaEtiqueta: { fontSize: 13, color: color.suave },
  barra: { height: 6, backgroundColor: color.borde, borderRadius: 3, overflow: 'hidden' },
  barraRelleno: { height: 6, backgroundColor: color.primario, borderRadius: 3 },
});
