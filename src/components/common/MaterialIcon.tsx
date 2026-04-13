// src/components/common/MaterialIcon.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';

/**
 * MaterialIcon Component
 * Renders Google Material Symbols (Rounded) using a custom font.
 * Ensure 'MaterialSymbols' font is loaded in the app root.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type IconName =
  | 'person'
  | 'groups'
  | 'supervisor_account'
  | 'manage_accounts'
  | 'admin_panel_settings'
  | 'school'
  | 'class'
  | 'menu_book'
  | 'science'
  | 'calculate'
  | 'dashboard'
  | 'settings'
  | 'notifications'
  | 'check_circle'
  | 'warning';

interface MaterialIconProps {
  name: IconName;
  color?: string;
  size?: number;
  fontFamily?: string;
}

// ---------------------------------------------------------------------------
// Icon Codepoint Mapping
// Source: https://fonts.google.com/icons
// ---------------------------------------------------------------------------
const CODEPOINTS: Record<IconName, string> = {
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  color = '#000000',
  size = 24,
  fontFamily = DEFAULT_FONT,
}) => {
  const codepoint = CODEPOINTS[name];

  if (!codepoint) {
    if (__DEV__) {
      console.warn(`[MaterialIcon Error]: "${name}" is not defined in CODEPOINTS.`);
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

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  icon: {
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});

export default MaterialIcon;