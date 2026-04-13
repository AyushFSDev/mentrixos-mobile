/**
 * @file useDeviceType.ts
 * @module hooks/useDeviceType
 * @description Reactive layout helper that classifies the current window
 * dimensions into semantic device-type flags.
 *
 * Eliminates "magic number" width comparisons scattered across screens by
 * centralizing the breakpoint definitions in one place.
 *
 * Breakpoints:
 *   isTablet    — width ≥ 768px  (standard tablet threshold)
 *   isWide      — width > 800px  (wide tablet / small desktop)
 *   isLandscape — width > height (any device in landscape orientation)
 *
 * Usage:
 *   const { isTablet, isLandscape, width } = useDeviceType();
 *   const columns = isTablet ? 3 : 2;
 */

import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

// ---------------------------------------------------------------------------
// Breakpoints
// Defined here so all threshold changes are made in one place.
// ---------------------------------------------------------------------------
const BREAKPOINTS = {
  TABLET: 768, // Matches common CSS tablet breakpoint
  WIDE: 800, // For wider layouts on large tablets / foldables
} as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface DeviceType {
  /** Current window width in logical pixels. */
  width: number;
  /** Current window height in logical pixels. */
  height: number;
  /** True when the device is in landscape orientation (width > height). */
  isLandscape: boolean;
  /** True when width ≥ 768px — standard tablet size. */
  isTablet: boolean;
  /** True when width > 800px — wide tablet or small desktop layout. */
  isWide: boolean;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export const useDeviceType = (): DeviceType => {
  const { width, height } = useWindowDimensions();

  return useMemo<DeviceType>(
    () => ({
      width,
      height,
      isLandscape: width > height,
      isTablet: width >= BREAKPOINTS.TABLET,
      isWide: width > BREAKPOINTS.WIDE,
    }),
    [width, height],
  );
};
