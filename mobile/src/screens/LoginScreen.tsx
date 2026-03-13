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
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Logo from '../components/Logo';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fungsi untuk memproses URL kembalian dari Google
  const extractParams = (url: string) => {
    const params: any = {};
    const queryString = url.split('#')[1] || url.split('?')[1];
    if (queryString) {
      const pairs = queryString.split('&');
      for (const pair of pairs) {
        const [key, value] = pair.split('=');
        params[key] = decodeURIComponent(value);
      }
    }
    return params;
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // 1. Tentukan URL Redirect (Penting!)
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'cartaai', // Sesuai scheme di app.json
      });
      
      console.log("PASTIKAN URL INI ADA DI SUPABASE:", redirectUri);

      // 2. Minta URL Login dari Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true, // Kita akan buka browser secara manual
        },
      });

      if (error) throw error;

      // 3. Buka browser HP untuk login
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
        
        // 4. Jika sukses kembali ke aplikasi, ambil tokennya
        if (result.type === 'success' && result.url) {
          const { access_token, refresh_token } = extractParams(result.url);
          
          if (access_token && refresh_token) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (sessionError) throw sessionError;
            
            router.replace('/(tabs)');
          }
        }
      }
    } catch (error: any) {
      Alert.alert('Login Google Gagal', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Isi email dan password.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
      if (error) throw error;
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Gagal', error.message);
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
            <Text style={styles.title}>Masuk ke <Text style={styles.brand}>CartaAI</Text></Text>
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} /><View style={styles.dividerDot} />
            </View>
            <Text style={styles.subtitle}>Selamat datang kembali! Silakan masuk ke akun Anda.</Text>
          </View>

          <View style={styles.card}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.topAccent} />
            <View style={styles.form}>
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

              <TouchableOpacity onPress={handleLogin} disabled={loading} style={styles.mainBtnContainer}>
                <LinearGradient colors={loading ? ['#9ca3af', '#6b7280'] : ['#667eea', '#764ba2']} style={styles.mainBtn}>
                  <Text style={styles.mainBtnText}>{loading ? 'Memproses...' : 'Masuk'}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.orArea}>
                <View style={styles.orLine} /><Text style={styles.orText}>Atau</Text><View style={styles.orLine} />
              </View>

              <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin}>
                <Image source={{ uri: 'https://www.google.com/favicon.ico' }} style={styles.googleIcon} />
                <Text style={styles.googleBtnText}>Lanjutkan dengan Google</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Belum punya akun? <Text style={styles.link} onPress={() => router.push('/register')}>Daftar</Text></Text>
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
  mainBtnContainer: { borderRadius: 12, overflow: 'hidden', marginBottom: 24 },
  mainBtn: { paddingVertical: 16, alignItems: 'center' },
  mainBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  orArea: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  orLine: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  orText: { paddingHorizontal: 12, color: '#6b7280', fontSize: 14 },
  googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, backgroundColor: '#fff', gap: 12 },
  googleIcon: { width: 20, height: 20, resizeMode: 'contain' },
  googleBtnText: { color: '#374151', fontWeight: '600' },
  footer: { marginTop: 32, alignItems: 'center' },
  footerText: { color: '#4b5563' },
  link: { color: '#4f46e5', fontWeight: 'bold' },
});
