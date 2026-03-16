import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { useDarkMode } from '../context/DarkModeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function BlockchainPayment() {
  const { darkMode } = useDarkMode();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    setLoading(true);
    // Simulasi koneksi wallet (Di mobile nyata, butuh library seperti @walletconnect/modal-react-native)
    setTimeout(() => {
      setAddress('0x71C...3921');
      setLoading(false);
      Alert.alert('Wallet Terhubung', 'Dompet Ethereum Anda berhasil terhubung.');
    }, 1500);
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#1f2937' : '#f3f4f6' }]}>
      <View style={styles.header}>
        <MaterialIcons name="currency-bitcoin" size={24} color="#f59e0b" />
        <Text style={[styles.title, { color: darkMode ? '#fff' : '#111827' }]}>Pembayaran Crypto</Text>
      </View>

      {!address ? (
        <TouchableOpacity 
          style={styles.connectButton}
          onPress={connectWallet}
          disabled={loading}
        >
          <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.gradient}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Hubungkan Wallet</Text>}
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <View style={styles.infoBox}>
          <Text style={styles.label}>Terhubung ke:</Text>
          <Text style={[styles.address, { color: darkMode ? '#fff' : '#111827' }]}>{address}</Text>
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payButtonText}>Bayar dengan ETH</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <Text style={styles.footerText}>Mendukung jaringan Sepolia Testnet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoBox: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: '#9ca3af',
  },
  address: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  payButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  payButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 12,
  },
});
