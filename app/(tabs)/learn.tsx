import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, BackHandler } from 'react-native';
import { Search, LineChart, Shield, Calculator, PieChart, ChevronRight, BookOpen, Clock, ArrowLeft, TrendingUp, CreditCard } from 'lucide-react-native';

const CATEGORIES = ['All', 'Investing', 'Trading', 'Budgeting'];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1626' },
  container: { padding: 24, paddingTop: 48 },
  header: { marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '800', color: '#ffffff', fontFamily: 'serif', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#64748b' },
  
  // Library specific styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#142337',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  searchIcon: { marginRight: 12 },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    height: '100%',
  },
  
  categoriesWrapper: {
    marginHorizontal: -24,
    marginBottom: 24,
  },
  categoriesContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#142337',
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  categoryPillActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  categoryText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  
  lessonsList: { gap: 16 },
  emptyState: { paddingVertical: 40, alignItems: 'center' },
  emptyStateText: { color: '#64748b', fontSize: 15 },
  
  lessonCard: {
    flexDirection: 'row',
    backgroundColor: '#142337',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e2f47',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  lessonContent: { flex: 1 },
  lessonMetaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  levelTag: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  timeTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { color: '#64748b', fontSize: 12 },
  lessonTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  lessonDescription: { color: '#94a3b8', fontSize: 13, lineHeight: 18 },
  chevronContainer: { marginLeft: 12, justifyContent: 'center' },

  // Reader View Styles
  readerHeader: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2f47',
    backgroundColor: '#0b1626',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButtonText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },
  readerContent: {
    padding: 24,
    paddingBottom: 80,
  },
  readerHero: {
    marginBottom: 32,
  },
  largeIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  readerHeroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  readerTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'serif',
    lineHeight: 40,
  },
  articleBody: {
    gap: 16,
  },
  paragraph: {
    color: '#cbd5e1',
    fontSize: 17,
    lineHeight: 28,
  },
  h2: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 8,
  },
  bold: {
    fontWeight: '700',
    color: '#ffffff',
  },
  bulletList: {
    marginLeft: 8,
    gap: 12,
    marginVertical: 8,
  },
  bulletItem: {
    color: '#cbd5e1',
    fontSize: 17,
    lineHeight: 26,
  },
  mathBox: {
    backgroundColor: '#142337',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
    marginVertical: 12,
  },
  mathText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: 'monospace',
  },
  completeButton: {
    marginTop: 48,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  }
});

