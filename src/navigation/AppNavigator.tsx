// src/navigation/AppNavigator.js
// ─────────────────────────────────────────────────────────────────────────────
// Mobile equivalent of web AppRoutes.js.
// Uses React Navigation v6 — Stack Navigator.
//
// Route guards are handled via conditional rendering of navigators
// (AuthStack vs AppStack) based on auth state from AuthContext —
// same logic as web AuthRoute / FlowRoute / DashboardRoute guards.
//
// Screens:
//   AuthStack  → PublicLoginScreen
//   FlowStack  → InstituteSelectScreen, RoleSelectScreen
//   AppStack   → DashboardScreen
//
// Install deps:
//   npm install @react-navigation/native @react-navigation/native-stack
//   npm install react-native-screens react-native-safe-area-context
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../hooks/useAuth';

// Screens
import SplashScreen from '../screens/SplashScreen';
import PublicLoginScreen from '../screens/auth/PublicLoginScreen';
import InstituteSelectScreen from '../screens/auth/InstituteSelectScreen';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createNativeStackNavigator();

// ─── Shared screen options (no header — all screens manage their own UI) ─────
const screenOptions = {
  headerShown: false,
  animation: 'slide_from_right',
};

// ─── Auth Stack: unauthenticated users ───────────────────────────────────────
// Mirrors web AuthRoute — only accessible when NOT logged in.
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Login" component={PublicLoginScreen} />
  </Stack.Navigator>
);

// ─── Flow Stack: mid-login context selection ──────────────────────────────────
// Mirrors web FlowRoute — accessible only when pre_context_token exists.
// InstituteSelect and RoleSelect are pushed/popped based on institute count.
const FlowNavigator = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="InstituteSelect" component={InstituteSelectScreen} />
    <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
  </Stack.Navigator>
);

// ─── App Stack: fully authenticated users ────────────────────────────────────
// Mirrors web DashboardRoute — requires access_token.
const AppNavigator = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
  </Stack.Navigator>
);

// ─── Root Navigator ───────────────────────────────────────────────────────────
// Decides which navigator to render based on auth state.
// authState values:
//   'loading'      → show SplashScreen (checking AsyncStorage on boot)
//   'unauthenticated' → AuthNavigator (Login)
//   'flow'         → FlowNavigator (InstituteSelect / RoleSelect)
//   'authenticated' → AppNavigator (Dashboard)
const RootNavigator = () => {
  const { authState } = useAuth();

  if (authState === 'loading') {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="Splash" component={SplashScreen} />
      </Stack.Navigator>
    );
  }

  if (authState === 'authenticated') return <AppNavigator />;
  if (authState === 'flow') return <FlowNavigator />;
  return <AuthNavigator />;
};

// ─── Root export ──────────────────────────────────────────────────────────────
const Navigation = () => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);

export default Navigation;

// ─── Route name constants (use these instead of hardcoded strings) ────────────
export const ROUTES = {
  LOGIN: 'Login',
  INSTITUTE_SELECT: 'InstituteSelect',
  ROLE_SELECT: 'RoleSelect',
  DASHBOARD: 'Dashboard',
  SPLASH: 'Splash',
};
