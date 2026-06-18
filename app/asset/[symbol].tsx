import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { CustomText as Text } from '../../components/CustomText';
import { useLocalSearchParams, router } from 'expo-router';
import { useTradingStore } from '../../store/useTradingStore';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react-native';
import ContextualTooltip from '../../components/ContextualTooltip';
import RealtimeChart from '../../components/RealtimeChart';

export default function AssetDetails() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const { marketPrices, portfolio, buyAsset, sellAsset, cashBalance } = useTradingStore();
  
  const [quantityStr, setQuantityStr] = useState('1');
  const [orderType, setOrderType] = useState<'Market' | 'Limit'>('Market');

  const currentPrice = marketPrices[symbol as string] || 0;
  const holding = portfolio[symbol as string];
  const quantity = parseFloat(quantityStr) || 0;
  const totalCost = quantity * currentPrice;

  // Mock checking if the asset is up or down recently
  const isUp = currentPrice > 0;

  const handleBuy = () => {
    if (quantity <= 0) return;
    const success = buyAsset(symbol as string, quantity, currentPrice);
    if (success) {
      Alert.alert('Paper Trade Executed', `Bought ${quantity} ${symbol} for $${totalCost.toFixed(2)}`);
    } else {
      Alert.alert('Insufficient Funds', 'You do not have enough cash balance for this trade.');
    }
  };

  const handleSell = () => {
    if (quantity <= 0) return;
    const success = sellAsset(symbol as string, quantity, currentPrice);
    if (success) {
      Alert.alert('Paper Trade Executed', `Sold ${quantity} ${symbol} for $${totalCost.toFixed(2)}`);
    } else {
      Alert.alert('Insufficient Assets', `You do not own enough ${symbol} to sell.`);
    }
  };

  if (!symbol) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* ── Header ─────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color="#e2e8f0" />
          </TouchableOpacity>
          <Text style={styles.symbolTitle}>{symbol}</Text>
          <View style={styles.placeholderBox} />
        </View>

        {/* ── Price Section ───────────────────── */}
        <View style={styles.priceSection}>
          <Text style={styles.price}>
            {currentPrice > 0
              ? `$${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
              : 'Fetching...'}
          </Text>
          <View style={[styles.badge, { backgroundColor: isUp ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)' }]}>
            {isUp ? <TrendingUp size={16} color="#22c55e" /> : <TrendingDown size={16} color="#ef4444" />}
            <Text style={[styles.badgeText, { color: isUp ? '#22c55e' : '#ef4444' }]}>
              {isUp ? '+' : '-'}1.2% Today
            </Text>
          </View>
        </View>

        {/* ── Candlestick Chart ──────────────── */}
        <View style={styles.chartWrapper}>
          <RealtimeChart />
        </View>

        {/* ── Learning Tooltip ────────────────── */}
        <View style={styles.learningSection}>
          <ContextualTooltip
            term="Market Capitalization"
            screenContext="AssetDetail"
            explanation="This is the total dollar market value of a company's outstanding shares of stock. It's calculated by multiplying the total number of shares by the current price of one share."
            metaphor="If a company is a pizza, Market Cap is the total price of the entire pizza. The share price is just the cost of one slice."
          >
            What is this asset actually worth?
          </ContextualTooltip>
        </View>

        {/* ── Trade Card ─────────────────────── */}
        <View style={styles.tradeCard}>
          <Text style={styles.sectionTitle}>Place a Paper Trade</Text>
          
          <View style={styles.orderTypeContainer}>
            <TouchableOpacity 
              style={[styles.typeButton, orderType === 'Market' && styles.typeButtonActive]}
              onPress={() => setOrderType('Market')}
            >
              <ContextualTooltip
                term="Market Order"
                screenContext="AssetDetail"
                explanation="A market order is an instruction to buy or sell immediately at the current available price."
                metaphor="Like grabbing the first apple you see at the supermarket and paying whatever the sticker says right now."
              >
                Market
              </ContextualTooltip>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.typeButton, orderType === 'Limit' && styles.typeButtonActive]}
              onPress={() => setOrderType('Limit')}
            >
              <ContextualTooltip
                term="Limit Order"
                screenContext="AssetDetail"
                explanation="A limit order is an instruction to buy or sell an asset at a specific price or better."
                metaphor="Like telling a real estate agent 'I will only buy this house if the price drops to $200k.' If it never does, you don't buy it."
              >
                Limit
              </ContextualTooltip>
            </TouchableOpacity>
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Quantity</Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={quantityStr}
              onChangeText={setQuantityStr}
              placeholderTextColor="#4a5568"
            />
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated Cost</Text>
            <Text style={styles.summaryValue}>${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Available Buying Power</Text>
            <Text style={styles.summaryValue}>${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.actionBtn, styles.buyBtn]} onPress={handleBuy}>
              <Text style={styles.actionBtnText}>Buy {symbol}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.sellBtn, (!holding || holding.quantity === 0) && styles.disabledBtn]} 
              onPress={handleSell}
            >
              <Text style={styles.actionBtnText}>Sell {symbol}</Text>
            </TouchableOpacity>
          </View>
          
          {holding && holding.quantity > 0 && (
            <View style={styles.holdingInfo}>
              <Text style={styles.holdingText}>You currently hold {holding.quantity} {symbol}.</Text>
              <Text style={styles.holdingSubText}>Avg Cost: ${holding.averageCost.toFixed(2)}</Text>
            </View>
          )}
        </View>

        {/* Bottom spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0b1626',
  },
  container: {
    flex: 1,
    backgroundColor: '#0b1626',
  },
  content: {
    padding: 24,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  symbolTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  placeholderBox: {
    width: 40,
  },
  priceSection: {
    marginBottom: 8,
  },
  price: {
    fontSize: 40,
    fontWeight: '800',
    color: '#ffffff',
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
    gap: 4,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 14,
  },
  chartWrapper: {
    marginHorizontal: -24,
    minHeight: 220,
  },
  learningSection: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#142337',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  tradeCard: {
    backgroundColor: '#142337',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
  },
  orderTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e2f47',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  typeButtonActive: {
    backgroundColor: '#147684',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1e2f47',
    borderWidth: 1,
    borderColor: '#334155',
    color: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '600',
    width: 120,
    textAlign: 'right',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#94a3b8',
    fontSize: 15,
  },
  summaryValue: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyBtn: {
    backgroundColor: '#10b981',
  },
  sellBtn: {
    backgroundColor: '#ef4444',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  actionBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  holdingInfo: {
    marginTop: 20,
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e2f47',
  },
  holdingText: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
  holdingSubText: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 4,
  },
});
