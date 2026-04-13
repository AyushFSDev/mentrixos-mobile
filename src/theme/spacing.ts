/**
 * @file spacing.ts
 * @module theme/spacing
 * @description Single source of truth for all spacing values in the app.
 *
 * Based on a 4pt base grid — consistent with the web variables.css spacing system
 * so that padding, margin, and gap values stay in sync across platforms.
 *
 * Scale:
 *   xs   →  4px
 *   sm   →  8px
 *   md   → 12px
 *   lg   → 16px
 *   xl   → 20px
 *   xxl  → 28px
 *   xxxl → 40px
 *
 * Exports:
 *   spacing (default) — Raw numeric scale
 *   insets            — Semantic named values (screen, card, gap, sizes...)
 *   layout            — Pre-built StyleSheet fragments to spread in components
 *
 * Usage:
 *   import spacing, { insets, layout } from '../theme/spacing';
 *
 *   // Raw token
 *   marginBottom: spacing.xxl
 *
 *   // Semantic inset
 *   paddingHorizontal: insets.screen
 *
 *   // Spread layout helper — no more hardcoded values in components!
 *   <View style={[layout.screenPad, layout.rowBetween]}>
 *   style={[styles.card, layout.cardPad]}
 */

import { StyleSheet } from 'react-native';

// ---------------------------------------------------------------------------
// Base scale
// ---------------------------------------------------------------------------
interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
};

export default spacing;

// ---------------------------------------------------------------------------
// Insets
// Semantic values built on the base scale.
// Use these instead of hardcoded numbers anywhere in components.
// ---------------------------------------------------------------------------
export const insets = {
  // Screen
  screen: spacing.xl, // 20 — horizontal padding on every screen

  // Cards
  card: spacing.xl, // 20 — internal card padding

  // Sections
  section: spacing.xxl, // 28 — gap between major page sections

  // List items
  listItem: spacing.md, // 12 — list item top/bottom padding

  // Inputs
  inputH: spacing.lg, // 16 — input horizontal padding
  inputV: spacing.md, // 12 — input vertical padding

  // Buttons
  btnH: spacing.lg, // 16 — button horizontal padding

  // Fixed component sizes
  iconBtn: 46, // icon button width & height
  navHeight: 64, // top navigation bar height
  tabHeight: 56, // bottom tab bar height
  avatar: 40, // standard avatar diameter
  avatarSm: 32, // small avatar
  avatarLg: 52, // large avatar
  logoSm: 28, // small logo (header)
  logoLg: 72, // large logo (brand header)

  // Gaps between flex siblings
  gap: spacing.md, // 12
  gapSm: spacing.sm, // 8
  gapLg: spacing.lg, // 16
} as const;

// ---------------------------------------------------------------------------
// Layout
// Pre-built StyleSheet fragments — spread directly into component styles.
// This eliminates hardcoded margin/padding values across every screen.
//
// Example:
//   import { layout } from '../theme/spacing';
//
//   const styles = StyleSheet.create({
//     header: {
//       ...layout.rowBetween,   ← spread
//       backgroundColor: colors.surface,
//     },
//   });
//
//   // Or directly on View:
//   <View style={[layout.screenPad, layout.row]}>
// ---------------------------------------------------------------------------
export const layout = StyleSheet.create({
  // ── Flex basics ────────────────────────────────────────────────────────────
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flexDirection: 'column',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  colCenter: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  // ── Screen containers ──────────────────────────────────────────────────────
  /** Root flex container — apply to SafeAreaView or top-level View */
  screen: {
    flex: 1,
  },
  /** Standard screen horizontal padding */
  screenPad: {
    paddingHorizontal: insets.screen,
  },
  /** Screen padding with top breathing room */
  screenPadTop: {
    paddingHorizontal: insets.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  /** Full scroll content area padding */
  scrollContent: {
    paddingHorizontal: insets.screen,
    paddingBottom: spacing.xxxl,
  },

  // ── Cards ──────────────────────────────────────────────────────────────────
  cardPad: {
    padding: insets.card,
  },
  cardPadH: {
    paddingHorizontal: insets.card,
  },
  cardPadV: {
    paddingVertical: spacing.md,
  },

  // ── Sections ───────────────────────────────────────────────────────────────
  sectionGap: {
    marginBottom: insets.section,
  },
  sectionGapTop: {
    marginTop: insets.section,
  },
  sectionGapBoth: {
    marginVertical: insets.section,
  },

  // ── List items ─────────────────────────────────────────────────────────────
  listItem: {
    paddingVertical: insets.listItem,
    paddingHorizontal: insets.screen,
  },
  listItemPad: {
    paddingVertical: insets.listItem,
  },

  // ── Inputs ─────────────────────────────────────────────────────────────────
  inputPad: {
    paddingHorizontal: insets.inputH,
    paddingVertical: insets.inputV,
  },

  // ── Gaps ──────────────────────────────────────────────────────────────────
  gapSm: {
    gap: insets.gapSm, // 8
  },
  gap: {
    gap: insets.gap, // 12
  },
  gapLg: {
    gap: insets.gapLg, // 16
  },

  // ── Margin top helpers ─────────────────────────────────────────────────────
  mtXs: { marginTop: spacing.xs },
  mtSm: { marginTop: spacing.sm },
  mtMd: { marginTop: spacing.md },
  mtLg: { marginTop: spacing.lg },
  mtXl: { marginTop: spacing.xl },
  mtXxl: { marginTop: spacing.xxl },
  mtXxxl: { marginTop: spacing.xxxl },

  // ── Margin bottom helpers ──────────────────────────────────────────────────
  mbXs: { marginBottom: spacing.xs },
  mbSm: { marginBottom: spacing.sm },
  mbMd: { marginBottom: spacing.md },
  mbLg: { marginBottom: spacing.lg },
  mbXl: { marginBottom: spacing.xl },
  mbXxl: { marginBottom: spacing.xxl },
  mbXxxl: { marginBottom: spacing.xxxl },

  // ── Margin horizontal/vertical ─────────────────────────────────────────────
  mhScreen: { marginHorizontal: insets.screen },
  mvSection: { marginVertical: insets.section },

  // ── Hero / greeting sections ───────────────────────────────────────────────
  /** Used on InstituteSelect / RoleSelect greeting block */
  heroSection: {
    alignItems: 'center',
    paddingTop: spacing.xxxl,
    marginBottom: spacing.xxl,
  },
  /** Used on Dashboard welcome block */
  heroSectionCenter: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
    marginTop: spacing.xxl,
  },

  // ── Navigation bar ─────────────────────────────────────────────────────────
  navBar: {
    height: insets.navHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: insets.screen,
    borderBottomWidth: 1,
  },

  // ── Footer strip ───────────────────────────────────────────────────────────
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: insets.screen,
  },

  // ── Auth screen bottom fixed section ──────────────────────────────────────
  authBottom: {
    paddingHorizontal: insets.screen,
    paddingBottom: spacing.lg,
  },
});
