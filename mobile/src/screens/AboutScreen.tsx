import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useDarkMode } from '../context/DarkModeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const teamMembers = [
  { name: 'Adriel', role: 'Project Manager', bio: 'Memastikan visi CartaAI tercapai.' },
  { name: 'Adith', role: 'Developer', bio: 'Membangun inti kecerdasan CartaAI.' },
  { name: 'Julio', role: 'Developer', bio: 'Membangun inti kecerdasan CartaAI.' },
  { name: 'Prince', role: 'UI/UX Designer', bio: 'Membuat CartaAI indah dipandang.' },
  { name: 'Sandro', role: 'Quality Assurance', bio: 'Menjamin kualitas terbaik untuk Anda.' },
];

export default function AboutScreen() {
  const { darkMode } = useDarkMode();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#111827' : '#f9fafb' }]}>
      <View style={styles.headerTop}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={darkMode ? '#fff' : '#111827'} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="auto-awesome" size={48} color="#6366f1" />
          </View>
          <Text style={[styles.title, { color: darkMode ? '#fff' : '#111827' }]}>Tentang CartaAI</Text>
          <Text style={styles.subtitle}>
            CartaAI adalah platform undangan digital cerdas yang memanfaatkan teknologi AI 
            untuk membantu Anda menciptakan momen pernikahan yang tak terlupakan dengan cara yang mudah, 
            cepat, dan elegan.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#111827' }]}>Tim Kami</Text>
          <View style={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <View key={index} style={[styles.memberCard, { backgroundColor: darkMode ? '#1f2937' : '#fff' }]}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.avatarText}>{member.name.charAt(0)}</Text>
                </View>
                <Text style={[styles.memberName, { color: darkMode ? '#fff' : '#111827' }]}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
                <Text style={[styles.memberBio, { color: darkMode ? '#9ca3af' : '#6b7280' }]}>{member.bio}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.visionCard, { backgroundColor: '#6366f1' }]}>
          <Text style={styles.visionTitle}>Visi Kami</Text>
          <Text style={styles.visionText}>
            Menjadi platform undangan digital nomor satu yang menghubungkan hati melalui teknologi inovatif.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTop: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  memberCard: {
    width: (width - 64) / 2,
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
    marginBottom: 8,
  },
  memberBio: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  visionCard: {
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
  },
  visionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  visionText: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 14,
  },
});
