/**
 * @file Divider.tsx
 * @module components/common/Divider
 * @description Horizontal "OR" divider used between two alternative auth actions
 * (e.g. between a primary login button and a social login option).
 *
 * Layout:
 *   ─────────────  OR  ─────────────
 *
 * The label text is sourced from STRINGS so it can be localized without
 * touching this component.
 *
 * Usage:
 *   <Divider />
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { STRINGS } from '../../constants/strings';
import spacing from '../../theme/spacing';

const Divider: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {/* Left rule — takes up equal remaining space */}
      <View style={[styles.line, { backgroundColor: colors.dividerLine }]} />

      {/* Center label — "OR" */}
      <Text style={[styles.label, { color: colors.textColor }]}>
        {STRINGS.DIVIDER_OR}
      </Text>

      {/* Right rule — takes up equal remaining space */}
      <View style={[styles.line, { backgroundColor: colors.dividerLine }]} />
    </View>
  );
};

export default Divider;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.sm + 2, // Slightly wider than sm for visual breathing room
  },
  // flex: 1 ensures both rules grow equally and center the label.
  line: {
    flex:   1,
    height: 1,
  },
  label: {
    fontSize:      14,
    fontWeight:    '700',
    letterSpacing: 0.8,
  },
});