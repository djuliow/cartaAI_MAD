import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { API_BASE_URL } from '../lib/api';

const plans = [
  {
    name: 'Basic',
    price: 'Gratis',
    description: 'Untuk memulai',
    buttonText: 'Mulai Gratis',
    isPopular: false,
    features: ['Desain terbatas', 'Fitur dasar', 'Hingga 100 undangan'],
  },
  {
    name: 'Premium',
    price: 'Rp 99rb',
    period: '/bulan',
    description: 'Untuk acara spesial',
    buttonText: 'Pilih Paket Premium',
    isPopular: true,
    features: [
      'Semua desain premium',
      'Fitur lengkap & interaktif',
      'Hingga 500 undangan',
      'Dukungan prioritas',
    ],
  },
];

export default function Pricing() {
  const { darkMode } = useDarkMode();
  const { session } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePremium = async () => {
    if (!session) {
      router.push('/login');
      return;
    }
    router.push('/harga');
  };

  const handleBasic = () => {
    router.push(session ? '/chat' : '/login');
  };

  return (
    <LinearGradient
      colors={darkMode ? ['#111827', '#111827'] : ['#ffffff', '#f9fafb']}
      style={styles.section}
    >
      {/* Header */}
      <View style={styles.header}>
        {/* Dekorator garis */}
        <View style={styles.dividerWrap}>
          <LinearGradient
            colors={['#6366f1', '#a855f7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.dividerLine}
          />
          <View style={[styles.dividerDot, { backgroundColor: darkMode ? '#1f2937' : '#fff' }]} />
        </View>

        <Text style={[styles.title, { color: darkMode ? '#fff' : '#111827' }]}>
          Fitur Paket yang <Text style={styles.titleAccent}>Tersedia</Text>
        </Text>
        <Text style={[styles.subtitle, { color: darkMode ? '#d1d5db' : '#4b5563' }]}>
          Pilih paket yang paling sesuai dengan kebutuhan Anda
        </Text>
      </View>

      {/* Daftar Paket */}
      <View style={styles.list}>
        {plans.map((plan) => (
          <View key={plan.name} style={styles.planWrapper}>
            {/* Gradient border */}
            <LinearGradient
              colors={
                plan.isPopular
                  ? ['#667eea', '#764ba2']
                  : ['#e0e7ff', '#f3e8ff']
              }
              style={styles.planBorder}
            >
              <View
                style={[
                  styles.planCard,
                  { backgroundColor: darkMode ? '#1f2937' : '#ffffff' },
                ]}
              >
                {/* Top accent */}
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.topAccent}
                />

                {/* Badge Populer */}
                {plan.isPopular && (
                  <View style={styles.popularBadgeWrap}>
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      style={styles.popularBadge}
                    >
                      <Text style={styles.popularText}>Populer</Text>
                    </LinearGradient>
                  </View>
                )}

                {/* Nama & Harga */}
                <Text style={[styles.planName, { color: darkMode ? '#fff' : '#111827' }]}>
                  {plan.name}
                </Text>
                <Text style={[styles.planPrice, { color: darkMode ? '#fff' : '#111827' }]}>
                  {plan.price}
                  {plan.period ? (
                    <Text style={[styles.planPeriod, { color: darkMode ? '#d1d5db' : '#4b5563' }]}>
                      {plan.period}
                    </Text>
                  ) : null}
                </Text>
                <Text style={[styles.planDescription, { color: darkMode ? '#d1d5db' : '#4b5563' }]}>
                  {plan.description}
                </Text>

                {/* Tombol Aksi */}
                <TouchableOpacity
                  onPress={plan.name === 'Premium' ? handlePremium : handleBasic}
                  disabled={loading}
                  style={styles.actionWrap}
                  activeOpacity={0.88}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.actionButton}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.actionText}>{plan.buttonText}</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Fitur */}
                <View style={styles.features}>
                  {plan.features.map((feature) => (
                    <View key={feature} style={styles.featureRow}>
                      <MaterialIcons name="check-circle" size={18} color="#10b981" />
                      <Text
                        style={[
                          styles.featureText,
                          { color: darkMode ? '#d1d5db' : '#374151' },
                        ]}
                      >
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </LinearGradient>
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
    marginBottom: 32,
  },
  dividerWrap: {
    width: 112,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    width: '100%',
    height: 4,
    borderRadius: 999,
  },
  dividerDot: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: '#6366f1',
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    textAlign: 'center',
    fontWeight: '800',
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
    maxWidth: 330,
  },
  list: {
    gap: 20,
  },
  planWrapper: {
    paddingTop: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  planBorder: {
    borderRadius: 22,
    padding: 4,
  },
  planCard: {
    borderRadius: 18,
    padding: 24,
    overflow: 'hidden',
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  popularBadgeWrap: {
    alignItems: 'center',
    marginTop: -16,
    marginBottom: 12,
  },
  popularBadge: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  planName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  planPeriod: {
    fontSize: 17,
    fontWeight: '500',
  },
  planDescription: {
    marginTop: 8,
    fontSize: 14,
    marginBottom: 22,
  },
  actionWrap: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 22,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  actionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  features: {
    gap: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
