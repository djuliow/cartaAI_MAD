import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useDarkMode } from '../context/DarkModeContext';

const features = [
  {
    icon: 'auto-awesome' as const,
    title: 'Desain Cantik & Variatif',
    description:
      'Pilih dari beragam desain modern dan elegan yang sesuai dengan tema acara Anda.',
  },
  {
    icon: 'flash-on' as const,
    title: 'Instan & Praktis',
    description:
      'Buat undangan dalam hitungan menit dengan antarmuka yang mudah digunakan.',
  },
  {
    icon: 'devices' as const,
    title: 'Responsif & Interaktif',
    description:
      'Undangan tampil sempurna di semua perangkat, dengan fitur interaktif yang menarik.',
  },
  {
    icon: 'edit' as const,
    title: 'Personalisasi Mudah',
    description:
      'Tambahkan sentuhan pribadi dengan mudah, mulai dari teks hingga foto dan musik.',
  },
];

export default function Features() {
  const { darkMode } = useDarkMode();

  return (
    <LinearGradient
      colors={
        darkMode
          ? ['#111827', '#111827']
          : ['rgba(238,242,255,0.4)', 'rgba(243,232,255,0.2)']
      }
      style={styles.section}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: darkMode ? '#fff' : '#111827' }]}>
          Semua yang{' '}
          <Text style={styles.titleAccent}>Anda Butuhkan</Text>
        </Text>
        <Text style={[styles.subtitle, { color: darkMode ? '#d1d5db' : '#4b5563' }]}>
          Fitur canggih untuk membuat undangan pernikahan yang tak terlupakan.
        </Text>
      </View>

      {/* Grid Kartu */}
      <View style={styles.grid}>
        {features.map((feature) => (
          <View
            key={feature.title}
            style={[
              styles.card,
              {
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                borderColor: darkMode ? '#374151' : '#f3f4f6',
                shadowColor: darkMode ? '#000' : '#6366f1',
              },
            ]}
          >
            {/* Top accent bar */}
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cardAccent}
            />

            {/* Icon */}
            <LinearGradient
              colors={['#6366f1', '#7c3aed']}
              style={styles.iconWrap}
            >
              <MaterialIcons name={feature.icon} size={24} color="#fff" />
            </LinearGradient>

            {/* Teks */}
            <Text style={[styles.cardTitle, { color: darkMode ? '#fff' : '#111827' }]}>
              {feature.title}
            </Text>
            <Text style={[styles.cardDescription, { color: darkMode ? '#d1d5db' : '#4b5563' }]}>
              {feature.description}
            </Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  titleAccent: {
    color: '#6366f1',
  },
  subtitle: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 24,
    maxWidth: 340,
  },
  grid: {
    gap: 16,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 24,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
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
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 22,
  },
});
