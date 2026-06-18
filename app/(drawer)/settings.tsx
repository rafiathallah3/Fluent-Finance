import { RotateCcw, ChevronDown, ChevronUp, BookOpen, Wallet, LineChart, HelpCircle, LogOut, Check } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomText as Text } from '../../components/CustomText';
import { useTradingStore } from '../../store/useTradingStore';
import { useProgressStore } from '../../store/useProgressStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore, THEMES } from '../../store/useThemeStore';

export default function SettingsScreen() {
  const { cashBalance, portfolio, transactionHistory, resetAccount } = useTradingStore();
  const { currentTheme, setTheme } = useThemeStore();
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const positionCount = Object.keys(portfolio).length;
  const txCount = transactionHistory.length;

  const handleResetDefault = () => {
    Alert.alert(
      'Reset Money Lab',
      'This will remove all positions, transaction history, and reset your cash balance to $10,000.\n\nAre you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetAccount();
            Alert.alert('Done', 'Money Lab has been reset to $10,000.');
          },
        },
      ],
    );
  };

  const handleResetCustom = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive number.');
      return;
    }
    Alert.alert(
      'Reset Money Lab',
      `This will remove all positions, transaction history, and set your cash balance to $${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}.\n\nAre you sure?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetAccount(amount);
            setCustomAmount('');
            setShowCustomInput(false);
            Alert.alert('Done', `Money Lab has been reset to $${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`);
          },
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.safe}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text weight="bold" style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure your app preferences.</Text>

        {/* Color Preference Section */}
        <View style={[styles.sectionCard, { marginBottom: 24 }]}>
          <Text style={styles.sectionTitle}>Color Preference</Text>
          <Text style={styles.sectionDesc}>
            Choose your primary accent color for buttons, tabs, and indicators.
          </Text>
          <View style={styles.themesContainer}>
            {Object.entries(THEMES).map(([key, theme]) => {
              const isActive = currentTheme.name === theme.name;
              return (
                <TouchableOpacity
                  key={key}
                  style={styles.themeOption}
                  onPress={() => setTheme(key as keyof typeof THEMES)}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.circleWrapper,
                    isActive && { borderColor: theme.primary }
                  ]}>
                    <View style={[styles.colorCircle, { backgroundColor: theme.primary }]}>
                      {isActive && <Check size={18} color="#ffffff" strokeWidth={3.5} />}
                    </View>
                  </View>
                  <Text
                    weight={isActive ? "semiBold" : "regular"}
                    style={[
                      styles.themeLabel,
                      isActive ? { color: '#ffffff' } : { color: '#94a3b8' }
                    ]}
                  >
                    {theme.label.split(' ')[1]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Money Lab Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Money Lab</Text>
          <Text style={styles.sectionDesc}>
            Reset your paper trading environment to start fresh.
          </Text>

          {/* Current State Summary */}
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Cash Balance</Text>
              <Text style={styles.summaryValue}>
                ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Open Positions</Text>
              <Text style={styles.summaryValue}>{positionCount}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Transactions</Text>
              <Text style={styles.summaryValue}>{txCount}</Text>
            </View>
          </View>

          {/* Reset Default Button */}
          <TouchableOpacity onPress={handleResetDefault} activeOpacity={0.8}>
            <LinearGradient
              colors={currentTheme.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.resetBtnGradient}
            >
              <RotateCcw size={16} color="#ffffff" />
              <Text style={styles.resetBtnText}>Reset to Default ($10,000)</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Custom Amount Toggle */}
          <TouchableOpacity
            style={styles.customToggle}
            onPress={() => setShowCustomInput(!showCustomInput)}
          >
            <Text style={[styles.customToggleText, { color: currentTheme.primary }]}>
              {showCustomInput ? 'Cancel Custom Amount' : 'Or set a custom starting balance...'}
            </Text>
          </TouchableOpacity>

          {showCustomInput && (
            <View style={styles.customInputSection}>
              <Text style={styles.customLabel}>Enter Starting Balance ($)</Text>
              <TextInput
                style={styles.customInput}
                keyboardType="decimal-pad"
                placeholder="e.g. 5000"
                placeholderTextColor="#475569"
                value={customAmount}
                onChangeText={setCustomAmount}
              />
              <TouchableOpacity onPress={handleResetCustom} activeOpacity={0.8}>
                <LinearGradient
                  colors={currentTheme.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.customResetBtnGradient}
                >
                  <RotateCcw size={16} color="#ffffff" />
                  <Text style={styles.resetBtnText}>Reset with Custom Amount</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Warning */}
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️  Resetting will permanently remove all positions, transaction history, and snapshots. This cannot be undone.
            </Text>
          </View>
        </View>

        {/* Journey Progress Section */}
        <JourneyResetSection />

        {/* Help Onboarding Section */}
        <HelpOnboardingSection />

        {/* Account Security Section */}
        <AccountSecuritySection />

        {/* User Manual Section */}
        <UserManualSection />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function JourneyResetSection() {
  const { xp, streak, completedLessons, resetProgress } = useProgressStore();
  const { currentTheme } = useThemeStore();

  const handleReset = () => {
    Alert.alert(
      'Reset Journey Progress',
      'This will reset your XP, streak, and all lesson completions.\n\nAre you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetProgress();
            Alert.alert('Done', 'Journey progress has been reset.');
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.sectionCard, { marginTop: 24 }]}>
      <Text style={styles.sectionTitle}>Journey Progress</Text>
      <Text style={styles.sectionDesc}>
        Reset your learning progress and start fresh.
      </Text>

      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>XP Earned</Text>
          <Text style={styles.summaryValue}>{xp}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Day Streak</Text>
          <Text style={styles.summaryValue}>{streak}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Lessons Completed</Text>
          <Text style={styles.summaryValue}>{completedLessons.length}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={handleReset} activeOpacity={0.8}>
        <LinearGradient
          colors={currentTheme.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.resetBtnGradient}
        >
          <RotateCcw size={16} color="#ffffff" />
          <Text style={styles.resetBtnText}>Reset Journey Progress</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

function HelpOnboardingSection() {
  const { currentTheme } = useThemeStore();

  const handleLaunchTour = async () => {
    try {
      await AsyncStorage.removeItem('hasSeenTour');
      // Redirect to Home screen where the tour auto-triggers
      router.replace('/');
    } catch {
      Alert.alert('Error', 'Failed to launch guided tour.');
    }
  };

  return (
    <View style={[styles.sectionCard, { marginTop: 24 }]}>
      <Text style={styles.sectionTitle}>App Onboarding</Text>
      <Text style={styles.sectionDesc}>
        Need a refresher? Replay the step-by-step interactive app walkthrough guide.
      </Text>

      <TouchableOpacity onPress={handleLaunchTour} activeOpacity={0.8}>
        <LinearGradient
          colors={currentTheme.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.tourBtnGradient}
        >
          <HelpCircle size={16} color="#ffffff" />
          <Text style={styles.tourBtnText}>Launch Guided Tour</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

function AccountSecuritySection() {
  const { logout } = useAuthStore();
  const { currentTheme } = useThemeStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.sectionCard, { marginTop: 24 }]}>
      <Text style={styles.sectionTitle}>Account Security</Text>
      <Text style={styles.sectionDesc}>
        Log out from your current simulated session.
      </Text>
      <TouchableOpacity onPress={handleLogout} activeOpacity={0.8}>
        <LinearGradient
          colors={currentTheme.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.logoutBtnGradient}
        >
          <LogOut size={16} color="#ffffff" />
          <Text style={styles.resetBtnText}>Logout</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

function UserManualSection() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const { currentTheme } = useThemeStore();

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const sections = [
    {
      id: 'welcome',
      title: 'Getting Started',
      description: 'Overview of Fluent Finance & key features',
      icon: HelpCircle,
      color: currentTheme.primary,
      content: (
        <View style={styles.manualContent}>
          <Text style={styles.manualBody}>
            Fluent Finance is a risk-free simulator designed to teach you the fundamentals of personal budgeting and asset trading. The app is divided into five core tabs:
          </Text>
          <View style={styles.bulletRow}>
            <Text style={[styles.bulletPoint, { color: currentTheme.primary }]}>•</Text>
            <Text style={styles.bulletText}>
              <Text weight="semiBold" style={{ color: currentTheme.primary }}>Home:</Text> Check your stats, current learning streak, XP progression level, and portfolio summary.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={[styles.bulletPoint, { color: currentTheme.primary }]}>•</Text>
            <Text style={styles.bulletText}>
              <Text weight="semiBold" style={{ color: currentTheme.primary }}>Learn:</Text> Browse and read standard lessons covering compound interest, technical indicators, and debt metrics.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={[styles.bulletPoint, { color: currentTheme.primary }]}>•</Text>
            <Text style={styles.bulletText}>
              <Text weight="semiBold" style={{ color: currentTheme.primary }}>Lab:</Text> Open simulators to experiment with budget planners or perform paper trading.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={[styles.bulletPoint, { color: currentTheme.primary }]}>•</Text>
            <Text style={styles.bulletText}>
              <Text weight="semiBold" style={{ color: currentTheme.primary }}>Market:</Text> View live token rates, track index sentiment, and explore key financial term definitions.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={[styles.bulletPoint, { color: currentTheme.primary }]}>•</Text>
            <Text style={styles.bulletText}>
              <Text weight="semiBold" style={{ color: currentTheme.primary }}>Journey:</Text> Track your XP level roadmap and see how close you are to financial mastery.
            </Text>
          </View>
        </View>
      ),
    },
    {
      id: 'lessons',
      title: 'Lessons & Journey Progress',
      description: 'How to learn, earn XP, and level up',
      icon: BookOpen,
      color: '#a855f7',
      content: (
        <View style={styles.manualContent}>
          <Text style={styles.manualBody}>
            Fluent Finance rewards consistency. The more you learn, the higher rank you earn:
          </Text>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>
              <Text weight="semiBold" style={{ color: '#a855f7' }}>Completing Lessons:</Text> Navigate to the <Text weight="semiBold">Learn</Text> tab, select a module, and read through to the end. Every completion marks the concept off your list.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>
              <Text weight="semiBold" style={{ color: '#a855f7' }}>Earning XP:</Text> Finishing lessons awards you XP points. You also earn XP by executing simulator trades in the Invest Lab.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>
              <Text weight="semiBold" style={{ color: '#a855f7' }}>Leveling Up:</Text> Accumulate XP to advance levels (displayed on Home). Watch your badge upgrade from Level 1 up to senior ranks.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>
              <Text weight="semiBold" style={{ color: '#a855f7' }}>Day Streaks:</Text> Read at least one lesson daily. The Home screen streak flame keeps track of your consecutive active days.
            </Text>
          </View>
        </View>
      ),
    },
    {
      id: 'budget',
      title: 'Budget Simulator',
      description: 'Calculate expenses and projected savings',
      icon: Wallet,
      color: '#10b981',
      content: (
        <View style={styles.manualContent}>
          <Text style={styles.manualBody}>
            The Budget Lab helps you visualize your cash flow and build positive savings habits:
          </Text>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>
              <Text weight="semiBold" style={{ color: '#10b981' }}>Income Slider:</Text> Adjust your simulated monthly income (ranging from Rp 1,000,000 to Rp 20,000,000) to match your real-world scenarios.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>
              <Text weight="semiBold" style={{ color: '#10b981' }}>Savings target:</Text> Set your target savings rate percentage. The slider calculates expenses as: <Text style={{ fontStyle: 'italic', color: '#cbd5e1' }}>Income - Projected Savings</Text>.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>
              <Text weight="semiBold" style={{ color: '#10b981' }}>Budget Health:</Text> Financial experts recommend saving at least 15% of your income. The simulator alerts you with a warning if your rate is too risky, accompanied by interactive visual metaphors.
            </Text>
          </View>
        </View>
      ),
    },
    {
      id: 'investing',
      title: 'Paper Trading (Invest)',
      description: 'Trade assets, track P&L, and gain rewards',
      icon: LineChart,
      color: '#f59e0b',
      content: (
        <View style={styles.manualContent}>
          <Text style={styles.manualBody}>
            Test your investment theories under real-world market movements using paper money:
          </Text>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>
              <Text weight="semiBold" style={{ color: '#f59e0b' }}>Mock Capital:</Text> You start with $10,000 in simulated cash. You can customize this balance at any time on this Settings screen.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>
              <Text weight="semiBold" style={{ color: '#f59e0b' }}>Order Execution:</Text> Monitor the live Bitcoin chart in the Invest tab. Input your desired purchase/sale size and click <Text weight="semiBold">Buy BTC</Text> or <Text weight="semiBold">Sell BTC</Text>. Each successful transaction yields <Text weight="semiBold" style={{ color: '#eab308' }}>+10 XP</Text>.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>
              <Text weight="semiBold" style={{ color: '#f59e0b' }}>Positions & History:</Text> Check the &quot;View Open Positions&quot; section to see holdings, purchase cost basis, and live Unrealized P&L. Expand &quot;Transaction History&quot; to audit past trades.
            </Text>
          </View>
        </View>
      ),
    },
  ];

  return (
    <View style={[styles.sectionCard, { marginTop: 24, marginBottom: 40 }]}>
      <Text style={styles.sectionTitle}>User Manual & Guide</Text>
      <Text style={styles.sectionDesc}>
        Detailed guide on how to get the most out of your Fluent Finance experience.
      </Text>

      <View style={styles.manualList}>
        {sections.map(sec => {
          const isOpen = !!expandedSections[sec.id];
          const Icon = sec.icon;

          return (
            <View key={sec.id} style={[styles.manualItem, isOpen && { borderColor: currentTheme.primary }]}>
              <TouchableOpacity
                style={styles.manualHeader}
                activeOpacity={0.7}
                onPress={() => toggleSection(sec.id)}
              >
                <View style={[styles.manualIconBox, { backgroundColor: sec.color + '15' }]}>
                  <Icon size={18} color={sec.color} />
                </View>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text weight="semiBold" style={styles.manualItemTitle}>{sec.title}</Text>
                  <Text style={styles.manualItemDesc}>{sec.description}</Text>
                </View>
                {isOpen ? (
                  <ChevronUp size={18} color={currentTheme.primary} />
                ) : (
                  <ChevronDown size={18} color="#94a3b8" />
                )}
              </TouchableOpacity>
              
              {isOpen && (
                <View style={styles.manualExpanded}>
                  <View style={styles.manualDivider} />
                  {sec.content}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1626' },
  container: { padding: 24, paddingTop: 24 },
  title: {
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 32,
  },
  sectionCard: {
    backgroundColor: '#142337',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabel: { color: '#94a3b8', fontSize: 14 },
  summaryValue: { color: '#e2e8f0', fontSize: 14, fontWeight: '600' },
  divider: {
    height: 1,
    backgroundColor: '#1e2f47',
    marginVertical: 4,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  resetBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  customToggle: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 4,
  },
  customToggleText: {
    color: '#0ea5e9',
    fontSize: 13,
    fontWeight: '600',
  },
  customInputSection: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  customLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  customInput: {
    backgroundColor: '#1e2f47',
    borderWidth: 1,
    borderColor: '#334155',
    color: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  customResetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#b91c1c',
    paddingVertical: 14,
    borderRadius: 12,
  },
  warningBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  warningText: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
  },
  manualList: {
    gap: 12,
  },
  manualItem: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e2f47',
    overflow: 'hidden',
  },
  manualItemOpen: {
    borderColor: '#334155',
  },
  manualHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  manualIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  manualItemTitle: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 2,
  },
  manualItemDesc: {
    color: '#64748b',
    fontSize: 11,
  },
  manualExpanded: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  manualDivider: {
    height: 1,
    backgroundColor: '#1e2f47',
    marginBottom: 12,
  },
  manualContent: {
    gap: 8,
  },
  manualBody: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingRight: 8,
  },
  bulletPoint: {
    color: '#0ea5e9',
    fontSize: 14,
    lineHeight: 18,
  },
  bulletText: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  tourBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0ea5e9',
    paddingVertical: 14,
    borderRadius: 12,
  },
  tourBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    borderRadius: 12,
  },
  themesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  themeOption: {
    alignItems: 'center',
    gap: 6,
  },
  circleWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeLabel: {
    fontSize: 12,
  },
  resetBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
  },
  customResetBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
  },
  tourBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
  },
  logoutBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
  },
});
