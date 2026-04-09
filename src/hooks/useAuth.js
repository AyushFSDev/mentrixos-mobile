/**
 * @file useAuth.js
 * @module hooks/useAuth
 * @description Global authentication context — stores and persists the current
 * user session across app restarts using AsyncStorage.
 *
 * Provides:
 *   user              — Authenticated user object (null if logged out)
 *   institutes        — List of institutes the user belongs to
 *   selectedInstitute — The institute the user is currently operating in
 *   selectedRole      — The role the user selected for this session
 *   setUser           — Persists a new user value (pass null to clear)
 *   setInstitutes     — Persists the institutes list (pass [] to clear)
 *   setSelectedInstitute — Persists the active institute (pass null to clear)
 *   setSelectedRole   — Persists the active role (pass null to clear)
 *   logout            — Clears all session data and revokes tokens
 *
 * Setup:
 *   Wrap your app root with <AuthProvider> before any screen that calls useAuth.
 *
 * Usage:
 *   const { user, logout } = useAuth();
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearTokens } from '../services/api-service';

// ---------------------------------------------------------------------------
// Storage keys — centralized so a typo in one place doesn't break persistence.
// ---------------------------------------------------------------------------
const STORAGE_KEYS = {
  USER: 'user',
  INSTITUTES: 'institutes',
  SELECTED_INSTITUTE: 'selected_institute',
  SELECTED_ROLE: 'selected_role',
};

const AuthContext = createContext(null);

// ---------------------------------------------------------------------------
// AuthProvider
// ---------------------------------------------------------------------------
export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [institutes, setInstitutesState] = useState([]);
  const [selectedInstitute, setSelectedInstituteState] = useState(null);
  const [selectedRole, setSelectedRoleState] = useState(null);

  // ── On mount: restore all persisted session data in a single read pass ────
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [rawUser, rawInstitutes, rawInstitute, rawRole] =
          await Promise.all([
            AsyncStorage.getItem(STORAGE_KEYS.USER),
            AsyncStorage.getItem(STORAGE_KEYS.INSTITUTES),
            AsyncStorage.getItem(STORAGE_KEYS.SELECTED_INSTITUTE),
            AsyncStorage.getItem(STORAGE_KEYS.SELECTED_ROLE),
          ]);

        if (rawUser) setUserState(JSON.parse(rawUser));
        if (rawInstitutes) setInstitutesState(JSON.parse(rawInstitutes));
        if (rawInstitute) setSelectedInstituteState(JSON.parse(rawInstitute));
        if (rawRole) setSelectedRoleState(JSON.parse(rawRole));
      } catch {
        // Corrupted storage is non-fatal — the user will see the login screen.
      }
    };

    restoreSession();
  }, []);

  // ── Setters — each updates both React state and AsyncStorage atomically ───

  /**
   * Persists the authenticated user.
   * Pass `null` to remove the user (e.g. on logout).
   */
  const setUser = async userData => {
    setUserState(userData);
    if (userData) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    }
  };

  /**
   * Persists the list of institutes the user belongs to.
   * Pass an empty array to remove the list.
   */
  const setInstitutes = async data => {
    setInstitutesState(data);
    if (data?.length) {
      await AsyncStorage.setItem(STORAGE_KEYS.INSTITUTES, JSON.stringify(data));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.INSTITUTES);
    }
  };

  /**
   * Persists the currently active institute.
   * Pass `null` to deselect (e.g. when the user switches institutes).
   */
  const setSelectedInstitute = async institute => {
    setSelectedInstituteState(institute);
    if (institute) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SELECTED_INSTITUTE,
        JSON.stringify(institute),
      );
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.SELECTED_INSTITUTE);
    }
  };

  /**
   * Persists the currently active role.
   * Pass `null` to deselect (e.g. when the user switches roles).
   */
  const setSelectedRole = async role => {
    setSelectedRoleState(role);
    if (role) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SELECTED_ROLE,
        JSON.stringify(role),
      );
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.SELECTED_ROLE);
    }
  };

  /**
   * Logs the user out:
   *   1. Revokes tokens on the server via the API service.
   *   2. Wipes all persisted session keys from AsyncStorage.
   *   3. Resets all local state to its initial empty values.
   *
   * Token revocation failure is swallowed deliberately — the local session
   * is always cleared regardless of network conditions.
   */
  const logout = async () => {
    try {
      await clearTokens();
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch {
      // Non-fatal — proceed with clearing local state even if the API call fails.
    }

    setUserState(null);
    setInstitutesState([]);
    setSelectedInstituteState(null);
    setSelectedRoleState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        institutes,
        setInstitutes,
        selectedInstitute,
        setSelectedInstitute,
        selectedRole,
        setSelectedRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// useAuth hook
// ---------------------------------------------------------------------------
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>.');
  }
  return ctx;
};
