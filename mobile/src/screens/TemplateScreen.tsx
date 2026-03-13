import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useDarkMode } from '../context/DarkModeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { WEDDING_TEMPLATES } from '../constants/data';

const { width } = Dimensions.get('window');

export default function TemplateScreen() {
  const { darkMode } = useDarkMode();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('elegan');

  const categories = [
    { id: 'elegan', label: 'Elegan', icon: 'auto-awesome' },
    { id: 'formal', label: 'Formal', icon: 'business-center' },
    { id: 'simple', label: 'Simple', icon: 'filter-hdr' },
  ];

  const TemplateCard = ({ item }: any) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: darkMode ? '#1f2937' : '#fff' }]}
      onPress={() => router.push(`/template-usage/${item.id}`)}
    >
      <Image 
        source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
        style={styles.cardImage} 
      />
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: darkMode ? '#fff' : '#111827' }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.cardDesc, { color: darkMode ? '#9ca3af' : '#6b7280' }]} numberOfLines={2}>
          {item.desc}
        </Text>
        <TouchableOpacity 
          style={styles.useButton}
          onPress={() => router.push(`/template-usage/${item.id}`)}
        >
          <Text style={styles.useButtonText}>Gunakan</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#111827' : '#f9fafb' }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={darkMode ? '#fff' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: darkMode ? '#fff' : '#111827' }]}>Pilih Desain</Text>
        <Text style={styles.subtitle}>Pilih desain yang paling sesuai dengan kisah cinta Anda.</Text>
      </View>

      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.id)}
              style={[
                styles.categoryTab,
                activeCategory === cat.id && styles.categoryTabActive,
                { backgroundColor: activeCategory === cat.id ? '#6366f1' : (darkMode ? '#1f2937' : '#fff') }
              ]}
            >
              <MaterialIcons 
                name={cat.icon as any} 
                size={20} 
                color={activeCategory === cat.id ? '#fff' : (darkMode ? '#9ca3af' : '#6b7280')} 
              />
              <Text style={[
                styles.categoryText,
                { color: activeCategory === cat.id ? '#fff' : (darkMode ? '#9ca3af' : '#6b7280') }
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.templateGrid} showsVerticalScrollIndicator={false}>
        <View style={styles.gridWrapper}>
          {WEDDING_TEMPLATES[activeCategory].map((item: any) => (
            <TemplateCard key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
  },
  backButton: {
    marginBottom: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  categoryTabActive: {
    shadowColor: '#6366f1',
    shadowOpacity: 0.3,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  templateGrid: {
    padding: 20,
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 56) / 2,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 8,
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 11,
    marginBottom: 12,
    lineHeight: 16,
  },
  useButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  useButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6366f1',
  },
});
