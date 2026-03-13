import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useDarkMode } from '../context/DarkModeContext';

const testimonials = [
  {
    text: '"CartaAI membuat undangan pernikahan kami jadi lebih berkesan! Prosesnya cepat, hasilnya cantik."',
    name: 'Maya & Rio',
    role: 'Pasangan Pernikahan',
    image: require('../../assets/templates/simple_3.jpg'),
  },
  {
    text: '"Kami sangat puas dengan layanan CartaAI. Desain undangannya elegan dan sesuai dengan tema pernikahan kami!"',
    name: 'Budi & Sarah',
    role: 'Pasangan Pernikahan',
    image: require('../../assets/templates/logo_cartaAI.jpg'),
  },
  {
    text: '"Undangan pernikahan kami jadi unik dan berkesan berkat CartaAI. Prosesnya mudah dan hasilnya luar biasa indah!"',
    name: 'Arif',
    role: 'Mempelai laki-laki',
    image: require('../../assets/templates/logo_cartaAI.jpg'),
  },
];

export default function Testimonials() {
  const { darkMode } = useDarkMode();

  return (
    <View
      style={[
        styles.section,
        { backgroundColor: darkMode ? 'rgba(31,41,55,0.35)' : 'rgba(238,242,255,0.25)' },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: darkMode ? '#fff' : '#111827' }]}>
          Apa Kata <Text style={styles.titleAccent}>Mereka?</Text>
        </Text>
        <Text style={[styles.subtitle, { color: darkMode ? '#9ca3af' : '#6b7280' }]}>
          Cerita sukses dari pengguna kami yang bahagia.
        </Text>
      </View>

      <View style={styles.list}>
        {testimonials.map((testimonial) => (
          <View
            key={testimonial.name}
            style={[
              styles.card,
              {
                backgroundColor: darkMode ? '#1f2937' : '#fff',
                borderColor: darkMode ? '#374151' : '#f3f4f6',
              },
            ]}
          >
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.cardAccent} />

            <LinearGradient colors={['#6366f1', '#7c3aed']} style={styles.quoteWrap}>
              <MaterialIcons name="format-quote" size={20} color="#fff" />
            </LinearGradient>

            <Text style={[styles.quoteText, { color: darkMode ? '#d1d5db' : '#4b5563' }]}>
              {testimonial.text}
            </Text>

            <View style={[styles.authorRow, { borderTopColor: darkMode ? '#374151' : '#f3f4f6' }]}>
              <View style={styles.avatarBorder}>
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.avatarGradient}>
                  <Image source={testimonial.image} style={styles.avatar} />
                </LinearGradient>
              </View>
              <View>
                <Text style={[styles.authorName, { color: darkMode ? '#fff' : '#111827' }]}>
                  {testimonial.name}
                </Text>
                <Text style={[styles.authorRole, { color: darkMode ? '#9ca3af' : '#6b7280' }]}>
                  {testimonial.role}
                </Text>
              </View>
            </View>
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
    maxWidth: 320,
  },
  list: {
    gap: 14,
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  quoteWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  quoteText: {
    fontSize: 15,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 18,
  },
  authorRow: {
    borderTopWidth: 1,
    paddingTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBorder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  avatarGradient: {
    flex: 1,
    padding: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '800',
  },
  authorRole: {
    marginTop: 2,
    fontSize: 12,
  },
});
