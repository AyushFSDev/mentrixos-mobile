/**
 * @file typography.js
 * @module theme/typography
 * @description Typography design tokens and pre-composed text style objects.
 *
 * ── Font family ──────────────────────────────────────────────────────────────
 * Mirrors the web globals.css font-family: 'DM Sans'.
 * DM Sans must be loaded before use via expo-font or react-native-google-fonts.
 * Fallback on unloaded font: SF Pro (iOS) / Roboto (Android) system default.
 *
 * Loading example (Expo):
 *   import { useFonts } from 'expo-font';
 *   const [loaded] = useFonts({
 *     'DMSans-Regular':   require('./assets/fonts/DMSans-Regular.ttf'),
 *     'DMSans-Medium':    require('./assets/fonts/DMSans-Medium.ttf'),
 *     'DMSans-SemiBold':  require('./assets/fonts/DMSans-SemiBold.ttf'),
 *     'DMSans-Bold':      require('./assets/fonts/DMSans-Bold.ttf'),
 *     'DMSans-ExtraBold': require('./assets/fonts/DMSans-ExtraBold.ttf'),
 *   });
 *
 * ── Usage ────────────────────────────────────────────────────────────────────
 *   import typography from '../theme/typography';
 *
 *   // Spread a pre-composed style into a StyleSheet:
 *   title: { ...typography.sectionTitle, color: colors.textPrimary }
 *
 *   // Use raw tokens for one-off values:
 *   import { fontSize, fontWeight } from '../theme/typography';
 *   fontSize: fontSize.lg, fontWeight: fontWeight.bold
 */

// ---------------------------------------------------------------------------
// Font family tokens
// Use these string values when fontFamily must be set explicitly.
// ---------------------------------------------------------------------------
export const fontFamily = {
  regular: 'DMSans-Regular',
  medium: 'DMSans-Medium',
  semiBold: 'DMSans-SemiBold',
  bold: 'DMSans-Bold',
  extraBold: 'DMSans-ExtraBold',
};

// ---------------------------------------------------------------------------
// Font size scale (px)
// Mirrors the web font-size CSS variables.
// ---------------------------------------------------------------------------
export const fontSize = {
  xs: 11, // Caption, fine print
  sm: 13, // Labels, subtitles, secondary body
  md: 15, // Body text
  base: 16, // Default / button text
  lg: 18, // Card titles, sub-headings
  xl: 20, // Section titles
  xxl: 24, // Page titles
  xxxl: 30, // Brand name
  hero: 32, // Hero / greeting headlines
};

// ---------------------------------------------------------------------------
// Font weight tokens
// React Native accepts numeric strings for fontWeight.
// ---------------------------------------------------------------------------
export const fontWeight = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
};

// ---------------------------------------------------------------------------
// Line height multipliers
// Multiply against fontSize to get an absolute lineHeight for StyleSheet.
// Example: fontSize.hero * lineHeight.tight = 32 * 1.2 = 38.4
// ---------------------------------------------------------------------------
export const lineHeight = {
  tight: 1.2, // Headlines, large display text
  normal: 1.5, // Body text
  relaxed: 1.7, // Long-form reading text
};

// ---------------------------------------------------------------------------
// Pre-composed text styles
// Spread these directly into StyleSheet.create() definitions.
// Colors are intentionally NOT included — always apply color via theme tokens.
// ---------------------------------------------------------------------------
const typography = {
  /** Large display headline — used for greeting / hero sections */
  heroTitle: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.extraBold,
    lineHeight: fontSize.hero * lineHeight.tight,
  },

  /** Screen or section heading */
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },

  /** Primary text in a card or list item */
  cardTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
  },

  /** Secondary / supporting text below a card title */
  cardSubtitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
  },

  /** Small all-caps or emphasized labels, badge text */
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
  },

  /** Standard body / paragraph text */
  body: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
  },

  /** Fine print, helper text, timestamps */
  caption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
  },

  /** Large button label (height 52 buttons) */
  buttonLg: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semiBold,
  },

  /** Medium button label */
  buttonMd: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
  },
};

export default typography;
