/**
 * @file useAuth.tsx
 * @module hooks/useAuth
 * @description Global authentication context — stores and persists the current
 * user session across app restarts using AsyncStorage.
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
// Types
// ---------------------------------------------------------------------------
export interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
}

export interface Institute {
  tenant_id: string;
  institute_id: string;
  name?: string;
  roles: Role[];
  [key: string]: unknown;
}

export interface Role {
  role_id: string;
  role_name?: string;
  name?: string;
  [key: string]: unknown;
}

interface AuthContextValue {
  user: User | null;
  setUser: (userData: User | null) => Promise<void>;
  institutes: Institute[];
  setInstitutes: (data: Institute[]) => Promise<void>;
  selectedInstitute: Institute | null;
  setSelectedInstitute: (institute: Institute | null) => Promise<void>;
  selectedRole: Role | null;
  setSelectedRole: (role: Role | null) => Promise<void>;
  isAuthLoading: boolean;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------
const STORAGE_KEYS = {
  USER:               'user',
  INSTITUTES:         'institutes',
  SELECTED_INSTITUTE: 'selected_institute',
  SELECTED_ROLE:      'selected_role',
} as const;

const AuthContext = createContext<AuthContextValue | null>(null);

// ---------------------------------------------------------------------------
// AuthProvider
// ---------------------------------------------------------------------------
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user,              setUserState]              = useState<User | null>(null);
  const [institutes,        setInstitutesState]        = useState<Institute[]>([]);
  const [selectedInstitute, setSelectedInstituteState] = useState<Institute | null>(null);
  const [selectedRole,      setSelectedRoleState]      = useState<Role | null>(null);
  const [isAuthLoading,     setIsAuthLoading]          = useState<boolean>(true);

  // ── Restore session on mount ──────────────────────────────────────────────
  useEffect(() => {
    const restoreSession = async (): Promise<void> => {
      try {
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
      } catch (e) {
        console.warn('[AuthProvider] Failed to restore session:', e);
      } finally {
        setIsAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ── Setters ───────────────────────────────────────────────────────────────
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

  const logout = async (): Promise<void> => {
    try {
      await clearTokens();
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (e) {
      console.warn('[AuthProvider] Logout cleanup error:', e);
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
        isAuthLoading,
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