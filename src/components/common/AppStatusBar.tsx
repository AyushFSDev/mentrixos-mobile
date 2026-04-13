import React from 'react';
import { StatusBar } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const AppStatusBar: React.FC = () => {
  const { isDark, colors } = useTheme();

  return (
    <StatusBar
      barStyle={isDark ? 'light-content' : 'dark-content'}
      backgroundColor={colors.background}
      translucent={false}
    />
  );
};

export default AppStatusBar;