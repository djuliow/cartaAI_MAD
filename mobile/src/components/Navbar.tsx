import React, { useMemo, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import Logo from './Logo';

type MenuLink = {
  label: string;
  path: string;
};

const navLinks: MenuLink[] = [
  { label: 'Beranda', path: '/' },
  { label: 'Tentang', path: '/about' },
  { label: 'Template', path: '/template' },
  { label: 'Harga', path: '/harga' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session, userProfile } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const router = useRouter();
  const pathname = usePathname();

  const isPremium = userProfile?.subscription_status === 'premium';
  const theme = useMemo(
    () => ({
      text: darkMode ? '#f9fafb' : '#111827',
      secondary: darkMode ? '#d1d5db' : '#6b7280',
      panel: darkMode ? 'rgba(17,24,39,0.96)' : 'rgba(255,255,255,0.96)',
      border: darkMode ? 'rgba(55,65,81,0.65)' : 'rgba(229,231,235,0.85)',
      hover: darkMode ? 'rgba(31,41,55,0.95)' : '#f8fafc',
      active: '#4f46e5',
      freeBg: darkMode ? '#374151' : '#e5e7eb',
      freeText: darkMode ? '#f3f4f6' : '#1f2937',
    }),
    [darkMode]
  );

  const handleNavigate = (path: string) => {
    setIsMenuOpen(false);
    router.push(path as never);
  };

  const isActivePath = (path: string) => pathname === path;

  return (
    <View style={styles.wrapper}>
      <BlurView
        intensity={90}
        tint={darkMode ? 'dark' : 'light'}
        style={[
          styles.header,
          {
            backgroundColor: theme.panel,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.brand}
              onPress={() => handleNavigate('/')}
              activeOpacity={0.85}
            >
              <Logo size={46} showText={false} />
              <Text style={[styles.brandText, { color: theme.text }]}>cartaAI</Text>
            </TouchableOpacity>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={toggleDarkMode}
                style={[styles.iconButton, { backgroundColor: theme.hover }]}
                activeOpacity={0.85}
              >
                <MaterialIcons
                  name={darkMode ? 'light-mode' : 'dark-mode'}
                  size={22}
                  color={theme.secondary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsMenuOpen((prev) => !prev)}
                style={[styles.iconButton, { backgroundColor: theme.hover }]}
                activeOpacity={0.85}
              >
                <MaterialIcons
                  name={isMenuOpen ? 'close' : 'menu'}
                  size={24}
                  color={theme.text}
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </BlurView>

      {isMenuOpen ? (
        <View style={styles.menuOverlay}>
          <BlurView
            intensity={95}
            tint={darkMode ? 'dark' : 'light'}
            style={[
              styles.menuPanel,
              {
                backgroundColor: theme.panel,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.menuContent}>
              {navLinks.map((item) => {
                const active = isActivePath(item.path);
                return (
                  <TouchableOpacity
                    key={item.path}
                    onPress={() => handleNavigate(item.path)}
                    style={styles.linkButton}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.linkText,
                        { color: active ? theme.active : theme.text },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              {session ? (
                <View style={styles.authGroup}>
                  {isPremium ? (
                    <TouchableOpacity
                      onPress={() => handleNavigate('/(tabs)/generator')}
                      style={styles.ctaWrapper}
                      activeOpacity={0.9}
                    >
                      <LinearGradient
                        colors={['#facc15', '#f97316']}
                        style={styles.ctaButton}
                      >
                        <Text style={styles.ctaText}>Premium Generator</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleNavigate('/(tabs)/generator')}
                      style={[styles.freeButton, { backgroundColor: theme.freeBg }]}
                      activeOpacity={0.9}
                    >
                      <Text style={[styles.freeButtonText, { color: theme.freeText }]}>
                        Free Generator
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() => handleNavigate('/(tabs)/profile')}
                    style={styles.ctaWrapper}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={['#6366f1', '#7c3aed']}
                      style={styles.ctaButton}
                  >
                      <Text style={styles.ctaText}>Profil</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.authGroup}>
                  <TouchableOpacity
                    onPress={() => handleNavigate('/login')}
                    style={styles.ctaWrapper}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={['#6366f1', '#7c3aed']}
                      style={styles.ctaButton}
                    >
                      <Text style={styles.ctaText}>Masuk</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleNavigate('/register')}
                    style={styles.ctaWrapper}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={['#6366f1', '#7c3aed']}
                      style={styles.ctaButton}
                    >
                      <Text style={styles.ctaText}>Daftar</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </BlurView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 120,
  },
  header: {
    borderBottomWidth: 1,
  },
  safeArea: {
    paddingTop: Platform.OS === 'android' ? 10 : 0,
  },
  headerRow: {
    height: 72,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandText: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuOverlay: {
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'android' ? 84 : 92,
  },
  menuPanel: {
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  menuContent: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 6,
  },
  linkButton: {
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginTop: 8,
    marginBottom: 12,
  },
  authGroup: {
    gap: 10,
  },
  ctaWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  ctaButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  ctaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  freeButton: {
    minHeight: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  freeButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
