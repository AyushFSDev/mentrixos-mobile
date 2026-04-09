/**
 * @file spacing.js
 * @module theme/spacing
 * @description Single source of truth for all spacing values in the app.
 *
 * Based on a 4pt base grid — consistent with the web variables.css spacing system
 * so that padding, margin, and gap values stay in sync across platforms.
 *
 * Scale:
 *   xs   →  4px   — Tight gaps between tightly related elements (e.g. icon + label)
 *   sm   →  8px   — Small internal padding, compact gaps
 *   md   → 12px   — Default gap between sibling elements
 *   lg   → 16px   — Card padding, list item spacing
 *   xl   → 20px   — Screen horizontal padding, section gaps
 *   xxl  → 28px   — Large vertical section separation
 *   xxxl → 40px   — Hero-level spacing, screen-top padding
 *
 * Usage:
 *   import spacing from '../theme/spacing';
 *   paddingHorizontal: spacing.xl
 *   gap: spacing.md
 */

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
};

export default spacing;