const LESSONS = [
  {
    id: '1',
    title: 'How Compound Interest Works',
    description: 'The mathematical miracle that makes your wealth snowball over time.',
    category: 'Investing',
    level: 'Beginner',
    readTime: '5 min',
    icon: PieChart,
    color: '#0ea5e9',
    bgColor: 'rgba(14, 165, 233, 0.1)',
    content: (
      <>
        <Text style={styles.paragraph}>Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it. But what exactly is it?</Text>
        
        <Text style={styles.h2}>The Snowball Effect</Text>
        <Text style={styles.paragraph}>Imagine rolling a small snowball down a hill. As it rolls, it picks up more snow. The larger it gets, the more snow it picks up with each revolution. This is exactly how compound interest works.</Text>
        <Text style={styles.paragraph}>When you invest money, you earn interest. In the next period, you earn interest not only on your original investment (the principal) but also on the interest you earned previously.</Text>
        
        <Text style={styles.h2}>A Real-World Example</Text>
        <Text style={styles.paragraph}>Let's say you invest $1,000 at a 10% annual return.</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Year 1:</Text> You earn $100. Total = $1,100.</Text>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Year 2:</Text> You earn 10% of $1,100 ($110). Total = $1,210.</Text>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Year 3:</Text> You earn 10% of $1,210 ($121). Total = $1,331.</Text>
        </View>
        <Text style={styles.paragraph}>Over 30 years, that initial $1,000 grows to over <Text style={styles.bold}>$17,449</Text> without you adding another penny!</Text>
      </>
    )
  },
  {
    id: '2',
    title: 'Understanding Candlesticks',
    description: 'Learn to read market emotion and price action like a pro.',
    category: 'Trading',
    level: 'Intermediate',
    readTime: '8 min',
    icon: LineChart,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    content: (
      <>
        <Text style={styles.paragraph}>Candlestick charts are standard across all major trading platforms. They provide a quick visual representation of market emotion over a specific timeframe (like 1 Day or 1 Hour).</Text>
        
        <Text style={styles.h2}>The Anatomy of a Candle</Text>
        <Text style={styles.paragraph}>Each candle tells a short story of the battle between buyers (bulls) and sellers (bears). It contains 4 key price points, known as OHLC:</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Open:</Text> The price at the beginning of the period.</Text>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>High:</Text> The highest price reached during the period.</Text>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Low:</Text> The lowest price reached during the period.</Text>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Close:</Text> The final price at the end of the period.</Text>
        </View>
        
        <Text style={styles.h2}>Green vs. Red</Text>
        <Text style={styles.paragraph}>If the <Text style={styles.bold}>Close</Text> is higher than the <Text style={styles.bold}>Open</Text>, the candle is green (bullish). Buyers pushed the price up and won the session!{"\n\n"}If the <Text style={styles.bold}>Close</Text> is lower than the <Text style={styles.bold}>Open</Text>, the candle is red (bearish). Sellers overwhelmed the buyers!</Text>
        
        <Text style={styles.h2}>Wicks (or Shadows)</Text>
        <Text style={styles.paragraph}>The thin vertical lines above and below the solid body are the wicks. A very long wick at the bottom shows that sellers tried to push the price down, but buyers rejected it aggressively and drove the price back up.</Text>
      </>
    )
  },
  {
    id: '3',
    title: 'Emergency Funds 101',
    description: 'Protect yourself and your investments from unexpected expenses.',
    category: 'Budgeting',
    level: 'Beginner',
    readTime: '4 min',
    icon: Shield,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    content: (
      <>
        <Text style={styles.paragraph}>An emergency fund is a bank account with money set aside exclusively to cover large, unexpected expenses. Think of it as a financial shock absorber.</Text>
        
        <Text style={styles.h2}>Why do you need one?</Text>
        <Text style={styles.paragraph}>If all your money is tied up in stocks, a sudden emergency might force you to sell your investments at a loss just to get cash. An emergency fund protects your investments so they can continue to grow.</Text>
        
        <Text style={styles.h2}>How much should you save?</Text>
        <Text style={styles.paragraph}>The golden rule is <Text style={styles.bold}>3 to 6 months of absolute basic living expenses</Text>. If your rent, groceries, and debt stringently total $2,000 a month, your emergency fund should be positioned between $6,000 and $12,000.</Text>
        
        <Text style={styles.h2}>Where should you keep it?</Text>
        <Text style={styles.paragraph}>Not under your mattress, and certainly not in the stock market! Keep it in a <Text style={styles.bold}>High Yield Savings Account (HYSA)</Text>. It needs to be extremely liquid (easily accessible in hours) while still earning a little bit of interest to combat inflation safely.</Text>
      </>
    )
  },
  {
    id: '4',
    title: 'Asset Allocation Strategies',
    description: 'Why you shouldn\'t put all your eggs in one investment basket.',
    category: 'Investing',
    level: 'Advanced',
    readTime: '10 min',
    icon: BookOpen,
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
    content: (
      <>
        <Text style={styles.paragraph}>Asset allocation is an investment strategy that aims to balance risk and reward. Simply put, it's how you slice your investment pie into different asset classes.</Text>
        
        <Text style={styles.h2}>Don't Put All Your Eggs in One Basket</Text>
        <Text style={styles.paragraph}>Different assets behave differently in the market. When stocks go down, bonds often hold steady. By creatively mixing different asset classes (Stocks, Bonds, Real Estate, Cash, Crypto), you smooth out the bumpy ride of a volatile market.</Text>
        
        <Text style={styles.h2}>The Classic 60/40 Portfolio</Text>
        <Text style={styles.paragraph}>Traditionally, financial advisors recommended holding <Text style={styles.bold}>60% stocks</Text> for rapid growth and <Text style={styles.bold}>40% bonds</Text> for safety and fixed income. While modern variations exist, the core concept remains: aggressively balance high-risk assets with deliberate, low-risk stabilizers.</Text>
        
        <Text style={styles.h2}>Age-Based Allocation</Text>
        <Text style={styles.paragraph}>A common rule of thumb is "110 minus your age". If you are 30 years old, 110 - 30 = 80. You should theoretically hold 80% in aggressive stocks, and 20% in safe bonds. As you get closer to retirement, you predictably become more conservative to preserve capital.</Text>
      </>
    )
  },
  {
    id: '5',
    title: 'Debt To Income Ratio',
    description: 'A key metric lenders use to determine your financial health.',
    category: 'Budgeting',
    level: 'Intermediate',
    readTime: '6 min',
    icon: Calculator,
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.1)',
    content: (
      <>
        <Text style={styles.paragraph}>Your Debt-to-Income (DTI) ratio is the percentage of your gross monthly income that goes toward paying your monthly debt payments. Lenders scrutinize this metric to determine your overall borrowing risk.</Text>
        
        <Text style={styles.h2}>The Formula</Text>
        <View style={styles.mathBox}>
          <Text style={styles.mathText}>DTI = {"\n"}(Total Monthly Debt / Gross Monthly Income) × 100</Text>
        </View>
        <Text style={styles.paragraph}>For example, if you pay $1,500 for your mortgage, $200 for a car loan, and $300 for student loans, your monthly debt is $2,000. If your gross (before taxes) income is $6,000, your DTI is exactly 33.3%.</Text>
        
        <Text style={styles.h2}>Why It Matters</Text>
        <Text style={styles.paragraph}>To secure an optimal mortgage rate, lenders generally want to see a DTI securely <Text style={styles.bold}>below 36%</Text>. If your DTI climbs to 43% or higher, it becomes an alarming "red flag". You will be viewed as a high-risk borrower—meaning getting loans will be difficult, and you will pay significantly higher interest rates.</Text>
      </>
    )
  },
  {
    id: '6',
    title: 'What is a Bull Market?',
    description: 'Understanding the phase of the market when prices are rising and optimism is high.',
    category: 'Investing',
    level: 'Beginner',
    readTime: '5 min',
    icon: TrendingUp,
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.1)',
    content: (
      <>
        <Text style={styles.paragraph}>A "Bull Market" is a financial market condition where prices are rising or expected to rise. The term is most frequently used to refer to the stock market, but can be applied to anything that is traded, such as bonds, real estate, currencies, and commodities.</Text>
        
        <Text style={styles.h2}>Why "Bull"?</Text>
        <Text style={styles.paragraph}>The term "bull" comes from the way the animal attacks its opponents. A bull thrusts its horns up into the air, symbolizing the upward movement of stock prices. Conversely, a "bear" swipes its paws down, representing a down market.</Text>
        
        <Text style={styles.h2}>Key Characteristics</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Rising Prices:</Text> Asset prices typically increase by 20% or more over a sustained period.</Text>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Investor Optimism:</Text> High confidence leads to increased buying activity.</Text>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Strong Economy:</Text> Often coincides with high GDP growth and low unemployment.</Text>
        </View>
        
        <Text style={styles.h2}>How to Invest in a Bull Market</Text>
        <Text style={styles.paragraph}>Many investors follow a "buy and hold" strategy during bull markets. However, it's important to remember that bull markets don't last forever. Diversification remains key to protecting your portfolio when the cycle eventually turns.</Text>
      </>
    )
  },
  {
    id: '7',
    title: 'Credit Scores Explained',
    description: 'Learn how your financial reputaton is measured and why it matters for your future.',
    category: 'Budgeting',
    level: 'Beginner',
    readTime: '7 min',
    icon: CreditCard,
    color: '#6366f1',
    bgColor: 'rgba(99, 102, 241, 0.1)',
    content: (
      <>
        <Text style={styles.paragraph}>Your credit score is a three-digit number that represents your "creditworthiness." It tells lenders how likely you are to pay back money you borrow. In the US, FICO scores are the most common, ranging from 300 to 850.</Text>
        
        <Text style={styles.h2}>What Makes Up Your Score?</Text>
        <Text style={styles.paragraph}>Your score isn't random; it's calculated based on several key factors in your credit report:</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Payment History (35%):</Text> Do you pay your bills on time? This is the most important factor.</Text>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Amounts Owed (30%):</Text> Also known as Credit Utilization. Using too much of your available credit limit can lower your score.</Text>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Length of Credit History (15%):</Text> How long have you had credit accounts open?</Text>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>New Credit (10%):</Text> Opening too many accounts in a short time is seen as risky.</Text>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Credit Mix (10%):</Text> Having different types of credit (like a credit card and a car loan).</Text>
        </View>
        
        <Text style={styles.h2}>Why Your Score Matters</Text>
        <Text style={styles.paragraph}>A high credit score (usually 740+) can save you thousands of dollars over your lifetime by qualifying you for lower interest rates on mortgages, car loans, and credit cards. It can even affect your ability to rent an apartment or get certain jobs.</Text>
      </>
    )
  }
];

