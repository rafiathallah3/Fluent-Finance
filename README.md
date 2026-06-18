# Fluent Finance

A premium, interactive financial literacy mobile application built with Expo and React Native. Fluent Finance aims to bridge the gap between complex financial markets and everyday understanding through real-time data, sandbox environments, and contextual educational scaffolding.

## Key Features

### Money Lab
A dedicated sandbox environment where users can practice financial management without real-world consequences.
- **Dynamic Budgeting**: Interactive sliders for income and savings targets with real-time visual feedback on expense ratios.
- **Paper Trading**: Buy and sell assets (e.g., Bitcoin) using a virtual cash balance to understand market dynamics.

### Real-time Market Data & Charts
- **Interactive Candlestick Charts**: Powered by react-native-wagmi-charts, providing a professional-grade trading visualization experience.
- **Live Price Updates**: Real-time asset price tracking and portfolio valuation.
- **Portfolio Tracking**: Holistic view of total wealth, cash balance, and unrealized P&L across all positions.
- **Sentiment Gauge**: A clean, Svg-based visual market sentiment gauge displaying Fear & Greed index status using a blue gradient arc and animated indicator.

### DeepSeek AI Chat Assistant
A floating chat bubble integrated across all screens powered by the DeepSeek API.
- **Interactive Dragging**: Supports full drag-and-drop panning, snapping to the left or right screen edge with spring animations upon release.
- **Markdown Rendering**: Formats responses with Markdown, rendering headers, bolding, bullet/numbered lists, and monospace inline code blocks.

### Onboarding & User Manual
- **First-Time Guided App Tour**: An interactive, step-by-step walkthrough explaining layout elements, simulated environments, and core navigation buttons.
- **Comprehensive User Manual**: A detailed guide accessible directly in Settings with accordion-style layout panels.
- **Custom Accent Themes**: Choice of five themes (Ocean Cyan, Forest Emerald, Royal Purple, Sunset Amber, Crimson Rose) that propagate dynamically to all layouts, buttons, and chat widgets.
- **Mock Login System**: Standard secure login accepting any credentials, customizing user profiles instantly.

### Contextual Scaffolding
- **Contextual Tooltips**: Immediate explanations of complex financial terms (e.g., "Market Order", "Unrealized P&L") right where they appear.
- **Visual Metaphors**: Simplified visual representations of financial health to make abstract concepts intuitive.
- **Journey Tracking**: A structured roadmap for users to progress from financial basics to advanced investing.

### Research Telemetry
Integrated telemetry system to evaluate the effectiveness of contextual scaffolding in financial education.
- Tracks tool-tip engagement and trading behavior.
- Provides data-driven insights into how users learn and interact with financial tools.

## Tech Stack

- **Framework**: Expo (React Native)
- **Routing**: Expo Router (Link-based drawer and tabs navigation)
- **State Management**: Zustand
- **Charts**: React Native Wagmi Charts
- **Animations**: React Native Reanimated
- **Icons**: Lucide React Native
- **Theming**: Premium dark-mode UI with consistent design tokens.

## Getting Started

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

- Press **a** for Android emulator.
- Press **i** for iOS simulator.
- Press **w** for web version.
- Scan the QR code with the Expo Go app to run on a physical device.

## Project Structure

```text
FluentFinance/
├── app/                  # Expo Router pages
│   ├── (drawer)/         # Side drawer navigation
│   │   ├── (tabs)/       # Core bottom tabs (Overview, Learn, Lab, Market, Journey)
│   │   ├── _layout.tsx   # Drawer container configurations
│   │   ├── settings.tsx  # Color preferences, user manual, resets
│   │   └── terms.tsx     # Terms of service
│   ├── asset/            # Detailed asset views
│   ├── _layout.tsx       # Root layout containing app routes
│   └── login.tsx         # Welcome credentials dashboard
├── components/           # Reusable UI components
│   ├── FloatingChat.tsx  # DeepSeek AI Assistant bubble
│   ├── AppTourModal.tsx  # Onboarding walkthrough modal
│   ├── CustomText.tsx    # Custom Poppins font typography wrapper
│   └── ContextualTooltip.tsx
├── store/                # Zustand global state (Auth, Theme, Progress, Trading)
├── hooks/                # Custom hooks (Theming, Layout)
├── utils/                # Helper functions & Telemetry
└── assets/               # Images, banners, and static resources
```

---
