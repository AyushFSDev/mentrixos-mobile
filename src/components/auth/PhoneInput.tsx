/**
 * @file PhoneInput.tsx
 * @module components/auth/PhoneInput
 * @description Phone number input with a fixed country-code selector on the left.
 *
 * Layout:
 *   [ 🇮🇳  +91 ]  [ Phone number field ──────────────── ]
 *
 * @prop {string}   value           — Controlled phone number value.
 * @prop {function} onChangeText    — Callback fired on every keystroke.
 * @prop {string}   placeholder     — Overrides the default placeholder text.
 * @prop {function} onCountryPress  — Optional callback when the country pill is tapped.
 */

import React, { memo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { STRINGS } from '../../constants/strings';
import spacing, { insets } from '../../theme/spacing';
import { radius } from '../../theme/globalStyles';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onCountryPress?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  placeholder,
  onCountryPress,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {/* ── Country selector pill ─────────────────────────────────────────── */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onCountryPress}
        accessibilityRole="button"
        accessibilityLabel={`Country code ${STRINGS.COUNTRY_CODE}`}
        style={[
          styles.countryPill,
          {
            backgroundColor: colors.countryBg,
            borderColor: colors.countryBorder,
          },
        ]}
      >
        <Text style={styles.flag}>{STRINGS.COUNTRY_FLAG}</Text>
        <Text style={[styles.dialCode, { color: colors.countryText }]}>
          {STRINGS.COUNTRY_CODE}
        </Text>
      </TouchableOpacity>

      {/* ── Phone number text field ───────────────────────────────────────── */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.inputBorder,
            color: colors.inputText,
          },
        ]}
        placeholder={placeholder ?? STRINGS.PLACEHOLDER_PHONE_NUMBER}
        placeholderTextColor={colors.inputPlaceholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType="phone-pad"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

export default memo(PhoneInput);

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  countryPill: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.xs + 2,
  },
  flag: {
    fontSize: 18,
  },
  dialCode: {
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: insets.inputH,
    fontSize: 16,
  },
});