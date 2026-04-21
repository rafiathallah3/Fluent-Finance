# Fluent Finance 💹

A premium, interactive financial literacy mobile application built with **Expo** and **React Native**. Fluent Finance aims to bridge the gap between complex financial markets and everyday understanding through real-time data, sandbox environments, and contextual educational scaffolding.

## 🚀 Key Features

### 🧪 Money Lab
A dedicated sandbox environment where users can practice financial management without real-world consequences.
- **Dynamic Budgeting**: Interactive sliders for income and savings targets with real-time visual feedback on expense ratios.
- **Paper Trading**: Buy and sell assets (e.g., Bitcoin) using a virtual cash balance to understand market dynamics.

### 📊 Real-time Market Data & Charts
- **Interactive Candlestick Charts**: Powered by `react-native-wagmi-charts`, providing a professional-grade trading visualization experience.
- **Live Price Updates**: Real-time asset price tracking and portfolio valuation.
- **Portfolio Tracking**: Holistic view of total wealth, cash balance, and unrealized P&L across all positions.

### 🎓 Educational Scaffolding
- **Contextual Tooltips**: Immediate explanations of complex financial terms (e.g., "Market Order", "Unrealized P&L") right where they appear.
- **Visual Metaphors**: Simplified visual representations of financial health to make abstract concepts intuitive.
- **Journey Tracking**: A structured roadmap for users to progress from financial basics to advanced investing.

### 🔍 Research Telemetry
Integrated telemetry system to evaluate the effectiveness of contextual scaffolding in financial education.
- Tracks tool-tip engagement and trading behavior.
- Provides data-driven insights into how users learn and interact with financial tools.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (Link-based navigation)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Charts**: [React Native Wagmi Charts](https://github.com/coinjar/react-native-wagmi-charts)
- **Animations**: [React Native Reanimated](https://docs.expo.dev/versions/latest/sdk/reanimated/)
- **Icons**: [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native)
- **Theming**: Premium dark-mode UI with consistent design tokens.

## 📦 Getting Started

### Prerequisites
- Node.js (Late LTS)
- npm or yarn
- Expo Go app on your mobile device (optional, for physical device testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FluentFinance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

- Press **`a`** for Android emulator.
- Press **`i`** for iOS simulator.
- Press **`w`** for web version.
- Scan the QR code with the **Expo Go** app to run on a physical device.

## 📂 Project Structure

```text
FluentFinance/
├── app/                # Expo Router pages
│   ├── (tabs)/         # Main tab-based navigation
│   │   ├── index.tsx   # Portfolio Overview
│   │   ├── lab.tsx     # Money Lab (Budgeting & Investing)
│   │   └── market.tsx  # Market Insights
│   └── asset/          # Detailed asset views
├── components/         # Reusable UI components
│   ├── RealtimeChart.tsx
│   └── ContextualTooltip.tsx
├── store/              # Zustand global state (Trading, UI)
├── hooks/              # Custom hooks (Theming, Layout)
├── utils/              # Helper functions & Telemetry
└── assets/             # Images, fonts, and static resources
```

---

