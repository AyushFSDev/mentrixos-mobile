/**
 * @file Icon.tsx
 * @module components/common/Icon
 * @description Lightweight SVG icon registry for UI-specific icons.
 */

import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export type IconName = 'warning' | 'moon' | 'sun' | 'qr' | 'chevronRight';

interface IconProps {
  name: IconName | string;
  size?: number;
  color?: string;
}

interface BaseIconProps {
  size?: number;
  color?: string;
}

const WarningIcon: React.FC<BaseIconProps> = ({ size = 22, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2.25L1.5 20.25h21L12 2.25z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinejoin="round"
      fill="none"
    />
    <Path d="M12 9.75v4.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Circle cx={12} cy={17.25} r={0.75} fill={color} />
  </Svg>
);

const MoonIcon: React.FC<BaseIconProps> = ({ size = 22, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const SunIcon: React.FC<BaseIconProps> = ({ size = 22, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={4} stroke={color} strokeWidth={1.6} fill="none" />
    <Path
      d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </Svg>
);

const QrIcon: React.FC<BaseIconProps> = ({ size = 18, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinejoin="round"
      fill="none"
    />
    <Path d="M5 5h3v3H5zM16 5h3v3h-3zM5 16h3v3H5z" fill={color} />
    <Path
      d="M14 14h3v3h-3zM17 17h3v3h-3zM14 17h3"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const ChevronRightIcon: React.FC<BaseIconProps> = ({ size = 18, color = '#1A7AFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 18l6-6-6-6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ICONS: Record<string, React.FC<BaseIconProps>> = {
  warning: WarningIcon,
  moon: MoonIcon,
  sun: SunIcon,
  qr: QrIcon,
  chevronRight: ChevronRightIcon,
};

const Icon: React.FC<IconProps> = ({ name, size, color }) => {
  const IconComponent = ICONS[name];

  if (!IconComponent) {
    if (__DEV__) {
      console.warn(`[Icon] Unknown icon name: "${name}". Add it to ICONS in Icon.tsx.`);
    }
    return null;
  }

  return <IconComponent size={size} color={color} />;
};

export default Icon;

