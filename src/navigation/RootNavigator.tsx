/**
 * @file RootNavigator.tsx
 * @module navigation/RootNavigator
 * @description Flat single-stack navigator that owns the NavigationContainer.
 *
 * All screens live in one stack with `initialRouteName="Splash"`. The Splash
 * screen reads the persisted session from AsyncStorage and then calls
 * `navigation.replace()` to send the user to the correct screen — avoiding
 * the flash that comes from re-rendering a conditional navigator.
 *
 * ── When to use RootNavigator vs AppNavigator ────────────────────────────────
 *   RootNavigator — Preferred for simpler apps or when deep-linking requires
 *                   a flat screen hierarchy.
 *   AppNavigator  — Preferred when guard-based sub-navigators are needed
 *                   (mirrors the web AuthRoute / FlowRoute pattern).
 *
 * ── Screen list ──────────────────────────────────────────────────────────────
 *   Splash          — Boot screen; decides where to redirect
 *   Login           — Unauthenticated entry point
 *   InstituteSelect — Mid-login institute picker
 *   RoleSelect      — Mid-login role picker
 *   Dashboard       — Main authenticated screen
 *
 * ── Prerequisites ────────────────────────────────────────────────────────────
 *   npm install @react-navigation/native @react-navigation/native-stack
 *   npm install react-native-screens react-native-safe-area-context
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

import SplashScreen          from '../screens/SplashScreen';
import PublicLoginScreen     from '../screens/auth/PublicLoginScreen';
import InstituteSelectScreen from '../screens/auth/InstituteSelectScreen';
import RoleSelectScreen      from '../screens/auth/RoleSelectScreen';
import DashboardScreen       from '../screens/DashboardScreen';

// ---------------------------------------------------------------------------
// Route param types
// Declare params for every screen here so TypeScript catches navigation errors.
// ---------------------------------------------------------------------------
export type RootStackParamList = {
  /** Boot screen — no params needed */
  Splash: undefined;
  /** Login screen — no params needed */
  Login: undefined;
  /** Institute picker — no params needed (list loaded from context) */
  InstituteSelect: undefined;
  /** Role picker — receives the selected institute */
  RoleSelect: { institute?: object };
  /** Main dashboard — no params needed */
  Dashboard: undefined;
};

// ---------------------------------------------------------------------------
// Navigator setup
// ---------------------------------------------------------------------------
const Stack = createNativeStackNavigator<RootStackParamList>();

/** All screens hide the native header — each screen manages its own header UI. */
const SCREEN_OPTIONS: NativeStackNavigationOptions = {
  headerShown: false,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const RootNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={SCREEN_OPTIONS}
    >
      {/* Boot — reads persisted session and redirects to the correct screen */}
      <Stack.Screen name="Splash"          component={SplashScreen} />

      {/* Auth flow */}
      <Stack.Screen name="Login"           component={PublicLoginScreen} />
      <Stack.Screen name="InstituteSelect" component={InstituteSelectScreen} />
      <Stack.Screen name="RoleSelect"      component={RoleSelectScreen} />

      {/* Main app */}
      <Stack.Screen name="Dashboard"       component={DashboardScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default RootNavigator;