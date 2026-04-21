import React, { useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { TrendingUp, TrendingDown, Bitcoin, ChevronRight, Zap, Landmark, Percent, BarChart3, Activity } from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import Animated, { useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useTradingStore } from '../../store/useTradingStore';
import ContextualTooltip from '../../components/ContextualTooltip';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Watchlist asset config ──────────────────────────────────
const WATCHLIST_ASSETS = [
  { symbol: 'BTC', name: 'Bitcoin', icon: Bitcoin, accentColor: '#f59e0b' },
  { symbol: 'ETH', name: 'Ethereum', icon: Activity, accentColor: '#6366f1' },
  { symbol: 'SOL', name: 'Solana', icon: Zap, accentColor: '#14b8a6' },
];

// ── Market highlights data ──────────────────────────────────
const HIGHLIGHTS = [
  {
    title: 'Bitcoin Dominance at 54%',
    description: 'BTC continues to lead the total crypto market cap as institutional adoption grows.',
    icon: Bitcoin,
    accentColor: '#f59e0b',
  },
  {
    title: 'Fed Holds Rates Steady',
    description: 'The Federal Reserve maintains current interest rates, signaling a cautious outlook.',
    icon: Landmark,
    accentColor: '#6366f1',
  },
  {
    title: 'ETH Staking Yields 3.8%',
    description: 'Ethereum staking returns remain attractive for long-term holders seeking passive income.',
    icon: Percent,
    accentColor: '#14b8a6',
  },
];

// ── Mini sparkline generator ────────────────────────────────
function generateSparkline(isUp: boolean): number[] {
  const base = isUp
    ? [30, 28, 25, 27, 20, 18, 12]
    : [12, 15, 18, 16, 22, 25, 30];
  // Add slight random variation
  return base.map(v => v + (Math.random() * 4 - 2));
}

function sparklineToPath(data: number[], w: number, h: number): string {
  const stepX = w / (data.length - 1);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  return data
    .map((val, i) => {
      const x = i * stepX;
      const y = ((val - min) / range) * (h - 4) + 2; // 2px padding
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

// ── Sentiment Gauge ─────────────────────────────────────────
function SentimentGauge({ score }: { score: number }) {
  // score 0-100. The arc sweeps 180° (π radians) from left to right.
  const r = 70;
  const cx = 90;
  const cy = 85;
  const startAngle = Math.PI;
  const endAngle = 0;

  // Background arc path (full semicircle)
  const bgArcStart = { x: cx + r * Math.cos(startAngle), y: cy - r * Math.sin(startAngle) };
  const bgArcEnd = { x: cx + r * Math.cos(endAngle), y: cy - r * Math.sin(endAngle) };

  // Needle position
  const needleAngle = Math.PI - (score / 100) * Math.PI;
  const needleX = cx + (r - 10) * Math.cos(needleAngle);
  const needleY = cy - (r - 10) * Math.sin(needleAngle);

  const label =
    score <= 20 ? 'Extreme Fear' :
    score <= 40 ? 'Fear' :
    score <= 60 ? 'Neutral' :
    score <= 80 ? 'Greedy' : 'Extreme Greed';

  const labelColor =
    score <= 20 ? '#ef4444' :
    score <= 40 ? '#f97316' :
    score <= 60 ? '#eab308' :
    score <= 80 ? '#22c55e' : '#10b981';

  // Pulse animation for needle dot
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSequence(withTiming(0.4, { duration: 1200 }), withTiming(1, { duration: 1200 })),
      -1,
      true,
    ),
  }));

  return (
    <View style={styles.gaugeContainer}>
      <Svg width={180} height={100} viewBox="0 0 180 100">
        <Defs>
          <LinearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#ef4444" />
            <Stop offset="0.35" stopColor="#f97316" />
            <Stop offset="0.5" stopColor="#eab308" />
            <Stop offset="0.7" stopColor="#22c55e" />
            <Stop offset="1" stopColor="#10b981" />
          </LinearGradient>
        </Defs>
        {/* Background arc */}
        <Path
          d={`M ${bgArcStart.x} ${bgArcStart.y} A ${r} ${r} 0 0 1 ${bgArcEnd.x} ${bgArcEnd.y}`}
          fill="none"
          stroke="#1e2f47"
          strokeWidth={12}
          strokeLinecap="round"
        />
        {/* Colored arc */}
        <Path
          d={`M ${bgArcStart.x} ${bgArcStart.y} A ${r} ${r} 0 0 1 ${bgArcEnd.x} ${bgArcEnd.y}`}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={12}
          strokeLinecap="round"
        />
        {/* Needle line */}
        <Path
          d={`M ${cx} ${cy} L ${needleX} ${needleY}`}
          stroke="#e2e8f0"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Center dot */}
        <Circle cx={cx} cy={cy} r={5} fill="#e2e8f0" />
      </Svg>

      {/* Pulsing needle tip */}
      <Animated.View
        style={[
          styles.needleDot,
          {
            left: (needleX / 180) * 180 - 5,
            top: (1 - needleY / 100) * 100 - 5,
          },
          pulseStyle,
        ]}
      />

      <Text style={[styles.gaugeScore, { color: labelColor }]}>{score}</Text>
      <Text style={[styles.gaugeLabel, { color: labelColor }]}>{label}</Text>
    </View>
  );
}

