import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import Icon from './Icon';
import spacing from '../../theme/spacing';
import { radius } from '../../theme/globalStyles';

interface SecondaryButtonProps {
  label: string;
  iconName?: string;
  onPress: () => void;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ label, iconName, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      accessibilityRole="button"
      style={[
        styles.btn,
        {
          backgroundColor: colors.secondaryBtn,
          borderColor: colors.secondaryBtnBorder,
        },
      ]}
    >
      {iconName && (
        <View style={styles.iconWrapper}>
          <Icon name={iconName} size={18} color={colors.secondaryBtnText} />
        </View>
      )}
      <Text style={[styles.label, { color: colors.secondaryBtnText }]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default SecondaryButton;

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  iconWrapper: {
    marginRight: spacing.xs / 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});

