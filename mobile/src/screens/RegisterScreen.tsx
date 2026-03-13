import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../supabaseClient';
import { useRouter } from 'expo-router';
import Logo from '../components/Logo';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Semua field wajib diisi.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

      if (error) throw error;

      if (data.session) {
        Alert.alert('Berhasil', 'Registrasi berhasil! Selamat bergabung.');
        router.replace('/(tabs)');
      } else {
        Alert.alert('Hampir Selesai', 'Silakan periksa email Anda untuk verifikasi akun.');
        router.push('/login');
      }
    } catch (error: any) {
      Alert.alert('Registrasi Gagal', error.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Logo size={80} showText={false} style={{ marginBottom: 20 }} />
            <Text style={styles.title}>Daftar di <Text style={styles.brand}>CartaAI</Text></Text>
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} /><View style={styles.dividerDot} />
            </View>
            <Text style={styles.subtitle}>Buat akun untuk mulai merancang undangan pernikahan impian Anda.</Text>
          </View>

          <View style={styles.card}>
            <LinearGradient colors={['#667eea', '#764ba2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.topAccent} />
            
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nama Lengkap</Text>
                <TextInput style={styles.input} placeholder="Nama Lengkap Anda" placeholderTextColor="#9ca3af" value={name} onChangeText={setName} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} placeholder="nama@email.com" placeholderTextColor="#9ca3af" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Kata Sandi</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput style={styles.passwordInput} placeholder="••••••••" placeholderTextColor="#9ca3af" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    <Text style={{ color: '#6366f1', fontWeight: 'bold' }}>{showPassword ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Konfirmasi Kata Sandi</Text>
                <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#9ca3af" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPassword} />
              </View>

              <TouchableOpacity onPress={handleRegister} disabled={loading} style={styles.mainBtnContainer}>
                <LinearGradient colors={loading ? ['#9ca3af', '#6b7280'] : ['#667eea', '#764ba2']} style={styles.mainBtn}>
                  <Text style={styles.mainBtnText}>{loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Sudah punya akun? <Text style={styles.link} onPress={() => router.push('/login')}>Masuk</Text></Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContent: { padding: 24, justifyContent: 'center', minHeight: '100%' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  brand: { color: '#4f46e5' },
  dividerContainer: { alignItems: 'center', marginBottom: 16, position: 'relative' },
  dividerLine: { width: 100, height: 4, backgroundColor: '#6366f1', borderRadius: 2 },
  dividerDot: { position: 'absolute', top: -6, width: 16, height: 16, backgroundColor: '#fff', borderWidth: 4, borderColor: '#6366f1', borderRadius: 8 },
  subtitle: { color: '#4b5563', textAlign: 'center', lineHeight: 20 },
  card: { backgroundColor: '#fff', borderRadius: 24, elevation: 5, overflow: 'hidden' },
  topAccent: { height: 4 },
  form: { padding: 24 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 14, fontSize: 16, color: '#111827' },
  passwordWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12 },
  passwordInput: { flex: 1, padding: 14, fontSize: 16, color: '#111827' },
  eyeBtn: { paddingRight: 16 },
  mainBtnContainer: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  mainBtn: { paddingVertical: 16, alignItems: 'center' },
  mainBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footer: { marginTop: 32, alignItems: 'center' },
  footerText: { color: '#4b5563' },
  link: { color: '#4f46e5', fontWeight: 'bold' },
});
