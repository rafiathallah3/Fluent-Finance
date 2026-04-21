import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useTradingStore } from '../store/useTradingStore';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const { updateMarketPrice } = useTradingStore();

  useEffect(() => {
    const fetchLivePrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd');
        const data = await response.json();
        if (data.bitcoin?.usd) updateMarketPrice('BTC', data.bitcoin.usd);
        if (data.ethereum?.usd) updateMarketPrice('ETH', data.ethereum.usd);
        if (data.solana?.usd) updateMarketPrice('SOL', data.solana.usd);
      } catch (error) {
        console.error('Failed to fetch live prices', error);
      }
    };

    // Initial fetch
    fetchLivePrice();

    // Poll every 15 seconds to avoid strict rate limits on free CoinGecko tier
    const interval = setInterval(fetchLivePrice, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ contentStyle: { backgroundColor: '#0f172a' } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="asset/[symbol]" options={{ title: 'Asset', presentation: 'modal', headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
