import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDarkMode } from '../context/DarkModeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { WEDDING_TEMPLATES } from '../constants/data';

export default function TemplateUsageScreen() {
  const { id } = useLocalSearchParams();
  const { darkMode } = useDarkMode();
  const router = useRouter();

  // Cari template dari data pusat berdasarkan ID
  const allTemplates = Object.values(WEDDING_TEMPLATES).flat() as any[];
  const template = allTemplates.find(t => t.id.toString() === id);

  if (!template) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: darkMode ? '#fff' : '#111827' }}>Template tidak ditemukan</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: '#6366f1' }}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#111827' : '#f9fafb' }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: darkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)' }]} 
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={darkMode ? '#fff' : '#111827'} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image 
          source={typeof template.image === 'string' ? { uri: template.image } : template.image} 
          style={styles.mainImage} 
        />
        
        <View style={styles.content}>
          <Text style={[styles.title, { color: darkMode ? '#fff' : '#111827' }]}>{template.title}</Text>
          <Text style={[styles.desc, { color: darkMode ? '#9ca3af' : '#6b7280' }]}>{template.desc}</Text>

          <View style={[styles.tipsCard, { backgroundColor: darkMode ? '#1f2937' : '#fff' }]}>
            <View style={styles.tipsHeader}>
              <MaterialIcons name="lightbulb" size={20} color="#6366f1" />
              <Text style={[styles.tipsTitle, { color: darkMode ? '#fff' : '#111827' }]}>Tips Penggunaan</Text>
            </View>
            <Text style={[styles.tipsText, { color: darkMode ? '#9ca3af' : '#6b7280' }]}>
              Gunakan foto dengan resolusi tinggi untuk hasil maksimal pada template ini agar undangan terlihat jernih di semua perangkat.
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={() => router.push('/generator')}
          >
            <LinearGradient colors={['#6366f1', '#a855f7']} style={styles.ctaGradient}>
              <Text style={styles.ctaText}>Gunakan Template Ini</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  mainImage: {
    width: '100%',
    height: 500,
    resizeMode: 'cover',
  },
  content: {
    padding: 24,
    marginTop: -30,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  desc: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  tipsCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  ctaGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
