/**
 * @file Icon.tsx
 * @module components/common/Icon
 * @description Lightweight SVG icon registry for UI-specific icons that are
 * not covered by the vector-icon font libraries.
 *
 * Each icon is a self-contained functional component. The unified `Icon`
 * default export lets consumers reference any icon by name without importing
 * individual components.
 *
 * Prerequisites:
 *   npm install react-native-svg
 *   # iOS only:
 *   cd ios && pod install
 *
 * Available icon names:
 *   'warning' | 'moon' | 'sun' | 'qr' | 'chevronRight'
 *
 * Usage:
 *   <Icon name="warning"      size={22} color="#e53e3e" />
 *   <Icon name="moon"         size={22} color="#333"    />
 *   <Icon name="chevronRight" size={18} color="#1A7AFF" />
 */

import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** String union of all registered icon names — use for typed icon props. */
export type IconName = 'warning' | 'moon' | 'sun' | 'qr' | 'chevronRight';

interface IconProps {
  /** Icon name from the registry. Unknown names log a warning in dev and render null. */
  name: IconName | string;
  size?: number;
  color?: string;
}

interface BaseIconProps {
  size?: number;
  color?: string;
}

// ---------------------------------------------------------------------------
// Individual icon components
// Each accepts only `size` and `color` so they compose cleanly with any layout.
// ---------------------------------------------------------------------------

/**
 * WarningIcon — equilateral triangle with an exclamation mark.
 * Used for validation errors, alerts, and destructive action warnings.
 */
const WarningIcon: React.FC<BaseIconProps> = ({
  size = 22,
  color = '#000',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Outer triangle border */}
    <Path
      d="M12 2.25L1.5 20.25h21L12 2.25z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinejoin="round"
      fill="none"
    />
    {/* Exclamation bar */}
    <Path
      d="M12 9.75v4.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    {/* Exclamation dot */}
    <Circle cx={12} cy={17.25} r={0.75} fill={color} />
  </Svg>
);

/**
 * MoonIcon — crescent moon shape.
 * Shown in the theme toggle when the app is in light mode (tap → switch to dark).
 */
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

/**
 * SunIcon — circle with radiating rays.
 * Shown in the theme toggle when the app is in dark mode (tap → switch to light).
 */
const SunIcon: React.FC<BaseIconProps> = ({ size = 22, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Central sun disc */}
    <Circle
      cx={12}
      cy={12}
      r={4}
      stroke={color}
      strokeWidth={1.6}
      fill="none"
    />
    {/* Eight radiating rays at cardinal and diagonal angles */}
    <Path
      d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * QrIcon — simplified QR code pattern.
 * Used on the "Join Institute" action where the user scans or enters a code.
 */
const QrIcon: React.FC<BaseIconProps> = ({ size = 18, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Three outer corner squares */}
    <Path
      d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinejoin="round"
      fill="none"
    />
    {/* Three inner corner square fills */}
    <Path d="M5 5h3v3H5zM16 5h3v3h-3zM5 16h3v3H5z" fill={color} />
    {/* Bottom-right data cells */}
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

/**
 * ChevronRightIcon — right-pointing chevron (›).
 * Used as a trailing indicator on list items and action buttons.
 */
const ChevronRightIcon: React.FC<BaseIconProps> = ({
  size = 18,
  color = '#1A7AFF',
}) => (
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

// ---------------------------------------------------------------------------
// Icon registry
// Maps string names to component implementations.
// Add new entries here and they become available via the unified Icon component.
// ---------------------------------------------------------------------------
const ICONS: Record<string, React.FC<BaseIconProps>> = {
  warning: WarningIcon,
  moon: MoonIcon,
  sun: SunIcon,
  qr: QrIcon,
  chevronRight: ChevronRightIcon,
};

// ---------------------------------------------------------------------------
// Unified Icon component
// Looks up the icon by name and renders it.
// Returns null for unknown names — fails silently in production without crashing.
// ---------------------------------------------------------------------------
const Icon: React.FC<IconProps> = ({ name, size, color }) => {
  const IconComponent = ICONS[name];

  if (!IconComponent) {
    if (__DEV__) {
      console.warn(
        `[Icon] Unknown icon name: "${name}". Add it to ICONS in Icon.tsx.`,
      );
    }
    return null;
  }

  return <IconComponent size={size} color={color} />;
};

export default Icon;
