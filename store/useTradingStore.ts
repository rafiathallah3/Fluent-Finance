import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** Round to N decimal places to avoid IEEE 754 artifacts (e.g. 0.1+0.2 = 0.30000000000000004) */
const roundDecimal = (n: number, dp = 8): number => Math.round(n * 10 ** dp) / 10 ** dp;

const DEFAULT_CASH_BALANCE = 10000;

export interface Holding {
  quantity: number;
  averageCost: number;
}

export type Portfolio = Record<string, Holding>;

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  quantity: number;
  price: number;
  totalCost: number;
  date: string;
}

export interface Snapshot {
  timestamp: string;
  totalWealth: number;
}

interface TradingState {
  cashBalance: number;
  portfolio: Portfolio;
  unrealizedPnL: number;
  marketPrices: Record<string, number>; 
  snapshots: Snapshot[];
  transactionHistory: Transaction[];
  
  // Actions
  updateMarketPrice: (symbol: string, price: number) => void;
  buyAsset: (symbol: string, quantity: number, price: number) => boolean;
  sellAsset: (symbol: string, quantity: number, price: number) => boolean;
  calculatePnL: () => void;
  takeSnapshot: () => void;
  getPortfolioDelta: () => number;
  resetAccount: (startingBalance?: number) => void;
}

export const useTradingStore = create<TradingState>()(
  persist(
    (set, get) => ({
      cashBalance: DEFAULT_CASH_BALANCE, // Start with $10,000 for paper trading
      portfolio: {},
      unrealizedPnL: 0,
      marketPrices: {},
      snapshots: [],
      transactionHistory: [],

      takeSnapshot: () => {
        const { cashBalance, portfolio, marketPrices, snapshots } = get();
        let portfolioValue = 0;
        Object.entries(portfolio).forEach(([sym, hold]) => {
          const price = marketPrices[sym] || hold.averageCost;
          portfolioValue += hold.quantity * price;
        });
        
        const totalWealth = cashBalance + portfolioValue;
        
        set({
          snapshots: [
            ...snapshots,
            { timestamp: new Date().toISOString(), totalWealth }
          ]
        });
      },

      getPortfolioDelta: () => {
        const { cashBalance, portfolio, marketPrices, snapshots } = get();
        if (snapshots.length === 0) return 0;
        
        let portfolioValue = 0;
        Object.entries(portfolio).forEach(([sym, hold]) => {
          const price = marketPrices[sym] || hold.averageCost;
          portfolioValue += hold.quantity * price;
        });
        const currentWealth = cashBalance + portfolioValue;
        const lastSnapshotWealth = snapshots[snapshots.length - 1].totalWealth;
        
        return currentWealth - lastSnapshotWealth;
      },

      updateMarketPrice: (symbol, price) => {
        set((state) => ({
          marketPrices: { ...state.marketPrices, [symbol]: price },
        }));
        get().calculatePnL();
      },

      buyAsset: (symbol, quantity, price) => {
        const cost = roundDecimal(quantity * price);
        const { cashBalance, portfolio, takeSnapshot } = get();
        
        if (cashBalance < cost) {
          return false; // Insufficient funds
        }

        const existingHolding = portfolio[symbol] || { quantity: 0, averageCost: 0 };
        const totalCost = roundDecimal(existingHolding.quantity * existingHolding.averageCost + cost);
        const newQuantity = roundDecimal(existingHolding.quantity + quantity);
        const newAverageCost = roundDecimal(totalCost / newQuantity);

        const transaction: Transaction = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          type: 'BUY',
          symbol,
          quantity,
          price,
          totalCost: cost,
          date: new Date().toISOString(),
        };

        set((state) => ({
          cashBalance: roundDecimal(state.cashBalance - cost),
          portfolio: {
            ...state.portfolio,
            [symbol]: {
              quantity: newQuantity,
              averageCost: newAverageCost,
            },
          },
          transactionHistory: [transaction, ...state.transactionHistory],
        }));

        get().calculatePnL();
        takeSnapshot();
        return true;
      },

      sellAsset: (symbol, quantity, price) => {
        const { portfolio, takeSnapshot } = get();
        const holding = portfolio[symbol];

        if (!holding || holding.quantity < quantity) {
          return false; // Insufficient assets
        }

        const revenue = roundDecimal(quantity * price);

        const transaction: Transaction = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          type: 'SELL',
          symbol,
          quantity,
          price,
          totalCost: revenue,
          date: new Date().toISOString(),
        };

        set((state) => {
          const newQuantity = roundDecimal(holding.quantity - quantity);
          const newPortfolio = { ...state.portfolio };

          if (newQuantity === 0) {
            delete newPortfolio[symbol];
          } else {
            newPortfolio[symbol] = {
              quantity: newQuantity,
              averageCost: holding.averageCost,
            };
          }

          return {
            cashBalance: roundDecimal(state.cashBalance + revenue),
            portfolio: newPortfolio,
            transactionHistory: [transaction, ...state.transactionHistory],
          };
        });

        get().calculatePnL();
        takeSnapshot();
        return true;
      },

      calculatePnL: () => {
        set((state) => {
          let pnl = 0;
          Object.entries(state.portfolio).forEach(([symbol, holding]) => {
            const currentPrice = state.marketPrices[symbol];
            if (currentPrice) {
              pnl += (currentPrice - holding.averageCost) * holding.quantity;
            }
          });
          return { unrealizedPnL: roundDecimal(pnl) };
        });
      },

      resetAccount: (startingBalance?: number) => {
        set({
          cashBalance: startingBalance ?? DEFAULT_CASH_BALANCE,
          portfolio: {},
          unrealizedPnL: 0,
          snapshots: [],
          transactionHistory: [],
        });
      },
    }),
    {
      name: 'fluentfinance-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        cashBalance: state.cashBalance, 
        portfolio: state.portfolio,
        snapshots: state.snapshots,
        transactionHistory: state.transactionHistory,
        marketPrices: state.marketPrices,
      }),
    }
  )
);
