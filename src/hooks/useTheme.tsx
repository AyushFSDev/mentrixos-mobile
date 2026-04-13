/**
 * @file useTheme.tsx
 * @module hooks/useTheme
 * @description Theme context that provides colors, dark-mode state, and
 * theme controls to every component in the tree.
 *
 * ── Supported modes ──────────────────────────────────────────────────────────
 *   'system'  — Follows the OS color scheme (default).
 *   'light'   — Forced light regardless of OS setting.
 *   'dark'    — Forced dark regardless of OS setting.
 *   'inverse' — Opposite of the OS color scheme.
 *               Also activates automatically when the iOS "Invert Colors"
 *               accessibility setting is enabled.
 *
 * ── Context value ─────────────────────────────────────────────────────────────
 *   colors        — Active color palette (lightColors or darkColors)
 *   isDark        — True when the effective theme is dark
 *   themeMode     — Current mode string: 'system' | 'light' | 'dark' | 'inverse'
 *   loaded        — False until the persisted preference has been read;
 *                   use this to delay rendering and avoid a light→dark flash.
 *   toggleTheme   — Flips between 'light' and 'dark'; does not affect 'system'
 *   resetToSystem — Removes the manual override; returns to OS-driven theming
 *   setInverseMode — Locks the theme to the inverse of the OS scheme
 *
 * Setup:
 *   Wrap your app root with <ThemeProvider> before any component that calls useTheme.
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

/** All supported theme modes. */
export type ThemeMode = 'system' | 'light' | 'dark' | 'inverse';

interface ThemeContextValue {
  colors:        ColorPalette;
  isDark:        boolean;
  themeMode:     ThemeMode;
  loaded:        boolean;
  toggleTheme:   () => Promise<void>;
  resetToSystem: () => Promise<void>;
  setInverseMode:() => Promise<void>;
}

interface ThemeProviderProps {
  children: ReactNode;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** AsyncStorage key for the persisted theme preference. */
const THEME_STORAGE_KEY = 'mentrixos_theme_preference';

/**
 * Modes that can be persisted to storage.
 * 'system' is the default and is represented by the absence of a stored value.
 */
const PERSISTABLE_MODES = new Set<ThemeMode>(['light', 'dark', 'inverse']);

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const ThemeContext = createContext<ThemeContextValue | null>(null);

// ---------------------------------------------------------------------------
// ThemeProvider
// ---------------------------------------------------------------------------
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode,           setThemeMode]           = useState<ThemeMode>('system');
  const [systemIsDark,        setSystemIsDark]        = useState<boolean>(
    Appearance.getColorScheme() === 'dark',
  );
  const [systemInvertEnabled, setSystemInvertEnabled] = useState<boolean>(false);

  // False until the persisted preference has been read — prevents a flash.
  const [loaded, setLoaded] = useState<boolean>(false);

  // ── Listen for OS-level color scheme changes ───────────────────────────────
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemIsDark(colorScheme === 'dark');
    });
    return () => subscription?.remove?.();
  }, []);

  // ── Listen for iOS "Invert Colors" accessibility setting ───────────────────
  // AccessibilityInfo.isInvertColorsEnabled is iOS-only; the require() is
  // guarded in a try/catch so it degrades gracefully on Android.
  useEffect(() => {
    let mounted = true;

    try {
      const { AccessibilityInfo } = require('react-native');

      // Read the initial value.
      AccessibilityInfo.isInvertColorsEnabled?.()
        ?.then((enabled: boolean) => {
          if (mounted) setSystemInvertEnabled(Boolean(enabled));
        })
        ?.catch(() => {});

      // Subscribe to future changes.
      const subscription = AccessibilityInfo.addEventListener?.(
        'invertColorsChanged',
        (enabled: boolean) => setSystemInvertEnabled(Boolean(enabled)),
      );

      return () => {
        mounted = false;
        subscription?.remove?.();
      };
    } catch {
      return () => { mounted = false; };
    }
  }, []);

  // ── Load persisted theme preference on mount ───────────────────────────────
  useEffect(() => {
    const loadPreference = async (): Promise<void> => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        // Only apply recognized modes; treat anything else as 'system'.
        setThemeMode(
          saved && PERSISTABLE_MODES.has(saved as ThemeMode)
            ? (saved as ThemeMode)
            : 'system',
        );
      } catch (error) {
        // Storage read failure is non-fatal — default to system theme.
        console.warn('[ThemeProvider] Failed to load theme preference:', error);
        setThemeMode('system');
      } finally {
        setLoaded(true);
      }
    };

    loadPreference();
  }, []);

  // ── Derive the effective dark state ───────────────────────────────────────
  // Evaluation order matters — explicit modes take priority over system defaults.
  const effectiveIsDark: boolean =
    themeMode === 'dark'    ? true        :
    themeMode === 'light'   ? false       :
    themeMode === 'inverse' ? !systemIsDark :
    // 'system' mode — also respects iOS Invert Colors accessibility setting.
    systemInvertEnabled     ? !systemIsDark :
    systemIsDark;

  const colors: ColorPalette = effectiveIsDark ? darkColors : lightColors;
  const isDark: boolean      = effectiveIsDark;

  // ── Theme controls ─────────────────────────────────────────────────────────

  /**
   * Toggles between 'light' and 'dark', persisting the selection.
   * When called from 'system' or 'inverse' mode, locks to the opposite of
   * the current effective theme.
   */
  const toggleTheme = useCallback(async (): Promise<void> => {
    const next: ThemeMode = isDark ? 'light' : 'dark';
    setThemeMode(next);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, next);
    } catch (error) {
      console.warn('[ThemeProvider] Failed to persist theme preference:', error);
    }
  }, [isDark]);

  /**
   * Clears the manual override and returns to OS-driven theming.
   * Also removes the persisted key so the next launch also uses 'system'.
   */
  const resetToSystem = useCallback(async (): Promise<void> => {
    setThemeMode('system');
    try {
      await AsyncStorage.removeItem(THEME_STORAGE_KEY);
    } catch (error) {
      console.warn('[ThemeProvider] Failed to clear theme preference:', error);
    }
  }, []);

  /**
   * Locks the theme to the inverse of the current OS color scheme.
   * Useful as a manual accessibility aid when the system Invert Colors
   * setting is unavailable or not in use.
   */
  const setInverseMode = useCallback(async (): Promise<void> => {
    setThemeMode('inverse');
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, 'inverse');
    } catch (error) {
      console.warn('[ThemeProvider] Failed to persist inverse mode:', error);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{ colors, isDark, themeMode, loaded, toggleTheme, resetToSystem, setInverseMode }}
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