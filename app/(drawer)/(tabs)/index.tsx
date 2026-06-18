import { useRouter, useFocusEffect } from 'expo-router';
import {
  BookOpen,
  BrainCircuit,
  ChevronRight,
  Flame,
  LineChart,
  TrendingDown,
  TrendingUp,
  Trophy,
  Wallet,
  Zap,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomText as Text } from '../../../components/CustomText';
import { AppTourModal } from '../../../components/AppTourModal';
import { useAuthStore } from '../../../store/useAuthStore';
import { LESSON_CATEGORIES, useProgressStore } from '../../../store/useProgressStore';
import { useTradingStore } from '../../../store/useTradingStore';

// Lesson metadata mirrored from learn.tsx for quick-access cards
const LESSON_META: Record<string, { title: string; category: string; readTime: string; color: string }> = {
  '1': { title: 'How Compound Interest Works', category: 'Investing', readTime: '5 min', color: '#0ea5e9' },
  '2': { title: 'Understanding Candlesticks', category: 'Trading', readTime: '8 min', color: '#f59e0b' },
  '3': { title: 'Emergency Funds 101', category: 'Budgeting', readTime: '4 min', color: '#10b981' },
  '4': { title: 'Asset Allocation Strategies', category: 'Investing', readTime: '10 min', color: '#8b5cf6' },
  '5': { title: 'Debt To Income Ratio', category: 'Budgeting', readTime: '6 min', color: '#ec4899' },
  '6': { title: 'What is a Bull Market?', category: 'Investing', readTime: '5 min', color: '#22c55e' },
  '7': { title: 'Credit Scores Explained', category: 'Budgeting', readTime: '7 min', color: '#6366f1' },
};

