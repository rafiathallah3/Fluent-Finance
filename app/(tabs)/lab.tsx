import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Flame, LineChart as ChartIcon, CheckSquare, ChevronDown, ChevronUp, Wallet, TrendingUp, TrendingDown } from 'lucide-react-native';
import VisualMetaphors from '../../components/VisualMetaphors';
import RealtimeChart from '../../components/RealtimeChart';
import ContextualTooltip from '../../components/ContextualTooltip';
import { useTradingStore } from '../../store/useTradingStore';
import Slider from '@react-native-community/slider';

export default function LabScreen() {
  const [activeTab, setActiveTab] = useState<'Budget' | 'Invest'>('Budget');
  const [monthlyIncome, setMonthlyIncome] = useState(3500000);
  const [savingsRate, setSavingsRate] = useState(20);
  const [isPortfolioExpanded, setIsPortfolioExpanded] = useState(false);
  const { marketPrices, cashBalance, portfolio, unrealizedPnL, buyAsset, sellAsset, snapshots, getPortfolioDelta } = useTradingStore();
  const [quantityStr, setQuantityStr] = useState('0.1');

  // Calculate Aggregates
  const projectedSavings = monthlyIncome * (savingsRate / 100);
  const monthlyExpenses = monthlyIncome - projectedSavings;
  const isBudgetProfitable = savingsRate >= 15;

  const totalPortfolioValue = Object.entries(portfolio).reduce((acc, [sym, hold]) => {
    return acc + (hold.quantity * (marketPrices[sym] || 0));
  }, 0);
  const totalWealth = cashBalance + totalPortfolioValue;
  const portfolioDelta = getPortfolioDelta();

  // Hardcode focus on BTC for the Invest tab demo
  const symbol = 'BTC';
  const currentPrice = marketPrices[symbol] || 0;
  const holding = portfolio[symbol];
  const quantity = parseFloat(quantityStr) || 0;
  const totalCost = quantity * currentPrice;

  const handleBuy = () => {
    if (quantity <= 0) return;
    const success = buyAsset(symbol, quantity, currentPrice);
    if (success) {
      Alert.alert('Trade Executed', `Bought ${quantity} ${symbol} for $${totalCost.toFixed(2)}`);
    } else {
      Alert.alert('Insufficient Funds', 'Not enough cash balance.');
    }
  };

  const handleSell = () => {
    if (quantity <= 0) return;
    const success = sellAsset(symbol, quantity, currentPrice);
    if (success) {
      Alert.alert('Trade Executed', `Sold ${quantity} ${symbol} for $${totalCost.toFixed(2)}`);
    } else {
      Alert.alert('Insufficient Assets', `Not enough ${symbol} to sell.`);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Money Lab</Text>
          <Text style={styles.subtitle}>Practice without real consequences</Text>
        </View>

        {/* Sticky Portfolio Header */}
        <View style={styles.portfolioCard}>
          <View style={styles.portfolioTopRow}>
            <View>
              <Text style={styles.portfolioLabel}>Total Wealth</Text>
              <Text style={styles.portfolioValue}>${totalWealth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
              {snapshots.length > 0 && (
                <View style={[styles.pnlBox, { marginTop: 4 }]}>
                  {portfolioDelta >= 0 ? <TrendingUp size={14} color="#10b981" /> : <TrendingDown size={14} color="#ef4444" />}
                  <Text style={{ color: portfolioDelta >= 0 ? '#10b981' : '#ef4444', fontSize: 13, fontWeight: '600' }}>
                    {portfolioDelta >= 0 ? '+' : ''}${portfolioDelta.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} since last trade
                  </Text>
                </View>
              )}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.portfolioLabel}>Unrealized P&L</Text>
              <View style={styles.pnlBox}>
                {unrealizedPnL >= 0 ? <TrendingUp size={16} color="#10b981" /> : <TrendingDown size={16} color="#ef4444" />}
                <Text style={[styles.pnlValue, { color: unrealizedPnL >= 0 ? '#10b981' : '#ef4444' }]}>
                  {unrealizedPnL >= 0 ? '+' : ''}${unrealizedPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.expandBtn} 
            onPress={() => setIsPortfolioExpanded(!isPortfolioExpanded)}
          >
            <Wallet size={14} color="#94a3b8" />
            <Text style={styles.expandText}>
              {isPortfolioExpanded ? 'Hide Positions' : 'View Open Positions'}
            </Text>
            {isPortfolioExpanded ? <ChevronUp size={14} color="#94a3b8" /> : <ChevronDown size={14} color="#94a3b8" />}
          </TouchableOpacity>

          {isPortfolioExpanded && (
            <View style={styles.positionsList}>
              {Object.keys(portfolio).length === 0 ? (
                <Text style={styles.emptyText}>No active positions.</Text>
              ) : (
                Object.entries(portfolio).map(([sym, hold]) => {
                  const currentPrc = marketPrices[sym] || 0;
                  const value = hold.quantity * currentPrc;
                  const pnl = (currentPrc - hold.averageCost) * hold.quantity;
                  return (
                    <View key={sym} style={styles.positionRow}>
                      <View>
                        <Text style={styles.posSymbol}>{sym}</Text>
                        <Text style={styles.posQty}>{hold.quantity} @ ${hold.averageCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.posValue}>${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                        <Text style={[styles.posPnl, { color: pnl >= 0 ? '#10b981' : '#ef4444' }]}>
                          {pnl >= 0 ? '+' : ''}${pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, activeTab === 'Budget' && styles.toggleActive]}
            onPress={() => setActiveTab('Budget')}
          >
            <Flame size={16} color={activeTab === 'Budget' ? "#ffffff" : "#94a3b8"} />
            <Text style={activeTab === 'Budget' ? styles.toggleTextActive : styles.toggleTextInActive}>Budget</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, activeTab === 'Invest' && styles.toggleActive]}
            onPress={() => setActiveTab('Invest')}
          >
            <ChartIcon size={16} color={activeTab === 'Invest' ? "#ffffff" : "#94a3b8"} />
            <Text style={activeTab === 'Invest' ? styles.toggleTextActive : styles.toggleTextInActive}>Invest</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'Budget' ? (
          <>
            <View style={styles.slidersCard}>
              <View style={styles.sliderRow}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sliderLabel}>Monthly Income</Text>
                  <Text style={styles.sliderValue}>Rp {monthlyIncome.toLocaleString('id-ID')}</Text>
                </View>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={1000000}
                  maximumValue={20000000}
                  step={250000}
                  value={monthlyIncome}
                  onValueChange={setMonthlyIncome}
                  minimumTrackTintColor="#0ea5e9"
                  maximumTrackTintColor="#1e2f47"
                  thumbTintColor="#ffffff"
                />
              </View>

              <View style={styles.sliderRow}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sliderLabel}>Savings Target</Text>
                  <Text style={styles.sliderValue}>{savingsRate}%</Text>
                </View>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0}
                  maximumValue={100}
                  step={1}
                  value={savingsRate}
                  onValueChange={setSavingsRate}
                  minimumTrackTintColor="#0ea5e9"
                  maximumTrackTintColor="#1e2f47"
                  thumbTintColor="#ffffff"
                />
              </View>

              <View style={styles.sliderRow}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sliderLabel}>Monthly Expenses</Text>
                  <Text style={styles.sliderValue}>Rp {monthlyExpenses.toLocaleString('id-ID')}</Text>
                </View>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderFill, { width: `${100 - savingsRate}%`, backgroundColor: '#ef4444' }]} />
                </View>
              </View>
            </View>

            <View style={styles.projectionCard}>
              <Text style={styles.projectionLabel}>Projected Monthly Savings</Text>
              <Text style={styles.projectionValue}>Rp {projectedSavings.toLocaleString('id-ID')}</Text>
              <View style={styles.trackBox}>
                <CheckSquare size={14} color={isBudgetProfitable ? "#10b981" : "#ef4444"} />
                <Text style={styles.trackText}>
                  {isBudgetProfitable ? `On track - Saving ${savingsRate}% is healthy` : `Warning - Saving only ${savingsRate}% is risky`}
                </Text>
              </View>
              <VisualMetaphors isProfitable={isBudgetProfitable} />
            </View>
          </>
        ) : (
          <View style={styles.investCard}>
            <View style={styles.investHeader}>
              <View>
                <Text style={styles.investSymbol}>{symbol}</Text>
                <Text style={styles.investName}>Bitcoin / USD</Text>
              </View>
              <Text style={styles.investPrice}>
                {currentPrice > 0 ? `$${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'Fetching...'}
              </Text>
            </View>

            <View style={styles.chartWrapper}>
              <RealtimeChart />
            </View>

            <View style={styles.tradeControls}>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="decimal-pad"
                  value={quantityStr}
                  onChangeText={setQuantityStr}
                />
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Cost</Text>
                <Text style={styles.summaryValue}>${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Buying Power</Text>
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
                  <Text style={styles.holdingSubText}>Holding {holding.quantity} BTC at Avg Cost: ${holding.averageCost.toLocaleString()}</Text>
                </View>
              )}
            </View>

            <View style={styles.learningSection}>
              <ContextualTooltip
                term="Market Order"
                screenContext="LabInvest"
                explanation="A market order executes immediately at the current live price you see above."
                metaphor="You're walking into an auction and saying 'I'll take it for whatever the current bid is right now!'"
              >
                You are executing a Market Order.
              </ContextualTooltip>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1626' },
  container: { padding: 24, paddingTop: 48 },
  header: { marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '800', color: '#ffffff', fontFamily: 'serif', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#64748b' },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#142337',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
    borderRadius: 6,
  },
  toggleActive: { backgroundColor: '#147684' },
  toggleTextActive: { color: '#ffffff', fontWeight: '600' },
  toggleTextInActive: { color: '#94a3b8', fontWeight: '500' },
  slidersCard: {
    backgroundColor: '#142337',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  sliderRow: { marginBottom: 20 },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sliderLabel: { color: '#94a3b8', fontSize: 14 },
  sliderValue: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  sliderTrack: { height: 4, backgroundColor: '#1e2f47', borderRadius: 2, position: 'relative' },
  sliderFill: { height: '100%', backgroundColor: '#0ea5e9', borderRadius: 2 },
  sliderThumb: {
    width: 12, height: 12, borderRadius: 6, backgroundColor: '#ffffff',
    position: 'absolute', top: -4, marginLeft: -6,
  },
  projectionCard: {
    backgroundColor: '#142337',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  projectionLabel: { color: '#94a3b8', fontSize: 13, marginBottom: 8 },
  projectionValue: { fontSize: 36, fontWeight: '700', color: '#10b981', marginBottom: 12 },
  trackBox: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  trackText: { color: '#94a3b8', fontSize: 12 },
  investCard: {
    backgroundColor: '#142337',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  investHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  investSymbol: { fontSize: 24, fontWeight: '800', color: '#ffffff' },
  investName: { fontSize: 14, color: '#64748b' },
  investPrice: { fontSize: 24, fontWeight: '700', color: '#10b981' },
  chartWrapper: {
    marginVertical: 16,
    marginHorizontal: -20,
    minHeight: 220,
  },
  tradeControls: {
    marginTop: 8,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    marginBottom: 8,
  },
  summaryLabel: { color: '#94a3b8', fontSize: 14 },
  summaryValue: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyBtn: { backgroundColor: '#10b981' },
  sellBtn: { backgroundColor: '#ef4444' },
  disabledBtn: { opacity: 0.5 },
  actionBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  holdingInfo: {
    marginTop: 16,
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e2f47',
  },
  holdingSubText: { color: '#64748b', fontSize: 13 },
  learningSection: { marginTop: 24 },
  portfolioCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1e2f47',
  },
  portfolioTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  portfolioLabel: { color: '#94a3b8', fontSize: 13, marginBottom: 4 },
  portfolioValue: { color: '#e2e8f0', fontSize: 24, fontWeight: '700' },
  pnlBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pnlValue: { fontSize: 16, fontWeight: '700' },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: '#1e2f47',
    borderRadius: 8,
  },
  expandText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  positionsList: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e2f47',
    gap: 12,
  },
  emptyText: { color: '#64748b', fontSize: 13, textAlign: 'center', fontStyle: 'italic' },
  positionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  posSymbol: { color: '#e2e8f0', fontSize: 15, fontWeight: '600' },
  posQty: { color: '#64748b', fontSize: 12 },
  posValue: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  posPnl: { fontSize: 12, fontWeight: '600' },
});
