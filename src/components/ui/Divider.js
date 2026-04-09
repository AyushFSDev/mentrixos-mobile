/**
 * @file Divider.js
 * @module components/ui/Divider
 * @description Horizontal "OR" divider used between two alternative auth actions
 * (e.g. between a primary login button and a social login option).
 *
 * Layout:
 *   ─────────────  OR  ─────────────
 *
 * The label text is pulled from the shared STRINGS constant so it can be
 * localized without touching this component.
 *
 * Usage:
 *   <Divider />
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { STRINGS } from '../../constants/strings';

const Divider = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {/* Left horizontal rule */}
      <View style={[styles.line, { backgroundColor: colors.dividerLine }]} />

      {/* Center label — "OR" */}
      <Text style={[styles.label, { color: colors.textColor }]}>
        {STRINGS.DIVIDER_OR}
      </Text>

      {/* Right horizontal rule */}
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
    alignItems: 'center',
    gap: 10,
  },
  // Each rule takes up equal remaining space on either side of the label.
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
