import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from '@/src/providers/QueryProvider';
import { AppNavigator } from '@/src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </QueryProvider>
    </SafeAreaProvider>
  );
}
