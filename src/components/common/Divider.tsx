import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { STRINGS } from '../../constants/strings';
import spacing from '../../theme/spacing';

const Divider: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <View style={[styles.line, { backgroundColor: colors.dividerLine }]} />
      <Text style={[styles.label, { color: colors.textColor }]}>
        {STRINGS.DIVIDER_OR}
      </Text>
      <View style={[styles.line, { backgroundColor: colors.dividerLine }]} />
    </View>
  );
};

export default Divider;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  line: {
    flex: 1,
    height: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});

