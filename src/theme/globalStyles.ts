/**
 * @file globalStyles.js
 * @module theme/globalStyles
 * @description Shared, reusable StyleSheet fragments and design-token scales.
 *
 * These mirror the web variables.css / components.css shared patterns so that
 * the mobile and web UIs stay visually consistent.
 *
 * Exports:
 *   radius      — Border radius scale (plain object, not a StyleSheet)
 *   shadows     — Shadow presets   (plain object — spread into StyleSheet styles)
 *   layout      — Common flexbox layout helpers
 *   screen      — Screen-level container styles
 *   appHeader   — Header bar used on InstituteSelect + RoleSelect screens
 *   pageFooter  — Bottom footer strip
 *   errorStyles — Inline error banner
 *
 * Usage:
 *   import { radius, shadows, appHeader } from '../theme/globalStyles';
 *
 *   // In a StyleSheet:
 *   card: { borderRadius: radius.lg, ...shadows.card }
 *
 *   // As a direct style:
 *   <View style={appHeader.header} />
 *
 * Rules:
 *   - Import only what you need — do not spread the entire module.
 *   - Do not hardcode spacing or radius values in component files; use the
 *     tokens from this file and from spacing.js instead.
 */

import { StyleSheet } from 'react-native';
import spacing from './spacing';
import typography from './typography';

// ---------------------------------------------------------------------------
// Border radius scale
// Mirrors web --radius-* CSS variables.
// Plain object (not StyleSheet) so values can be used in both styles and logic.
// ---------------------------------------------------------------------------
export const radius = {
  sm: 8,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999, // Produces a perfect pill / circle at any size
};

// ---------------------------------------------------------------------------
// Shadow presets
// Mirrors web --shadow-card / --shadow-hover CSS variables.
// Plain object — spread into a StyleSheet definition where needed.
//
// Note: React Native shadows require both the iOS shadow* props AND Android
// `elevation`. Both are included here.
// ---------------------------------------------------------------------------
export const shadows = {
  /** Subtle resting shadow for cards and surfaces. */
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  /** More prominent shadow for hovered / focused / elevated elements. */
  hover: {
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
};

// ---------------------------------------------------------------------------
// Layout helpers
// Common flexbox patterns extracted to avoid repetition across screens.
// ---------------------------------------------------------------------------
export const layout = StyleSheet.create({
  /** flex: 1 — fills available space in the parent */
  flex1: {
    flex: 1,
  },
  /** Horizontal row */
  row: {
    flexDirection: 'row',
  },
  /** Centers children both horizontally and vertically */
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** Horizontal row with vertically centered children */
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  /** Horizontal row with children pushed to opposite ends */
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

// ---------------------------------------------------------------------------
// Screen containers
// Top-level wrappers applied to every screen's root View / SafeAreaView.
// ---------------------------------------------------------------------------
export const screen = StyleSheet.create({
  /** Full-screen scrollable content area with standard horizontal padding. */
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  /** SafeAreaView wrapper — just flex: 1, let the screen control its own padding. */
  safeArea: {
    flex: 1,
  },
});

// ---------------------------------------------------------------------------
// App header
// Used on InstituteSelect and RoleSelect screens.
// Mirrors the web .appHeader component pattern.
//
// Note: AuthHeader intentionally omits borderBottomWidth — it extends this
// by applying only the header layout without the border.
// ---------------------------------------------------------------------------
export const appHeader = StyleSheet.create({
  /** Full header bar with bottom border */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  /** Left-side brand group: logo image + brand name text */
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  /** Brand logo image */
  logo: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  /** "MentrixOS" brand name next to the logo */
  brandName: {
    ...typography.sectionTitle,
    fontSize: 17,
  },
  /** Right-side circular user avatar button */
  avatar: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  /** Single initial character inside the avatar */
  avatarText: {
    ...typography.label,
    fontSize: 13,
  },
});

// ---------------------------------------------------------------------------
// Page footer
// Bottom strip shared across auth screens.
// Mirrors the web .pageFooter component pattern.
// ---------------------------------------------------------------------------
export const pageFooter = StyleSheet.create({
  /** Centered footer container with generous vertical padding */
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  /** Muted supporting copy (e.g. "By continuing, you agree to our") */
  text: {
    ...typography.caption,
    textAlign: 'center',
  },
  /** Tappable link text (e.g. "Terms & Privacy Policy") */
  link: {
    ...typography.caption,
    fontWeight: '600',
  },
});

// ---------------------------------------------------------------------------
// Error banner
// Inline error displayed above forms when a request fails.
// Pair with colors.errorText and colors.surface for background/text colors.
// ---------------------------------------------------------------------------
export const errorStyles = StyleSheet.create({
  /** Row containing an alert icon + error message */
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  /** Error message text — flex: 1 allows it to wrap next to the icon */
  text: {
    ...typography.body,
    flex: 1,
  },
});
