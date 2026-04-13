/**
 * @file RoleIcon.tsx
 * @module components/common/RoleIcon
 * @description Resolves a role's icon name (stored in the database) to the
 * correct React Native vector icon component.
 *
 * Resolution order:
 *   1. Normalize the DB value  (underscores → dashes, lowercase)
 *   2. Check COMMUNITY_ICON_MAP — icons absent from MaterialIcons but
 *      present in MaterialCommunityIcons are mapped here.
 *   3. Fall back to MaterialIcons (covers the vast majority of cases).
 *
 * Role → icon reference:
 * ┌────────────────────┬──────────────────────────┬────────────────────────────────┐
 * │ Role               │ DB value                 │ Resolved icon                  │
 * ├────────────────────┼──────────────────────────┼────────────────────────────────┤
 * │ Super Admin        │ admin_panel_settings     │ MCommunity: shield-account     │
 * │ Institute Admin    │ school                   │ MaterialIcons: school          │
 * │ Trainer            │ person                   │ MaterialIcons: person          │
 * │ Student            │ groups                   │ MaterialIcons: groups          │
 * │ Parent             │ family_restroom          │ MCommunity: human-male-female  │
 * │ Staff              │ badge                    │ MaterialIcons: badge           │
 * └────────────────────┴──────────────────────────┴────────────────────────────────┘
 *
 * @prop name     — Icon name as stored in the DB (underscores or dashes both accepted).
 * @prop color    — Icon color as a hex string, e.g. "#4CAF50". Default: '#757575'
 * @prop size     — Icon size in pixels. Default: 24
 * @prop fallback — Icon name to render when `name` is missing or unrecognized. Default: 'help-outline'
 *
 * Usage:
 *   <RoleIcon name={role.icon_name} color={role.icon_color} size={28} />
 */

import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// ---------------------------------------------------------------------------
// Community icon overrides
// Icons listed here are missing from MaterialIcons but available in
// MaterialCommunityIcons. Add new entries as the DB grows.
//
// Key   = normalized icon name (dashes, lowercase)
// Value = exact MaterialCommunityIcons icon name
// ---------------------------------------------------------------------------
const COMMUNITY_ICON_MAP: Record<string, string> = {
  'admin-panel-settings': 'shield-account', // closest MCommunity equivalent
  'family-restroom': 'human-male-female-child',
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface RoleIconProps {
  name?: string | null;
  color?: string;
  size?: number;
  fallback?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const RoleIcon: React.FC<RoleIconProps> = ({
  name,
  color = '#757575',
  size = 24,
  fallback = 'help-outline',
}) => {
  // Step 1 — Normalize: replace underscores with dashes and lowercase.
  // DB stores "admin_panel_settings"; vector icon libs expect "admin-panel-settings".
  const normalizedName =
    (name ?? '').replace(/_/g, '-').toLowerCase() || fallback;

  // Step 2 — Check if this icon lives in MaterialCommunityIcons.
  const communityName = COMMUNITY_ICON_MAP[normalizedName];

  if (communityName) {
    return (
      <MaterialCommunityIcons name={communityName} size={size} color={color} />
    );
  }

  // Step 3 — Default: render from MaterialIcons.
  return <MaterialIcons name={normalizedName} size={size} color={color} />;
};

export default RoleIcon;
