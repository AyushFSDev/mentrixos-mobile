/**
 * @file SecondaryButton.js
 * @module components/ui/SecondaryButton
 * @description Outlined secondary action button, optionally prefixed with an
 * SVG icon from the local Icon registry.
 *
 * Used for alternative or supplementary actions such as "Join Institute",
 * "Setup Institute", or "Continue with Google".
 *
 * Usage:
 *   <SecondaryButton label="Join Institute"  iconName="qr"           onPress={handleJoin}  />
 *   <SecondaryButton label="Setup Institute" iconName="chevronRight" onPress={handleSetup} />
 *   <SecondaryButton label="Cancel"                                  onPress={handleCancel}/>
 *
 * @prop {string}   label    — Button label text.
 * @prop {string}   iconName — Optional icon name passed to the Icon component.
 *                             Renders nothing if omitted or unrecognized.
 * @prop {function} onPress  — Callback fired on press.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import Icon from './Icon';

const SecondaryButton = ({ label, iconName, onPress }) => {
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
      {/* Icon is optional — only rendered when a valid name is provided */}
      {iconName && (
        <View style={styles.iconWrapper}>
          <Icon name={iconName} size={18} color={colors.secondaryBtnText} />
        </View>
      )}

      <Text style={[styles.label, { color: colors.secondaryBtnText }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default SecondaryButton;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  // Small nudge so the icon and label optical centers align properly.
  iconWrapper: {
    marginRight: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
