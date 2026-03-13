import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useDarkMode } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../lib/api';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
}

export default function ChatScreen() {
  const { darkMode } = useDarkMode();
  const { session } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Halo! Saya adalah asisten AI untuk membantu Anda membuat undangan pernikahan yang cantik. Silakan berikan detail acara Anda seperti nama mempelai, tanggal, lokasi, dan tema yang diinginkan.',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(msg => ({
        role: msg.type === "bot" ? "bot" : "user",
        content: msg.content
      }));

      if (!API_BASE_URL) {
        throw new Error("EXPO_PUBLIC_BACKEND_URL tidak terdefinisi di .env");
      }

      console.log("Mencoba fetch ke:", `${API_BASE_URL}/api/chatbot/chat`);

      const response = await fetch(`${API_BASE_URL}/api/chatbot/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          history: chatHistory
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const rawContent = data.reply || "Maaf, saya tidak mengerti.";
        const cleanContent = rawContent.replace(/\*{1,2}/g, "");

        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: cleanContent,
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error(data.detail || "Gagal mendapatkan respons bot");
      }
    } catch (error: any) {
      console.error("Chatbot Error:", error);
      let errorMsg = "Oops! Terjadi kesalahan koneksi.";
      
      if (error.message === "Network request failed") {
        errorMsg = "Gagal terhubung ke server. Pastikan IP di .env benar dan server backend menyala.";
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: errorMsg,
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    {
      title: "Tema Rustic",
      text: "Saya ingin membuat undangan pernikahan dengan tema rustic, nama mempelai pria John dan wanita Jane, tanggal 15 Desember 2024",
      icon: "celebration",
    },
    {
      title: "Tema Modern",
      text: "Buat undangan modern dengan warna biru navy, nama mempelai Alex dan Sarah, tanggal 20 Januari 2025 di Jakarta",
      icon: "palette",
    },
    {
      title: "Tema Klasik",
      text: "Saya butuh undangan klasik dengan tema emas, nama mempelai Michael dan Emily, tanggal 10 Februari 2025",
      icon: "auto_awesome",
    },
  ];

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageWrapper,
      item.type === 'user' ? styles.userWrapper : styles.botWrapper
    ]}>
      <View style={[
        styles.messageBubble,
        item.type === 'user' 
          ? styles.userBubble 
          : [styles.botBubble, { backgroundColor: darkMode ? '#1f2937' : '#fff', borderColor: darkMode ? '#374151' : '#e5e7eb' }]
      ]}>
        {item.type === 'user' ? (
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.userGradient}
          >
            <Text style={styles.userText}>{item.content}</Text>
          </LinearGradient>
        ) : (
          <Text style={[styles.botText, { color: darkMode ? '#fff' : '#111827' }]}>
            {item.content}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#111827' : '#f9fafb' }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Chat Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.botInfo}>
            <View style={styles.botAvatar}>
              <MaterialIcons name="smart-toy" size={24} color="#6366f1" />
            </View>
            <View>
              <Text style={styles.botName}>carta AI</Text>
              <Text style={styles.botStatus}>Online - Siap membantu Anda</Text>
            </View>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={
            isLoading ? (
              <View style={styles.loadingContainer}>
                <View style={[styles.loadingBubble, { backgroundColor: darkMode ? '#1f2937' : '#fff' }]}>
                  <ActivityIndicator size="small" color="#6366f1" />
                  <Text style={[styles.loadingText, { color: darkMode ? '#9ca3af' : '#6b7280' }]}>Sedang mengetik...</Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* Quick Prompts - Only show at start */}
        {messages.length <= 1 && (
          <View style={styles.quickPromptsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
              {quickPrompts.map((prompt, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.promptCard, { backgroundColor: darkMode ? '#1f2937' : '#fff' }]}
                  onPress={() => setInputText(prompt.text)}
                >
                  <LinearGradient colors={['#6366f1', '#a855f7']} style={styles.promptIcon}>
                    <MaterialIcons name={prompt.icon as any} size={20} color="#fff" />
                  </LinearGradient>
                  <Text style={[styles.promptTitle, { color: darkMode ? '#fff' : '#111827' }]}>{prompt.title}</Text>
                  <Text style={styles.promptDesc} numberOfLines={2}>Ketuk untuk mencoba</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Input Area */}
        <View style={[styles.inputArea, { backgroundColor: darkMode ? '#1f2937' : '#fff', borderTopColor: darkMode ? '#374151' : '#e5e7eb' }]}>
          <TextInput
            style={[styles.textInput, { color: darkMode ? '#fff' : '#111827' }]}
            placeholder="Ketik detail undangan Anda..."
            placeholderTextColor="#9ca3af"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, { opacity: inputText.trim() ? 1 : 0.5 }]} 
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.sendGradient}>
              <MaterialIcons name="send" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  botInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  botStatus: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageWrapper: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  userWrapper: {
    alignSelf: 'flex-end',
  },
  botWrapper: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },
  botText: {
    fontSize: 15,
    lineHeight: 22,
  },
  loadingContainer: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
  },
  loadingText: {
    fontSize: 13,
  },
  quickPromptsContainer: {
    paddingVertical: 16,
  },
  promptCard: {
    width: 160,
    padding: 16,
    borderRadius: 20,
    marginRight: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  promptIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  promptTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  promptDesc: {
    fontSize: 11,
    color: '#9ca3af',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
  },
  sendButton: {
    marginLeft: 8,
  },
  sendGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
