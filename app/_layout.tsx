import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { useTradingStore } from "../store/useTradingStore";
import { useAuthStore } from "../store/useAuthStore";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { updateMarketPrice } = useTradingStore();
  const [isReady, setIsReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
  });

  useEffect(() => {
    const prepare = async () => {
      if (!fontsLoaded && !fontError) return;

      try {
        const hasSeenWelcome = await AsyncStorage.getItem("hasSeenWelcome");
        if (hasSeenWelcome !== "true") {
          setTimeout(() => router.replace("/welcome" as any), 0);
          return;
        }

        // Check if user is logged in
        const authState = useAuthStore.getState();
        if (!authState.isLoggedIn) {
          setTimeout(() => router.replace("/login" as any), 0);
        }
      } catch (e) {
        console.warn("Failed to read welcome/auth status", e);
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    };
    prepare();
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const fetchLivePrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd",
        );
        const data = await response.json();
        if (data.bitcoin?.usd) updateMarketPrice("BTC", data.bitcoin.usd);
        if (data.ethereum?.usd) updateMarketPrice("ETH", data.ethereum.usd);
        if (data.solana?.usd) updateMarketPrice("SOL", data.solana.usd);
      } catch (error) {
        console.error("Failed to fetch live prices", error);
      }
    };

    // Initial fetch
    fetchLivePrice();

    // Poll every 15 seconds to avoid strict rate limits on free CoinGecko tier
    const interval = setInterval(fetchLivePrice, 15000);

    return () => clearInterval(interval);
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ contentStyle: { backgroundColor: "#0f172a" } }}>
        <Stack.Screen
          name="welcome"
          options={{ headerShown: false, animation: "fade" }}
        />
        <Stack.Screen
          name="login"
          options={{ headerShown: false, animation: "fade" }}
        />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen
          name="profile"
          options={{
            presentation: "modal",
            headerShown: false,
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="asset/[symbol]"
          options={{
            title: "Asset",
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
