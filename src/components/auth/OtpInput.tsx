/**
 * @file OtpInput.tsx
 * @module components/auth/OtpInput
 * @description Six-digit OTP input rendered as individual single-character boxes.
 *
 * Behavior:
 *   - Accepts only numeric digits (0–9); all other characters are stripped.
 *   - Focus advances automatically to the next box after a digit is entered.
 *   - Pressing Backspace on an empty box moves focus back to the previous box.
 *   - Supports Android autofill via `autoComplete="one-time-code"`.
 *
 * @prop {string[]} otp      — Controlled array of 6 digit strings.
 * @prop {function} onChange — Called with (index, digit, refs) on every change.
 */

import React, { useRef } from 'react';
import { View, TextInput, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import spacing from '../../theme/spacing';
import { radius } from '../../theme/globalStyles';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface OtpInputProps {
  otp: string[];
  onChange: (index: number, digit: string, refs: Array<TextInput | null>) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const OtpInput: React.FC<OtpInputProps> = ({ otp, onChange }) => {
  const { colors } = useTheme();

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleChange = (index: number, value: string): void => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);

    onChange(index, digit, inputRefs.current);

    if (digit && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    index: number,
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ): void => {
    if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={el => {
            inputRefs.current[index] = el;
          }}
          style={[
            styles.box,
            {
              backgroundColor: colors.otpBg,
              borderColor: digit ? colors.otpActiveBorder : colors.otpBorder,
              color: colors.otpText,
            },
          ]}
          value={digit}
          onChangeText={value => handleChange(index, value)}
          onKeyPress={event => handleKeyPress(index, event)}
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
          autoComplete="one-time-code"
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

export default OtpInput;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  box: {
    flex: 1,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: 20,
    fontWeight: '700',
  },
});