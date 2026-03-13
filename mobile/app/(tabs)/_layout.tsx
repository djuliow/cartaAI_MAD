import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useDarkMode } from '../../src/context/DarkModeContext';

export default function TabLayout() {
  const { darkMode } = useDarkMode();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: darkMode ? '#9ca3af' : '#6b7280',
        tabBarStyle: {
          display: 'none', // Sembunyikan bar navigasi bawah
        },
        headerShown: false, // Sembunyikan header default karena kita pakai Navbar kustom
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="generator"
        options={{
          title: 'Buat',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="auto-awesome" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
