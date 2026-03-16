import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useDarkMode } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../lib/api';
import GuestManagementModal from '../components/GuestManagementModal';

export default function SuccessScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { darkMode } = useDarkMode();
  const { session } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const theme = {
    bg: darkMode ? '#111827' : '#f9fafb',
    text: darkMode ? '#ffffff' : '#111827',
    muted: darkMode ? '#9ca3af' : '#6b7280',
    card: darkMode ? '#1f2937' : '#ffffff',
    border: darkMode ? '#374151' : '#e5e7eb',
  };

  const openInvitation = async () => {
    if (!slug) return;
    const url = `${API_BASE_URL}/api/invitations/${slug}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Error', 'Tidak dapat membuka tautan undangan.');
    }
  };

  const handleManageGuests = () => {
    Alert.alert(
      'Konfirmasi Data',
      'Apakah isi undangan Anda sudah benar? Jika masih ada yang ingin diubah, Anda bisa kembali ke halaman sebelumnya untuk mengedit.',
      [
        {
          text: 'Cek Lagi',
          style: 'cancel',
        },
        {
          text: 'Sudah Benar',
          onPress: () => {
            setIsConfirmed(true);
            setModalVisible(true);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#10b981', '#34d399']}
            style={styles.iconBg}
          >
            <MaterialIcons name="check-circle" size={80} color="#fff" />
          </LinearGradient>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>
          Yeay! Undangan Berhasil Dibuat
        </Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          AI kami telah menyelesaikan pembuatan undangan Anda. Sekarang saatnya menyusun daftar tamu dan mengirimkannya.
        </Text>

        <View style={styles.actionsBox}>
          <TouchableOpacity onPress={handleManageGuests} style={styles.mainActionWrap}>
            <LinearGradient
              colors={['#6366f1', '#7c3aed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.mainAction}
            >
              <MaterialIcons name="group-add" size={24} color="#fff" />
              <Text style={styles.mainActionText}>Kelola Tamu & Kirim</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openInvitation}
            style={[styles.secondaryAction, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <MaterialIcons name="visibility" size={20} color="#6366f1" />
            <Text style={[styles.secondaryActionText, { color: theme.text }]}>
              Lihat Hasil Undangan
            </Text>
          </TouchableOpacity>

          {!isConfirmed && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.secondaryAction, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              <MaterialIcons name="edit" size={20} color="#f59e0b" />
              <Text style={[styles.secondaryActionText, { color: theme.text }]}>
                Edit Ulang Undangan
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/profile')}
            style={[styles.tertiaryAction]}
          >
            <Text style={styles.tertiaryActionText}>Kembali ke Profil</Text>
          </TouchableOpacity>
        </View>
      </View>

      {session && slug && (
        <GuestManagementModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          slug={slug}
          sessionToken={session.access_token}
          apiBaseUrl={API_BASE_URL}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 32,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconBg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 48,
  },
  actionsBox: {
    width: '100%',
    gap: 16,
  },
  mainActionWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  mainAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  mainActionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 16,
    gap: 10,
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '700',
  },
  tertiaryAction: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  tertiaryActionText: {
    color: '#6366f1',
    fontSize: 15,
    fontWeight: '700',
  },
});
