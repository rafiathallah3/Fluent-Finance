import { LinearGradient } from 'expo-linear-gradient';
import { usePathname } from 'expo-router';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomText as Text } from './CustomText';
import { useThemeStore } from '../store/useThemeStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API || 'sk-310a2b5eef814971a9501697d4a55a7a';

const SUGGESTIONS = [
  { text: 'Explain Compound Interest', prompt: 'Explain compound interest with an intuitive metaphor.' },
  { text: 'Budgeting Tips', prompt: 'What are some key tips for budgeting in the Money Lab?' },
  { text: 'How to Paper Trade?', prompt: 'How do I start paper trading and using the Invest Lab in the app?' },
  { text: 'What is Market Cap?', prompt: 'What is Market Capitalization and how does it relate to cryptocurrency?' },
];

const SYSTEM_PROMPT = `You are Fluent Finance AI, an intelligent personal finance tutor integrated into the Fluent Finance mobile app.
Your goal is to guide the user in learning finance, budgeting, and investment.
Explain financial concepts (like compound interest, candlesticks, emergency funds, debt-to-income ratio) simply, using intuitive real-world metaphors (e.g., comparing interest to a snowball, or market cap to a pizza).
If the user asks about using the app, you can guide them:
- Home: dashboard showing day streaks, level, and wealth.
- Learn: interactive lessons.
- Money Lab: includes the Budget planner and Paper Trading simulator (BTC/USD paper trading starting with $10,000, trade executions reward +10 XP).
- Market: live price watchlists (BTC, ETH, SOL) and Fear & Greed index.
- Journey: visual roadmap of learning progress.
Keep responses concise, friendly, and properly formatted (use bold text or bullet points where appropriate). Do not mention that you are an AI model unless asked, and emphasize your role as the Fluent Finance AI.`;

function renderInlineStyles(text: string, currentTheme: any) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const cleanText = part.slice(2, -2);
      return (
        <Text key={index} weight="bold" style={{ color: '#ffffff' }}>
          {cleanText}
        </Text>
      );
    } else if (part.startsWith('`') && part.endsWith('`')) {
      const cleanText = part.slice(1, -1);
      return (
        <Text
          key={index}
          style={{
            fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
            backgroundColor: '#101e30',
            color: currentTheme.primary,
            paddingHorizontal: 4,
            paddingVertical: 1,
            borderRadius: 4,
            fontSize: 13,
          }}
        >
          {cleanText}
        </Text>
      );
    } else {
      return <Text key={index}>{part}</Text>;
    }
  });
}

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { currentTheme } = useThemeStore();
  const lines = content.split('\n');

  return (
    <View style={styles.mdContainer}>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (trimmed === '') {
          return <View key={index} style={{ height: 6 }} />;
        }

        // Headers
        if (line.startsWith('### ')) {
          return (
            <Text key={index} weight="bold" style={[styles.mdHeader3, { color: '#ffffff', marginTop: 8, marginBottom: 4 }]}>
              {renderInlineStyles(line.slice(4), currentTheme)}
            </Text>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <Text key={index} weight="bold" style={[styles.mdHeader2, { color: '#ffffff', marginTop: 10, marginBottom: 6 }]}>
              {renderInlineStyles(line.slice(3), currentTheme)}
            </Text>
          );
        }
        if (line.startsWith('# ')) {
          return (
            <Text key={index} weight="bold" style={[styles.mdHeader1, { color: '#ffffff', marginTop: 12, marginBottom: 8 }]}>
              {renderInlineStyles(line.slice(2), currentTheme)}
            </Text>
          );
        }

        // List Items
        const bulletMatch = line.match(/^\s*[\*\-\•]\s+(.*)/);
        if (bulletMatch) {
          return (
            <View key={index} style={styles.mdBulletRow}>
              <Text style={[styles.mdBullet, { color: currentTheme.primary }]}>•</Text>
              <Text style={styles.mdBulletText}>
                {renderInlineStyles(bulletMatch[1], currentTheme)}
              </Text>
            </View>
          );
        }

        const numberMatch = line.match(/^\s*(\d+)\.\s+(.*)/);
        if (numberMatch) {
          return (
            <View key={index} style={styles.mdBulletRow}>
              <Text style={[styles.mdNumber, { color: currentTheme.primary }]}>{numberMatch[1]}.</Text>
              <Text style={styles.mdBulletText}>
                {renderInlineStyles(numberMatch[2], currentTheme)}
              </Text>
            </View>
          );
        }

        // Paragraph
        return (
          <Text key={index} style={styles.mdParagraph}>
            {renderInlineStyles(line, currentTheme)}
          </Text>
        );
      })}
    </View>
  );
}

