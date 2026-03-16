import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const footerLinks = {
  produk: [
    { label: 'Template', path: '/template' },
    { label: 'Harga', path: '/harga' },
  ],
  perusahaan: [
    { label: 'Tentang Kami', path: '/about' },
    { label: 'Kontak', url: 'https://www.instagram.com/cartaai' },
  ],
  legal: [
    { label: 'Kebijakan Privasi', path: null },
    { label: 'Syarat & Ketentuan', path: null },
  ],
};

export default function Footer() {
  const router = useRouter();

  const handlePress = (item: { path?: string | null; url?: string }) => {
    if (item.url) {
      Linking.openURL(item.url);
    } else if (item.path) {
      router.push(item.path as never);
    }
  };

  return (
    <LinearGradient
      colors={['#3d56c5', '#764ba2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.footer}
    >
      {/* Baris info & link */}
      <View style={styles.grid}>
        {/* Brand */}
        <View style={styles.brandCol}>
          <Text style={styles.brandText}>CartaAI</Text>
          <Text style={styles.brandDesc}>
            Undangan digital cerdas untuk setiap momen pernikahan anda.
          </Text>
        </View>

        {/* Kolom link */}
        <View style={styles.linksRow}>
          {/* Produk */}
          <View style={styles.linkCol}>
            <Text style={styles.colTitle}>Produk</Text>
            {footerLinks.produk.map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => handlePress(item)}
                activeOpacity={0.75}
              >
                <Text style={styles.linkText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Perusahaan */}
          <View style={styles.linkCol}>
            <Text style={styles.colTitle}>Perusahaan</Text>
            {footerLinks.perusahaan.map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => handlePress(item)}
                activeOpacity={0.75}
              >
                <Text style={styles.linkText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Legal */}
          <View style={styles.linkCol}>
            <Text style={styles.colTitle}>Legal</Text>
            {footerLinks.legal.map((item) => (
              <Text key={item.label} style={styles.linkText}>
                {item.label}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.copyright}>© 2026 CartaAI. Semua hak dilindungi.</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://www.instagram.com/cartaai')}
          activeOpacity={0.75}
          style={styles.socialIcon}
        >
          <MaterialIcons name="camera-alt" size={22} color="rgba(255,255,255,0.85)" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 28,
  },
  grid: {
    gap: 24,
  },
  brandCol: {
    gap: 10,
  },
  brandText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  brandDesc: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    lineHeight: 20,
    maxWidth: 260,
  },
  linksRow: {
    flexDirection: 'row',
    gap: 0,
    justifyContent: 'space-between',
  },
  linkCol: {
    gap: 10,
    flex: 1,
  },
  colTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  linkText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginTop: 28,
    marginBottom: 18,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copyright: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    flex: 1,
  },
  socialIcon: {
    padding: 4,
  },
});
