import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { API_BASE_URL } from '../lib/api';

export default function RecentInvitations() {
  const { session } = useAuth();
  const { darkMode } = useDarkMode();
  const router = useRouter();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvitations = async () => {
      if (!session?.access_token || !API_BASE_URL) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/invitations/`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setInvitations(
            data
              .sort(
                (a: any, b: any) =>
                  new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
              )
              .slice(0, 3)
          );
        }
      } catch (error) {
        console.error('Gagal mengambil riwayat di mobile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, [session]);

  if (!session || (invitations.length === 0 && !loading)) return null;

  const handleOpenInvitation = async (slug: string) => {
    if (!API_BASE_URL) return;
    await Linking.openURL(`${API_BASE_URL}/api/invitations/${slug}`);
  };

  return (
    <View style={[styles.section, { backgroundColor: darkMode ? 'rgba(31,41,55,0.35)' : '#f9fafb' }]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: darkMode ? '#fff' : '#111827' }]}>
            Undangan Terakhir Anda
          </Text>
          <Text style={[styles.subtitle, { color: darkMode ? '#9ca3af' : '#6b7280' }]}>
            Lanjutkan mengelola atau lihat hasil undangan yang telah Anda buat.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.headerLink}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Text style={styles.headerLinkText}>Lihat Semua</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#6366f1" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#6366f1" style={{ marginTop: 12 }} />
      ) : (
        <View style={styles.list}>
          {invitations.map((invitation) => {
            const content = invitation.tbl_t_invitation_content || {};
            const pria = content.groom_name || 'Pria';
            const wanita = content.bride_name || 'Wanita';

            return (
              <View
                key={invitation.id_invitation}
                style={[
                  styles.card,
                  {
                    backgroundColor: darkMode ? '#1f2937' : '#fff',
                    borderColor: darkMode ? '#374151' : '#f3f4f6',
                  },
                ]}
              >
                <View style={styles.cardTop}>
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateText}>
                      {new Date(invitation.created_date).toLocaleDateString('id-ID')}
                    </Text>
                  </View>
                  <MaterialIcons name="drafts" size={18} color="#9ca3af" />
                </View>

                <Text style={[styles.cardTitle, { color: darkMode ? '#fff' : '#1f2937' }]}>
                  {pria} & {wanita}
                </Text>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.previewButton}
                    onPress={() => handleOpenInvitation(invitation.invitation_link)}
                  >
                    <Text style={styles.previewText}>Lihat Hasil</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.settingsButton,
                      { backgroundColor: darkMode ? '#374151' : '#f3f4f6' },
                    ]}
                    onPress={() => router.push('/(tabs)/profile')}
                  >
                    <MaterialIcons
                      name="settings"
                      size={18}
                      color={darkMode ? '#d1d5db' : '#4b5563'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 22,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  headerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerLinkText: {
    color: '#6366f1',
    fontSize: 13,
    fontWeight: '700',
  },
  list: {
    gap: 14,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  dateBadge: {
    backgroundColor: 'rgba(99,102,241,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  dateText: {
    color: '#6366f1',
    fontSize: 11,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  previewButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
