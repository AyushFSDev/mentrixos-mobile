/**
 * @file AppNavigator.tsx
 * @module navigation/AppNavigator
 * @description Mobile equivalent of the web AppRoutes.js — defines all screens
 * and route guards using React Navigation v6 native stack.
 *
 * ── Route guard strategy ─────────────────────────────────────────────────────
 * Guards are implemented via conditional navigator rendering driven by
 * `authState` from AuthContext — mirroring the web AuthRoute / FlowRoute /
 * DashboardRoute guard pattern.
 *
 * authState values:
 *   'loading'        — Checking AsyncStorage on boot; shows SplashScreen.
 *   'unauthenticated'— No session found; shows AuthNavigator (Login).
 *   'flow'           — pre_context_token present; shows FlowNavigator.
 *   'authenticated'  — Full access_token present; shows AppNavigator (Dashboard).
 *
 * ── Stack structure ──────────────────────────────────────────────────────────
 *   AuthStack — Login
 *   FlowStack — InstituteSelect → RoleSelect
 *   AppStack  — Dashboard
 *
 * ── Prerequisites ────────────────────────────────────────────────────────────
 *   npm install @react-navigation/native @react-navigation/native-stack
 *   npm install react-native-screens react-native-safe-area-context
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../hooks/useAuth';

// Screens
import SplashScreen           from '../screens/SplashScreen';
import PublicLoginScreen      from '../screens/auth/PublicLoginScreen';
import InstituteSelectScreen  from '../screens/auth/InstituteSelectScreen';
import RoleSelectScreen       from '../screens/auth/RoleSelectScreen';
import DashboardScreen        from '../screens/DashboardScreen';

// ---------------------------------------------------------------------------
// Route name constants
// Import these wherever a screen name string is needed to avoid typos.
// ---------------------------------------------------------------------------
export const ROUTES = {
  SPLASH:           'Splash',
  LOGIN:            'Login',
  INSTITUTE_SELECT: 'InstituteSelect',
  ROLE_SELECT:      'RoleSelect',
  DASHBOARD:        'Dashboard',
} as const;

// ---------------------------------------------------------------------------
// Shared screen options
// All screens manage their own header UI — the native header is hidden globally.
// ---------------------------------------------------------------------------
const SCREEN_OPTIONS = {
  headerShown: false,
  animation:   'slide_from_right',
} as const;

const Stack = createNativeStackNavigator();

// ---------------------------------------------------------------------------
// AuthNavigator
// Shown to unauthenticated users — mirrors the web AuthRoute guard.
// ---------------------------------------------------------------------------
const AuthNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
    <Stack.Screen name={ROUTES.LOGIN} component={PublicLoginScreen} />
  </Stack.Navigator>
);

// ---------------------------------------------------------------------------
// FlowNavigator
// Shown during the mid-login institute/role selection phase.
// Mirrors the web FlowRoute guard — requires a valid pre_context_token.
// InstituteSelect is the entry point; RoleSelect is pushed on top when needed.
// ---------------------------------------------------------------------------
const FlowNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
    <Stack.Screen name={ROUTES.INSTITUTE_SELECT} component={InstituteSelectScreen} />
    <Stack.Screen name={ROUTES.ROLE_SELECT}      component={RoleSelectScreen} />
  </Stack.Navigator>
);

// ---------------------------------------------------------------------------
// AppNavigator
// Shown to fully authenticated users — mirrors the web DashboardRoute guard.
// Requires a valid access_token.
// ---------------------------------------------------------------------------
const AppNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
    <Stack.Screen name={ROUTES.DASHBOARD} component={DashboardScreen} />
  </Stack.Navigator>
);

// ---------------------------------------------------------------------------
// RootNavigator
// Reads authState and renders the correct sub-navigator.
// This is the single point of truth for all route guards.
// ---------------------------------------------------------------------------
const RootNavigator: React.FC = () => {
  const { authState } = useAuth();

  // Show splash while AsyncStorage session check is in progress.
  if (authState === 'loading') {
    return (
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
      </Stack.Navigator>
    );
  }

  if (authState === 'authenticated') return <AppNavigator />;
  if (authState === 'flow')         return <FlowNavigator />;
  return <AuthNavigator />;
};

// ---------------------------------------------------------------------------
// Navigation root export
// Wrap with NavigationContainer here so no other component needs to import it.
// ---------------------------------------------------------------------------
const Navigation: React.FC = () => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);

export default Navigation;