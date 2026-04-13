/**
 * @file SupportFooter.tsx
 * @module components/common/SupportFooter
 * @description Footer strip shown at the bottom of auth screens.
 *
 * Displays a support prompt with a tappable email address that opens
 * the device's default mail client pre-filled with a subject and body.
 *
 * Layout:
 *   "Trouble logging in?  support@mentrixos.com"
 *                          ↑ tappable — opens mail client
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import spacing, { insets } from '../../theme/spacing';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const SUPPORT_EMAIL = 'support@mentrixos.com';

const MAILTO_URI =
  `mailto:${SUPPORT_EMAIL}` +
  `?subject=${encodeURIComponent('Support Needed')}` +
  `&body=${encodeURIComponent('Hello Team,')}`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const SupportFooter: React.FC = () => {
  const { colors } = useTheme();

  const handleEmailPress = (): void => {
    Linking.openURL(MAILTO_URI).catch(() => {
      // Mail client unavailable (e.g. simulator without a mail app).
    });
  };

  return (
    <View style={styles.footer}>
      <Text style={[styles.text, { color: colors.textMuted }]}>
        Trouble logging in?{' '}
        <Text
          style={[styles.link, { color: colors.accentBlue }]}
          onPress={handleEmailPress}
          accessibilityRole="link"
          accessibilityLabel={`Email support at ${SUPPORT_EMAIL}`}
        >
          {SUPPORT_EMAIL}
        </Text>
      </Text>
    </View>
  );
};

export default SupportFooter;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  footer: {
    paddingVertical: spacing.lg,
    paddingHorizontal: insets.screen,
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
  },
  link: {
    fontSize: 12,
    fontWeight: '600',
  },
});