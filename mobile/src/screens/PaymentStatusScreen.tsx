import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useDarkMode } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function PaymentStatusScreen() {
  const { darkMode } = useDarkMode();
  const { refreshProfile } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const transactionStatus = params.transaction_status as string;
  const orderId = params.order_id as string || 'Unknown';

  const [isSuccess, setIsSuccess] = useState(false);
  const [title, setTitle] = useState('Status Pembayaran');
  const [message, setMessage] = useState('Mengecek status pembayaran Anda...');

  useEffect(() => {
    if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
      setIsSuccess(true);
      setTitle('Pembayaran Berhasil!');
      setMessage(`Terima kasih! Pembayaran Anda untuk pesanan ${orderId} telah kami terima. Akun Anda akan segera di-upgrade.`);
      
      const timer = setTimeout(() => {
        refreshProfile();
      }, 2000);
      return () => clearTimeout(timer);
    } else if (transactionStatus === 'pending') {
      setTitle('Pembayaran Tertunda');
      setMessage(`Pembayaran Anda untuk pesanan ${orderId} sedang menunggu konfirmasi. Silakan selesaikan pembayaran Anda.`);
    } else if (transactionStatus === 'failure' || transactionStatus === 'cancel' || transactionStatus === 'expire') {
      setTitle('Pembayaran Gagal');
      setMessage(`Maaf, pembayaran Anda untuk pesanan ${orderId} gagal atau dibatalkan. Silakan coba lagi.`);
    } else {
      setTitle('Terima Kasih');
      setMessage('Status pembayaran sedang diproses.');
    }
  }, [transactionStatus, orderId, refreshProfile]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#111827' : '#f9fafb' }]}>
      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: darkMode ? '#1f2937' : '#fff' }]}>
          <LinearGradient
            colors={isSuccess ? ['#10b981', '#059669'] : ['#f59e0b', '#d97706']}
            style={styles.cardAccent}
          />

          <View style={styles.iconContainerWrapper}>
            <LinearGradient
              colors={isSuccess ? ['#10b981', '#059669'] : ['#f59e0b', '#d97706']}
              style={styles.iconContainer}
            >
              <MaterialIcons 
                name={isSuccess ? "check-circle" : "warning"} 
                size={40} 
                color="#fff" 
              />
            </LinearGradient>
          </View>

          <Text style={[styles.title, { color: darkMode ? '#fff' : '#111827' }]}>{title}</Text>
          <Text style={[styles.message, { color: darkMode ? '#9ca3af' : '#6b7280' }]}>{message}</Text>

          <TouchableOpacity 
            style={styles.homeButtonContainer}
            onPress={() => router.replace('/(tabs)')}
          >
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.homeButton}>
              <Text style={styles.homeButtonText}>Kembali ke Beranda</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
  },
  iconContainerWrapper: {
    marginBottom: 24,
    marginTop: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  homeButtonContainer: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  homeButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
