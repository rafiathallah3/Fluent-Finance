import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Flame, BrainCircuit, Star } from 'lucide-react-native';

export default function JourneyScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Journey</Text>
          <Text style={styles.subtitle}>Your financial literacy progress</Text>
        </View>

        <View style={styles.statsRow}>
          <StatBox icon={<Flame size={20} color="#f97316" />} value="7" label="Day Streak" />
          <StatBox icon={<BrainCircuit size={20} color="#ec4899" />} value="24" label="Concepts" />
          <StatBox icon={<Star size={20} color="#eab308" />} value="480" label="XP Earned" />
        </View>

        <Text style={styles.sectionTitle}>TOPIC PROGRESS</Text>

        <View style={styles.progressContainer}>
          <TopicProgress label="Investing Basics" percent={75} color="#0ea5e9" />
          <TopicProgress label="Personal Finance" percent={50} color="#f59e0b" />
          <TopicProgress label="Credit & Loans" percent={30} color="#10b981" />
          <TopicProgress label="Tax Basics" percent={10} color="#64748b" />
        </View>

        <View style={styles.reviewCard}>
          <View style={styles.reviewContent}>
            <View>
              <Text style={styles.reviewTitle}>3 cards to review today</Text>
              <Text style={styles.reviewSub}>Yield curve · Bull Market · P/E Ratio</Text>
            </View>
            <TouchableOpacity style={styles.reviewBtn}>
              <Text style={styles.reviewBtnText}>REVIEW</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <View style={styles.statBox}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function TopicProgress({ label, percent, color }: { label: string, percent: number, color: string }) {
  return (
    <View style={styles.topicRow}>
      <View style={styles.topicHeader}>
        <Text style={styles.topicLabel}>{label}</Text>
        <Text style={styles.topicPercent}>{percent}%</Text>
      </View>
      <View style={styles.topicTrack}>
        <View style={[styles.topicFill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1626' },
  container: { padding: 24, paddingTop: 48 },
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '800', color: '#ffffff', fontFamily: 'serif', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#64748b' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 36 },
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1.2,
    marginBottom: 20,
  },
  progressContainer: { gap: 20, marginBottom: 36 },
  topicRow: {},
  topicHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  topicLabel: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  topicPercent: { color: '#64748b', fontSize: 13 },
  topicTrack: { height: 6, backgroundColor: '#1e2f47', borderRadius: 3 },
  topicFill: { height: '100%', borderRadius: 3 },
  reviewCard: {
    backgroundColor: '#1e293b', 
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  reviewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewTitle: { color: '#facc15', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  reviewSub: { color: '#94a3b8', fontSize: 12 },
  reviewBtn: {
    backgroundColor: '#facc15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reviewBtnText: { color: '#000000', fontWeight: '700', fontSize: 13 }
});
