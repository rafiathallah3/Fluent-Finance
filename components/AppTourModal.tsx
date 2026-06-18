import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { CustomText as Text } from './CustomText';
import {
  Sparkles,
  Home,
  BookOpen,
  Wallet,
  LineChart,
  Map,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeStore } from '../store/useThemeStore';

interface AppTourModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TOUR_SLIDES = [
  {
    id: 'welcome',
    title: 'Welcome to Fluent Finance!',
    subtitle: 'Your risk-free playground to financial literacy.',
    icon: Sparkles,
    color: '#0ea5e9',
    description: 'Fluent Finance combines education with simulation. Let\'s take a quick 1-minute tour to see how to navigate and make the most of the app!',
    bullets: [
      'Learn key financial concepts via interactive lessons.',
      'Test your budgeting skills with realistic scenarios.',
      'Trade assets paper-money style with live price feeds.',
    ],
  },
  {
    id: 'home',
    title: 'Home & Habits',
    subtitle: 'Track your streak, levels, and wealth.',
    icon: Home,
    color: '#f97316',
    description: 'The Home dashboard keeps you motivated and tracks your daily financial learning progress:',
    bullets: [
      '🔥 Streak Flame: Glows when you read lessons daily. Keep it alive!',
      '🏆 Level Badge: Accumulate Experience Points (XP) to rank up.',
      '💼 Wealth Summary: Combined value of cash and simulator assets.',
    ],
  },
  {
    id: 'learn',
    title: 'Learn Tab',
    subtitle: 'Byte-sized finance lessons.',
    icon: BookOpen,
    color: '#a855f7',
    description: 'Browse the Learn catalog to read finance modules across Investing, Trading, and Budgeting:',
    bullets: [
      'Concept cards cover Compound Interest, Debt ratios, and Candlesticks.',
      'Read to completion to earn +50 XP and grow your Daily Streak.',
      'Earned badges will automatically record on your Journey profile.',
    ],
  },
  {
    id: 'budget',
    title: 'Money Lab - Budgeting',
    subtitle: 'Test cash flow allocations.',
    icon: Wallet,
    color: '#10b981',
    description: 'Practice virtual budget management in the Money Lab (Budget tab):',
    bullets: [
      'Sliders let you adjust Monthly Income and target Savings Rate.',
      'Calculates allowances for monthly expenses automatically.',
      'Target at least 15% savings to keep your tracker green and healthy.',
    ],
  },
  {
    id: 'trading',
    title: 'Money Lab - Paper Trading',
    subtitle: 'Buy and Sell assets risk-free.',
    icon: LineChart,
    color: '#f59e0b',
    description: 'Trade simulator assets on real market data (Invest tab):',
    bullets: [
      'Simulate trades with a custom virtual starting cash balance.',
      'Execute Buy or Sell orders on real-time price feeds.',
      'Every successful order execution rewards you with +10 XP!',
      'Monitor live P&L and view detailed receipt logs in History.',
    ],
  },
  {
    id: 'market_journey',
    title: 'Market, Journey & AI Helper',
    subtitle: 'Sentiment trackers and your roadmap.',
    icon: Map,
    color: '#ec4899',
    description: 'Advanced features for deeper learning:',
    bullets: [
      'Market tab: Includes the Fear & Greed Sentiment Gauge.',
      'Journey tab: Visualizes your lesson completion roadmap.',
      '💬 AI Assistant: Click the floating chat bubble at the bottom center to ask DeepSeek any finance questions!',
    ],
  },
];

export function AppTourModal({ visible, onClose }: AppTourModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currentTheme } = useThemeStore();

  const handleNext = async () => {
    if (currentIndex < TOUR_SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      await handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem('hasSeenTour', 'true');
    } catch (e) {
      console.warn('Failed to save tour status', e);
    }
    setCurrentIndex(0);
    onClose();
  };

  if (!visible) return null;

  const currentSlide = TOUR_SLIDES[currentIndex];
  const Icon = currentSlide.icon;
  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === TOUR_SLIDES.length - 1;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleFinish}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Top Graphic Header */}
          <LinearGradient
            colors={[currentSlide.color + '15', 'transparent']}
            style={styles.gradientHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />

          {/* Floating Icon Box */}
          <View style={[styles.iconBox, { backgroundColor: currentSlide.color + '20', borderColor: currentSlide.color + '40' }]}>
            <Icon size={28} color={currentSlide.color} />
          </View>

          {/* Content Area */}
          <View style={styles.content}>
            <Text weight="bold" style={styles.title}>{currentSlide.title}</Text>
            <Text weight="semiBold" style={[styles.subtitle, { color: currentSlide.color }]}>
              {currentSlide.subtitle}
            </Text>
            
            <Text style={styles.description}>{currentSlide.description}</Text>

            {/* Bullets */}
            <View style={styles.bulletsList}>
              {currentSlide.bullets.map((bullet, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={[styles.bulletDot, { color: currentSlide.color }]}>•</Text>
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Bottom Footer Controls */}
          <View style={styles.footer}>
            {/* Dots Indicator */}
            <View style={styles.dotsRow}>
              {TOUR_SLIDES.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    idx === currentIndex
                      ? [styles.dotActive, { backgroundColor: currentSlide.color }]
                      : styles.dotInactive,
                  ]}
                />
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsRow}>
              {!isFirstSlide ? (
                <TouchableOpacity
                  style={styles.prevBtn}
                  onPress={handlePrev}
                  activeOpacity={0.7}
                >
                  <ArrowLeft size={16} color="#94a3b8" />
                  <Text weight="medium" style={styles.prevBtnText}>Back</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.skipBtn}
                  onPress={handleFinish}
                  activeOpacity={0.7}
                >
                  <Text style={styles.skipBtnText}>Skip Tour</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={handleNext}
                activeOpacity={0.85}
                style={styles.nextBtnContainer}
              >
                <LinearGradient
                  colors={isLastSlide ? ['#10b981', '#059669'] : currentTheme.gradient}
                  style={styles.nextBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text weight="bold" style={styles.nextBtnText}>
                    {isLastSlide ? 'Get Started' : 'Next'}
                  </Text>
                  {isLastSlide ? (
                    <Check size={16} color="#ffffff" strokeWidth={3} />
                  ) : (
                    <ArrowRight size={16} color="#ffffff" strokeWidth={2.5} />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(7, 14, 26, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: Math.min(SCREEN_WIDTH - 32, 360),
    maxHeight: SCREEN_HEIGHT * 0.82,
    backgroundColor: '#142337',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#1e3048',
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
  },
  gradientHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  content: {
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  description: {
    color: '#cbd5e1',
    fontSize: 13.5,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  bulletsList: {
    width: '100%',
    backgroundColor: '#0f172a',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 10,
    marginBottom: 24,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletDot: {
    fontSize: 16,
    lineHeight: 18,
  },
  bulletText: {
    color: '#94a3b8',
    fontSize: 12.5,
    lineHeight: 17,
    flex: 1,
  },
  footer: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 18,
  },
  dotInactive: {
    width: 6,
    backgroundColor: '#334155',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  skipBtn: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  skipBtnText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  prevBtnText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  nextBtnContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  nextBtnText: {
    color: '#ffffff',
    fontSize: 14,
  },
});
