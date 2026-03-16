import React, { useCallback, useMemo, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import Navbar from '../components/Navbar';
import { API_BASE_URL } from '../lib/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const { session } = useAuth();
  const { darkMode } = useDarkMode();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareSlug, setShareSlug] = useState('');
  const [guestNames, setGuestNames] = useState('');
  const [persistedGuests, setPersistedGuests] = useState<any[]>([]);
  const [isSavingGuests, setIsSavingGuests] = useState(false);

  const theme = useMemo(
    () => ({
      bg: darkMode ? '#111827' : '#f9fafb',
      card: darkMode ? '#1f2937' : '#ffffff',
      soft: darkMode ? '#0f172a' : '#f8fafc',
      text: darkMode ? '#ffffff' : '#111827',
      secondary: darkMode ? '#d1d5db' : '#4b5563',
      muted: darkMode ? '#9ca3af' : '#6b7280',
      border: darkMode ? '#374151' : '#e5e7eb',
    }),
    [darkMode]
  );

  useFocusEffect(
    useCallback(() => {
      if (!session) {
        router.replace('/login');
        return;
      }
      fetchInvitations();
    }, [session])
  );

  const fetchInvitations = async () => {
    if (!session?.access_token) return;
    setLoading(true);
    setError(null);
    try {
      if (!API_BASE_URL) throw new Error('EXPO_PUBLIC_BACKEND_URL belum diset');
      const headers = { Authorization: `Bearer ${session.access_token}` };

      const invRes = await fetch(`${API_BASE_URL}/api/invitations/`, { headers });
      if (!invRes.ok) throw new Error('Gagal mengambil data undangan.');
      const invData = await invRes.json();
      setInvitations(
        invData.sort(
          (a: any, b: any) =>
            new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal memuat data riwayat.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuests = async (slug: string) => {
    if (!session?.access_token || !API_BASE_URL) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/invitations/guests/${slug}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) setPersistedGuests(await res.json());
    } catch (err) {
      console.error('Error fetching guests:', err);
    }
  };

  const handleShareClick = (slug: string) => {
    setShareSlug(slug);
    setGuestNames('');
    setPersistedGuests([]);
    setShareModalOpen(true);
    fetchGuests(slug);
  };

  const saveGuests = async () => {
    if (!session?.access_token || !API_BASE_URL) return;
    const names = guestNames.split('\n').map((n) => n.trim()).filter(Boolean);
    if (names.length === 0) {
      Alert.alert('Daftar tamu kosong', 'Masukkan minimal satu nama tamu.');
      return;
    }
    setIsSavingGuests(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/invitations/guests/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ slug: shareSlug, names }),
      });
      if (!response.ok) throw new Error('Gagal menyimpan daftar tamu.');
      setGuestNames('');
      await fetchGuests(shareSlug);
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Gagal menyimpan daftar tamu.');
    } finally {
      setIsSavingGuests(false);
    }
  };

  const deleteGuest = async (guestId: string) => {
    if (!session?.access_token || !API_BASE_URL) return;
    Alert.alert('Hapus tamu?', 'Tamu ini akan dihapus dari daftar.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/invitations/guests/${guestId}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${session.access_token}` },
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

  const requestDeleteInvitation = (slug: string) => {
    Alert.alert('Hapus Undangan?', 'Undangan ini akan dihapus secara permanen.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          if (!session?.access_token || !API_BASE_URL) return;
          try {
            const res = await fetch(`${API_BASE_URL}/api/invitations/`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ slugs: [slug] }),
            });
            if (!res.ok) throw new Error('Gagal menghapus undangan');
            setInvitations((prev) => prev.filter((inv) => inv.invitation_link !== slug));
          } catch (err) {
            Alert.alert('Error', err instanceof Error ? err.message : 'Terjadi kesalahan');
          }
        },
      },
    ]);
  };

  const openInvitation = (slug: string) => {
    const url = `${API_BASE_URL}/api/invitations/${slug}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Tidak dapat membuka tautan');
    });
  };

  const shareGuestLink = async (guestName: string) => {
    try {
      const guestSlug = `${shareSlug}-${guestName.toLowerCase().replace(/\s+/g, '-')}`;
      const url = `${API_BASE_URL}/api/invitations/${shareSlug}?to=${encodeURIComponent(guestName)}`;
      await Share.share({
        message: `Halo ${guestName},\nKami mengundang Anda untuk hadir di acara pernikahan kami.\n\nBuka undangan: ${url}`,
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (!session) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Navbar />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Riwayat Undangan</Text>
          <Text style={[styles.headerSubtitle, { color: theme.muted }]}>
            Kelola semua undangan yang pernah Anda buat di sini.
          </Text>
        </View>

        <View style={styles.contentArea}>
          {loading ? (
            <ActivityIndicator size="large" color="#6366f1" style={{ marginVertical: 32 }} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : invitations.length > 0 ? (
            invitations.map((invitation) => {
              const content = invitation.tbl_t_invitation_content || {};
              const pria = content.groom_name || 'Mempelai Pria';
              const wanita = content.bride_name || 'Mempelai Wanita';
              return (
                <View
                  key={invitation.id_invitation}
                  style={[styles.invCard, { backgroundColor: theme.soft, borderColor: theme.border }]}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.invAccent}
                  />
                  <View style={styles.invHeader}>
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>AKTIF</Text>
                    </View>
                    <Text style={[styles.invDate, { color: theme.muted }]}>
                      {new Date(invitation.created_date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={[styles.invNames, { color: theme.text }]}>{pria} & {wanita}</Text>

                  <TouchableOpacity onPress={() => handleShareClick(invitation.invitation_link)} style={styles.primaryWrap}>
                    <LinearGradient colors={['#6366f1', '#7c3aed']} style={styles.manageButton}>
                      <MaterialIcons name="group" size={18} color="#fff" />
                      <Text style={styles.manageText}>Daftar Tamu & Kirim</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <View style={styles.invActions}>
                    <TouchableOpacity
                      onPress={() => openInvitation(invitation.invitation_link)}
                      style={[styles.viewButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                    >
                      <MaterialIcons name="visibility" size={16} color={theme.secondary} />
                      <Text style={[styles.viewText, { color: theme.secondary }]}>Lihat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => requestDeleteInvitation(invitation.invitation_link)}
                      style={styles.deleteButton}
                    >
                      <MaterialIcons name="delete" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={[styles.emptyText, { color: theme.muted }]}>Belum ada riwayat undangan.</Text>
          )}
        </View>
      </ScrollView>

      <Modal visible={shareModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Manajemen Tamu</Text>
              <TouchableOpacity onPress={() => setShareModalOpen(false)}>
                <MaterialIcons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalLabel, { color: theme.secondary }]}>Tambah Tamu Baru (Satu nama per baris)</Text>
              <TextInput
                value={guestNames}
                onChangeText={setGuestNames}
                multiline
                placeholder="Budi Santoso&#10;Keluarga Andi"
                placeholderTextColor="#9ca3af"
                style={[styles.textArea, { backgroundColor: theme.soft, borderColor: theme.border, color: theme.text }]}
              />
              <TouchableOpacity onPress={saveGuests} disabled={isSavingGuests} style={styles.primaryWrap}>
                <LinearGradient colors={['#6366f1', '#7c3aed']} style={styles.manageButton}>
                  {isSavingGuests ? <ActivityIndicator color="#fff" /> : <Text style={styles.manageText}>Simpan ke Database</Text>}
                </LinearGradient>
              </TouchableOpacity>

              <Text style={[styles.guestTitle, { color: theme.text }]}>Daftar Tamu Tersimpan ({persistedGuests.length})</Text>
              {persistedGuests.length > 0 ? (
                persistedGuests.map((guest) => (
                  <View key={guest.id_guest} style={[styles.guestRow, { borderBottomColor: theme.border }]}>
                    <Text style={[styles.guestName, { color: theme.text }]}>{guest.guest_name}</Text>
                    <View style={styles.guestActions}>
                      <TouchableOpacity onPress={() => shareGuestLink(guest.guest_name)} style={[styles.smallAction, { backgroundColor: '#f1f5f9' }]}>
                        <MaterialIcons name="share" size={16} color="#3b82f6" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteGuest(guest.id_guest)} style={[styles.smallAction, { backgroundColor: '#fef2f2' }]}>
                        <MaterialIcons name="delete" size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={[styles.emptyText, { color: theme.muted, marginTop: 10 }]}>Belum ada tamu tersimpan.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  contentArea: {
    marginTop: 10,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 32,
  },
  invCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  invAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  invHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: '#166534',
    fontSize: 10,
    fontWeight: '800',
  },
  invDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  invNames: {
    fontSize: 18,
    fontWeight: '800',
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
  invActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  viewText: {
    fontSize: 13,
    fontWeight: '600',
  },
  deleteButton: {
    width: 42,
    height: 42,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
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
});
