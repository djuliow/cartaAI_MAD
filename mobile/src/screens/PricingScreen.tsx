import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useDarkMode } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { PRICING_PLANS } from '../constants/data';

export default function PricingScreen() {
  const { darkMode } = useDarkMode();
  const { session } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = (plan: any) => {
    if (plan.id !== 'free' && !session) {
      router.push('/login');
      return;
    }
    
    if (plan.id === 'free') {
      router.push('/chat');
    } else {
      router.push('/payment');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#111827' : '#f9fafb' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={darkMode ? '#fff' : '#111827'} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: darkMode ? '#fff' : '#111827' }]}>
            Paket <Text style={styles.brand}>Harga</Text>
          </Text>
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
          </View>
          <Text style={styles.subtitle}>
            Pilih paket yang paling sesuai dengan kebutuhan Anda.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {PRICING_PLANS.map((plan, index) => (
            <View 
              key={index} 
              style={[
                styles.cardWrapper, 
                plan.isPopular && styles.cardWrapperPopular
              ]}
            >
              {plan.isPopular && (
                <View style={styles.popularBadgeContainer}>
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.popularBadge}
                  >
                    <Text style={styles.popularBadgeText}>Populer</Text>
                  </LinearGradient>
                </View>
              )}
              <View style={[styles.card, { backgroundColor: darkMode ? '#1f2937' : '#fff' }]}>
                <LinearGradient
                  colors={plan.isPopular ? ['#667eea', '#764ba2'] : ['#e5e7eb', '#d1d5db']}
                  style={styles.cardAccent}
                />
                <View style={styles.cardContent}>
                  <Text style={[styles.planName, { color: darkMode ? '#fff' : '#111827' }]}>
                    {plan.name}
                  </Text>
                  <Text style={[styles.planPrice, { color: darkMode ? '#fff' : '#111827' }]}>
                    {plan.price}
                    {plan.period && <Text style={styles.planPeriod}>{plan.period}</Text>}
                  </Text>
                  <Text style={styles.planDesc}>{plan.description}</Text>

                  <TouchableOpacity
                    style={styles.actionButtonContainer}
                    onPress={() => handleAction(plan)}
                    disabled={loading}
                  >
                    <LinearGradient
                      colors={plan.isPopular ? ['#667eea', '#764ba2'] : ['#9ca3af', '#6b7280']}
                      style={styles.actionButton}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.actionButtonText}>{plan.buttonText}</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  <View style={styles.featuresList}>
                    {plan.features.map((feature: string, fIndex: number) => (
                      <View key={fIndex} style={styles.featureItem}>
                        <MaterialIcons name="check-circle" size={20} color="#10b981" />
                        <Text style={[styles.featureText, { color: darkMode ? '#d1d5db' : '#374151' }]}>
                          {feature}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          ))}
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
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  brand: {
    color: '#6366f1',
  },
  dividerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    width: 60,
    height: 4,
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  subtitle: {
    color: '#6b7280',
    textAlign: 'center',
    fontSize: 16,
  },
  cardsContainer: {
    gap: 32,
  },
  cardWrapper: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
  },
  cardWrapperPopular: {
    shadowColor: '#6366f1',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  popularBadgeContainer: {
    position: 'absolute',
    top: -12,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  popularBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardAccent: {
    height: 6,
  },
  cardContent: {
    padding: 24,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planPeriod: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#6b7280',
  },
  planDesc: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  actionButtonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 32,
  },
  actionButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
  },
});
