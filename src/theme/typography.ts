/**
 * @file typography.ts
 * @module theme/typography
 * @description Typography design tokens and pre-composed text style objects.
 *
 * Usage:
 *   import typography from '../theme/typography';
 *   import { fontSize, fontWeight } from '../theme/typography';
 *
 *   title: { ...typography.sectionTitle, color: colors.textPrimary }
 *   fontSize: fontSize.lg, fontWeight: fontWeight.bold
 */

import { TextStyle } from 'react-native';

// ---------------------------------------------------------------------------
// Font family tokens
// ---------------------------------------------------------------------------
interface FontFamily {
  regular: string;
  medium: string;
  semiBold: string;
  bold: string;
  extraBold: string;
}

export const fontFamily: FontFamily = {
  regular: 'DMSans-Regular',
  medium: 'DMSans-Medium',
  semiBold: 'DMSans-SemiBold',
  bold: 'DMSans-Bold',
  extraBold: 'DMSans-ExtraBold',
};

// ---------------------------------------------------------------------------
// Font size scale (px)
// ---------------------------------------------------------------------------
interface FontSize {
  xs: number;
  sm: number;
  md: number;
  base: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
  hero: number;
}

export const fontSize: FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  hero: 32,
};

// ---------------------------------------------------------------------------
// Font weight tokens
// ---------------------------------------------------------------------------
interface FontWeight {
  regular: TextStyle['fontWeight'];
  medium: TextStyle['fontWeight'];
  semiBold: TextStyle['fontWeight'];
  bold: TextStyle['fontWeight'];
  extraBold: TextStyle['fontWeight'];
}

export const fontWeight: FontWeight = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
};

// ---------------------------------------------------------------------------
// Line height multipliers
// ---------------------------------------------------------------------------
interface LineHeight {
  tight: number;
  normal: number;
  relaxed: number;
}

export const lineHeight: LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
};

// ---------------------------------------------------------------------------
// Pre-composed text styles
// ---------------------------------------------------------------------------
interface Typography {
  heroTitle: TextStyle;
  sectionTitle: TextStyle;
  cardTitle: TextStyle;
  cardSubtitle: TextStyle;
  label: TextStyle;
  body: TextStyle;
  caption: TextStyle;
  buttonLg: TextStyle;
  buttonMd: TextStyle;
}

const typography: Typography = {
  heroTitle: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.extraBold,
    lineHeight: fontSize.hero * lineHeight.tight,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  cardTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
  },
  cardSubtitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
  },
  body: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
  },
  caption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
  },
  buttonLg: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semiBold,
  },
  buttonMd: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
  },
};

export default typography;
