import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Flame, PieChart, BadgeDollarSign, Building2 } from 'lucide-react-native';

export default function HomeScreen() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning 👋';
    if (hour < 18) return 'Good afternoon ☀️';
    return 'Good evening 🌙';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.name}>Rafi</Text>
          <View style={styles.streakPill}>
            <Flame size={14} color="#f97316" />
            <Text style={styles.streakText}>7-day streak</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressLabel}>Your progress</Text>
          <Text style={styles.progressValue}>12 concepts</Text>
          <Text style={styles.progressSub}>learned this week • 3 to review</Text>
        </View>

        <Text style={styles.sectionTitle}>CONTINUE LEARNING</Text>
        
        <View style={styles.lessonList}>
          <LessonCard 
            icon={<PieChart size={20} color="#60a5fa" />} 
            title="What is a Bull Market?" 
            meta="5 min · Investing Basics" 
          />
          <LessonCard 
            icon={<BadgeDollarSign size={20} color="#fbbf24" />} 
            title="How Compound Interest Wor..." 
            meta="4 min · Personal Finance" 
          />
          <LessonCard 
            icon={<Building2 size={20} color="#94a3b8" />} 
            title="Credit Scores Explained" 
            meta="6 min · Banking" 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LessonCard({ icon, title, meta }: { icon: React.ReactNode, title: string, meta: string }) {
  return (
    <TouchableOpacity style={styles.lessonCard}>
      <View style={styles.lessonIconContainer}>
        {icon}
      </View>
      <View style={styles.lessonContent}>
        <Text style={styles.lessonTitle}>{title}</Text>
        <Text style={styles.lessonMeta}>{meta}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0b1626',
  },
  container: {
    padding: 24,
    paddingTop: 48,
  },
  header: {
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 4,
  },
  name: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'serif',
    marginBottom: 12,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
  },
  streakText: {
    color: '#f59e0b',
    fontWeight: '600',
    fontSize: 14,
  },
  progressCard: {
    backgroundColor: '#147684', // Teal gradient representation
    borderRadius: 20,
    padding: 24,
    marginBottom: 36,
  },
  progressLabel: {
    color: '#b5e3e6',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  progressValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  progressSub: {
    color: '#b5e3e6',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  lessonList: {
    gap: 12,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#142337',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  lessonIconContainer: {
    width: 44,
    height: 44,
    backgroundColor: '#1e2f47',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  lessonMeta: {
    fontSize: 13,
    color: '#64748b',
  }
});
