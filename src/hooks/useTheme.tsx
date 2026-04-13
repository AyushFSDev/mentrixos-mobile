/**
 * @file useTheme.tsx
 * @module hooks/useTheme
 * @description Theme context that provides colors, dark-mode state, and
 * theme controls to every component in the tree.
 *
 * Supported modes:
 *   'system'  — follows the OS color scheme (default)
 *   'light'   — forced light regardless of OS setting
 *   'dark'    — forced dark regardless of OS setting
 *   'inverse' — uses the opposite of OS color scheme
 *
 * Usage:
 *   const { colors, isDark, toggleTheme } = useTheme();
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, ColorPalette } from '../theme/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type ThemeMode = 'system' | 'light' | 'dark' | 'inverse';

interface ThemeContextValue {
  colors: ColorPalette;
  isDark: boolean;
  themeMode: ThemeMode;
  loaded: boolean;
  toggleTheme: () => Promise<void>;
  resetToSystem: () => Promise<void>;
  setInverseMode: () => Promise<void>;
}

interface ThemeProviderProps {
  children: ReactNode;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const THEME_STORAGE_KEY = 'mentrixos_theme_preference';
const VALID_MODES = new Set<ThemeMode>(['light', 'dark', 'inverse']);

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const ThemeContext = createContext<ThemeContextValue | null>(null);

// ---------------------------------------------------------------------------
// ThemeProvider
// ---------------------------------------------------------------------------
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [systemIsDark, setSystemIsDark] = useState<boolean>(
    Appearance.getColorScheme() === 'dark',
  );
  const [systemInvertEnabled, setSystemInvertEnabled] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  // ── Listen for OS-level theme changes ─────────────────────────────────────
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemIsDark(colorScheme === 'dark');
    });
    return () => subscription?.remove?.();
  }, []);

  // ── Listen for OS invert-colors accessibility setting ─────────────────────
  useEffect(() => {
    let mounted = true;

    // AccessibilityInfo.isInvertColorsEnabled is iOS-only; guard gracefully.
    try {
      const { AccessibilityInfo } = require('react-native');
      AccessibilityInfo.isInvertColorsEnabled?.()
        ?.then((enabled: boolean) => {
          if (mounted) setSystemInvertEnabled(Boolean(enabled));
        })
        ?.catch(() => {});

      const sub = AccessibilityInfo.addEventListener?.(
        'invertColorsChanged',
        (enabled: boolean) => {
          setSystemInvertEnabled(Boolean(enabled));
        },
      );

      return () => {
        mounted = false;
        sub?.remove?.();
      };
    } catch {
      return () => { mounted = false; };
    }
  }, []);

  // ── Load persisted theme preference on mount ──────────────────────────────
  useEffect(() => {
    const loadPreference = async (): Promise<void> => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        setThemeMode(
          saved && VALID_MODES.has(saved as ThemeMode)
            ? (saved as ThemeMode)
            : 'system',
        );
      } catch (e) {
        console.warn('[ThemeProvider] Failed to load theme preference:', e);
        setThemeMode('system');
      } finally {
        setLoaded(true);
      }
    };

    loadPreference();
  }, []);

  // ── Derive effective dark state ────────────────────────────────────────────
  const effectiveIsDark: boolean =
    themeMode === 'dark'
      ? true
      : themeMode === 'light'
        ? false
        : themeMode === 'inverse'
          ? !systemIsDark
          : systemInvertEnabled
            ? !systemIsDark
            : systemIsDark;

  const colors: ColorPalette = effectiveIsDark ? darkColors : lightColors;
  const isDark: boolean = effectiveIsDark;

  // ── Theme controls ────────────────────────────────────────────────────────
  const toggleTheme = useCallback(async (): Promise<void> => {
    const next: ThemeMode = isDark ? 'light' : 'dark';
    setThemeMode(next);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, next);
    } catch (e) {
      console.warn('[ThemeProvider] Failed to persist theme preference:', e);
    }
  }, [isDark]);

  const resetToSystem = useCallback(async (): Promise<void> => {
    setThemeMode('system');
    try {
      await AsyncStorage.removeItem(THEME_STORAGE_KEY);
    } catch (e) {
      console.warn('[ThemeProvider] Failed to clear theme preference:', e);
    }
  }, []);

  const setInverseMode = useCallback(async (): Promise<void> => {
    setThemeMode('inverse');
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, 'inverse');
    } catch (e) {
      console.warn('[ThemeProvider] Failed to persist inverse mode:', e);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        colors,
        isDark,
        themeMode,
        loaded,
        toggleTheme,
        resetToSystem,
        setInverseMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// useTheme hook
// ---------------------------------------------------------------------------
export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within <ThemeProvider>.');
  }
  return ctx;
};