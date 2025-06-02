import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from './src/stores/authStore';
import OnboardingNavigator from './src/navigation/OnboardingNavigator';

export default function App() {
  const { isFirstLaunch, checkFirstLaunch, user, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkFirstLaunch();
    checkAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isFirstLaunch ? (
          <OnboardingNavigator />
        ) : (
          <AppNavigator />
        )}
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}