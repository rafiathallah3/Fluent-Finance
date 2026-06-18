import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lock, Sparkles, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomText as Text } from '../components/CustomText';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginScreen() {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isUserFocused, setIsUserFocused] = useState(false);
  const [isPassFocused, setIsPassFocused] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const insets = useSafeAreaInsets();

  const handleLogin = () => {
    const username = usernameInput.trim();
    const password = passwordInput.trim();

    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    login(username);
    router.replace('/(drawer)/(tabs)' as any);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={[styles.innerContainer, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
        {/* Glowing Logo Header */}
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={['#0284c7', '#0ea5e9']}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Sparkles size={36} color="#ffffff" />
          </LinearGradient>
          <Text weight="bold" style={styles.titleText}>Fluent Finance</Text>
          <Text style={styles.subtitleText}>Master finance through simulation</Text>
        </View>

        {/* Inputs Panel */}
        <View style={styles.formContainer}>
          <Text weight="semiBold" style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>Login to access your dashboard</Text>

          {/* Username Field */}
          <View style={[styles.inputWrapper, isUserFocused && styles.inputWrapperFocused]}>
            <User size={20} color={isUserFocused ? '#0ea5e9' : '#64748b'} style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="Username"
              placeholderTextColor="#64748b"
              value={usernameInput}
              onChangeText={setUsernameInput}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setIsUserFocused(true)}
              onBlur={() => setIsUserFocused(false)}
            />
          </View>

          {/* Password Field */}
          <View style={[styles.inputWrapper, isPassFocused && styles.inputWrapperFocused]}>
            <Lock size={20} color={isPassFocused ? '#0ea5e9' : '#64748b'} style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="Password"
              placeholderTextColor="#64748b"
              secureTextEntry
              value={passwordInput}
              onChangeText={setPasswordInput}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setIsPassFocused(true)}
              onBlur={() => setIsPassFocused(false)}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLogin}
            style={styles.loginBtnContainer}
          >
            <LinearGradient
              colors={['#0284c7', '#0ea5e9']}
              style={styles.loginBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text weight="bold" style={styles.loginBtnText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Info footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>For simulation, enter any credentials.</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1626',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoGradient: {
    width: 76,
    height: 76,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  titleText: {
    color: '#ffffff',
    fontSize: 26,
    marginBottom: 4,
  },
  subtitleText: {
    color: '#64748b',
    fontSize: 13,
  },
  formContainer: {
    backgroundColor: '#142337',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1e2f47',
    width: '100%',
  },
  formTitle: {
    color: '#ffffff',
    fontSize: 20,
    marginBottom: 4,
  },
  formSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 54,
  },
  inputWrapperFocused: {
    borderColor: '#0ea5e9',
  },
  inputIcon: {
    marginRight: 12,
  },
  inputField: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    height: '100%',
  },
  loginBtnContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  loginBtn: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  footerText: {
    color: '#475569',
    fontSize: 12,
  },
});
