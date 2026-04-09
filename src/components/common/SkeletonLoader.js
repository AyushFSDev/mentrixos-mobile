/**
 * @file SkeletonLoader.js
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
import { View, Animated, StyleSheet } from 'react-native';
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
// SkeletonBlock
// A single animated rectangle that pulses between two opacity values,
// creating a "breathing" shimmer effect without a gradient shader.
//
// @prop {number|string} width   — Block width  (px or '90%')
// @prop {number}        height  — Block height (px)
// @prop {object}        style   — Additional ViewStyle overrides
// ---------------------------------------------------------------------------
const SkeletonBlock = ({ width, height, style }) => {
  const { isDark } = useTheme();

  // Animated value drives the opacity interpolation (0 → dim, 1 → bright).
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Loop a sequence of fade-in then fade-out indefinitely.
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: SHIMMER_DURATION,
          useNativeDriver: true, // Opacity runs on the UI thread — no JS bridge cost
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: SHIMMER_DURATION,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    // Clean up the animation when the component unmounts to prevent
    // "Can't perform a React state update on an unmounted component" warnings.
    return () => animation.stop();
  }, [shimmer]);

  // Choose the correct opacity range for the active color scheme.
  const { min, max } = isDark ? DARK_OPACITY : LIGHT_OPACITY;

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [min, max],
  });

  // Use white on dark backgrounds and black on light ones so the shimmer
  // blends naturally with whatever surface sits behind it.
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
// Placeholder that mirrors the layout of a real dashboard stat card:
//   [Large number block]
//   [Label block]
//   [Two description lines]
// ---------------------------------------------------------------------------
export const StatCardSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {/* Large number / metric placeholder */}
      <SkeletonBlock
        width={60}
        height={44}
        style={{ marginBottom: spacing.sm }}
      />

      {/* Card label placeholder */}
      <SkeletonBlock
        width={120}
        height={16}
        style={{ marginBottom: spacing.xs }}
      />

      {/* Two description / sub-label lines */}
      <SkeletonBlock
        width="90%"
        height={12}
        style={{ marginTop: spacing.md }}
      />
      <SkeletonBlock
        width="70%"
        height={12}
        style={{ marginTop: spacing.xs }}
      />
    </View>
  );
};

// ---------------------------------------------------------------------------
// HeroSkeleton
// Placeholder that mirrors the greeting / hero text block at the top of
// the dashboard:
//   [Wider headline line]
//   [Narrower sub-headline line]
// ---------------------------------------------------------------------------
export const HeroSkeleton = () => (
  <View style={styles.hero}>
    {/* Main greeting headline */}
    <SkeletonBlock
      width={200}
      height={32}
      style={{ marginBottom: spacing.sm }}
    />

    {/* Secondary sub-heading */}
    <SkeletonBlock width={160} height={28} />
  </View>
);

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  statCard: {
    width: '47%', // Two cards sit side-by-side in a 2-column grid
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

// Default export is SkeletonBlock so it can be used as a generic building block.
export default SkeletonBlock;
