/**
 * @file BrandHeader.tsx
 * @module components/auth/BrandHeader
 * @description Full brand identity block shown at the top of the auth screens.
 *
 * Layout (top to bottom):
 *   1. Logo image
 *   2. Brand name  "Mentrix" + "OS"
 *   3. Tagline line 1
 *   4. Tagline line 2
 *
 * Usage:
 *   <BrandHeader />
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { STRINGS } from '../../constants/strings';
import spacing, { insets } from '../../theme/spacing';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const BrandHeader: React.FC = () => {
  const { colors, isDark } = useTheme();

  const logoSource = isDark
    ? require('../../assets/images/white-logo.png')
    : require('../../assets/images/black-logo.png');

  return (
    <View style={styles.container}>
      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <Image source={logoSource} style={styles.logo} resizeMode="contain" />

      {/* ── Brand name ────────────────────────────────────────────────────── */}
      <View style={styles.brandRow}>
        <Text style={[styles.brandText, { color: colors.brandMentrix }]}>
          {STRINGS.BRAND_MENTRIX}
        </Text>
        <Text style={[styles.brandText, { color: colors.brandOS }]}>
          {STRINGS.BRAND_OS}
        </Text>
      </View>

      {/* ── Tagline line 1 ────────────────────────────────────────────────── */}
      <View style={styles.tagRow}>
        <Text style={[styles.tagBold, { color: colors.textPrimary }]}>
          {STRINGS.TAGLINE_1}
        </Text>
        <Text style={[styles.tagBold, { color: colors.accentOrange }]}>
          {STRINGS.TAGLINE_MENTOR}
        </Text>
        <Text style={[styles.tagBold, { color: colors.textPrimary }]}>
          {STRINGS.TAGLINE_PLUS_MATRIX}
        </Text>
        <Text style={[styles.tagBold, { color: colors.accentPurple }]}>
          {STRINGS.TAGLINE_METRICS}
        </Text>
      </View>

      {/* ── Tagline line 2 ────────────────────────────────────────────────── */}
      <View style={styles.tagRow}>
        <Text style={[styles.tagMuted, { color: colors.textSecondary }]}>
          {STRINGS.TAGLINE_2A}
        </Text>
        <Text style={[styles.tagBold, { color: colors.textPrimary }]}>
          {STRINGS.TAGLINE_2B}
        </Text>
        <Text style={[styles.tagMuted, { color: colors.textSecondary }]}>
          {STRINGS.TAGLINE_2C}
        </Text>
      </View>
    </View>
  );
};

export default BrandHeader;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    width: insets.logoLg,
    height: insets.logoLg,
    marginBottom: spacing.sm + 2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  brandText: {
    fontSize: 30,
    fontWeight: '800',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.xs / 2,
  },
  tagBold: {
    fontSize: 13,
    fontWeight: '700',
  },
  tagMuted: {
    fontSize: 13,
    fontWeight: '400',
  },
});