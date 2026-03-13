import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useDarkMode } from '../context/DarkModeContext';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import RecentInvitations from '../components/RecentInvitations';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import ChatbotFAB from '../components/ChatbotFAB';

export default function HomeScreen() {
  const { darkMode } = useDarkMode();

  return (
    <View style={{ flex: 1 }}>
      <Navbar />

      <ScrollView 
        style={[styles.container, { backgroundColor: darkMode ? '#111827' : '#f9fafb' }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Hero />
        <RecentInvitations />
        <Features />
        <Pricing />
        <Testimonials />
        <View style={styles.bottomSpace} />
      </ScrollView>

      <ChatbotFAB />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 92,
    paddingBottom: 20,
  },
  bottomSpace: {
    height: 40,
  },
});
