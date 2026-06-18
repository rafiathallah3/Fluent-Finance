import { Tabs } from 'expo-router';
import { Home, BookOpen, FlaskConical, LineChart, Map } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../../../store/useThemeStore';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { currentTheme } = useThemeStore();
  const bottomPadding = Platform.OS === 'android' ? Math.max(insets.bottom, 12) : 24;

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // The drawer will handle the header
        tabBarStyle: {
          backgroundColor: '#0b1626',
          borderTopWidth: 1,
          borderTopColor: '#1e293b',
          elevation: 0,
          minHeight: (Platform.OS === 'android' ? 64 : 80) + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 8,
        },
        tabBarActiveTintColor: currentTheme.primary,
        tabBarInactiveTintColor: '#64748b',
        sceneStyle: { backgroundColor: '#0f172a' },
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
