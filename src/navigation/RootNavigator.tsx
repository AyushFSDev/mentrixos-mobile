// src/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import PublicLoginScreen from '../screens/auth/PublicLoginScreen';
import InstituteSelectScreen from '../screens/auth/InstituteSelectScreen';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';
import DashboardScreen from '../screens/DashboardScreen';

// ---------------------------------------------------------------------------
// Route param types
// ---------------------------------------------------------------------------
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  InstituteSelect: undefined;
  RoleSelect: { institute?: object };
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={screenOptions}
      >
        {/* Boot — decides where to redirect */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {/* Auth flow */}
        <Stack.Screen name="Login" component={PublicLoginScreen} />
        <Stack.Screen name="InstituteSelect" component={InstituteSelectScreen} />
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />

        {/* Main app */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;