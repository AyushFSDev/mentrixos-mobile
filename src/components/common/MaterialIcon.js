// src/components/common/MaterialIcon.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';

/**
 * MaterialIcon Component
 * Renders Google Material Symbols (Rounded) using a custom font.
 * Ensure 'MaterialSymbols' font is loaded in the app root.
 */

// Icon Codepoint Mapping
// Source: https://fonts.google.com/icons
const CODEPOINTS = {
  // Category: People & Management
  person: '\ue7fd',
  groups: '\uac0d',
  supervisor_account: '\ue8d3',
  manage_accounts: '\uf02e',
  admin_panel_settings: '\uef3d',

  // Category: Educational Modules
  school: '\ue80c',
  class: '\ue86e',
  menu_book: '\ue865',
  science: '\uea4b',
  calculate: '\uea5f',

  // Category: Layout & UI
  dashboard: '\ue871',
  settings: '\ue8b8',
  notifications: '\ue7f4',
  check_circle: '\ue86c',
  warning: '\ue002',
};

const DEFAULT_FONT = 'MaterialSymbols';

const MaterialIcon = ({
  name,
  color = '#000000',
  size = 24,
  fontFamily = DEFAULT_FONT,
}) => {
  const codepoint = CODEPOINTS[name];

  // Fallback rendering for missing icons during development
  if (!codepoint) {
    if (__DEV__) {
      console.warn(
        `[MaterialIcon Error]: "${name}" is not defined in CODEPOINTS.`,
      );
    }
    return <Text style={[styles.icon, { fontSize: size, color }]}>?</Text>;
  }

  return (
    <Text
      style={[styles.icon, { fontSize: size, color, fontFamily }]}
      numberOfLines={1}
      allowFontScaling={false}
    >
      {codepoint}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlignVertical: 'center',
    includeFontPadding: false, // Ensures consistent alignment across platforms
  },
});

export default MaterialIcon;
