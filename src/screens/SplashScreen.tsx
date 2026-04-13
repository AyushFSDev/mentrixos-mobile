import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { isAuthLoading } = useAuth();
  const { loaded: themeLoaded, colors } = useTheme();
  const hasNavigated = useRef<boolean>(false);

  useEffect(() => {
    if (isAuthLoading || !themeLoaded || hasNavigated.current) return;

    const bootstrap = async (): Promise<void> => {
      hasNavigated.current = true;

      try {
        const [accessToken, preContextToken, storedUser] = await Promise.all([
          AsyncStorage.getItem('access_token'),
          AsyncStorage.getItem('pre_context_token'),
          AsyncStorage.getItem('user'),
        ]);

        if (accessToken && storedUser) {
          navigation.replace('Dashboard');
          return;
        }

        if (preContextToken && storedUser) {
          navigation.replace('InstituteSelect');
          return;
        }

        navigation.replace('Login');
      } catch {
        navigation.replace('Login');
      }
    };

    bootstrap();
  }, [isAuthLoading, themeLoaded, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.accentBlue} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});