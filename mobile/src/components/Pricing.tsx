import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';

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

  return (
    <View style={[styles.section, { backgroundColor: darkMode ? '#111827' : '#fff' }]}>
      <View style={styles.header}>
        <View style={styles.dividerWrap}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerDot} />
        </View>
        <Text style={[styles.title, { color: darkMode ? '#fff' : '#111827' }]}>
          Fitur Paket yang <Text style={styles.titleAccent}>Tersedia</Text>
        </Text>
        <Text style={[styles.subtitle, { color: darkMode ? '#d1d5db' : '#4b5563' }]}>
          Pilih paket yang paling sesuai dengan kebutuhan Anda
        </Text>
      </View>

      <View style={styles.list}>
        {plans.map((plan) => (
          <View key={plan.name} style={styles.planWrapper}>
            <LinearGradient
              colors={plan.isPopular ? ['#667eea', '#764ba2'] : ['#e0e7ff', '#f3e8ff']}
              style={styles.planBorder}
            >
              <View
                style={[
                  styles.planCard,
                  { backgroundColor: darkMode ? '#1f2937' : '#fff' },
                ]}
              >
                <View style={styles.topAccent} />

                {plan.isPopular ? (
                  <View style={styles.popularBadgeWrap}>
                    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.popularBadge}>
                      <Text style={styles.popularText}>Populer</Text>
                    </LinearGradient>
                  </View>
                ) : null}

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

                <TouchableOpacity
                  onPress={() =>
                    plan.name === 'Premium'
                      ? router.push('/harga')
                      : router.push(session ? '/chat' : '/login')
                  }
                >
                  <LinearGradient
                    colors={
                      plan.name === 'Premium'
                        ? ['#667eea', '#764ba2']
                        : ['#667eea', '#764ba2']
                    }
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionText}>{plan.buttonText}</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.features}>
                  {plan.features.map((feature) => (
                    <View key={feature} style={styles.featureRow}>
                      <MaterialIcons name="check-circle" size={18} color="#10b981" />
                      <Text style={[styles.featureText, { color: darkMode ? '#d1d5db' : '#374151' }]}>
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
  dividerWrap: {
    width: 112,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  dividerLine: {
    width: '100%',
    height: 4,
    borderRadius: 999,
    backgroundColor: '#8b5cf6',
  },
  dividerDot: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#6366f1',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
    fontWeight: '800',
  },
  titleAccent: {
    color: '#6366f1',
  },
  subtitle: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 24,
    maxWidth: 330,
  },
  list: {
    gap: 18,
  },
  planWrapper: {
    paddingTop: 10,
  },
  planBorder: {
    borderRadius: 22,
    padding: 4,
  },
  planCard: {
    borderRadius: 18,
    padding: 22,
    overflow: 'hidden',
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#667eea',
  },
  popularBadgeWrap: {
    alignItems: 'center',
    marginTop: -14,
    marginBottom: 10,
  },
  popularBadge: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  planName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: '800',
  },
  planPeriod: {
    fontSize: 17,
    fontWeight: '500',
  },
  planDescription: {
    marginTop: 8,
    fontSize: 14,
    marginBottom: 20,
  },
  actionButton: {
    minHeight: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  features: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
  },
});
