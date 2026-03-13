import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';

export default function Hero() {
  const router = useRouter();
  const { session, userProfile } = useAuth();
  const { darkMode } = useDarkMode();

  const handlePrimaryAction = () => {
    if (!session) {
      router.push('/login');
      return;
    }

    router.push('/(tabs)/generator');
  };

  return (
    <View
      style={[
        styles.section,
        { backgroundColor: darkMode ? '#111827' : '#f9fafb' },
      ]}
    >
      <View style={styles.content}>
        <ImageBackground
          source={require('../../assets/templates/bg_hero1.jpg')}
          style={styles.imageCard}
          imageStyle={styles.image}
        >
          <View style={styles.imageOverlay} />
        </ImageBackground>

        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: darkMode ? '#fff' : '#111827' }]}>
            Buat Undangan{' '}
            <Text style={styles.titleHighlight}>Pernikahan</Text>
            {'\n'}Digital yang Indah dan Praktis, Dirancang Otomatis oleh AI.
          </Text>

          <Text style={[styles.subtitle, { color: darkMode ? '#d1d5db' : '#4b5563' }]}>
            Buat undangan pernikahan kamu yang kreatif dan personal dengan mudah.
            Tanpa ribet, cepat, dan hasilnya memukau!
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryWrap} onPress={handlePrimaryAction}>
              <LinearGradient colors={['#667eea', '#764ba2']} style={styles.primaryButton}>
                <Text style={styles.primaryText}>
                  {userProfile?.subscription_status === 'premium'
                    ? 'Buat Undangan Sekarang'
                    : 'Coba Gratis'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                { borderColor: darkMode ? '#818cf8' : '#4f46e5' },
              ]}
              onPress={() => router.push('/template')}
            >
              <Text
                style={[
                  styles.secondaryText,
                  { color: darkMode ? '#818cf8' : '#4f46e5' },
                ]}
              >
                Lihat Contoh Undangan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  content: {
    gap: 28,
  },
  textBlock: {
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '900',
    textAlign: 'center',
  },
  titleHighlight: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '900',
    color: '#6366f1',
  },
  subtitle: {
    marginTop: 18,
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    maxWidth: 340,
  },
  actions: {
    width: '100%',
    marginTop: 24,
    gap: 14,
  },
  primaryWrap: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '700',
  },
  imageCard: {
    height: 320,
    borderRadius: 22,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 22,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
});
