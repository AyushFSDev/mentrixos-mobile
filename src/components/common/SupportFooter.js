/**
 * @file SupportFooter.js
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
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const SUPPORT_EMAIL = 'support@mentrixos.com';

/**
 * Pre-built mailto URI so the mail client opens with subject and body
 * already filled in, reducing friction for the user.
 */
const MAILTO_URI =
  `mailto:${SUPPORT_EMAIL}` +
  `?subject=${encodeURIComponent('Support Needed')}` +
  `&body=${encodeURIComponent('Hello Team,')}`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const SupportFooter = () => {
  const { colors } = useTheme();

  /**
   * Opens the device mail client with the support address pre-filled.
   * Linking.openURL is fire-and-forget on most platforms; we catch
   * the rejection silently to avoid unhandled promise warnings.
   */
  const handleEmailPress = () => {
    Linking.openURL(MAILTO_URI).catch(() => {
      // Mail client unavailable (e.g. simulator without a mail app).
      // No user-facing error needed — the tap simply does nothing.
    });
  };

  return (
    <View style={[styles.footer]}>
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
    paddingVertical: 16,
    paddingHorizontal: 20,
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
