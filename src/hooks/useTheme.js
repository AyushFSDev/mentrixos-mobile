/**
 * @file useTheme.js
 * @module hooks/useTheme
 * @description Theme context that provides colors, dark-mode state, and
 * theme controls to every component in the tree.
 *
 * Supported modes:
 *   'system' — follows the OS color scheme (default)
 *   'light'  — forced light regardless of OS setting
 *   'dark'   — forced dark regardless of OS setting
 *
 * The selected mode is persisted to AsyncStorage under THEME_STORAGE_KEY
 * so the user's preference survives app restarts.
 *
 * Context value:
 *   colors       — Active color palette (lightColors or darkColors)
 *   isDark       — Boolean; true when the effective theme is dark
 *   themeMode    — Current mode string: 'system' | 'light' | 'dark'
 *   loaded       — False until the persisted preference has been read;
 *                  use this to delay rendering if you want to avoid a flash.
 *   toggleTheme  — Flips between light and dark (does not touch 'system')
 *   resetToSystem — Removes the override and returns to OS-driven theming
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
} from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '../theme/colors';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** AsyncStorage key under which the user's theme preference is persisted. */
const THEME_STORAGE_KEY = 'mentrixos_theme_preference';

/** Valid persisted values — anything else is treated as 'system'. */
const VALID_MODES = new Set(['light', 'dark']);

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const ThemeContext = createContext(null);

// ---------------------------------------------------------------------------
// ThemeProvider
// ---------------------------------------------------------------------------
export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('system');
  const [systemIsDark, setSystemIsDark] = useState(
    Appearance.getColorScheme() === 'dark',
  );
  // `loaded` gates rendering in screens that want to avoid a light→dark flash.
  const [loaded, setLoaded] = useState(false);

  // ── Listen for OS-level theme changes ──────────────────────────────────────
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemIsDark(colorScheme === 'dark');
    });
    // Clean up the listener when the provider unmounts.
    return () => subscription?.remove?.();
  }, []);

  // ── Load persisted theme preference on mount ───────────────────────────────
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        // Only apply recognized values; fall back to 'system' for anything else.
        setThemeMode(VALID_MODES.has(saved) ? saved : 'system');
      } catch {
        // AsyncStorage read failure is non-fatal — default to system theme.
        setThemeMode('system');
      } finally {
        setLoaded(true);
      }
    };

    loadPreference();
  }, []);

  // ── Derive effective dark state from mode + OS setting ─────────────────────
  const isDark =
    themeMode === 'dark' ? true : themeMode === 'light' ? false : systemIsDark; // 'system' — delegate to the OS

  const colors = isDark ? darkColors : lightColors;

  // ── Theme controls ─────────────────────────────────────────────────────────

  /**
   * Toggles between 'light' and 'dark', persisting the selection.
   * Calling this while in 'system' mode will lock to the opposite of the
   * current effective theme.
   */
  const toggleTheme = useCallback(async () => {
    const next = isDark ? 'light' : 'dark';
    setThemeMode(next);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Persistence failure is non-fatal — the in-memory state still updates.
    }
  }, [isDark]);

  /**
   * Removes the manual override and returns to OS-driven theming.
   * Also deletes the persisted preference so the next launch also uses 'system'.
   */
  const resetToSystem = useCallback(async () => {
    setThemeMode('system');
    try {
      await AsyncStorage.removeItem(THEME_STORAGE_KEY);
    } catch {
      // Non-fatal — in-memory state is already updated.
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{ colors, isDark, themeMode, loaded, toggleTheme, resetToSystem }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// useTheme hook
// ---------------------------------------------------------------------------
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within <ThemeProvider>.');
  }
  return ctx;
};
