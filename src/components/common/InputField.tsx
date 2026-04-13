import React, { RefObject } from 'react';
import { TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { insets } from '../../theme/spacing';
import { radius } from '../../theme/globalStyles';

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
      autoCorrect={false}
      editable={editable}
    />
  );
};

export default InputField;

const styles = StyleSheet.create({
  input: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: insets.inputH,
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});