export default function HomeScreen() {
  const router = useRouter();
  const { xp, streak, completedLessons, getCurrentLevel, getNextLevel, getLevelProgress } = useProgressStore();
  const { cashBalance, portfolio, marketPrices, unrealizedPnL } = useTradingStore();
  const { username } = useAuthStore();
  const [showTour, setShowTour] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const checkTourStatus = async () => {
        try {
          const hasSeen = await AsyncStorage.getItem('hasSeenTour');
          if (hasSeen !== 'true') {
            setShowTour(true);
          }
        } catch (e) {
          console.warn('Failed to check tour status', e);
        }
      };
      checkTourStatus();
    }, [])
  );

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const levelProgress = getLevelProgress();
  const totalLessons = Object.values(LESSON_CATEGORIES).flat().length;
  const conceptCount = completedLessons.length;

  // Portfolio value
  const portfolioValue = Object.entries(portfolio).reduce((acc, [sym, hold]) => {
    return acc + hold.quantity * (marketPrices[sym] || 0);
  }, 0);
  const totalWealth = cashBalance + portfolioValue;
  const hasPositions = Object.keys(portfolio).length > 0;

  // Next lessons to learn (uncompleted ones)
  const uncompletedLessons = Object.keys(LESSON_META).filter(
    (id) => !completedLessons.includes(id)
  );
  const nextLessons = uncompletedLessons.slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning 👋';
    if (hour < 18) return 'Good afternoon ☀️';
    return 'Good evening 🌙';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.name}>{username || 'Rafi'}</Text>
          <View style={styles.pillRow}>
            <View style={styles.streakPill}>
              <Flame size={14} color="#f97316" />
              <Text style={styles.streakText}>
                {streak > 0 ? `${streak}-day streak` : 'Start your streak!'}
              </Text>
            </View>
            <View style={styles.levelPill}>
              <Trophy size={12} color="#facc15" />
              <Text style={styles.levelPillText}>Lv.{currentLevel.level} {currentLevel.title}</Text>
            </View>
          </View>
        </View>

        {/* XP Progress Card */}
        <TouchableOpacity
          style={styles.progressCard}
          onPress={() => router.push('/(drawer)/(tabs)/journey')}
          activeOpacity={0.85}
        >
          <View style={styles.progressTopRow}>
            <View>
              <Text style={styles.progressLabel}>Your progress</Text>
              <Text style={styles.progressValue}>
                {conceptCount}/{totalLessons} concepts
              </Text>
              <Text style={styles.progressSub}>
                {xp} XP earned{nextLevel ? ` · ${nextLevel.xpRequired - xp} XP to ${nextLevel.title}` : ' · Max Level!'}
              </Text>
            </View>
            <View style={styles.xpBadge}>
              <Zap size={18} color="#facc15" />
              <Text style={styles.xpBadgeText}>{xp}</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.max(levelProgress * 100, 2)}%` }]} />
          </View>
        </TouchableOpacity>

        {/* Portfolio Snapshot */}
        <Text style={styles.sectionTitle}>PORTFOLIO SNAPSHOT</Text>

        <TouchableOpacity
          style={styles.portfolioCard}
          onPress={() => router.push('/(drawer)/(tabs)/lab')}
          activeOpacity={0.85}
        >
          <View style={styles.portfolioRow}>
            <View>
              <Text style={styles.portfolioLabel}>Total Wealth</Text>
              <Text style={styles.portfolioValue}>
                ${totalWealth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.portfolioRight}>
              <Text style={styles.portfolioLabel}>Unrealized P&L</Text>
              <View style={styles.pnlRow}>
                {unrealizedPnL >= 0 ? (
                  <TrendingUp size={14} color="#10b981" />
                ) : (
                  <TrendingDown size={14} color="#ef4444" />
                )}
                <Text
                  style={[
                    styles.pnlText,
                    { color: unrealizedPnL >= 0 ? '#10b981' : '#ef4444' },
                  ]}
                >
                  {unrealizedPnL >= 0 ? '+' : ''}
                  ${unrealizedPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.portfolioDetails}>
            <View style={styles.detailItem}>
              <Wallet size={14} color="#94a3b8" />
              <Text style={styles.detailLabel}>Cash</Text>
              <Text style={styles.detailValue}>
                ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <LineChart size={14} color="#94a3b8" />
              <Text style={styles.detailLabel}>Invested</Text>
              <Text style={styles.detailValue}>
                ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
          </View>

          {hasPositions && (
            <View style={styles.positionsPreview}>
              {Object.entries(portfolio).map(([sym, hold]) => {
                const price = marketPrices[sym] || 0;
                const value = hold.quantity * price;
                return (
                  <View key={sym} style={styles.positionChip}>
                    <Text style={styles.positionSymbol}>{sym}</Text>
                    <Text style={styles.positionQty}>{hold.quantity}</Text>
                    <Text style={styles.positionVal}>
                      ${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </TouchableOpacity>

        {/* Continue Learning */}
        {nextLessons.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>CONTINUE LEARNING</Text>
            <View style={styles.lessonList}>
              {nextLessons.map((id) => {
                const lesson = LESSON_META[id];
                return (
                  <TouchableOpacity
                    key={id}
                    style={styles.lessonCard}
                    onPress={() => router.push('/(drawer)/(tabs)/learn')}
                  >
                    <View style={[styles.lessonIconContainer, { backgroundColor: `${lesson.color}18` }]}>
                      <BookOpen size={20} color={lesson.color} />
                    </View>
                    <View style={styles.lessonContent}>
                      <Text style={styles.lessonTitle} numberOfLines={1}>{lesson.title}</Text>
                      <Text style={styles.lessonMeta}>{lesson.readTime} · {lesson.category}</Text>
                    </View>
                    <ChevronRight size={16} color="#475569" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* All done state */}
        {nextLessons.length === 0 && (
          <>
            <Text style={styles.sectionTitle}>LEARNING</Text>
            <View style={styles.allDoneCard}>
              <Trophy size={24} color="#facc15" />
              <Text style={styles.allDoneTitle}>All lessons completed!</Text>
              <Text style={styles.allDoneSub}>You&apos;ve mastered all {totalLessons} concepts. Keep practicing in the Lab!</Text>
            </View>
          </>
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>

        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push('/(drawer)/(tabs)/journey')}
          >
            <BrainCircuit size={22} color="#ec4899" />
            <Text style={styles.quickActionLabel}>Journey</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push('/(drawer)/(tabs)/lab')}
          >
            <LineChart size={22} color="#0ea5e9" />
            <Text style={styles.quickActionLabel}>Lab</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push('/(drawer)/(tabs)/learn')}
          >
            <BookOpen size={22} color="#10b981" />
            <Text style={styles.quickActionLabel}>Learn</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
      <AppTourModal visible={showTour} onClose={() => setShowTour(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1626' },
  container: { padding: 24, paddingTop: 24, paddingBottom: 48 },

  // Header
  header: { marginBottom: 24, alignItems: 'flex-start' },
  greeting: { fontSize: 16, color: '#94a3b8', marginBottom: 4 },
  name: { fontSize: 32, color: '#ffffff', marginBottom: 12 },
  pillRow: { flexDirection: 'row', gap: 8 },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
  },
  streakText: { color: '#f59e0b', fontWeight: '600', fontSize: 13 },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 4,
  },
  levelPillText: { color: '#facc15', fontWeight: '600', fontSize: 12 },

  // Progress Card
  progressCard: {
    backgroundColor: '#147684',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  progressLabel: { color: '#b5e3e6', fontSize: 13, fontWeight: '500', marginBottom: 4 },
  progressValue: { fontSize: 28, fontWeight: '700', color: '#ffffff', marginBottom: 4 },
  progressSub: { color: '#b5e3e6', fontSize: 12 },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(250, 204, 21, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  xpBadgeText: { color: '#facc15', fontSize: 16, fontWeight: '800' },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 3,
  },

  // Section
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1.2,
    marginBottom: 12,
  },

  // Portfolio Card
  portfolioCard: {
    backgroundColor: '#142337',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  portfolioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  portfolioLabel: { color: '#94a3b8', fontSize: 12, marginBottom: 4 },
  portfolioValue: { color: '#e2e8f0', fontSize: 22, fontWeight: '700' },
  portfolioRight: { alignItems: 'flex-end' },
  pnlRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pnlText: { fontSize: 15, fontWeight: '700' },
  portfolioDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: { color: '#64748b', fontSize: 12 },
  detailValue: { color: '#e2e8f0', fontSize: 12, fontWeight: '600', marginLeft: 'auto' },
  detailDivider: { width: 1, height: 24, backgroundColor: '#1e2f47', marginHorizontal: 8 },
  positionsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  positionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  positionSymbol: { color: '#e2e8f0', fontSize: 12, fontWeight: '700' },
  positionQty: { color: '#64748b', fontSize: 11 },
  positionVal: { color: '#94a3b8', fontSize: 11, fontWeight: '600' },

  // Lesson Cards
  lessonList: { gap: 10, marginBottom: 28 },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#142337',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  lessonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  lessonContent: { flex: 1 },
  lessonTitle: { fontSize: 15, fontWeight: '700', color: '#ffffff', marginBottom: 2 },
  lessonMeta: { fontSize: 12, color: '#64748b' },

  // All Done
  allDoneCard: {
    backgroundColor: '#142337',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  allDoneTitle: { color: '#facc15', fontSize: 16, fontWeight: '700' },
  allDoneSub: { color: '#94a3b8', fontSize: 13, textAlign: 'center', lineHeight: 20 },

  // Quick Actions
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#142337',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  quickActionLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
});
