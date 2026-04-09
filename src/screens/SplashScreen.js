// src/screens/SplashScreen.js

import React, { useEffect, useRef } from 'react';
import { StyleSheet, StatusBar, View, Animated, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../hooks/useTheme';
import Logo from '../components/ui/Logo';

// ─────────────────────────────────────────────────────────────────────────────
// SplashScreen Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * SplashScreen — The first screen rendered when the app launches.
 *
 * Responsibilities:
 *  - Plays a fade-in + scale-up entrance animation for the logo and brand name.
 *  - Waits 2.5 seconds (allowing the animation to complete) before checking
 *    stored authentication tokens.
 *  - Redirects the user to the appropriate screen based on token state:
 *      • `access_token` present  → Dashboard   (fully authenticated)
 *      • `pre_context_token` present → InstituteSelect (auth done, no context)
 *      • Neither token found     → Login        (unauthenticated)
 *  - Falls back to Login if AsyncStorage throws an unexpected error.
 *
 * @param {object} navigation - React Navigation prop used for screen transitions.
 */
const SplashScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();

  // ─── Animation Refs ────────────────────────────────────────────────────────
  // useRef ensures these Animated.Value instances are created only once and
  // are not re-initialised on subsequent renders.

  /** Controls the logo opacity, animating from 0 (invisible) → 1 (fully visible). */
  const fadeAnim = useRef(new Animated.Value(0)).current;

  /** Controls the logo scale, animating from 0.8 (slightly small) → 1 (natural size). */
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // ─── Bootstrap Effect ──────────────────────────────────────────────────────
  useEffect(() => {
    // ── Step 1: Start entrance animations in parallel ──────────────────────
    // Running both animations simultaneously creates a smooth "pop-in" effect.
    Animated.parallel([
      // Fade the logo in over 1 second using a linear timing curve.
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true, // Offloads animation to the native thread for 60 fps.
      }),
      // Scale the logo up with a spring for a natural, bouncy feel.
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4, // Lower friction = more bounce.
        useNativeDriver: true,
      }),
    ]).start();

    // ── Step 2: Check auth tokens and navigate ─────────────────────────────
    /**
     * Reads all relevant tokens from AsyncStorage after a minimum display
     * delay and decides which screen to navigate to.
     *
     * Token hierarchy:
     *  - `access_token`     — A fully resolved token with institute + role
     *                         context. User can go straight to the Dashboard.
     *  - `pre_context_token` — Issued after phone/email verification but before
     *                         institute/role selection. User must pick a context.
     */
    const bootstrap = async () => {
      // Enforce a minimum splash duration so the animation is always visible.
      await new Promise(resolve => setTimeout(resolve, 2500));

      try {
        const accessToken = await AsyncStorage.getItem('access_token');
        const preContextToken = await AsyncStorage.getItem('pre_context_token');
        const storedUser = await AsyncStorage.getItem('user');

        if (accessToken && storedUser) {
          // User is fully authenticated with a selected context.
          navigation.replace('Dashboard');
        } else if (preContextToken && storedUser) {
          // User is authenticated but has not yet selected an institute.
          navigation.replace('InstituteSelect');
        } else {
          // No valid session found — send the user to the login screen.
          navigation.replace('Login');
        }
      } catch {
        // AsyncStorage failed (e.g., storage quota exceeded or corruption).
        // Safely fall back to Login so the user can re-authenticate.
        navigation.replace('Login');
      }
    };

    bootstrap();
  }, [fadeAnim, scaleAnim]);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent={false}
      />

      {/* Animated wrapper — applies the fade and scale animations to all children */}
      <Animated.View
        style={[
          styles.center,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* App logo — color adapts to the active theme */}
        <Logo color={isDark ? '#FFFFFF' : '#000000'} size={100} />

        {/* Brand name row: "Mentrix" + "OS" rendered side-by-side at baseline */}
        <View style={styles.brandRow}>
          <Text style={[styles.mentrix, { color: colors.brandMentrix }]}>
            Mentrix
          </Text>
          <Text style={[styles.os, { color: colors.brandOS }]}>OS</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default SplashScreen;

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  /** Full-screen safe-area container — background color is theme-driven. */
  container: { flex: 1 },

  /** Centers logo and brand name both horizontally and vertically. */
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
   * Horizontal row for "Mentrix" and "OS" text.
   * `alignItems: 'baseline'` keeps the two words visually aligned on their
   * text baseline even if their font sizes differ in the future.
   */
  brandRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 20,
  },

  mentrix: {
    fontSize: 32,
    fontWeight: '700',
  },

  os: {
    fontSize: 32,
    fontWeight: '700',
    marginLeft: 4,
  },
});
