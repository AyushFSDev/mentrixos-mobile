/**
 * @file SkeletonLoader.tsx
 * @module components/common/SkeletonLoader
 * @description Animated shimmer placeholders shown while real content is loading.
 *
 * Exports:
 *   SkeletonBlock    (default) — Generic rectangular shimmer block.
 *   StatCardSkeleton           — Matches the dashboard stat-card layout.
 *   HeroSkeleton               — Matches the hero / greeting section layout.
 *
 * Usage:
 *   import SkeletonBlock, { StatCardSkeleton, HeroSkeleton } from './SkeletonLoader';
 *
 *   // Generic block with custom dimensions
 *   <SkeletonBlock width={120} height={16} />
 *
 *   // Pre-built skeletons
 *   <StatCardSkeleton />
 *   <HeroSkeleton />
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, DimensionValue } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { radius } from '../../theme/globalStyles';
import spacing from '../../theme/spacing';

// ---------------------------------------------------------------------------
// Animation constants
// ---------------------------------------------------------------------------
/** Duration (ms) for one fade-in or fade-out half-cycle of the shimmer. */
const SHIMMER_DURATION = 900;

/** Opacity range for dark mode — subtle on a darker surface. */
const DARK_OPACITY = { min: 0.15, max: 0.35 };

/** Opacity range for light mode — very light on a white/grey surface. */
const LIGHT_OPACITY = { min: 0.08, max: 0.18 };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SkeletonBlockProps {
  width: DimensionValue;
  height: number;
  style?: object;
}

// ---------------------------------------------------------------------------
// SkeletonBlock
// A single animated rectangle that pulses between two opacity values,
// creating a "breathing" shimmer effect without a gradient shader.
// ---------------------------------------------------------------------------
const SkeletonBlock: React.FC<SkeletonBlockProps> = ({ width, height, style }) => {
  const { isDark } = useTheme();

  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: SHIMMER_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: SHIMMER_DURATION,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [shimmer]);

  const { min, max } = isDark ? DARK_OPACITY : LIGHT_OPACITY;

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [min, max],
  });

  const baseColor = isDark ? '#ffffff' : '#000000';

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius.md,
          backgroundColor: baseColor,
          opacity,
        },
        style,
      ]}
    />
  );
};

// ---------------------------------------------------------------------------
// StatCardSkeleton
// ---------------------------------------------------------------------------
export const StatCardSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <SkeletonBlock width={60} height={44} style={{ marginBottom: spacing.sm }} />
      <SkeletonBlock width={120} height={16} style={{ marginBottom: spacing.xs }} />
      <SkeletonBlock width="90%" height={12} style={{ marginTop: spacing.md }} />
      <SkeletonBlock width="70%" height={12} style={{ marginTop: spacing.xs }} />
    </View>
  );
};

// ---------------------------------------------------------------------------
// HeroSkeleton
// ---------------------------------------------------------------------------
export const HeroSkeleton: React.FC = () => (
  <View style={styles.hero}>
    <SkeletonBlock width={200} height={32} style={{ marginBottom: spacing.sm }} />
    <SkeletonBlock width={160} height={28} />
  </View>
);

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  statCard: {
    width: '47%',
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.xl,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
    marginTop: spacing.xxl,
  },
});

export default SkeletonBlock;