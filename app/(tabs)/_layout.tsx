import { Tabs } from 'expo-router';
import { Home, BookOpen, FlaskConical, LineChart, Map } from 'lucide-react-native';

import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0b1626',
          borderTopWidth: 0,
          elevation: 0,
          minHeight: Platform.OS === 'android' ? 64 : 80,
          paddingBottom: Platform.OS === 'android' ? 12 : 24,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#64748b',
        sceneStyle: { backgroundColor: '#0b1626' }, // For Expo Router v3+
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="lab"
        options={{
          title: 'Lab',
          tabBarIcon: ({ color }) => <FlaskConical size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: 'Market',
          tabBarIcon: ({ color }) => <LineChart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: 'Journey',
          tabBarIcon: ({ color }) => <Map size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
