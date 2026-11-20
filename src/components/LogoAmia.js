import { Image, StyleSheet } from 'react-native';

export default function LogoAmia({ size = 176 }) {
  return (
    <Image
      source={require('../../assets/amia-logo.png')}
      accessibilityLabel="Amía"
      accessible
      resizeMode="contain"
      style={[s.logo, { width: size, height: size }]}
    />
  );
}

const s = StyleSheet.create({
  logo: { alignSelf: 'center', maxWidth: '100%', borderRadius: 20, marginBottom: 16 },
});
