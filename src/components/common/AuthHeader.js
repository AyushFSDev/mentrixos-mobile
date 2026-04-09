/**
 * @file AuthHeader.js
 * @module components/common/AuthHeader
 * @description Shared header used across InstituteSelectScreen and RoleSelectScreen.
 *
 * Layout:
 *   [Logo + Brand Name]  ←————————————→  [User Avatar (tap to logout)]
 *
 * Intentionally rendered without a bottom border to keep the auth
 * screens visually open. For screens that need a border, use the
 * standard appHeader styles from globalStyles instead.
 *
 * @prop {string}   userInitial — Single character displayed inside the avatar bubble. Default: 'A'
 * @prop {function} onLogout    — Callback fired when the user taps the avatar.
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { STRINGS } from '../../constants/strings';
import { appHeader } from '../../theme/globalStyles';

const AuthHeader = ({ userInitial = 'A', onLogout }) => {
  const { colors, isDark } = useTheme();

  // Swap logo asset based on the active color scheme so it stays legible
  // against both light and dark backgrounds.
  const logoSource = isDark
    ? require('../../assets/images/white-logo.png')
    : require('../../assets/images/black-logo.png');

  return (
    <View style={styles.header}>
      {/* ── Brand (left side) ─────────────────────────────────────────── */}
      <View style={appHeader.brand}>
        <Image source={logoSource} style={appHeader.logo} />
        <Text style={[appHeader.brandName, { color: colors.textPrimary }]}>
          {STRINGS.BRAND_FULL}
        </Text>
      </View>

      {/* ── User avatar (right side) — tap triggers logout ────────────── */}
      <TouchableOpacity
        style={[
          appHeader.avatar,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={onLogout}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Logout"
        accessibilityHint="Tap to sign out of your account"
      >
        <Text style={[appHeader.avatarText, { color: colors.textPrimary }]}>
          {userInitial}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthHeader;

// ---------------------------------------------------------------------------
// Styles
// Mirrors appHeader.header layout but deliberately omits borderBottomWidth
// so auth screens feel open and uncluttered.
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});
