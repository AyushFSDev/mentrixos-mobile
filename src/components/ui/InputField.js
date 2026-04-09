/**
 * @file InputField.js
 * @module components/ui/InputField
 * @description Themed single-line text input used throughout all forms in the app.
 *
 * Automatically applies the active theme's input colors (background, border,
 * text, placeholder) so individual screens never have to handle theming manually.
 *
 * Usage:
 *   <InputField
 *     placeholder="Enter your email"
 *     value={email}
 *     onChangeText={setEmail}
 *     keyboardType="email-address"
 *   />
 *
 * @prop {string}   placeholder      — Placeholder text shown when the field is empty.
 * @prop {string}   value            — Controlled input value.
 * @prop {function} onChangeText     — Callback fired on every keystroke with the new value.
 * @prop {string}   keyboardType     — React Native keyboard type. Default: 'default'
 * @prop {boolean}  secureTextEntry  — Hides input text (for passwords). Default: false
 * @prop {string}   autoCapitalize   — Capitalization mode. Default: 'none'
 * @prop {boolean}  autoFocus        — Focus the field on mount. Default: false
 * @prop {boolean}  editable         — Whether the field accepts input. Default: true
 * @prop {object}   inputRef         — Ref forwarded to the underlying TextInput.
 */

import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const InputField = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  autoCapitalize = 'none',
  autoFocus = false,
  editable = true,
  inputRef,
}) => {
  const { colors } = useTheme();

  return (
    <TextInput
      ref={inputRef}
      style={[
        styles.input,
        {
          backgroundColor: colors.inputBg,
          borderColor: colors.inputBorder,
          color: colors.inputText,
        },
        // Visually signal non-editable state with reduced opacity.
        !editable && styles.disabled,
      ]}
      placeholder={placeholder}
      placeholderTextColor={colors.inputPlaceholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      autoFocus={autoFocus}
      autoCorrect={false} // Prevents autocorrect from mangling emails / codes
      editable={editable}
    />
  );
};

export default InputField;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  input: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  // Applied when editable=false to provide a clear visual affordance.
  disabled: {
    opacity: 0.5,
  },
});
