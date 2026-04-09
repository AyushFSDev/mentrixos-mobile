// src/screens/DashboardScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
  useWindowDimensions,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';

import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import {
  StatCardSkeleton,
  HeroSkeleton,
} from '../components/common/SkeletonLoader';
import { STRINGS } from '../constants/strings';

import spacing from '../theme/spacing';
import typography from '../theme/typography';
import { radius, shadows } from '../theme/globalStyles';

// ─────────────────────────────────────────────────────────────────────────────
// Icon Components
// ─────────────────────────────────────────────────────────────────────────────

/**
 * MoonIcon — displayed in the theme toggle button when the app is in light mode.
 * Tapping it switches the theme to dark mode.
 *
 * @param {string} color - Stroke color of the SVG icon.
 */
const MoonIcon = ({ color }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * SunIcon — displayed in the theme toggle button when the app is in dark mode.
 * Tapping it switches the theme to light mode.
 *
 * @param {string} color - Stroke color of the SVG icon.
 */
const SunIcon = ({ color }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={4} stroke={color} strokeWidth={1.6} />
    <Path
      d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </Svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Statistics Configuration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * STATS — Static configuration array for the four KPI cards shown on the
 * dashboard. Each entry defines the display value, labels, and theme-aware
 * color tokens.
 *
 * TODO: Replace static `value` fields with live data fetched from the API
 *       once the backend endpoint is available.
 */
const STATS = [
  {
    id: 'active',
    value: '1,240',
    label: STRINGS.STAT_ACTIVE_STUDENTS_LABEL,
    desc: STRINGS.STAT_ACTIVE_STUDENTS_DESC,
    lightBg: '#eff6ff',
    lightBorder: '#dbeafe',
    darkBorder: '#3b82f6',
    valueColor: { light: '#1d4ed8', dark: '#60a5fa' },
  },
  {
    id: 'inactive',
    value: '86',
    label: STRINGS.STAT_INACTIVE_STUDENTS_LABEL,
    desc: STRINGS.STAT_INACTIVE_STUDENTS_DESC,
    lightBg: '#f0fdf4',
    lightBorder: '#dcfce7',
    darkBorder: '#10b981',
    valueColor: { light: '#15803d', dark: '#34d399' },
  },
  {
    id: 'modules',
    value: '34',
    label: STRINGS.STAT_ACTIVE_MODULES_LABEL,
    desc: STRINGS.STAT_ACTIVE_MODULES_DESC,
    lightBg: '#fff7ed',
    lightBorder: '#ffedd5',
    darkBorder: '#f59e0b',
    valueColor: { light: '#b45309', dark: '#fbbf24' },
  },
  {
    id: 'users',
    value: '58',
    label: STRINGS.STAT_STAFF_LABEL,
    desc: STRINGS.STAT_STAFF_DESC,
    lightBg: '#f5f3ff',
    lightBorder: '#ede9fe',
    darkBorder: '#8b5cf6',
    valueColor: { light: '#7c3aed', dark: '#a78bfa' },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DashboardScreen Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * DashboardScreen — The main home screen displayed after a user has
 * successfully authenticated and selected their institute and role.
 *
 * Responsibilities:
 *  - Renders a top navigation bar with branding, theme toggle, and avatar.
 *  - Shows skeleton placeholders while data is loading.
 *  - Displays four KPI statistic cards (active students, inactive students,
 *    active modules, staff count).
 *  - Blocks the Android hardware back button so the user cannot accidentally
 *    navigate back to the login or role-selection flow.
 *  - Provides a logout action via the avatar tap, resetting the navigation
 *    stack to the Login screen.
 *
 * @param {object} navigation - React Navigation prop used for screen transitions.
 */
const DashboardScreen = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { width } = useWindowDimensions();

  // Controls whether skeleton loaders are shown in place of real content.
  const [loading, setLoading] = useState(true);

  // Use a wider single-column layout on tablets or large-screen devices.
  const isWide = width > 800;

  // ─── Simulated Loading Delay ───────────────────────────────────────────────
  /**
   * Simulates an asynchronous data-fetch delay by hiding the skeleton after
   * 1.5 seconds.
   *
   * TODO: Remove this setTimeout once the real API is integrated. Replace
   *       with an actual fetch call and set `loading` to false in the
   *       finally block of that call.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    // Cleanup: cancel the timer if the component unmounts before it fires.
    return () => clearTimeout(timer);
  }, []);

  // ─── Android Hardware Back Button — Block Navigation ──────────────────────
  /**
   * Intercepts the Android hardware back button while this screen is focused.
   * Returning `true` from the handler signals that the event has been handled,
   * which prevents the user from navigating back to the role-selection or
   * login screens after a successful login.
   *
   * The subscription is automatically removed when the screen loses focus,
   * ensuring no memory leaks across navigation transitions.
   */
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true; // Consume the event; do not navigate back.

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  // ─── Logout Handler ────────────────────────────────────────────────────────
  /**
   * Displays a confirmation alert before logging the user out.
   *
   * On confirmation:
   *  1. Calls `logout()` to clear all stored tokens and user data.
   *  2. Uses `navigation.reset()` instead of `navigate()` or `replace()` so
   *     that the entire navigation stack is cleared. This prevents the user
   *     from pressing back after logout and returning to authenticated screens.
   */
  const handleLogout = () => {
    Alert.alert(STRINGS.DASHBOARD_LOGOUT_TITLE, STRINGS.DASHBOARD_LOGOUT_MSG, [
      { text: STRINGS.DASHBOARD_LOGOUT_CANCEL, style: 'cancel' },
      {
        text: STRINGS.DASHBOARD_LOGOUT_CONFIRM,
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  /**
   * Generates a unique, deterministic avatar URL for the current user by
   * seeding the DiceBear Avataaars API with the user's name.
   * Falls back to 'Felix' if the user object has no name.
   */
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${
    user?.name || 'Felix'
  }`;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* ── Top Navigation Bar ─────────────────────────────────────────────── */}
      <View
        style={[
          styles.nav,
          { borderBottomColor: colors.border, backgroundColor: colors.surface },
        ]}
      >
        {/* Left side: hamburger menu, app logo, and app name */}
        <View style={styles.navLeft}>
          <TouchableOpacity
            style={[styles.navBtn, { borderColor: colors.border }]}
          >
            <Text style={[styles.navBtnIcon, { color: colors.textPrimary }]}>
              {STRINGS.DASHBOARD_NAV_MENU}
            </Text>
          </TouchableOpacity>
          <Image
            source={
              isDark
                ? require('../assets/images/white-logo.png')
                : require('../assets/images/black-logo.png')
            }
            style={styles.navLogo}
          />
          <Text style={[styles.navTitle, { color: colors.textPrimary }]}>
            {STRINGS.BRAND_FULL}
          </Text>
        </View>

        {/* Right side: theme toggle button and user avatar (tap to logout) */}
        <View style={styles.navRight}>
          <TouchableOpacity
            style={[
              styles.themeBtn,
              {
                backgroundColor: colors.iconBtnBg,
                borderColor: colors.iconBtnBorder,
              },
            ]}
            onPress={toggleTheme}
            activeOpacity={0.8}
          >
            {/* Show SunIcon in dark mode, MoonIcon in light mode */}
            {isDark ? (
              <SunIcon color={colors.iconColor} />
            ) : (
              <MoonIcon color={colors.iconColor} />
            )}
          </TouchableOpacity>

          {/* Avatar — tapping triggers the logout confirmation dialog */}
          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Scrollable Content Area ────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={[styles.content, isWide && styles.contentWide]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section: welcome message or skeleton while loading */}
        {loading ? (
          <HeroSkeleton />
        ) : (
          <View style={styles.hero}>
            <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
              {STRINGS.DASHBOARD_WELCOME}
            </Text>
            <Text style={[styles.heroSub, { color: colors.accentBlue }]}>
              {STRINGS.DASHBOARD_SUBTITLE}
            </Text>
          </View>
        )}

        {/* Statistics Grid: renders 4 skeleton cards while loading,
            then the real KPI cards once data is ready */}
        <View style={styles.statsGrid}>
          {loading
            ? [1, 2, 3, 4].map(i => <StatCardSkeleton key={i} />)
            : STATS.map(stat => (
                <View
                  key={stat.id}
                  style={[
                    styles.statCard,
                    isDark
                      ? {
                          backgroundColor: '#1a1a1a',
                          borderColor: '#2d2d2d',
                          // Colored left border provides a quick visual
                          // category indicator in dark mode.
                          borderLeftColor: stat.darkBorder,
                          borderLeftWidth: 4,
                        }
                      : {
                          backgroundColor: stat.lightBg,
                          borderColor: stat.lightBorder,
                        },
                    shadows.card,
                  ]}
                >
                  <Text
                    style={[
                      styles.statValue,
                      {
                        color: isDark
                          ? stat.valueColor.dark
                          : stat.valueColor.light,
                      },
                    ]}
                  >
                    {stat.value}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textPrimary }]}
                  >
                    {stat.label}
                  </Text>
                  <Text
                    style={[styles.statDesc, { color: colors.textSecondary }]}
                  >
                    {stat.desc}
                  </Text>
                </View>
              ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },

  // Navigation bar
  nav: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
  },
  navLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnIcon: { fontSize: 18 },
  navLogo: { width: 32, height: 32, resizeMode: 'contain' },
  navTitle: { ...typography.sectionTitle, fontSize: 18 },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },

  // Theme toggle button
  themeBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // User avatar with green online-indicator border
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  avatarImg: { width: '100%', height: '100%', resizeMode: 'cover' },

  // Scrollable content padding
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  // Constrain content width on wide/tablet screens
  contentWide: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },

  // Hero / welcome section
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
    marginTop: spacing.xxl,
  },
  heroTitle: { ...typography.heroTitle, textAlign: 'center' },
  heroSub: { ...typography.heroTitle, textAlign: 'center' },

  // KPI stat cards grid
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  statCard: {
    width: '47%',
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.xl,
  },
  statValue: { fontSize: 40, fontWeight: '800', marginBottom: spacing.sm },
  statLabel: {
    ...typography.cardTitle,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  statDesc: {
    ...typography.cardSubtitle,
    marginTop: spacing.md,
    lineHeight: 18,
  },
});