export function FloatingChat() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { currentTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'greeting',
      role: 'assistant',
      content: "Hi! I'm your Fluent Finance AI assistant powered by DeepSeek. Ask me anything about personal finance, budgeting, investing, or how to use this app!",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          setIsOpen(false);
        }
      },
    })
  ).current;

  const pan = useRef(new Animated.ValueXY()).current;
  const panOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const listenerId = pan.addListener((value) => {
      panOffset.current = value;
    });
    return () => {
      pan.removeListener(listenerId);
    };
  }, [pan]);

  const buttonPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: panOffset.current.x,
          y: panOffset.current.y,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();
        if (Math.abs(gestureState.dx) < 8 && Math.abs(gestureState.dy) < 8) {
          setIsOpen(true);
          return;
        }

        const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
        const buttonSize = 54;
        const padding = 16;
        
        const currentX = panOffset.current.x;
        const snapX = currentX < 0
          ? -screenWidth / 2 + buttonSize / 2 + padding
          : screenWidth / 2 - buttonSize / 2 - padding;

        const currentY = panOffset.current.y;
        const minY = -screenHeight + bottomOffset + 120;
        const maxY = bottomOffset - 20;
        
        const constrainedY = Math.min(Math.max(currentY, minY), maxY);

        Animated.parallel([
          Animated.spring(pan.x, {
            toValue: snapX,
            useNativeDriver: false,
            tension: 60,
            friction: 7,
          }),
          Animated.spring(pan.y, {
            toValue: constrainedY,
            useNativeDriver: false,
            tension: 60,
            friction: 7,
          }),
        ]).start();
      },
    })
  ).current;

  const hasTabBar = pathname === '/' || pathname === '/learn' || pathname === '/lab' || pathname === '/market' || pathname === '/journey';
  const bottomOffset = hasTabBar ? (Platform.OS === 'ios' ? 110 : 92) : (Platform.OS === 'ios' ? 36 : 20);

  // Auto scroll to bottom
  useEffect(() => {
    if (messages.length > 0 && isOpen) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build API messages payload
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.concat(userMessage).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ];

      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: apiMessages,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch DeepSeek API response.');
      }

      const data = await response.json();
      const botResponseText = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that response.";

      const botMessage: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: botResponseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('DeepSeek API Error:', error);
      const errorMessage: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: 'Oops! I am having trouble connecting to the DeepSeek server right now. Please check your internet connection and try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowBot]}>
        {!isUser && (
          <View style={styles.botIconMini}>
            <Sparkles size={12} color={currentTheme.primary} />
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isUser ? [styles.bubbleUser, { backgroundColor: currentTheme.primary }] : styles.bubbleBot
        ]}>
          {isUser ? (
            <Text style={styles.messageText}>{item.content}</Text>
          ) : (
            <MarkdownRenderer content={item.content} />
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      {/* Floating Button */}
      <Animated.View
        style={[
          styles.floatingContainer,
          {
            bottom: bottomOffset,
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
        {...buttonPanResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.chatButtonContainer, { shadowColor: currentTheme.primary }]}
        >
          <LinearGradient
            colors={currentTheme.gradient}
            style={styles.chatButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MessageCircle size={26} color="#ffffff" />
            <View style={styles.badgePulse} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Chat Modal */}
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          {/* Backdrop Touch to Close */}
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setIsOpen(false)}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.chatContainer}
          >
            {/* Drag Handle Indicator */}
            <View {...panResponder.panHandlers} style={styles.dragHandleArea}>
              <View style={styles.dragHandle} />
            </View>

            {/* Header */}
            <View {...panResponder.panHandlers} style={styles.chatHeader}>
              <View style={styles.headerTitleRow}>
                <View style={styles.headerIconBg}>
                  <Sparkles size={18} color={currentTheme.primary} />
                </View>
                <View>
                  <Text weight="bold" style={styles.headerTitleText}>Fluent Finance AI</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setIsOpen(false)}
              >
                <X size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Message History */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessageItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => (
                isLoading ? (
                  <View style={styles.typingContainer}>
                    <View style={styles.botIconMini}>
                      <Sparkles size={12} color={currentTheme.primary} />
                    </View>
                    <View style={[styles.messageBubble, styles.bubbleBot, styles.typingBubble]}>
                      <ActivityIndicator size="small" color={currentTheme.primary} />
                      <Text style={styles.typingText}>AI is compiling thoughts...</Text>
                    </View>
                  </View>
                ) : null
              )}
            />

            {/* Suggested Chips (Only displayed on starting message list) */}
            {messages.length === 1 && !isLoading && (
              <View style={styles.chipsWrapper}>
                <Text style={styles.chipsLabel}>Ask me about...</Text>
                <FlatList
                  horizontal
                  data={SUGGESTIONS}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.text}
                  contentContainerStyle={styles.chipsScroll}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.chipBtn}
                      onPress={() => handleSend(item.prompt)}
                    >
                      <Text weight="medium" style={styles.chipText}>{item.text}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            {/* Input Bar */}
            <View style={[
              styles.inputBar,
              { paddingBottom: Math.max(insets.bottom, 14) }
            ]}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask a question..."
                placeholderTextColor="#64748b"
                value={inputText}
                onChangeText={setInputText}
                multiline={false}
                onSubmitEditing={() => handleSend(inputText)}
              />
              <TouchableOpacity
                style={[
                  styles.sendBtn,
                  { backgroundColor: currentTheme.primary },
                  !inputText.trim() && styles.sendBtnDisabled
                ]}
                onPress={() => handleSend(inputText)}
                disabled={!inputText.trim() || isLoading}
              >
                <Send size={18} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 999,
  },
  chatButtonContainer: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  chatButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  badgePulse: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10b981',
    borderWidth: 1.5,
    borderColor: '#0b1626',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(7, 14, 26, 0.75)',
    justifyContent: 'flex-end',
  },
  chatContainer: {
    height: SCREEN_HEIGHT * 0.75,
    backgroundColor: '#0b1626',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#1e2f47',
    overflow: 'hidden',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#101e30',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleText: {
    color: '#ffffff',
    fontSize: 16,
  },
  headerSubtitleText: {
    color: '#0ea5e9',
    fontSize: 11,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#1e2f47',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  messageRow: {
    flexDirection: 'row',
    maxWidth: '85%',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageRowUser: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  messageRowBot: {
    alignSelf: 'flex-start',
  },
  botIconMini: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleUser: {
    backgroundColor: '#0284c7',
    borderBottomRightRadius: 2,
  },
  bubbleBot: {
    backgroundColor: '#142337',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  messageText: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 20,
  },
  mdContainer: {
    gap: 4,
  },
  mdParagraph: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 20,
  },
  mdBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingLeft: 4,
    marginVertical: 2,
  },
  mdBullet: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'bold',
  },
  mdNumber: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: 'bold',
  },
  mdBulletText: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  mdHeader1: {
    fontSize: 18,
    lineHeight: 24,
    color: '#ffffff',
  },
  mdHeader2: {
    fontSize: 16,
    lineHeight: 22,
    color: '#ffffff',
  },
  mdHeader3: {
    fontSize: 15,
    lineHeight: 20,
    color: '#ffffff',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  typingText: {
    color: '#64748b',
    fontSize: 13,
  },
  chipsWrapper: {
    paddingVertical: 12,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  chipsLabel: {
    color: '#64748b',
    fontSize: 12,
    paddingHorizontal: 20,
    marginBottom: 8,
    fontWeight: '600',
  },
  chipsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chipBtn: {
    backgroundColor: '#1e2f47',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipText: {
    color: '#cbd5e1',
    fontSize: 13,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    backgroundColor: '#101e30',
    gap: 12,
  },
  dragHandleArea: {
    width: '100%',
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#101e30',
    paddingTop: 4,
  },
  dragHandle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#334155',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1e2f47',
    borderWidth: 1,
    borderColor: '#334155',
    color: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 80,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#1e2f47',
    opacity: 0.5,
  },
});
