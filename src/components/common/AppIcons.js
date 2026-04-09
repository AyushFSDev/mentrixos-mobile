/**
 * @file AppIcons.js
 * @module components/common/AppIcons
 * @description Centralized SVG icon library for MentrixOS.
 *
 * All icons are built with react-native-svg primitives and accept
 * a uniform set of props so they can be dropped in anywhere without
 * extra configuration.
 *
 * Usage:
 *   import AppIcons, { Location, Verified } from './AppIcons';
 *
 *   // Named import
 *   <Location size={14} color={colors.textMuted} />
 *
 *   // Default map import
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
// Default prop values shared by every icon component
// ---------------------------------------------------------------------------
const DEFAULTS = {
  size: 24,
  color: 'currentColor',
  strokeWidth: 2,
};

// ---------------------------------------------------------------------------
// ArrowLeft
// Navigates the user back to the previous screen.
// ---------------------------------------------------------------------------
export const ArrowLeft = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Horizontal shaft */}
    <Path
      d="M19 12H5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Arrowhead — bottom leg and top leg */}
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
// Represents a search / find action (magnifying glass).
// ---------------------------------------------------------------------------
export const Search = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Lens */}
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={strokeWidth} />
    {/* Handle */}
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
// Dismisses a modal, clears a field, or cancels an action (X mark).
// ---------------------------------------------------------------------------
export const Close = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Diagonal line — top-right to bottom-left */}
    <Line
      x1="18"
      y1="6"
      x2="6"
      y2="18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    {/* Diagonal line — top-left to bottom-right */}
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
// Indicates a geographic place or address (map pin).
// ---------------------------------------------------------------------------
export const Location = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Outer teardrop shape */}
    <Path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Inner dot marking the exact point */}
    <Circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

// ---------------------------------------------------------------------------
// Verified
// Confirms a trusted / authenticated entity (shield with checkmark).
// Uses the filled Material Symbols path — does not use strokeWidth.
// ---------------------------------------------------------------------------
export const Verified = ({ size = DEFAULTS.size, color = DEFAULTS.color }) => (
  <Svg viewBox="0 -960 960 960" width={size} height={size}>
    {/*
     * Outer shield ring + inner checkmark rendered as a single compound path.
     * The viewBox originates from the Material Symbols icon set.
     */}
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
// Signals a warning, validation error, or important notice.
// ---------------------------------------------------------------------------
export const AlertCircle = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Outer circle boundary */}
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
    {/* Vertical bar of the exclamation mark */}
    <Line
      x1="12"
      y1="8"
      x2="12"
      y2="12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    {/* Dot of the exclamation mark — x2="12.01" avoids SVG zero-length line bug */}
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
// Represents a successfully selected or completed state.
// ---------------------------------------------------------------------------
export const CheckCircle = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Outer circle */}
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
    {/* Checkmark tick */}
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
// Triggers the sign-out flow (door with arrow pointing outward).
// ---------------------------------------------------------------------------
export const LogOut = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Left panel representing the door / app frame */}
    <Path
      d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Arrowhead pointing right (exit direction) */}
    <Polyline
      points="16 17 21 12 16 7"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Horizontal arrow shaft */}
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
// Used for list-item drill-downs, carousels, and pagination.
// ---------------------------------------------------------------------------
export const ChevronRight = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Single right-pointing chevron */}
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
// Toggles a password / sensitive field to visible (open eye).
// ---------------------------------------------------------------------------
export const EyeOn = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Outer eyelid curve */}
    <Path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Iris / pupil */}
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

// ---------------------------------------------------------------------------
// EyeOff
// Toggles a password / sensitive field to hidden (eye with strike-through).
// ---------------------------------------------------------------------------
export const EyeOff = ({
  size = DEFAULTS.size,
  color = DEFAULTS.color,
  strokeWidth = DEFAULTS.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Lower eyelid — visible portion when partially covered */}
    <Path
      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Upper eyelid — right side + hint of visible content */}
    <Path
      d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Partial iris arc (top-left quadrant) */}
    <Path
      d="M14.12 14.12a3 3 0 1 1-4.24-4.24"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Diagonal strike-through line across the entire icon */}
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
// Example: <AppIcons.Location size={20} color="#333" />
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
