/**
 * @file useAuth.tsx
 * @module hooks/useAuth
 * @description Global authentication context — stores and persists the current
 * user session across app restarts using AsyncStorage.
 *
 * Context value:
 *   user              — Authenticated user object (null when logged out)
 *   institutes        — List of institutes the user belongs to
 *   selectedInstitute — The institute currently being operated in
 *   selectedRole      — The role selected for this session
 *   isAuthLoading     — True while the persisted session is being restored on boot
 *   setUser           — Persists a user (pass null to clear)
 *   setInstitutes     — Persists the institutes list (pass [] to clear)
 *   setSelectedInstitute — Persists the active institute (pass null to clear)
 *   setSelectedRole   — Persists the active role (pass null to clear)
 *   logout            — Clears all session data and revokes tokens
 *
 * Setup:
 *   Wrap your app root with <AuthProvider> before any screen that calls useAuth.
 *
 * Usage:
 *   const { user, isAuthLoading, logout } = useAuth();
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearTokens } from '../services/api-service';

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

/** Shape of the authenticated user object returned by the login API. */
export interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  [key: string]: unknown; // Allows additional fields without breaking the type
}

/** An institute the user is enrolled in, including its available roles. */
export interface Institute {
  tenant_id:    string;
  institute_id: string;
  name?:        string;
  roles:        Role[];
  [key: string]: unknown;
}

/** A role the user can assume within a given institute. */
export interface Role {
  role_id:    string;
  role_name?: string;
  name?:      string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Context types
// ---------------------------------------------------------------------------

interface AuthContextValue {
  user:                 User | null;
  institutes:           Institute[];
  selectedInstitute:    Institute | null;
  selectedRole:         Role | null;
  isAuthLoading:        boolean;
  setUser:              (userData: User | null) => Promise<void>;
  setInstitutes:        (data: Institute[]) => Promise<void>;
  setSelectedInstitute: (institute: Institute | null) => Promise<void>;
  setSelectedRole:      (role: Role | null) => Promise<void>;
  logout:               () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// ---------------------------------------------------------------------------
// Storage keys
// Centralized so a typo in one place cannot silently break persistence.
// ---------------------------------------------------------------------------
const STORAGE_KEYS = {
  USER:               'user',
  INSTITUTES:         'institutes',
  SELECTED_INSTITUTE: 'selected_institute',
  SELECTED_ROLE:      'selected_role',
} as const;

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const AuthContext = createContext<AuthContextValue | null>(null);

// ---------------------------------------------------------------------------
// AuthProvider
// ---------------------------------------------------------------------------
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user,              setUserState]              = useState<User | null>(null);
  const [institutes,        setInstitutesState]        = useState<Institute[]>([]);
  const [selectedInstitute, setSelectedInstituteState] = useState<Institute | null>(null);
  const [selectedRole,      setSelectedRoleState]      = useState<Role | null>(null);

  // True while AsyncStorage is being read on mount — prevents the app from
  // flashing the login screen before the persisted session has been checked.
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // ── Restore session on mount ──────────────────────────────────────────────
  useEffect(() => {
    const restoreSession = async (): Promise<void> => {
      try {
        // Read all four values in parallel to minimise startup latency.
        const [rawUser, rawInstitutes, rawInstitute, rawRole] =
          await Promise.all([
            AsyncStorage.getItem(STORAGE_KEYS.USER),
            AsyncStorage.getItem(STORAGE_KEYS.INSTITUTES),
            AsyncStorage.getItem(STORAGE_KEYS.SELECTED_INSTITUTE),
            AsyncStorage.getItem(STORAGE_KEYS.SELECTED_ROLE),
          ]);

        if (rawUser)       setUserState(JSON.parse(rawUser) as User);
        if (rawInstitutes) setInstitutesState(JSON.parse(rawInstitutes) as Institute[]);
        if (rawInstitute)  setSelectedInstituteState(JSON.parse(rawInstitute) as Institute);
        if (rawRole)       setSelectedRoleState(JSON.parse(rawRole) as Role);
      } catch (error) {
        // Corrupted storage is non-fatal — the user will see the login screen.
        console.warn('[AuthProvider] Failed to restore session:', error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ── Setters ───────────────────────────────────────────────────────────────
  // Each setter updates both React state and AsyncStorage atomically.
  // Passing null / [] removes the persisted value so stale data never
  // accumulates between sessions.

  const setUser = async (userData: User | null): Promise<void> => {
    setUserState(userData);
    if (userData) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    }
  };

  const setInstitutes = async (data: Institute[]): Promise<void> => {
    setInstitutesState(data);
    if (data?.length) {
      await AsyncStorage.setItem(STORAGE_KEYS.INSTITUTES, JSON.stringify(data));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.INSTITUTES);
    }
  };

  const setSelectedInstitute = async (institute: Institute | null): Promise<void> => {
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

  const setSelectedRole = async (role: Role | null): Promise<void> => {
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
   *   1. Revokes tokens on the server (failure is swallowed — always clears locally).
   *   2. Removes all persisted session keys from AsyncStorage.
   *   3. Resets all local state to its initial empty values.
   */
  const logout = async (): Promise<void> => {
    try {
      await clearTokens();
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.warn('[AuthProvider] Logout cleanup error:', error);
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
        institutes,
        selectedInstitute,
        selectedRole,
        isAuthLoading,
        setUser,
        setInstitutes,
        setSelectedInstitute,
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
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>.');
  }
  return ctx;
};