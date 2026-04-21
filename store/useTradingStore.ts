import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Holding {
  quantity: number;
  averageCost: number;
}

export type Portfolio = Record<string, Holding>;

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
  
  // Actions
  updateMarketPrice: (symbol: string, price: number) => void;
  buyAsset: (symbol: string, quantity: number, price: number) => boolean;
  sellAsset: (symbol: string, quantity: number, price: number) => boolean;
  calculatePnL: () => void;
  takeSnapshot: () => void;
  getPortfolioDelta: () => number;
}

export const useTradingStore = create<TradingState>()(
  persist(
    (set, get) => ({
      cashBalance: 10000, // Start with $10,000 for paper trading
      portfolio: {},
      unrealizedPnL: 0,
      marketPrices: {},
      snapshots: [],

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
        const cost = quantity * price;
        const { cashBalance, portfolio, takeSnapshot } = get();
        
        if (cashBalance < cost) {
          return false; // Insufficient funds
        }

        const existingHolding = portfolio[symbol] || { quantity: 0, averageCost: 0 };
        const totalCost = existingHolding.quantity * existingHolding.averageCost + cost;
        const newQuantity = existingHolding.quantity + quantity;
        const newAverageCost = totalCost / newQuantity;

        set((state) => ({
          cashBalance: state.cashBalance - cost,
          portfolio: {
            ...state.portfolio,
            [symbol]: {
              quantity: newQuantity,
              averageCost: newAverageCost,
            },
          },
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

        const revenue = quantity * price;

        set((state) => {
          const newQuantity = holding.quantity - quantity;
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
            cashBalance: state.cashBalance + revenue,
            portfolio: newPortfolio,
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
          return { unrealizedPnL: pnl };
        });
      },
    }),
    {
      name: 'fluentfinance-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        cashBalance: state.cashBalance, 
        portfolio: state.portfolio,
        snapshots: state.snapshots
      }),
    }
  )
);