// ── Sparkline Component ─────────────────────────────────────
function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const w = 60;
  const h = 28;
  const linePath = sparklineToPath(data, w, h);
  const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;

  return (
    <Svg width={w} height={h}>
      <Defs>
        <LinearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0.3" />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path d={areaPath} fill={`url(#spark-${color})`} />
      <Path d={linePath} fill="none" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

// ════════════════════════════════════════════════════════════
// ── Main Screen ────────────────────────────────────────────
// ════════════════════════════════════════════════════════════

export default function MarketScreen() {
  const { marketPrices } = useTradingStore();

  // Generate stable mock data on mount (useRef so it survives re-renders)
  const mockChanges = useRef<Record<string, number>>({
    BTC: +(Math.random() * 6 - 2).toFixed(2),
    ETH: +(Math.random() * 8 - 3).toFixed(2),
    SOL: +(Math.random() * 10 - 4).toFixed(2),
  }).current;

  const sparklines = useRef<Record<string, number[]>>({
    BTC: generateSparkline(mockChanges.BTC >= 0),
    ETH: generateSparkline(mockChanges.ETH >= 0),
    SOL: generateSparkline(mockChanges.SOL >= 0),
  }).current;

  const sentimentScore = useRef(Math.floor(Math.random() * 40) + 40).current; // 40-80

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* ── Header ────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.title}>Market</Text>
          <Text style={styles.subtitle}>Live prices & market insights</Text>
        </View>

        {/* ── Section 1: Market Sentiment ────────── */}
        <View style={styles.sentimentCard}>
          <View style={styles.sentimentHeader}>
            <BarChart3 size={18} color="#94a3b8" />
            <Text style={styles.sectionLabel}>MARKET SENTIMENT</Text>
          </View>
          <SentimentGauge score={sentimentScore} />
          <View style={styles.sentimentTooltipWrap}>
            <ContextualTooltip
              term="Fear & Greed Index"
              screenContext="Market"
              explanation="The Fear & Greed Index measures overall market sentiment on a scale from 0 (Extreme Fear) to 100 (Extreme Greed). When investors are fearful, it can signal buying opportunities. When they're greedy, it may signal an overheated market."
              metaphor="It's like a mood ring for the entire market—red when everyone's panicking, green when everyone's celebrating."
            >
              What is Market Sentiment?
            </ContextualTooltip>
          </View>
        </View>

        {/* ── Section 2: Watchlist ───────────────── */}
        <Text style={styles.sectionTitle}>WATCHLIST</Text>
        <View style={styles.watchlistContainer}>
          {WATCHLIST_ASSETS.map(asset => {
            const price = marketPrices[asset.symbol] || 0;
            const change = mockChanges[asset.symbol] || 0;
            const isUp = change >= 0;
            const Icon = asset.icon;

            return (
              <TouchableOpacity
                key={asset.symbol}
                style={styles.assetCard}
                activeOpacity={0.7}
                onPress={() => router.push(`/asset/${asset.symbol}`)}
              >
                {/* Left: Icon + Info */}
                <View style={styles.assetLeft}>
                  <View style={[styles.assetIconBox, { backgroundColor: asset.accentColor + '18' }]}>
                    <Icon size={20} color={asset.accentColor} />
                  </View>
                  <View>
                    <Text style={styles.assetSymbol}>{asset.symbol}</Text>
                    <Text style={styles.assetName}>{asset.name}</Text>
                  </View>
                </View>

                {/* Center: Sparkline */}
                <MiniSparkline
                  data={sparklines[asset.symbol]}
                  color={isUp ? '#22c55e' : '#ef4444'}
                />

                {/* Right: Price + Change */}
                <View style={styles.assetRight}>
                  <Text style={styles.assetPrice}>
                    {price > 0 ? `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                  </Text>
                  <View style={[styles.changeBadge, { backgroundColor: isUp ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)' }]}>
                    {isUp ? <TrendingUp size={11} color="#22c55e" /> : <TrendingDown size={11} color="#ef4444" />}
                    <Text style={[styles.changeText, { color: isUp ? '#22c55e' : '#ef4444' }]}>
                      {isUp ? '+' : ''}{change}%
                    </Text>
                  </View>
                </View>

                {/* Chevron */}
                <ChevronRight size={16} color="#334155" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Section 3: Market Highlights ────────── */}
        <Text style={styles.sectionTitle}>MARKET HIGHLIGHTS</Text>
        <View style={styles.highlightsContainer}>
          {HIGHLIGHTS.map((item, index) => {
            const Icon = item.icon;
            return (
              <View key={index} style={styles.highlightCard}>
                <View style={[styles.highlightIconBox, { backgroundColor: item.accentColor + '18' }]}>
                  <Icon size={20} color={item.accentColor} />
                </View>
                <View style={styles.highlightContent}>
                  <Text style={styles.highlightTitle}>{item.title}</Text>
                  <Text style={styles.highlightDesc}>{item.description}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Section 4: Key Terms ───────────────── */}
        <Text style={styles.sectionTitle}>KEY TERMS</Text>
        <View style={styles.termsCard}>
          <View style={styles.termRow}>
            <ContextualTooltip
              term="Market Capitalization"
              screenContext="Market"
              explanation="Market cap represents the total dollar value of all outstanding shares or coins. It's calculated by multiplying the current price by the total circulating supply."
              metaphor="If a company is a pizza, Market Cap is the total price of the entire pizza. The share price is just the cost of one slice."
            >
              Market Cap
            </ContextualTooltip>
          </View>
          <View style={styles.termDivider} />
          <View style={styles.termRow}>
            <ContextualTooltip
              term="24h Trading Volume"
              screenContext="Market"
              explanation="Volume measures the total amount of an asset that has been traded in the last 24 hours. High volume means lots of activity and usually tighter spreads. Low volume can signal low interest or potential for large price swings."
              metaphor="Think of a busy highway vs. an empty backroad — high volume means smooth traffic, low volume means any single car can cause a jam."
            >
              Trading Volume
            </ContextualTooltip>
          </View>
          <View style={styles.termDivider} />
          <View style={styles.termRow}>
            <ContextualTooltip
              term="Yield Curve"
              screenContext="Market"
              explanation="A graph showing interest rates for bonds of different lengths. When short-term rates are higher than long-term rates, the curve 'inverts' — often seen before recessions."
              metaphor="Think of it like a road: normally it goes uphill (longer = more reward). When it flips downhill, economists get nervous."
            >
              Yield Curve
            </ContextualTooltip>
          </View>
        </View>

        {/* Bottom spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ════════════════════════════════════════════════════════════
// ── Styles ─────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════

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
    marginBottom: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'serif',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },

  // ── Section labels ──
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1.2,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1.2,
  },

  // ── Sentiment ──
  sentimentCard: {
    backgroundColor: '#142337',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1e2f47',
    alignItems: 'center',
    marginBottom: 32,
  },
  sentimentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  gaugeContainer: {
    alignItems: 'center',
    position: 'relative',
    height: 130,
    justifyContent: 'center',
  },
  gaugeScore: {
    fontSize: 36,
    fontWeight: '800',
    marginTop: -20,
  },
  gaugeLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  needleDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e2e8f0',
  },
  sentimentTooltipWrap: {
    marginTop: 16,
    alignSelf: 'flex-start',
  },

  // ── Watchlist ──
  watchlistContainer: {
    gap: 12,
    marginBottom: 32,
  },
  assetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#142337',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  assetIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetSymbol: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  assetName: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 1,
  },
  assetRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  assetPrice: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // ── Highlights ──
  highlightsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  highlightCard: {
    flexDirection: 'row',
    backgroundColor: '#142337',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e2f47',
    alignItems: 'flex-start',
    gap: 14,
  },
  highlightIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightContent: {
    flex: 1,
  },
  highlightTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  highlightDesc: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 19,
  },

  // ── Key Terms ──
  termsCard: {
    backgroundColor: '#142337',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  termRow: {
    paddingVertical: 12,
  },
  termDivider: {
    height: 1,
    backgroundColor: '#1e2f47',
  },
});
