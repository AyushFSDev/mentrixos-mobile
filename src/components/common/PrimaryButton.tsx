/**
 * @file PrimaryButton.tsx
 * @module components/common/PrimaryButton
 * @description Solid filled call-to-action button used for primary actions
 * such as "Login", "Continue", and "Submit".
 *
 * States:
 *   default  — full opacity, pressable
 *   loading  — shows an ActivityIndicator; touch is disabled
 *   disabled — reduced opacity; touch is disabled
 *
 * @prop label    — Button label text.
 * @prop onPress  — Callback fired on press.
 * @prop loading  — Shows a spinner and blocks interaction. Default: false
 * @prop disabled — Dims the button and blocks interaction. Default: false
 * @prop flex     — Adds `flex: 1` so the button fills its parent row. Default: false
 * @prop style    — Additional ViewStyle overrides applied to the container.
 *
 * Usage:
 *   <PrimaryButton label="Login"    onPress={handleLogin} />
 *   <PrimaryButton label="Saving…"  loading />
 *   <PrimaryButton label="Continue" disabled={!isValid} />
 *   <PrimaryButton label="Submit"   flex onPress={handleSubmit} />
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import spacing from '../../theme/spacing';
import { radius } from '../../theme/globalStyles';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  flex?: boolean;
  style?: ViewStyle;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  flex = false,
  style = {},
}) => {
  const { colors } = useTheme();

  // The button is non-interactive while loading or explicitly disabled.
  const isInactive = loading || disabled;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isInactive}
      activeOpacity={0.82}
      accessibilityRole="button"
      accessibilityState={{ disabled: isInactive, busy: loading }}
      style={[
        styles.btn,
        { backgroundColor: colors.primaryBtn },
        flex && styles.flex,
        isInactive && styles.inactive,
        style,
      ]}
    >
      {loading ? (
        // Spinner replaces the label while an async action is in progress.
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text style={[styles.label, { color: colors.primaryBtnText }]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Applied when the button fills available horizontal space in a row layout.
  flex: {
    flex: 1,
  },
  // Applied in both `loading` and `disabled` states.
  inactive: {
    opacity: 0.65,
  },
});
