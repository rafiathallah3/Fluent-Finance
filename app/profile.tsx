import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { BrainCircuit, ChevronLeft, Flame, Pencil, Star, LogOut } from 'lucide-react-native';
import { CustomText as Text } from '../components/CustomText';
import { useAuthStore } from '../store/useAuthStore';

export default function ProfileScreen() {
  const { username, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text weight="semiBold" style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Avatar section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarEmoji}>😎</Text>
            </View>
            <TouchableOpacity style={styles.avatarEditBadge}>
              <Pencil size={12} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Name card */}
        <View style={styles.nameCard}>
          <Text weight="semiBold" style={styles.nameText}>{username || 'Travis Scott'}</Text>
        </View>

        {/* Floating edit button */}
        <View style={styles.editRow}>
          <TouchableOpacity style={styles.editButton}>
            <Pencil size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* My Journey section */}
        <Text weight="semiBold" style={styles.sectionTitle}>My Journey</Text>

        <View style={styles.statsRow}>
          <StatBox icon={<Flame size={20} color="#f97316" />} value="7" label="Day Streak" />
          <StatBox icon={<BrainCircuit size={20} color="#ec4899" />} value="24" label="Concepts" />
          <StatBox icon={<Star size={20} color="#eab308" />} value="480" label="XP Earned" />
        </View>

        {/* Topic Progress */}
        <View style={styles.progressHeader}>
          <Text style={styles.progressSectionLabel}>Topic Progress</Text>
          <Text style={styles.progressOverall}>75%</Text>
        </View>

        <View style={styles.progressContainer}>
          <TopicProgress label="Investing Basics" percent={45} color="#0ea5e9" />
          <TopicProgress label="Personal Finance" percent={25} color="#f59e0b" />
          <TopicProgress label="Credit & Loans" percent={18} color="#10b981" />
          <TopicProgress label="Tax Basics" percent={10} color="#3b82f6" />
        </View>

        {/* Review card */}
        <View style={styles.reviewCard}>
          <View style={styles.reviewContent}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text weight="semiBold" style={styles.reviewTitle}>3 cards to review today</Text>
              <Text style={styles.reviewSub}>Yield curve · Bull Market · P/E Ratio</Text>
            </View>
            <TouchableOpacity style={styles.reviewBtn}>
              <Text weight="bold" style={styles.reviewBtnText}>REVIEW</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Section */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={16} color="#ef4444" />
          <Text weight="bold" style={styles.logoutText}>Logout from Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <View style={styles.statBox}>
      {icon}
      <Text weight="bold" style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function TopicProgress({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <View style={styles.topicRow}>
      <Text weight="semiBold" style={styles.topicLabel}>{label}</Text>
      <View style={styles.topicTrack}>
        <View style={[styles.topicFill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0b1626',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#142337',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
  },
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#0ea5e9',
  },
  avatarEmoji: {
    fontSize: 48,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0b1626',
  },
  // Name
  nameCard: {
    backgroundColor: '#142337',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  nameText: {
    color: '#ffffff',
    fontSize: 20,
  },
  // Edit button
  editRow: {
    alignItems: 'flex-end',
    marginBottom: 28,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Section
  sectionTitle: {
    color: '#ffffff',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#142337',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 22,
  },
  statLabel: {
    color: '#64748b',
    fontSize: 12,
  },
  // Progress
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressSectionLabel: {
    color: '#94a3b8',
    fontSize: 14,
  },
  progressOverall: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  progressContainer: {
    gap: 18,
    marginBottom: 28,
  },
  topicRow: {
    gap: 8,
  },
  topicLabel: {
    color: '#ffffff',
    fontSize: 14,
  },
  topicTrack: {
    height: 8,
    backgroundColor: '#1e2f47',
    borderRadius: 4,
  },
  topicFill: {
    height: '100%',
    borderRadius: 4,
  },
  // Review card
  reviewCard: {
    backgroundColor: '#142337',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  reviewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewTitle: {
    color: '#facc15',
    fontSize: 15,
    marginBottom: 4,
  },
  reviewSub: {
    color: '#94a3b8',
    fontSize: 12,
  },
  reviewBtn: {
    backgroundColor: '#facc15',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  reviewBtnText: {
    color: '#000000',
    fontSize: 13,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 24,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 15,
  },
});
