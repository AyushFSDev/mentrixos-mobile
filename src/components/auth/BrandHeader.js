/**
 * @file BrandHeader.js
 * @module components/auth/BrandHeader
 * @description Full brand identity block shown at the top of the auth screens.
 *
 * Layout (top to bottom):
 *   1. Logo image  (white on dark, black on light)
 *   2. Brand name  "Mentrix" + "OS"  (two separately colored spans)
 *   3. Tagline line 1  — multi-colored word segments
 *   4. Tagline line 2  — mixed weight word segments
 *
 * All copy is sourced from the STRINGS constant so localization never
 * requires touching this component.
 *
 * Usage:
 *   <BrandHeader />
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { STRINGS } from '../../constants/strings';

const BrandHeader = () => {
  const { colors, isDark } = useTheme();

  // Swap the logo asset to maintain legibility against the active background.
  const logoSource = isDark
    ? require('../../assets/images/white-logo.png')
    : require('../../assets/images/black-logo.png');

  return (
    <View style={styles.container}>
      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <Image source={logoSource} style={styles.logo} resizeMode="contain" />

      {/* ── Brand name — "Mentrix" and "OS" are colored independently ─────── */}
      <View style={styles.brandRow}>
        <Text style={[styles.brandText, { color: colors.brandMentrix }]}>
          {STRINGS.BRAND_MENTRIX}
        </Text>
        <Text style={[styles.brandText, { color: colors.brandOS }]}>
          {STRINGS.BRAND_OS}
        </Text>
      </View>

      {/* ── Tagline line 1 — "Where Mentor + Matrix meets Metrics" ────────── */}
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

      {/* ── Tagline line 2 — secondary subtitle ───────────────────────────── */}
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
    marginBottom: 28,
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'baseline', // Aligns text baselines so mixed weights look even
    marginBottom: 12,
  },
  brandText: {
    fontSize: 30,
    fontWeight: '800',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Wraps gracefully on narrow screens
    justifyContent: 'center',
    marginBottom: 2,
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
