import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const COMMUNITY_ICON_MAP: Record<string, string> = {
  'admin-panel-settings': 'shield-account',
  'family-restroom': 'human-male-female-child',
};

interface RoleIconProps {
  name?: string | null;
  color?: string;
  size?: number;
  fallback?: string;
}

const RoleIcon: React.FC<RoleIconProps> = ({
  name,
  color = '#757575',
  size = 24,
  fallback = 'help-outline',
}) => {
  const iconName = (name ?? '').replace(/_/g, '-').toLowerCase() || fallback;
  const communityName = COMMUNITY_ICON_MAP[iconName];

  if (communityName) {
    return <MaterialCommunityIcons name={communityName} size={size} color={color} />;
  }

  return <MaterialIcons name={iconName} size={size} color={color} />;
};

export default RoleIcon;

