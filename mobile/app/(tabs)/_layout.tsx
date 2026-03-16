import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDarkMode } from '../../src/context/DarkModeContext';

export default function TabLayout() {
  const { darkMode } = useDarkMode();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: darkMode ? '#9ca3af' : '#6b7280',
        tabBarStyle: {
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          borderTopColor: darkMode ? '#374151' : '#e5e7eb',
          height: 60 + (insets.bottom > 0 ? insets.bottom - 10 : 0),
          paddingBottom: insets.bottom > 0 ? insets.bottom - 4 : 8,
          paddingTop: 8,
        },
        headerShown: false, // Sembunyikan header default karena kita pakai Navbar kustom
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="template"
        options={{
          title: 'Template',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="grid-view" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="generator"
        options={{
          title: 'Buat',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="auto-awesome" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="harga"
        options={{
          title: 'Harga',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="sell" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Tentang',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="info" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
