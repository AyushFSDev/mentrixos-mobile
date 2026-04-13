// App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from './src/hooks/useTheme';
import { AuthProvider }  from './src/hooks/useAuth';
import RootNavigator     from './src/navigation/RootNavigator';
import AppStatusBar      from './src/components/common/AppStatusBar';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppStatusBar />
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}