/**
 * @file OtpInput.js
 * @module components/auth/OtpInput
 * @description Six-digit OTP input rendered as individual single-character boxes.
 *
 * Behavior:
 *   - Accepts only numeric digits (0–9); all other characters are stripped.
 *   - Focus advances automatically to the next box after a digit is entered.
 *   - Pressing Backspace on an empty box moves focus back to the previous box.
 *   - Supports Android autofill via `autoComplete="one-time-code"`.
 *
 * Props:
 * @prop {string[]} otp      — Controlled array of 6 digit strings, e.g. ['1','2','','','','']
 * @prop {function} onChange — Called with (index, digit, refs) on every change.
 *                             Parent is responsible for updating the otp array.
 *
 * Usage:
 *   const [otp, setOtp] = useState(Array(6).fill(''));
 *
 *   const handleChange = (index, digit, refs) => {
 *     const next = [...otp];
 *     next[index] = digit;
 *     setOtp(next);
 *   };
 *
 *   <OtpInput otp={otp} onChange={handleChange} />
 */

import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const OtpInput = ({ otp, onChange }) => {
  const { colors } = useTheme();

  // A single stable ref array holds references to all 6 TextInput nodes.
  // Using useRef avoids the stale-closure issue that would occur if refs
  // were stored in state.
  const inputRefs = useRef([]);

  /**
   * Strips non-numeric characters, takes only the last digit (handles paste),
   * notifies the parent, then shifts focus to the next box if applicable.
   */
  const handleChange = (index, value) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);

    onChange(index, digit, inputRefs.current);

    // Advance focus after a digit is entered (not on clear).
    if (digit && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * On Backspace: if the current box is already empty, move focus to the
   * previous box so the user can correct earlier digits without extra taps.
   */
  const handleKeyPress = (index, event) => {
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
              // Active border highlights the filled boxes for clear visual feedback.
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
          autoComplete="one-time-code" // Enables SMS autofill on Android
          selectTextOnFocus // Makes it easy to overwrite an existing digit
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
    gap: 8,
  },
  box: {
    flex: 1, // Each box takes equal width in the row
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 20,
    fontWeight: '700',
  },
});
