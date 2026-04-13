/**
 * @file AppStatusBar.tsx
 * @module components/common/AppStatusBar
 * @description Themed status bar that automatically switches between
 * light and dark content based on the active theme.
 *
 * - Light theme → dark icons/text on the status bar ('dark-content')
 * - Dark theme  → light icons/text on the status bar ('light-content')
 *
 * The background color is set to `colors.background` so the status bar
 * blends seamlessly with the screen behind it on Android.
 *
 * Usage:
 *   Render once at the top of each screen (or in a shared layout component):
 *   <AppStatusBar />
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const AppStatusBar: React.FC = () => {
  const { isDark, colors } = useTheme();

  return (
    <StatusBar
      // 'light-content' = white icons (for dark backgrounds)
      // 'dark-content'  = dark icons (for light backgrounds)
      barStyle={isDark ? 'light-content' : 'dark-content'}
      // Android only — sets the status bar background color.
      // On iOS the status bar is transparent; the screen background shows through.
      backgroundColor={colors.background}
      // translucent=false keeps content below the status bar, not behind it.
      translucent={false}
    />
  );
};

export default AppStatusBar;
