// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Auth context
import { AuthProvider } from "./src/hooks/useAuth";
import * as Theme from './src/hooks/useTheme';

// Screens
import SplashScreen          from "./src/screens/SplashScreen";
import PublicLoginScreen     from "./src/screens/auth/PublicLoginScreen";
import InstituteSelectScreen from "./src/screens/auth/InstituteSelectScreen";
import RoleSelectScreen      from "./src/screens/auth/RoleSelectScreen";
import DashboardScreen       from "./src/screens/DashboardScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  console.log("ThemeProvider:", Theme.ThemeProvider);
  return (
    <SafeAreaProvider>
      <Theme.ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Splash"
              screenOptions={{ headerShown: false }}
            >
              {/* Boot */}
              <Stack.Screen name="Splash"           component={SplashScreen} />

              {/* Auth flow */}
              <Stack.Screen name="Login"            component={PublicLoginScreen} />
              <Stack.Screen name="InstituteSelect"  component={InstituteSelectScreen} />
              <Stack.Screen name="RoleSelect"       component={RoleSelectScreen} />

              {/* Main app */}
              <Stack.Screen name="Dashboard"        component={DashboardScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </Theme.ThemeProvider>
    </SafeAreaProvider>
  );
}