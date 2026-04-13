import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface DeviceType {
  width: number;
  height: number;
  isLandscape: boolean;
  isTablet: boolean;
  isWide: boolean;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
/**
 * Lightweight device/layout helper.
 * Keeps "width > X" magic numbers out of screens.
 */
export const useDeviceType = (): DeviceType => {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isLandscape = width > height;
    const isTablet = width >= 768;
    const isWide = width > 800;

    return { width, height, isLandscape, isTablet, isWide };
  }, [width, height]);
};