import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../supabaseClient';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Silakan masukkan email Anda');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'cartaai://update-password', // Custom scheme for mobile if configured
      });

      if (error) throw error;
      Alert.alert('Sukses', 'Instruksi reset password telah dikirim ke email Anda.');
      router.push('/login');
    } catch (error: any) {
      Alert.alert('Gagal', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, justifyContent: 'center' }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Lupa <Text style={styles.brand}>Password</Text></Text>
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
            </View>
            <Text style={styles.subtitle}>
              Masukkan email Anda, dan kami akan mengirimkan link untuk me-reset password Anda.
            </Text>
          </View>

          <View style={styles.card}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.topAccent}
            />

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="nama@email.com"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                onPress={handleReset}
                disabled={loading}
                style={styles.resetButtonContainer}
              >
                <LinearGradient
                  colors={loading ? ['#9ca3af', '#6b7280'] : ['#667eea', '#764ba2']}
                  style={styles.resetButton}
                >
                  <Text style={styles.resetButtonText}>
                    {loading ? 'Mengirim...' : 'Kirim Instruksi Reset'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={() => router.push('/login')} style={styles.footer}>
            <Text style={styles.footerText}>Ingat password Anda? <Text style={styles.link}>Masuk</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  brand: {
    color: '#4f46e5',
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
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  topAccent: {
    height: 4,
  },
  form: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  resetButtonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  resetButton: {
    padding: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    color: '#4b5563',
  },
  link: {
    color: '#4f46e5',
    fontWeight: 'bold',
  },
});
