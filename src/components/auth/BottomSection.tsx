/**
 * @file BottomSection.tsx
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
 *   <SetupCard onPress={handleSetup} />
 *   <Footer onLinkPress={handleLink} />
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { STRINGS } from '../../constants/strings';
import Icon from '../common/Icon';
import spacing from '../../theme/spacing';
import { radius } from '../../theme/globalStyles';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SetupCardProps {
  onPress: () => void;
}

interface FooterProps {
  onLinkPress: () => void;
}

// ---------------------------------------------------------------------------
// SetupCard
// ---------------------------------------------------------------------------
export const SetupCard: React.FC<SetupCardProps> = ({ onPress }) => {
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
      <Text style={[styles.question, { color: colors.setupText }]}>
        {STRINGS.SETUP_QUESTION}
      </Text>

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
// ---------------------------------------------------------------------------
export const Footer: React.FC<FooterProps> = ({ onLinkPress }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.footer}>
      <Text style={[styles.footerText, { color: colors.footerText }]}>
        {STRINGS.FOOTER_TEXT}
      </Text>

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
  // SetupCard
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  question: {
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
  },
  link: {
    fontSize: 15,
    fontWeight: '700',
  },

  // Footer
  footer: {
    alignItems: 'center',
    gap: spacing.xs / 2,
  },
  footerText: {
    fontSize: 12,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '500',
  },
});