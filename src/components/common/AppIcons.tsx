/**
 * @file AppIcons.tsx
 * @module components/common/AppIcons
 * @description Centralized SVG icon library for MentrixOS.
 *
 * Usage:
 *   import AppIcons, { Location, Verified } from './AppIcons';
 *
 *   <Location size={14} color={colors.textMuted} />
 *   <AppIcons.Verified size={16} color="#2563eb" />
 *
 * Common Props (supported by every icon):
 *   @prop {number} size        — Width and height in pixels.  Default: 24
 *   @prop {string} color       — Stroke / fill color.         Default: 'currentColor'
 *   @prop {number} strokeWidth — Stroke thickness.            Default: 2
 */

import React from 'react';
import Svg, { Path, Circle, Line, Polyline, Rect } from 'react-native-svg';

// ---------------------------------------------------------------------------
// Shared icon props type
// ---------------------------------------------------------------------------
interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// ---------------------------------------------------------------------------
// Default prop values shared by every icon component
// ---------------------------------------------------------------------------
const DEFAULTS = {
  size: 24,
  color: 'currentColor',
  strokeWidth: 2,
};

// ---------------------------------------------------------------------------
// ArrowLeft
// ---------------------------------------------------------------------------
export const ArrowLeft: React.FC<IconProps> = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 12l7 7M5 12l7-7"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------
export const Search: React.FC<IconProps> = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={strokeWidth} />
    <Line
      x1="16.5"
      y1="16.5"
      x2="22"
      y2="22"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Close
// ---------------------------------------------------------------------------
export const Close: React.FC<IconProps> = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line
      x1="18"
      y1="6"
      x2="6"
      y2="18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Line
      x1="6"
      y1="6"
      x2="18"
      y2="18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Location
// ---------------------------------------------------------------------------
export const Location: React.FC<IconProps> = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

// ---------------------------------------------------------------------------
// Verified — fill-only icon, no strokeWidth
// ---------------------------------------------------------------------------
interface VerifiedProps {
  size?: number;
  color?: string;
}

export const Verified: React.FC<VerifiedProps> = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
}) => (
  <Svg viewBox="0 -960 960 960" width={size} height={size}>
    <Path
      d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58
         76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Z
         m34-102 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96
         -102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Z
         m102-318Z
         m-42 142 226-226-56-58-170 170-86-84-56 56 142 142Z"
      fill={color}
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// AlertCircle
// ---------------------------------------------------------------------------
export const AlertCircle: React.FC<IconProps> = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
    <Line
      x1="12"
      y1="8"
      x2="12"
      y2="12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Line
      x1="12"
      y1="16"
      x2="12.01"
      y2="16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// CheckCircle
// ---------------------------------------------------------------------------
export const CheckCircle: React.FC<IconProps> = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M8 12l3 3 5-5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// LogOut
// ---------------------------------------------------------------------------
export const LogOut: React.FC<IconProps> = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="16 17 21 12 16 7"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line
      x1="21"
      y1="12"
      x2="9"
      y2="12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// ChevronRight
// ---------------------------------------------------------------------------
export const ChevronRight: React.FC<IconProps> = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 18l6-6-6-6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// EyeOn
// ---------------------------------------------------------------------------
export const EyeOn: React.FC<IconProps> = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

// ---------------------------------------------------------------------------
// EyeOff
// ---------------------------------------------------------------------------
export const EyeOff: React.FC<IconProps> = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.12 14.12a3 3 0 1 1-4.24-4.24"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line
      x1="1"
      y1="1"
      x2="23"
      y2="23"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Default export — named map for dot-notation access
// ---------------------------------------------------------------------------
const AppIcons = {
  ArrowLeft,
  Search,
  Close,
  Location,
  Verified,
  AlertCircle,
  CheckCircle,
  LogOut,
  ChevronRight,
  EyeOn,
  EyeOff,
};

export default AppIcons;