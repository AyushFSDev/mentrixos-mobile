/**
 * @file AuthHeader.tsx
 * @module components/common/AuthHeader
 * @description Shared header used across InstituteSelectScreen and RoleSelectScreen.
 *
 * Layout:
 *   [Logo + Brand Name]  ←————————————→  [User Avatar (tap to logout)]
 *
 * @prop {string}   userInitial — Single character displayed inside the avatar bubble. Default: 'A'
 * @prop {function} onLogout    — Callback fired when the user taps the avatar.
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { STRINGS } from '../../constants/strings';
import { appHeader } from '../../theme/globalStyles';
import { insets } from '../../theme/spacing';
import spacing from '../../theme/spacing';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface AuthHeaderProps {
  userInitial?: string;
  onLogout: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const AuthHeader: React.FC<AuthHeaderProps> = ({ userInitial = 'A', onLogout }) => {
  const { colors, isDark } = useTheme();

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
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: insets.screen,
    paddingVertical: spacing.md,
  },
});