import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { router, usePathname } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { BookOpen, FlaskConical, Home, LineChart, Map, Settings, User } from 'lucide-react-native';
import { Image, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomText } from '../../components/CustomText';
import { FloatingChat } from '../../components/FloatingChat';
import { useThemeStore } from '../../store/useThemeStore';

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { currentTheme } = useThemeStore();
  const activeColor = currentTheme.primary;

  return (
    <View style={{ flex: 1, backgroundColor: '#0b1626' }}>
      <DrawerContentScrollView {...props}>
        <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#1e293b', marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('../../assets/images/icon.png')} style={{ width: 32, height: 32, marginRight: 12, borderRadius: 8 }} />
          <CustomText weight="bold" style={{ color: '#fff', fontSize: 22 }}>Fluent Finance</CustomText>
        </View>

        {/* Custom Tab Links */}
        <DrawerItem
          label={() => <CustomText style={{ color: pathname === '/' ? activeColor : '#64748b' }}>Home</CustomText>}
          icon={({ color }) => <Home size={24} color={pathname === '/' ? activeColor : '#64748b'} />}
          onPress={() => router.push('/')}
        />
        <DrawerItem
          label={() => <CustomText style={{ color: pathname === '/learn' ? activeColor : '#64748b' }}>Learn</CustomText>}
          icon={({ color }) => <BookOpen size={24} color={pathname === '/learn' ? activeColor : '#64748b'} />}
          onPress={() => router.push('/learn')}
        />
        <DrawerItem
          label={() => <CustomText style={{ color: pathname === '/lab' ? activeColor : '#64748b' }}>Lab</CustomText>}
          icon={({ color }) => <FlaskConical size={24} color={pathname === '/lab' ? activeColor : '#64748b'} />}
          onPress={() => router.push('/lab')}
        />
        <DrawerItem
          label={() => <CustomText style={{ color: pathname === '/market' ? activeColor : '#64748b' }}>Market</CustomText>}
          icon={({ color }) => <LineChart size={24} color={pathname === '/market' ? activeColor : '#64748b'} />}
          onPress={() => router.push('/market')}
        />
        <DrawerItem
          label={() => <CustomText style={{ color: pathname === '/journey' ? activeColor : '#64748b' }}>Journey</CustomText>}
          icon={({ color }) => <Map size={24} color={pathname === '/journey' ? activeColor : '#64748b'} />}
          onPress={() => router.push('/journey')}
        />

        {/* Regular Drawer Items (Settings) */}
        <View style={{ marginTop: 10, borderTopWidth: 1, borderTopColor: '#1e293b', paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 20, paddingBottom: insets.bottom > 0 ? insets.bottom + 10 : 20, borderTopWidth: 1, borderTopColor: '#1e293b' }}>
        <TouchableOpacity onPress={() => router.push('/(drawer)/terms')}>
          <CustomText style={{ color: '#94a3b8', fontSize: 14 }}>Terms & Policy</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  const { currentTheme } = useThemeStore();

  return (
    <View style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0b1626',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#1e293b',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
        },
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 16 }} onPress={() => router.push('/profile' as any)}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        ),
        drawerStyle: {
          backgroundColor: '#0b1626',
        },
        drawerActiveTintColor: currentTheme.primary,
        drawerInactiveTintColor: '#64748b',
        drawerLabelStyle: {
          fontFamily: 'Poppins-Medium',
        },
        sceneStyle: { backgroundColor: '#0f172a' }
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerItemStyle: { display: 'none' }, // We render custom items for tabs above
          headerShown: true, // We want the Drawer to handle the header for tabs
          title: 'Fluent Finance',
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Settings',
          title: 'Settings',
          drawerIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="terms"
        options={{
          drawerLabel: 'Terms & Policy',
          title: 'Terms & Policy',
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
    <FloatingChat />
  </View>
);
}
