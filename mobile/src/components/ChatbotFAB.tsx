import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../lib/api';

type ChatMessage = {
  id: number;
  type: 'bot' | 'user';
  role: 'bot' | 'user';
  content: string;
};

export default function ChatbotFAB() {
  const router = useRouter();
  const { session } = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'bot',
      role: 'bot',
      content:
        'Halo! Saya siap membantu Anda membuat undangan pernikahan yang indah. Ada yang bisa saya bantu?',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const currentInput = inputMessage.trim();
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      role: 'user',
      type: 'user',
      content: currentInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      if (!API_BASE_URL) {
        throw new Error('EXPO_PUBLIC_BACKEND_URL tidak terdefinisi.');
      }

      const history = messages.map((message) => ({
        role: message.type === 'bot' ? 'bot' : 'user',
        content: message.content,
      }));

      const response = await fetch(`${API_BASE_URL}/api/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          history,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Gagal mendapatkan respons bot');
      }

      const rawContent = data.reply || 'Maaf, saya tidak mengerti.';
      const cleanContent = rawContent.replace(/\*{1,2}/g, '');

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: 'bot',
          type: 'bot',
          content: cleanContent,
        },
      ]);
    } catch (error) {
      console.error('Chatbot Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: 'bot',
          type: 'bot',
          content: 'Oops! Terjadi kesalahan koneksi. Silakan coba lagi nanti.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { text: 'Cara membuat undangan?', icon: 'help' as const },
    { text: 'Lihat paket harga', icon: 'attach-money' as const },
    { text: 'Contoh template', icon: 'palette' as const },
  ];

  return (
    <>
      {!isOpen ? (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsOpen(true)}
          activeOpacity={0.9}
        >
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.fabGradient}>
            <MaterialIcons name="chat" size={30} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      ) : null}

      <Modal visible={isOpen} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.window}>
            <View style={styles.gradientBorder}>
              <View style={styles.innerWindow}>
                <View style={styles.topAccent} />

                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
                  <View style={styles.headerInfo}>
                    <View style={styles.botAvatar}>
                      <MaterialIcons name="smart-toy" size={20} color="#fff" />
                    </View>
                    <View>
                      <Text style={styles.headerTitle}>cartaAI Assistant</Text>
                      <Text style={styles.headerStatus}>Online</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setIsOpen(false)}>
                    <MaterialIcons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </LinearGradient>

                <ScrollView
                  ref={scrollRef}
                  style={styles.messagesArea}
                  contentContainerStyle={styles.messagesContent}
                  showsVerticalScrollIndicator={false}
                >
                  {messages.map((message) => (
                    <View
                      key={message.id}
                      style={[
                        styles.messageRow,
                        message.type === 'user' ? styles.userRow : styles.botRow,
                      ]}
                    >
                      <View
                        style={[
                          styles.messageBubble,
                          message.type === 'user' ? styles.userBubble : styles.botBubble,
                        ]}
                      >
                        {message.type === 'user' ? (
                          <LinearGradient
                            colors={['#667eea', '#764ba2']}
                            style={styles.userBubbleGradient}
                          >
                            <Text style={styles.userMessageText}>{message.content}</Text>
                          </LinearGradient>
                        ) : (
                          <Text style={styles.botMessageText}>{message.content}</Text>
                        )}
                      </View>
                    </View>
                  ))}

                  {isLoading ? (
                    <View style={[styles.messageRow, styles.botRow]}>
                      <View style={[styles.messageBubble, styles.botBubble, styles.loadingBubble]}>
                        <View style={styles.loadingDots}>
                          <View style={styles.dot} />
                          <View style={styles.dot} />
                          <View style={styles.dot} />
                        </View>
                      </View>
                    </View>
                  ) : null}
                </ScrollView>

                {messages.length <= 2 ? (
                  <View style={styles.quickPromptSection}>
                    <Text style={styles.quickPromptLabel}>Pertanyaan cepat:</Text>
                    <View style={styles.quickPromptWrap}>
                      {quickPrompts.map((prompt, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => setInputMessage(prompt.text)}
                          style={styles.quickPromptButton}
                        >
                          <MaterialIcons name={prompt.icon} size={14} color="#4f46e5" />
                          <Text style={styles.quickPromptText}>{prompt.text}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ) : null}

                <View style={styles.inputArea}>
                  <View style={styles.inputRow}>
                    <TextInput
                      value={inputMessage}
                      onChangeText={setInputMessage}
                      placeholder="Tulis pesan Anda..."
                      placeholderTextColor="#9ca3af"
                      style={styles.input}
                      multiline
                    />
                    <TouchableOpacity
                      onPress={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      style={styles.sendButtonWrap}
                    >
                      <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={[
                          styles.sendButton,
                          (!inputMessage.trim() || isLoading) && styles.sendButtonDisabled,
                        ]}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <MaterialIcons name="send" size={18} color="#fff" />
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.footerText}>
                    Atau{' '}
                    <Text
                      style={styles.footerLink}
                      onPress={() => {
                        setIsOpen(false);
                        router.push(session ? '/chat' : '/login');
                      }}
                    >
                      buka halaman chat lengkap
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 10,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: 16,
  },
  window: {
    height: Platform.OS === 'ios' ? '78%' : '82%',
    maxHeight: 700,
  },
  gradientBorder: {
    flex: 1,
    borderRadius: 24,
    padding: 4,
    backgroundColor: '#667eea',
  },
  innerWindow: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#667eea',
    zIndex: 2,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerStatus: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  messagesArea: {
    flex: 1,
    backgroundColor: 'rgba(249,250,251,0.9)',
  },
  messagesContent: {
    padding: 20,
    gap: 14,
  },
  messageRow: {
    width: '100%',
  },
  userRow: {
    alignItems: 'flex-end',
  },
  botRow: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '86%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  userBubble: {
    backgroundColor: 'transparent',
  },
  botBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  userBubbleGradient: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  userMessageText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  botMessageText: {
    color: '#1f2937',
    fontSize: 14,
    lineHeight: 20,
  },
  loadingBubble: {
    minWidth: 74,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366f1',
  },
  quickPromptSection: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  quickPromptLabel: {
    color: '#6b7280',
    fontSize: 12,
    marginBottom: 8,
  },
  quickPromptWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickPromptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    backgroundColor: '#fff',
  },
  quickPromptText: {
    color: '#4f46e5',
    fontSize: 12,
    fontWeight: '600',
  },
  inputArea: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 22 : 14,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 96,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#111827',
    fontSize: 14,
  },
  sendButtonWrap: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  sendButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  footerText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 12,
  },
  footerLink: {
    color: '#4f46e5',
    fontWeight: '600',
  },
});
