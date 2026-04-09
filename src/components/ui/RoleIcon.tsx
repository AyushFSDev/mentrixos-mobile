/**
 * RoleIcon.tsx
 * Reusable icon component for role-based icons.
 *
 * Handles:
 *   1. underscore → dash conversion  (DB stores admin_panel_settings,
 *      React Native expects admin-panel-settings)
 *   2. Automatic fallback to MaterialCommunityIcons for icons that
 *      don't exist in MaterialIcons
 */

import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// ─── Config ───────────────────────────────────────────────────────────────────

/**
 * Icons that are NOT in MaterialIcons but ARE in MaterialCommunityIcons.
 * Add more here as your DB grows.
 *
 * Key   = normalised name (dashes, lowercase)
 * Value = exact MaterialCommunityIcons name
 */
const COMMUNITY_ICON_MAP: Record<string, string> = {
  'admin-panel-settings': 'shield-account',        // closest MCommunity match
  'family-restroom':      'human-male-female-child',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface RoleIconProps {
  /** Icon name exactly as stored in DB (underscores or dashes both fine) */
  name?: string | null;
  /** Hex color string, e.g. "#4CAF50" */
  color?: string;
  size?: number;
  /** Shown when name is missing or unrecognised */
  fallback?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const RoleIcon: React.FC<RoleIconProps> = ({
  name,
  color = '#757575',
  size = 24,
  fallback = 'help-outline',
}) => {
  // 1. Normalise: replace underscores with dashes, lowercase
  const iconName = (name ?? '').replace(/_/g, '-').toLowerCase() || fallback;

  // 2. Check if this icon lives in MaterialCommunityIcons
  const communityName = COMMUNITY_ICON_MAP[iconName];

  if (communityName) {
    return (
      <MaterialCommunityIcons
        name={communityName}
        size={size}
        color={color}
      />
    );
  }

  // 3. Default: MaterialIcons
  return (
    <MaterialIcons
      name={iconName}
      size={size}
      color={color}
    />
  );
};

export default RoleIcon;


// ─── Usage Example ────────────────────────────────────────────────────────────
//
//  import RoleIcon from './RoleIcon';
//
//  // role comes from your DB / API
//  const role = {
//    icon: 'admin_panel_settings',   // DB value — underscores are fine
//    icon_color: '#1565C0',
//  };
//
//  <RoleIcon
//    name={role.icon}
//    color={role.icon_color}
//    size={28}
//  />
//
// Role mapping reference:
// ┌────────────────┬──────────────────────────┬───────────────────────────────┐
// │ Role           │ DB icon                  │ Resolved to                   │
// ├────────────────┼──────────────────────────┼───────────────────────────────┤
// │ Super Admin    │ admin_panel_settings      │ MCommunity: shield-account    │
// │ Institute Admin│ school                   │ MaterialIcons: school         │
// │ Trainer        │ person                   │ MaterialIcons: person         │
// │ Student        │ groups                   │ MaterialIcons: groups         │
// │ Parent         │ family_restroom          │ MCommunity: human-male-female │
// │ Staff          │ badge                    │ MaterialIcons: badge          │
// └────────────────┴──────────────────────────┴───────────────────────────────┘