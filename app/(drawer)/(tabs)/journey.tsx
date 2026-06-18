import { ArrowLeft, BrainCircuit, CheckCircle2, ChevronRight, CircleHelp, Flame, Sparkles, Star, Target, Trophy, XCircle, Zap } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Animated, BackHandler, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { CustomText as Text } from '../../../components/CustomText';
import { LESSON_CATEGORIES, LEVELS, useProgressStore } from '../../../store/useProgressStore';
import { useRouter } from 'expo-router';

// ── Quiz Bank ───────────────────────────────────────────────────
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  category: 'Trading' | 'Finance' | 'Market';
}

const QUIZ_BANK: QuizQuestion[] = [
  // Trading concepts
  { id: 'q1', question: 'What does RSI stand for?', options: ['Relative Strength Index', 'Real Stock Indicator', 'Rapid Swing Index', 'Return on Simple Investment'], correctIndex: 0, category: 'Trading' },
  { id: 'q2', question: 'What is a Fair Value Gap (FVG)?', options: ['A gap between bid and ask price', 'An imbalance area on a chart where price moved too fast', 'The difference between book value and market value', 'A type of stock dividend'], correctIndex: 1, category: 'Trading' },
  { id: 'q3', question: 'What is "swing trading"?', options: ['Trading only during market swings', 'Holding positions for days to weeks to capture price swings', 'A type of high-frequency trading', 'Trading based on pendulum indicators'], correctIndex: 1, category: 'Trading' },
  { id: 'q4', question: 'What does a "bounce" mean in trading?', options: ['A failed trade execution', 'Price reversing direction after hitting support or resistance', 'A stock being delisted', 'An automatic order cancellation'], correctIndex: 1, category: 'Trading' },
  { id: 'q5', question: 'What is a "stop-loss" order?', options: ['An order to buy at a lower price', 'An order to automatically sell when price drops to a set level', 'A tax on trading losses', 'A mandatory trading break'], correctIndex: 1, category: 'Trading' },
  { id: 'q6', question: 'In candlestick charts, what does a long lower wick indicate?', options: ['Strong selling pressure', 'Buyers rejected lower prices aggressively', 'The market is closed', 'High trading volume'], correctIndex: 1, category: 'Trading' },
  { id: 'q7', question: 'What is "support" in technical analysis?', options: ['Customer service for traders', 'A price level where buying pressure tends to prevent further decline', 'The minimum trading amount', 'A government bailout level'], correctIndex: 1, category: 'Trading' },

  // Financial literacy
  { id: 'q8', question: 'What is compound interest?', options: ['Interest paid only on the principal', 'Interest earned on both principal and accumulated interest', 'A fixed interest rate', 'Interest charged by multiple banks'], correctIndex: 1, category: 'Finance' },
  { id: 'q9', question: 'What does DTI ratio measure?', options: ['Debt-to-Income: monthly debt payments vs gross income', 'Daily Trading Index', 'Dividend Tax Inclusion', 'Depreciation-to-Investment ratio'], correctIndex: 0, category: 'Finance' },
  { id: 'q10', question: 'What is a P/E ratio?', options: ['Price-to-Earnings: stock price divided by earnings per share', 'Profit-to-Expense ratio', 'Portfolio Efficiency rating', 'Public Equity ratio'], correctIndex: 0, category: 'Finance' },
  { id: 'q11', question: 'What is an emergency fund?', options: ['A high-risk investment account', 'Cash reserves for unexpected expenses, typically 3-6 months of expenses', 'Insurance premiums', 'A government stimulus check'], correctIndex: 1, category: 'Finance' },
  { id: 'q12', question: 'What does "asset allocation" mean?', options: ['Distributing investments across different asset classes', 'Selling all your assets', 'Allocating a budget for purchases', 'Government distribution of resources'], correctIndex: 0, category: 'Finance' },
  { id: 'q13', question: 'What credit score range is considered "excellent"?', options: ['300-500', '500-650', '650-740', '740-850'], correctIndex: 3, category: 'Finance' },

  // Market terminology
  { id: 'q14', question: 'What is a "bull market"?', options: ['A market with falling prices', 'A market with rising prices and investor optimism', 'A market for agricultural commodities', 'A market that only trades on Mondays'], correctIndex: 1, category: 'Market' },
  { id: 'q15', question: 'What does FOMO mean in trading?', options: ['Fixed Order Market Operation', 'Fear Of Missing Out', 'Federal Open Market Order', 'First Offer, Multiple Options'], correctIndex: 1, category: 'Market' },
  { id: 'q16', question: 'What is "market capitalization"?', options: ['The capital needed to enter a market', 'Total value of a company\'s outstanding shares', 'A trading fee', 'The maximum price of a stock'], correctIndex: 1, category: 'Market' },
  { id: 'q17', question: 'What does "bearish" mean?', options: ['Expecting prices to rise', 'Expecting prices to fall', 'Neutral market outlook', 'A type of trading strategy'], correctIndex: 1, category: 'Market' },
  { id: 'q18', question: 'What is "liquidity" in financial markets?', options: ['How easily an asset can be bought or sold without affecting its price', 'The amount of cash in a bank', 'A type of investment fund', 'The interest rate on savings'], correctIndex: 0, category: 'Market' },
  { id: 'q19', question: 'What is a "market order"?', options: ['An order placed at a specific price', 'An order that executes immediately at the current market price', 'A government regulation', 'A scheduled recurring purchase'], correctIndex: 1, category: 'Market' },
  { id: 'q20', question: 'What is "dollar-cost averaging"?', options: ['Converting currency at the best rate', 'Investing a fixed amount at regular intervals regardless of price', 'Averaging the cost of multiple purchases', 'A tax calculation method'], correctIndex: 1, category: 'Market' },
];

