/**
 * @file BottomSection.js
 * @module components/auth/BottomSection
 * @description Two small UI pieces rendered at the bottom of the auth screens.
 *
 * Exports:
 *   SetupCard — Prompt for users who want to register a new institute.
 *   Footer    — Legal / branding footer with a tappable link.
 *
 * Usage:
 *   import { SetupCard, Footer } from './BottomSection';
 *
 *   <SetupCard />
 *   <Footer />
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { STRINGS } from '../../constants/strings';
import Icon from '../ui/Icon';

// ---------------------------------------------------------------------------
// SetupCard
// Shown on the login screen to direct institute admins to the setup flow.
// Layout:
//   "Don't have an institute?"
//   "Set up your institute  ›"
// ---------------------------------------------------------------------------
export const SetupCard = ({ onPress }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.setupCardBg,
          borderColor: colors.setupCardBorder,
        },
      ]}
    >
      {/* Prompt question */}
      <Text style={[styles.question, { color: colors.setupText }]}>
        {STRINGS.SETUP_QUESTION}
      </Text>

      {/* Tappable action link with trailing chevron */}
      <TouchableOpacity
        style={styles.linkRow}
        activeOpacity={0.7}
        onPress={onPress}
        accessibilityRole="link"
        accessibilityLabel={STRINGS.SETUP_LINK}
      >
        <Text style={[styles.link, { color: colors.setupLink }]}>
          {STRINGS.SETUP_LINK}
        </Text>
        <Icon name="chevronRight" size={18} color={colors.setupLink} />
      </TouchableOpacity>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Footer
// Minimal legal / branding strip at the very bottom of auth screens.
// Layout:
//   "Powered by MentrixOS"
//   "Privacy Policy"
// ---------------------------------------------------------------------------
export const Footer = ({ onLinkPress }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.footer}>
      {/* Static footer copy */}
      <Text style={[styles.footerText, { color: colors.footerText }]}>
        {STRINGS.FOOTER_TEXT}
      </Text>

      {/* Tappable link — e.g. Privacy Policy or Terms */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onLinkPress}
        accessibilityRole="link"
        accessibilityLabel={STRINGS.FOOTER_LINK}
      >
        <Text style={[styles.footerLink, { color: colors.footerLink }]}>
          {STRINGS.FOOTER_LINK}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  // ── SetupCard ─────────────────────────────────────────────────────────────
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  question: {
    fontSize: 14,
    marginBottom: 4,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  link: {
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    alignItems: 'center',
    gap: 2,
  },
  footerText: {
    fontSize: 12,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '500',
  },
});
