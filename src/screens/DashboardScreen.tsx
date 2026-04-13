// src/screens/DashboardScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Image,
  Alert,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Path, Circle } from 'react-native-svg';

import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useDeviceType } from '../hooks/useDeviceType';
import {
  StatCardSkeleton,
  HeroSkeleton,
} from '../components/common/SkeletonLoader';
import { STRINGS } from '../constants/strings';
import { fetchDashboardStats } from '../services/dashboard/dashboard-service';
import { RootStackParamList } from '../navigation/RootNavigator';

import spacing from '../theme/spacing';
import typography from '../theme/typography';
import { radius, shadows } from '../theme/globalStyles';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface StatItem {
  id: string;
  value: string;
  label: string;
  desc: string;
  lightBg: string;
  lightBorder: string;
  darkBorder: string;
  valueColor: { light: string; dark: string };
}

interface IconProps {
  color: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

// ---------------------------------------------------------------------------
// Icon Components
// ---------------------------------------------------------------------------
const MoonIcon: React.FC<IconProps> = ({ color }) => (
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

const SunIcon: React.FC<IconProps> = ({ color }) => (
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

// ---------------------------------------------------------------------------
// DashboardScreen
// ---------------------------------------------------------------------------
const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { isWide } = useDeviceType();

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [stats, setStats] = useState<StatItem[]>([]);
  const [avatarFailed, setAvatarFailed] = useState<boolean>(false);

  const loadDashboard = useCallback(async (): Promise<void> => {
    setError('');
    try {
      const next = await fetchDashboardStats();
      setStats(Array.isArray(next) ? next : []);
    } catch {
      setError(STRINGS.DASHBOARD_LOAD_FAILED);
      setStats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // ── Android Hardware Back Button ──────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      const onBackPress = (): boolean => true;
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, []),
  );

  // ── Logout Handler ────────────────────────────────────────────────────────
  const handleLogout = (): void => {
    Alert.alert(STRINGS.DASHBOARD_LOGOUT_TITLE, STRINGS.DASHBOARD_LOGOUT_MSG, [
      { text: STRINGS.DASHBOARD_LOGOUT_CANCEL, style: 'cancel' },
      {
        text: STRINGS.DASHBOARD_LOGOUT_CONFIRM,
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${
    user?.name || 'Felix'
  }`;
  const userInitial =
    (user as any)?.full_name?.[0] ||
    user?.name?.[0] ||
    (user as any)?.initials ||
    'A';

  const onRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  }, [loadDashboard]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* ── Top Navigation Bar ─────────────────────────────────────────────── */}
      <View
        style={[
          styles.nav,
          { borderBottomColor: colors.border, backgroundColor: colors.surface },
        ]}
      >
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
            {isDark ? (
              <SunIcon color={colors.iconColor} />
            ) : (
              <MoonIcon color={colors.iconColor} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.avatarWrap, { borderColor: colors.accentBlue }]}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            {avatarFailed ? (
              <View
                style={[
                  styles.avatarFallback,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={{ color: colors.textPrimary, fontWeight: '800' }}>
                  {userInitial}
                </Text>
              </View>
            ) : (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatarImg}
                onError={() => setAvatarFailed(true)}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Scrollable Content Area ────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={[styles.content, isWide && styles.contentWide]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accentBlue}
          />
        }
      >
        {error ? (
          <View
            style={[
              styles.errorCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.errorText, { color: colors.errorText }]}>
              {error}
            </Text>
            <TouchableOpacity
              style={[
                styles.retryBtn,
                {
                  backgroundColor: colors.primaryBtn,
                  borderColor: colors.border,
                },
              ]}
              onPress={loadDashboard}
              activeOpacity={0.85}
            >
              <Text style={{ color: colors.primaryBtnText, fontWeight: '700' }}>
                {STRINGS.DASHBOARD_RETRY}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

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

        <View style={styles.statsGrid}>
          {loading
            ? [1, 2, 3, 4].map(i => <StatCardSkeleton key={i} />)
            : stats.map(stat => (
                <View
                  key={stat.id}
                  style={[
                    styles.statCard,
                    isDark
                      ? {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
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

const styles = StyleSheet.create({
  safe: { flex: 1 },
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
  themeBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    overflow: 'hidden',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  avatarFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  contentWide: { maxWidth: 800, alignSelf: 'center', width: '100%' },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
    marginTop: spacing.xxl,
  },
  heroTitle: { ...typography.heroTitle, textAlign: 'center' },
  heroSub: { ...typography.heroTitle, textAlign: 'center' },
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
  errorCard: {
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  errorText: { ...typography.body, textAlign: 'center' },
  retryBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