// Progress bar colors per category
const CATEGORY_COLORS: Record<string, string> = {
  'Investing': '#0ea5e9',
  'Trading': '#f59e0b',
  'Budgeting': '#10b981',
};

// Motivational quotes
const QUOTES = [
  "Every expert was once a beginner.",
  "Compound knowledge, like compound interest, grows exponentially.",
  "The best investment you can make is in yourself.",
  "Financial freedom is a journey, not a destination.",
  "Small daily improvements lead to stunning results.",
];

export default function JourneyScreen() {
  const router = useRouter();
  const {
    xp,
    streak,
    completedLessons,
    getCurrentLevel,
    getNextLevel,
    getLevelProgress,
    getCategoryProgress,
    updateStreak,
    addXP,
  } = useProgressStore();

  // Quiz view state
  const [showQuiz, setShowQuiz] = useState(false);

  // Quiz answer state
  const [quizAnswered, setQuizAnswered] = useState<Record<string, number | null>>({});
  const [quizXPAwarded, setQuizXPAwarded] = useState<Record<string, boolean>>({});

  // Pick 3 daily questions (stable per day)
  const dailyQuestions = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const shuffled = [...QUIZ_BANK].sort((a, b) => {
      const hashA = (dayOfYear * 31 + a.id.charCodeAt(1)) % 100;
      const hashB = (dayOfYear * 31 + b.id.charCodeAt(1)) % 100;
      return hashA - hashB;
    });
    return shuffled.slice(0, 3);
  }, []);

  const answeredCount = Object.keys(quizAnswered).length;
  const correctCount = Object.entries(quizAnswered).filter(
    ([qId, idx]) => dailyQuestions.find((q) => q.id === qId)?.correctIndex === idx
  ).length;

  const handleAnswer = (questionId: string, selectedIndex: number) => {
    if (quizAnswered[questionId] !== undefined) return; // Already answered

    const question = dailyQuestions.find((q) => q.id === questionId);
    if (!question) return;

    setQuizAnswered((prev) => ({ ...prev, [questionId]: selectedIndex }));

    if (selectedIndex === question.correctIndex && !quizXPAwarded[questionId]) {
      addXP(10);
      setQuizXPAwarded((prev) => ({ ...prev, [questionId]: true }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (selectedIndex !== question.correctIndex) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  // Update streak on screen visit
  useEffect(() => {
    updateStreak();
  }, []);

  // Handle Android back button when quiz is open
  useEffect(() => {
    const onBackPress = () => {
      if (showQuiz) {
        setShowQuiz(false);
        return true;
      }
      return false;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [showQuiz]);

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const levelProgress = getLevelProgress();
  const conceptCount = completedLessons.length;
  const totalLessons = Object.values(LESSON_CATEGORIES).flat().length;

  // Pick a stable daily quote
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const dailyQuote = QUOTES[dayOfYear % QUOTES.length];

  // ── Quiz Full-Screen View ──────────────────────────────────
  if (showQuiz) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.quizScreenHeader}>
          <TouchableOpacity
            style={styles.quizBackButton}
            onPress={() => setShowQuiz(false)}
          >
            <ArrowLeft size={24} color="#e2e8f0" />
            <Text style={styles.quizBackText}>Back to Journey</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.quizScreenContent}>
          <View style={styles.quizScreenHero}>
            <View style={styles.quizHeroIcon}>
              <CircleHelp size={28} color="#a78bfa" />
            </View>
            <Text style={styles.quizScreenTitle}>Daily Quiz</Text>
            <Text style={styles.quizScreenSub}>Answer correctly for +10 XP each</Text>
            <View style={styles.quizScorePillLarge}>
              <Text style={styles.quizScoreLargeText}>{correctCount}/{dailyQuestions.length} correct</Text>
            </View>
          </View>

          {answeredCount === dailyQuestions.length ? (
            <View style={styles.quizDoneCard}>
              <Trophy size={36} color="#facc15" />
              <Text style={styles.quizDoneTitle}>
                {correctCount === dailyQuestions.length ? '🎉 Perfect Score!' : `${correctCount}/${dailyQuestions.length} Correct!`}
              </Text>
              <Text style={styles.quizDoneSub}>
                {correctCount > 0 ? `+${correctCount * 10} XP earned from today\'s quiz` : 'Review the lessons and try again tomorrow!'}
              </Text>
              <TouchableOpacity
                style={styles.quizDoneButton}
                onPress={() => setShowQuiz(false)}
              >
                <Text style={styles.quizDoneButtonText}>Back to Journey</Text>
              </TouchableOpacity>
            </View>
          ) : (
            dailyQuestions.map((q, qIndex) => {
              const answered = quizAnswered[q.id];
              const isAnswered = answered !== undefined;
              const isCorrectlyAnswered = answered === q.correctIndex;

              if (isAnswered && isCorrectlyAnswered) {
                return (
                  <View key={q.id} style={styles.quizCompactCorrect}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <Text style={styles.quizCompactText} numberOfLines={1}>{q.question}</Text>
                    <Text style={styles.quizCompactXP}>+10 XP</Text>
                  </View>
                );
              }

              const firstUnansweredIdx = dailyQuestions.findIndex((qq) => quizAnswered[qq.id] === undefined);
              if (!isAnswered && qIndex !== firstUnansweredIdx) {
                return null;
              }

              return (
                <View key={q.id} style={styles.quizQuestionCard}>
                  <View style={styles.quizMeta}>
                    <View style={[styles.quizCategoryPill, {
                      backgroundColor: q.category === 'Trading' ? 'rgba(245,158,11,0.12)' : q.category === 'Finance' ? 'rgba(14,165,233,0.12)' : 'rgba(16,185,129,0.12)',
                    }]}>
                      <Text style={[styles.quizCategoryText, {
                        color: q.category === 'Trading' ? '#f59e0b' : q.category === 'Finance' ? '#0ea5e9' : '#10b981',
                      }]}>{q.category}</Text>
                    </View>
                    <Text style={styles.quizNumber}>Q{qIndex + 1}/{dailyQuestions.length}</Text>
                  </View>

                  <Text style={styles.quizQuestion}>{q.question}</Text>

                  <View style={styles.quizOptions}>
                    {q.options.map((option, optIdx) => {
                      let optionStyle = styles.quizOption;
                      let textColor = '#e2e8f0';
                      let icon = null;

                      if (isAnswered) {
                        if (optIdx === q.correctIndex) {
                          optionStyle = { ...styles.quizOption, ...styles.quizOptionCorrect };
                          textColor = '#10b981';
                          icon = <CheckCircle2 size={16} color="#10b981" />;
                        } else if (optIdx === answered) {
                          optionStyle = { ...styles.quizOption, ...styles.quizOptionWrong };
                          textColor = '#ef4444';
                          icon = <XCircle size={16} color="#ef4444" />;
                        }
                      }

                      return (
                        <TouchableOpacity
                          key={optIdx}
                          style={optionStyle}
                          onPress={() => handleAnswer(q.id, optIdx)}
                          disabled={isAnswered}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.quizOptionLetter, { color: textColor }]}>
                            {String.fromCharCode(65 + optIdx)}
                          </Text>
                          <Text style={[styles.quizOptionText, { color: textColor }]} numberOfLines={2}>
                            {option}
                          </Text>
                          {icon && <View style={styles.quizOptionIcon}>{icon}</View>}
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {isAnswered && !isCorrectlyAnswered && (
                    <View style={styles.quizWrongFeedback}>
                      <Text style={styles.quizWrongText}>The correct answer is highlighted in green.</Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Main Journey View ─────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Journey</Text>
          <Text style={styles.subtitle}>Your financial literacy progress</Text>
        </View>

        {/* Level Card */}
        <View style={styles.levelCard}>
          <View style={styles.levelTopRow}>
            <View style={styles.levelBadge}>
              <Trophy size={20} color="#facc15" />
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelTitle}>Level {currentLevel.level}</Text>
              <Text style={styles.levelName}>{currentLevel.title}</Text>
            </View>
            <View style={styles.xpPill}>
              <Zap size={12} color="#facc15" />
              <Text style={styles.xpPillText}>{xp} XP</Text>
            </View>
          </View>

          {nextLevel ? (
            <View style={styles.levelProgressSection}>
              <View style={styles.levelProgressTrack}>
                <Animated.View
                  style={[
                    styles.levelProgressFill,
                    { width: `${Math.max(levelProgress * 100, 2)}%` },
                  ]}
                />
              </View>
              <View style={styles.levelProgressLabels}>
                <Text style={styles.levelProgressCurrent}>{currentLevel.title}</Text>
                <Text style={styles.levelProgressNext}>
                  {nextLevel.xpRequired - xp} XP to {nextLevel.title}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.maxLevelBox}>
              <Sparkles size={14} color="#facc15" />
              <Text style={styles.maxLevelText}>Max Level Reached!</Text>
            </View>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatBox
            icon={<Flame size={20} color="#f97316" />}
            value={streak.toString()}
            label="Day Streak"
          />
          <StatBox
            icon={<BrainCircuit size={20} color="#ec4899" />}
            value={`${conceptCount}/${totalLessons}`}
            label="Concepts"
          />
          <StatBox
            icon={<Star size={20} color="#eab308" />}
            value={xp.toString()}
            label="XP Earned"
          />
        </View>

        {/* Motivational Quote */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteIcon}>💡</Text>
          <Text style={styles.quoteText}>"{dailyQuote}"</Text>
        </View>

        {/* Topic Progress */}
        <Text style={styles.sectionTitle}>TOPIC MASTERY</Text>

        <View style={styles.progressContainer}>
          {Object.entries(LESSON_CATEGORIES).map(([category, lessonIds]) => {
            const percent = getCategoryProgress(category);
            const completed = lessonIds.filter((id) => completedLessons.includes(id)).length;
            const color = CATEGORY_COLORS[category] || '#64748b';
            return (
              <TopicProgress
                key={category}
                label={category}
                percent={percent}
                color={color}
                completed={completed}
                total={lessonIds.length}
              />
            );
          })}
        </View>

        {/* Milestones */}
        <Text style={styles.sectionTitle}>MILESTONES</Text>

        <View style={styles.milestonesContainer}>
          {LEVELS.slice(0, 5).map((lvl) => {
            const isUnlocked = xp >= lvl.xpRequired;
            return (
              <View key={lvl.level} style={[styles.milestoneRow, !isUnlocked && styles.milestoneLocked]}>
                <View style={[styles.milestoneBadge, isUnlocked && styles.milestoneBadgeUnlocked]}>
                  {isUnlocked ? (
                    <Trophy size={16} color="#facc15" />
                  ) : (
                    <Target size={16} color="#475569" />
                  )}
                </View>
                <View style={styles.milestoneInfo}>
                  <Text style={[styles.milestoneName, !isUnlocked && styles.milestoneNameLocked]}>
                    {lvl.title}
                  </Text>
                  <Text style={styles.milestoneXP}>{lvl.xpRequired} XP required</Text>
                </View>
                {isUnlocked && (
                  <Text style={styles.milestoneCheck}>✓</Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => setShowQuiz(true)}
        >
          <View style={styles.actionLeft}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(167,139,250,0.15)' }]}>
              <CircleHelp size={20} color="#a78bfa" />
            </View>
            <View>
              <Text style={styles.actionTitle}>Daily Quiz</Text>
              <Text style={styles.actionSub}>
                {answeredCount === dailyQuestions.length
                  ? `Completed · ${correctCount}/${dailyQuestions.length} correct`
                  : `${dailyQuestions.length - answeredCount} questions remaining · +10 XP each`}
              </Text>
            </View>
          </View>
          <ChevronRight size={18} color="#475569" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/(drawer)/(tabs)/learn')}
        >
          <View style={styles.actionLeft}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(14,165,233,0.15)' }]}>
              <BrainCircuit size={20} color="#0ea5e9" />
            </View>
            <View>
              <Text style={styles.actionTitle}>Continue Learning</Text>
              <Text style={styles.actionSub}>
                {totalLessons - conceptCount} lessons remaining
              </Text>
            </View>
          </View>
          <ChevronRight size={18} color="#475569" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/(drawer)/(tabs)/lab')}
        >
          <View style={styles.actionLeft}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(16,185,129,0.15)' }]}>
              <Zap size={20} color="#10b981" />
            </View>
            <View>
              <Text style={styles.actionTitle}>Practice Trading</Text>
              <Text style={styles.actionSub}>Earn 10 XP per trade</Text>
            </View>
          </View>
          <ChevronRight size={18} color="#475569" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <View style={styles.statBox}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function TopicProgress({
  label,
  percent,
  color,
  completed,
  total,
}: {
  label: string;
  percent: number;
  color: string;
  completed: number;
  total: number;
}) {
  return (
    <View style={styles.topicRow}>
      <View style={styles.topicHeader}>
        <Text style={styles.topicLabel}>{label}</Text>
        <Text style={styles.topicPercent}>
          {completed}/{total} · {percent}%
        </Text>
      </View>
      <View style={styles.topicTrack}>
        <View style={[styles.topicFill, { width: `${Math.max(percent, 0)}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1626' },
  container: { padding: 24, paddingTop: 24, paddingBottom: 48 },
  header: { marginBottom: 24 },
  title: { fontSize: 32, color: '#ffffff', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#64748b' },

  // Level Card
  levelCard: {
    backgroundColor: '#142337',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  levelTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  levelBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(250, 204, 21, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelInfo: { flex: 1 },
  levelTitle: { color: '#e2e8f0', fontSize: 18, fontWeight: '700' },
  levelName: { color: '#94a3b8', fontSize: 13 },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(250, 204, 21, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpPillText: { color: '#facc15', fontSize: 13, fontWeight: '700' },
  levelProgressSection: { gap: 6 },
  levelProgressTrack: {
    height: 8,
    backgroundColor: '#1e2f47',
    borderRadius: 4,
    overflow: 'hidden',
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: '#facc15',
    borderRadius: 4,
  },
  levelProgressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelProgressCurrent: { color: '#64748b', fontSize: 11 },
  levelProgressNext: { color: '#facc15', fontSize: 11, fontWeight: '600' },
  maxLevelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: 'rgba(250, 204, 21, 0.08)',
    borderRadius: 8,
  },
  maxLevelText: { color: '#facc15', fontSize: 13, fontWeight: '700' },

  // Stats Row
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statBox: {
    flex: 1,
    backgroundColor: '#142337',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: { color: '#ffffff', fontSize: 20, fontWeight: '700' },
  statLabel: { color: '#64748b', fontSize: 12 },

  // Quote
  quoteCard: {
    backgroundColor: '#142337',
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  quoteIcon: { fontSize: 20 },
  quoteText: { color: '#94a3b8', fontSize: 14, fontStyle: 'italic', flex: 1, lineHeight: 22 },

  // Section
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1.2,
    marginBottom: 16,
  },

  // Topic Progress
  progressContainer: { gap: 20, marginBottom: 28 },
  topicRow: {},
  topicHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  topicLabel: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  topicPercent: { color: '#64748b', fontSize: 13 },
  topicTrack: { height: 6, backgroundColor: '#1e2f47', borderRadius: 3 },
  topicFill: { height: '100%', borderRadius: 3 },

  // Milestones
  milestonesContainer: {
    backgroundColor: '#142337',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  milestoneLocked: { opacity: 0.45 },
  milestoneBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#1e2f47',
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneBadgeUnlocked: {
    backgroundColor: 'rgba(250, 204, 21, 0.12)',
  },
  milestoneInfo: { flex: 1 },
  milestoneName: { color: '#e2e8f0', fontSize: 14, fontWeight: '600' },
  milestoneNameLocked: { color: '#64748b' },
  milestoneXP: { color: '#475569', fontSize: 12 },
  milestoneCheck: { color: '#10b981', fontSize: 16, fontWeight: '700' },

  // Quick Actions
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#142337',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  actionLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: { color: '#e2e8f0', fontSize: 15, fontWeight: '600' },
  actionSub: { color: '#64748b', fontSize: 12, marginTop: 2 },

  // Quiz Full-Screen
  quizScreenHeader: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2f47',
    backgroundColor: '#0b1626',
  },
  quizBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quizBackText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },
  quizScreenContent: {
    padding: 24,
    paddingBottom: 80,
  },
  quizScreenHero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  quizHeroIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(167, 139, 250, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  quizScreenTitle: { color: '#e2e8f0', fontSize: 26, fontWeight: '700', marginBottom: 4 },
  quizScreenSub: { color: '#94a3b8', fontSize: 14, marginBottom: 12 },
  quizScorePillLarge: {
    backgroundColor: 'rgba(167, 139, 250, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  quizScoreLargeText: { color: '#a78bfa', fontSize: 14, fontWeight: '700' },
  quizQuestionCard: {
    marginBottom: 20,
  },
  quizMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  quizCategoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  quizCategoryText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  quizNumber: { color: '#475569', fontSize: 12, fontWeight: '600' },
  quizQuestion: { color: '#e2e8f0', fontSize: 16, fontWeight: '600', lineHeight: 24, marginBottom: 16 },
  quizOptions: { gap: 10 },
  quizOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#142337',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e2f47',
    gap: 12,
  },
  quizOptionCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: '#10b981',
  },
  quizOptionWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: '#ef4444',
  },
  quizOptionLetter: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: '#1e2f47',
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 13,
    fontWeight: '700',
    overflow: 'hidden',
  },
  quizOptionText: { flex: 1, fontSize: 14, lineHeight: 20 },
  quizOptionIcon: { marginLeft: 'auto' },
  quizWrongFeedback: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(239,68,68,0.06)',
    borderRadius: 10,
  },
  quizWrongText: { color: '#94a3b8', fontSize: 12, fontStyle: 'italic' },
  quizCompactCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
    borderRadius: 12,
    marginBottom: 10,
  },
  quizCompactText: { flex: 1, color: '#94a3b8', fontSize: 13 },
  quizCompactXP: { color: '#10b981', fontSize: 12, fontWeight: '700' },
  quizDoneCard: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 32,
    backgroundColor: '#142337',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  quizDoneTitle: { color: '#facc15', fontSize: 20, fontWeight: '700' },
  quizDoneSub: { color: '#94a3b8', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  quizDoneButton: {
    marginTop: 8,
    backgroundColor: '#a78bfa',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  quizDoneButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});

