/**
 * @file useAuthFlow.ts
 * @module hooks/useAuthFlow
 * @description Pure state machine for the multi-step authentication flow.
 *
 * ── Flow ─────────────────────────────────────────────────────────────────────
 *   A. OTP path      — phone or email → send code → verify OTP
 *   B. Password path — email → enter password → login
 *
 * ── nextRoute values ─────────────────────────────────────────────────────────
 *   'Dashboard'       — 1 institute + 1 role auto-selected
 *   'RoleSelect'      — 1 institute, multiple roles
 *   'InstituteSelect' — multiple institutes
 *   null              — no navigation pending
 */

import { useState } from 'react';
import { STRINGS } from '../constants/strings';
import { useAuth, Institute, Role } from './useAuth';
import { login, fetchInstitutes, selectUserContext } from '../services/auth/auth-service';
import { mapAuthError } from '../utils/error-mapper';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type AuthMode = 'input' | 'otp' | 'password';
export type InputType = 'empty' | 'phone' | 'email';
export type NextRoute = 'Dashboard' | 'RoleSelect' | 'InstituteSelect' | null;

interface NextRouteParams {
  institute?: Institute;
  [key: string]: unknown;
}

export interface AuthFlowState {
  // State
  rawInput: string;
  password: string;
  otp: string[];
  mode: AuthMode;
  inputType: InputType;
  loading: boolean;
  error: string;
  nextRoute: NextRoute;
  nextRouteParams: NextRouteParams | null;

  // Setters
  setPassword: (value: string) => void;
  setError: (value: string) => void;

  // Handlers
  handleInputChange: (value: string) => void;
  handleSendCode: () => Promise<void>;
  handleUsePassword: () => void;
  handleVerifyOtp: () => Promise<void>;
  handlePasswordLogin: () => Promise<void>;
  handleResendCode: () => Promise<void>;
  handleOtpChange: (index: number, digit: string) => void;
  handleBack: () => void;
  clearNextRoute: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const EMPTY_OTP: string[] = ['', '', '', '', '', ''];

// ---------------------------------------------------------------------------
// Input type detection helper
// ---------------------------------------------------------------------------
const detectInputType = (value: string): InputType => {
  if (!value || value.trim() === '') return 'empty';
  if (/[a-zA-Z@._\-+]/.test(value)) return 'email';
  if (/^\d+$/.test(value)) return 'phone';
  return 'empty';
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export const useAuthFlow = (): AuthFlowState => {
  const { setUser, setInstitutes, setSelectedInstitute, setSelectedRole } =
    useAuth();

  const [rawInput,  setRawInput]  = useState<string>('');
  const [password,  setPassword]  = useState<string>('');
  const [otp,       setOtp]       = useState<string[]>(EMPTY_OTP);
  const [mode,      setMode]      = useState<AuthMode>('input');
  const [loading,   setLoading]   = useState<boolean>(false);
  const [error,     setError]     = useState<string>('');
  const [nextRoute, setNextRoute] = useState<NextRoute>(null);
  const [nextRouteParams, setNextRouteParams] = useState<NextRouteParams | null>(null);

  const inputType: InputType = detectInputType(rawInput);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const clearNextRoute = (): void => {
    setNextRoute(null);
    setNextRouteParams(null);
  };

  // ── Input ──────────────────────────────────────────────────────────────────
  const handleInputChange = (value: string): void => {
    setRawInput(value);
    setError('');
    if (!value || value.trim() === '') setMode('input');
  };

  // ── Post-login routing ─────────────────────────────────────────────────────
  const resolvePostLoginRoute = async (institutesData: Institute[]): Promise<void> => {
    const onlyInstitute = institutesData[0];
    const onlyRole: Role | undefined = onlyInstitute?.roles?.[0];

    if (institutesData.length === 1 && onlyInstitute.roles.length === 1 && onlyRole) {
      await selectUserContext({
        tenant_id: onlyInstitute.tenant_id,
        institute_id: onlyInstitute.institute_id,
        role_id: onlyRole.role_id,
      });

      setSelectedInstitute(onlyInstitute);
      setSelectedRole(onlyRole);
      setNextRoute('Dashboard');
    } else if (institutesData.length === 1) {
      setSelectedInstitute(onlyInstitute);
      setNextRoute('RoleSelect');
      setNextRouteParams({ institute: onlyInstitute });
    } else {
      setNextRoute('InstituteSelect');
    }
  };

  // ── Password login ─────────────────────────────────────────────────────────
  const handlePasswordLogin = async (): Promise<void> => {
    if (!password.trim()) {
      setError(STRINGS.ERR_EMPTY_PASSWORD);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { user, preContextToken } = await login(rawInput, password);
      await setUser(user);

      const institutesData: Institute[] = await fetchInstitutes(preContextToken);
      setInstitutes(institutesData);

      await resolvePostLoginRoute(institutesData);
    } catch (err) {
      setError(mapAuthError(err));
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  // ── OTP: Send code ─────────────────────────────────────────────────────────
  const handleSendCode = async (): Promise<void> => {
    if (!rawInput.trim()) {
      setError(STRINGS.ERR_EMPTY_INPUT);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: await authApi.sendOtp({ contact: rawInput.trim() });
      setMode('otp');
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // ── OTP: Verify ─────────────────────────────────────────────────────────────
  const handleVerifyOtp = async (): Promise<void> => {
    const code = otp.join('');

    if (code.length < 6) {
      setError(STRINGS.ERR_INVALID_OTP);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: const res = await authApi.verifyOtp({ contact: rawInput, otp: code });
      // TODO: const institutesData = await fetchInstitutes(res.pre_context_token);
      // TODO: setInstitutes(institutesData);
      // TODO: await resolvePostLoginRoute(institutesData);
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Mode transitions ───────────────────────────────────────────────────────
  const handleUsePassword = (): void => {
    setError('');
    setMode('password');
  };

  const handleResendCode = async (): Promise<void> => {
    setOtp(EMPTY_OTP);
    setError('');
    await handleSendCode();
  };

  const handleBack = (): void => {
    setMode('input');
    setOtp(EMPTY_OTP);
    setPassword('');
    setError('');
  };

  // ── OTP input ──────────────────────────────────────────────────────────────
  const handleOtpChange = (index: number, digit: string): void => {
    const updated = [...otp];
    updated[index] = digit;
    setOtp(updated);
  };

  // ── Public API ─────────────────────────────────────────────────────────────
  return {
    rawInput,
    password,
    otp,
    mode,
    inputType,
    loading,
    error,
    nextRoute,
    nextRouteParams,

    setPassword,
    setError,

    handleInputChange,
    handleSendCode,
    handleUsePassword,
    handleVerifyOtp,
    handlePasswordLogin,
    handleResendCode,
    handleOtpChange,
    handleBack,
    clearNextRoute,
  };
};