type LessonType = typeof LESSONS[0];

export default function LearnScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);

  // Handle hardware back button generically for android mostly
  React.useEffect(() => {
    const onBackPress = () => {
      if (selectedLesson) {
        setSelectedLesson(null);
        return true;
      }
      return false;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [selectedLesson]);

  if (selectedLesson) {
    const IconComponent = selectedLesson.icon;
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.readerHeader}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setSelectedLesson(null)}
          >
            <ArrowLeft size={24} color="#e2e8f0" />
            <Text style={styles.backButtonText}>Back to Library</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView contentContainerStyle={styles.readerContent}>
          <View style={styles.readerHero}>
            <View style={[styles.largeIconContainer, { backgroundColor: selectedLesson.bgColor }]}>
              <IconComponent size={36} color={selectedLesson.color} />
            </View>
            <View style={styles.readerHeroMeta}>
              <Text style={[styles.levelTag, { color: selectedLesson.color }]}>{selectedLesson.level}</Text>
              <View style={styles.timeTag}>
                <Clock size={14} color="#64748b" />
                <Text style={styles.timeText}>{selectedLesson.readTime}</Text>
              </View>
            </View>
            <Text style={styles.readerTitle}>{selectedLesson.title}</Text>
          </View>

          <View style={styles.articleBody}>
            {selectedLesson.content}
          </View>

          <TouchableOpacity style={[styles.completeButton, { backgroundColor: selectedLesson.color }]} onPress={() => setSelectedLesson(null)}>
            <Text style={styles.completeButtonText}>Finish Lesson</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const filteredLessons = LESSONS.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || lesson.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Learn</Text>
          <Text style={styles.subtitle}>Explore financial concepts and strategies</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search lessons, terms, etc..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesWrapper}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map(category => (
            <TouchableOpacity 
              key={category}
              style={[styles.categoryPill, activeCategory === category && styles.categoryPillActive]}
              onPress={() => setActiveCategory(category)}
            >
              <Text style={[styles.categoryText, activeCategory === category && styles.categoryTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lessons List */}
        <View style={styles.lessonsList}>
          {filteredLessons.length === 0 ? (
             <View style={styles.emptyState}>
               <Text style={styles.emptyStateText}>No lessons found for "{searchQuery}"</Text>
             </View>
          ) : (
            filteredLessons.map(lesson => {
              const IconComponent = lesson.icon;
              return (
                <TouchableOpacity 
                  key={lesson.id} 
                  style={styles.lessonCard}
                  onPress={() => setSelectedLesson(lesson)}
                >
                  <View style={[styles.iconContainer, { backgroundColor: lesson.bgColor }]}>
                    <IconComponent size={24} color={lesson.color} />
                  </View>
                  
                  <View style={styles.lessonContent}>
                    <View style={styles.lessonMetaHeader}>
                      <Text style={[styles.levelTag, { color: lesson.color }]}>{lesson.level}</Text>
                      <View style={styles.timeTag}>
                        <Clock size={12} color="#64748b" />
                        <Text style={styles.timeText}>{lesson.readTime}</Text>
                      </View>
                    </View>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    <Text style={styles.lessonDescription} numberOfLines={2}>{lesson.description}</Text>
                  </View>
                  
                  <View style={styles.chevronContainer}>
                    <ChevronRight size={20} color="#475569" />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
