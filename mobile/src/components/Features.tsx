import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useDarkMode } from '../context/DarkModeContext';

const features = [
  {
    icon: 'auto-awesome',
    title: 'Desain Cantik & Variatif',
    description:
      'Pilih dari beragam desain modern dan elegan yang sesuai dengan tema acara Anda.',
  },
  {
    icon: 'flash-on',
    title: 'Instan & Praktis',
    description:
      'Buat undangan dalam hitungan menit dengan antarmuka yang mudah digunakan.',
  },
  {
    icon: 'devices',
    title: 'Responsif & Interaktif',
    description:
      'Undangan tampil sempurna di semua perangkat, dengan fitur interaktif yang menarik.',
  },
  {
    icon: 'edit',
    title: 'Personalisasi Mudah',
    description:
      'Tambahkan sentuhan pribadi dengan mudah, mulai dari teks hingga foto dan musik.',
  },
];

export default function Features() {
  const { darkMode } = useDarkMode();

  return (
    <View
      style={[
        styles.section,
        { backgroundColor: darkMode ? '#111827' : 'rgba(238,242,255,0.35)' },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: darkMode ? '#fff' : '#111827' }]}>
          Semua yang <Text style={styles.titleAccent}>Anda Butuhkan</Text>
        </Text>
        <Text style={[styles.subtitle, { color: darkMode ? '#d1d5db' : '#4b5563' }]}>
          Fitur canggih untuk membuat undangan pernikahan yang tak terlupakan.
        </Text>
      </View>

      <View style={styles.grid}>
        {features.map((feature) => (
          <View
            key={feature.title}
            style={[
              styles.card,
              {
                backgroundColor: darkMode ? '#1f2937' : '#fff',
                borderColor: darkMode ? '#374151' : '#f3f4f6',
              },
            ]}
          >
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.cardAccent} />

            <LinearGradient colors={['#6366f1', '#7c3aed']} style={styles.iconWrap}>
              <MaterialIcons name={feature.icon as any} size={24} color="#fff" />
            </LinearGradient>

            <Text style={[styles.cardTitle, { color: darkMode ? '#fff' : '#111827' }]}>
              {feature.title}
            </Text>
            <Text style={[styles.cardDescription, { color: darkMode ? '#d1d5db' : '#4b5563' }]}>
              {feature.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    textAlign: 'center',
  },
  titleAccent: {
    color: '#6366f1',
  },
  subtitle: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 24,
    maxWidth: 340,
  },
  grid: {
    gap: 14,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 22,
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 22,
  },
});
