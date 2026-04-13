/**
 * @file InputField.tsx
 * @module components/common/InputField
 * @description Themed single-line text input used across all forms in the app.
 *
 * Automatically applies the active theme's input colors (background, border,
 * text, placeholder) so individual screens never manage theming manually.
 *
 * @prop placeholder      — Placeholder text shown when the field is empty.
 * @prop value            — Controlled input value.
 * @prop onChangeText     — Callback fired on every keystroke with the new value.
 * @prop keyboardType     — React Native keyboard type. Default: 'default'
 * @prop secureTextEntry  — Hides input text (for passwords). Default: false
 * @prop autoCapitalize   — Capitalization mode. Default: 'none'
 * @prop autoFocus        — Focus the field on mount. Default: false
 * @prop editable         — Whether the field accepts input. Default: true
 * @prop inputRef         — Ref forwarded to the underlying TextInput node.
 *
 * Usage:
 *   <InputField
 *     placeholder="Enter your email"
 *     value={email}
 *     onChangeText={setEmail}
 *     keyboardType="email-address"
 *   />
 */

import React, { RefObject } from 'react';
import { TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { insets } from '../../theme/spacing';
import { radius } from '../../theme/globalStyles';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface InputFieldProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoFocus?: boolean;
  editable?: boolean;
  inputRef?: RefObject<TextInput>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const InputField: React.FC<InputFieldProps> = ({
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
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: insets.inputH,
    fontSize: 16,
  },
  // Applied when editable=false to provide a clear visual affordance.
  disabled: {
    opacity: 0.5,
  },
});
