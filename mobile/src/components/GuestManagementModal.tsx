import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Share,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useDarkMode } from '../context/DarkModeContext';

interface GuestManagementModalProps {
  visible: boolean;
  onClose: () => void;
  slug: string;
  sessionToken: string;
  apiBaseUrl: string;
}

export default function GuestManagementModal({
  visible,
  onClose,
  slug,
  sessionToken,
  apiBaseUrl,
}: GuestManagementModalProps) {
  const { darkMode } = useDarkMode();
  const [guestNames, setGuestNames] = useState('');
  const [persistedGuests, setPersistedGuests] = useState<any[]>([]);
  const [isSavingGuests, setIsSavingGuests] = useState(false);

  const theme = {
    bg: darkMode ? '#111827' : '#f9fafb',
    card: darkMode ? '#1f2937' : '#ffffff',
    soft: darkMode ? '#0f172a' : '#f8fafc',
    text: darkMode ? '#ffffff' : '#111827',
    secondary: darkMode ? '#d1d5db' : '#4b5563',
    muted: darkMode ? '#9ca3af' : '#6b7280',
    border: darkMode ? '#374151' : '#e5e7eb',
  };

  useEffect(() => {
    if (visible && slug) {
      fetchGuests();
    } else {
      setGuestNames('');
      setPersistedGuests([]);
    }
  }, [visible, slug]);

  const fetchGuests = async () => {
    if (!sessionToken || !apiBaseUrl) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/invitations/guests/${slug}`, {
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      if (res.ok) setPersistedGuests(await res.json());
    } catch (err) {
      console.error('Error fetching guests:', err);
    }
  };

  const saveGuests = async () => {
    if (!sessionToken || !apiBaseUrl) return;
    const names = guestNames.split('\n').map((n) => n.trim()).filter(Boolean);
    if (names.length === 0) {
      Alert.alert('Daftar tamu kosong', 'Masukkan minimal satu nama tamu.');
      return;
    }
    setIsSavingGuests(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/invitations/guests/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ slug, names }),
      });
      if (!response.ok) throw new Error('Gagal menyimpan daftar tamu.');
      setGuestNames('');
      await fetchGuests();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Gagal menyimpan daftar tamu.');
    } finally {
      setIsSavingGuests(false);
    }
  };

  const deleteGuest = async (guestId: string) => {
    if (!sessionToken || !apiBaseUrl) return;
    Alert.alert('Hapus tamu?', 'Tamu ini akan dihapus dari daftar.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${apiBaseUrl}/api/invitations/guests/${guestId}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${sessionToken}` },
            });
            if (res.ok) {
              setPersistedGuests((prev) =>
                prev.filter((guest) => guest.id_guest !== guestId)
              );
              Alert.alert('Berhasil', 'Tamu dihapus dari antrean.');
            } else {
              const errData = await res.json().catch(() => ({}));
              Alert.alert('Gagal', errData.detail || 'Gagal menghapus tamu.');
            }
          } catch (e) {
            Alert.alert('Error', 'Kesalahan jaringan saat menghapus tamu.');
          }
        },
      },
    ]);
  };

  const getGuestUrl = (name: string) =>
    `${apiBaseUrl}/api/invitations/${slug}?to=${encodeURIComponent(name)}`;

  const shareGuestLink = async (name: string) => {
    try {
      await Share.share({
        message: `Kepada Yth. ${name}\n\nKami mengundang Anda untuk hadir di acara pernikahan kami.\n\nBuka undangan: ${getGuestUrl(
          name
        )}`,
      });
    } catch {}
  };

  const openWhatsApp = async (name: string) => {
    const message = `Kepada Yth. ${name}\n\nKami mengundang Anda untuk hadir di acara pernikahan kami.\n\nBuka undangan: ${getGuestUrl(
      name
    )}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
         Alert.alert('Error', 'Gagal membuka WhatsApp. Pastikan aplikasi terinstall.');
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Manajemen Tamu</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.modalLabel, { color: theme.secondary }]}>
              Tambah Tamu Baru (Satu nama per baris)
            </Text>
            <TextInput
              value={guestNames}
              onChangeText={setGuestNames}
              multiline
              placeholder="Budi Santoso&#10;Keluarga Andi"
              placeholderTextColor="#9ca3af"
              style={[
                styles.textArea,
                { backgroundColor: theme.soft, borderColor: theme.border, color: theme.text },
              ]}
            />
            <View style={styles.primaryWrap}>
              <TouchableOpacity onPress={saveGuests} disabled={isSavingGuests}>
                <LinearGradient colors={['#6366f1', '#7c3aed']} style={styles.manageButton}>
                  {isSavingGuests ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.manageText}>Tambahkan Tamu</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <Text style={[styles.guestTitle, { color: theme.text }]}>
              Daftar Tamu Tersimpan ({persistedGuests.length})
            </Text>
            {persistedGuests.length > 0 ? (
              persistedGuests.map((guest) => (
                <View
                  key={guest.id_guest}
                  style={[styles.guestRow, { borderBottomColor: theme.border }]}
                >
                  <Text style={[styles.guestName, { color: theme.text }]}>{guest.guest_name}</Text>
                  <View style={styles.guestActions}>
                    <TouchableOpacity
                      onPress={() => shareGuestLink(guest.guest_name)}
                      style={[styles.smallAction, { backgroundColor: '#f1f5f9' }]}
                    >
                      <MaterialIcons name="share" size={16} color="#3b82f6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => openWhatsApp(guest.guest_name)}
                      style={[styles.smallAction, { backgroundColor: '#dcfce7' }]}
                    >
                      <MaterialIcons name="send" size={16} color="#16a34a" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteGuest(guest.id_guest)}
                      style={[styles.smallAction, { backgroundColor: '#fef2f2' }]}
                    >
                      <MaterialIcons name="delete" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={[styles.emptyText, { color: theme.muted }]}>
                Belum ada tamu yang tersimpan.
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 14,
    marginBottom: 16,
  },
  primaryWrap: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  manageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  guestTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  guestName: {
    fontSize: 14,
    flex: 1,
  },
  guestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  smallAction: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 32,
  },
});
