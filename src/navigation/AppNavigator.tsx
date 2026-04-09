import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { FundListScreen, FavoritesScreen, FundDetailScreen } from '@/src/screens';
import { colors, fontSize } from '@/src/constants/theme';
import type { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTitleStyle: {
          fontSize: fontSize.lg,
          fontWeight: '600',
          color: colors.text,
        },
      }}
    >
      <Tab.Screen
        name="FundList"
        component={FundListScreen}
        options={{
          title: 'All Funds',
          tabBarLabel: 'Funds',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTitleStyle: {
            fontSize: fontSize.lg,
            fontWeight: '600',
            color: colors.text,
          },
          headerTintColor: colors.primary,
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FundDetail"
          component={FundDetailScreen}
          options={({ route }) => ({
            title: 'Fund Details',
            headerTitle: route.params.schemeName.length > 25
              ? route.params.schemeName.substring(0, 25) + '...'
              : route.params.schemeName,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
