/**
 * @file useAuthFlow.ts
 * @module hooks/useAuthFlow
 * @description Pure state machine for the multi-step authentication flow.
 *
 * This hook contains no navigation calls — instead it signals which screen
 * to navigate to via `nextRoute` + `nextRouteParams`. The consuming screen
 * observes these values and calls `navigation.navigate()` itself, then calls
 * `clearNextRoute()` to reset the signal.
 *
 * ── Auth paths ───────────────────────────────────────────────────────────────
 *   A. OTP path      — phone or email → send code → verify OTP
 *   B. Password path — email → enter password → login
 *
 * ── Input type detection ─────────────────────────────────────────────────────
 *   'empty'  — nothing entered
 *   'phone'  — input contains only digits
 *   'email'  — input contains letters, @, or other email characters
 *
 * ── Mode ─────────────────────────────────────────────────────────────────────
 *   'input'    — initial phone / email field
 *   'otp'      — OTP verification step
 *   'password' — password login step
 *
 * ── nextRoute signal ─────────────────────────────────────────────────────────
 *   'Dashboard'       — 1 institute + 1 role, auto-selected
 *   'RoleSelect'      — 1 institute, multiple roles
 *   'InstituteSelect' — multiple institutes
 *   null              — no pending navigation
 *
 * Usage:
 *   const flow = useAuthFlow();
 *   useEffect(() => {
 *     if (flow.nextRoute) {
 *       navigation.navigate(flow.nextRoute, flow.nextRouteParams ?? {});
 *       flow.clearNextRoute();
 *     }
 *   }, [flow.nextRoute]);
 */

import { useState } from 'react';
import { STRINGS } from '../constants/strings';
import { useAuth, Institute, Role } from './useAuth';
import {
  login,
  fetchInstitutes,
  selectUserContext,
} from '../services/auth/auth-service';
import { mapAuthError } from '../utils/error-mapper';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Current step in the authentication flow. */
export type AuthMode = 'input' | 'otp' | 'password';

/** What the user typed — drives which UI options are shown. */
export type InputType = 'empty' | 'phone' | 'email';

/** Screen name to navigate to after successful authentication. */
export type NextRoute = 'Dashboard' | 'RoleSelect' | 'InstituteSelect' | null;

/** Optional params passed alongside the nextRoute signal. */
interface NextRouteParams {
  institute?: Institute;
  [key: string]: unknown;
}

/** Complete public API surface of the hook. */
export interface AuthFlowState {
  // ── Read-only state ──────────────────────────────────────────────────────
  rawInput: string;
  password: string;
  otp: string[];
  mode: AuthMode;
  inputType: InputType;
  loading: boolean;
  error: string;
  nextRoute: NextRoute;
  nextRouteParams: NextRouteParams | null;

  // ── Setters exposed for edge cases ───────────────────────────────────────
  setPassword: (value: string) => void;
  setError: (value: string) => void;

  // ── Action handlers ───────────────────────────────────────────────────────
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

/** Empty OTP array — 6 slots for a 6-digit code. */
const EMPTY_OTP: string[] = ['', '', '', '', '', ''];

// ---------------------------------------------------------------------------
// Input type detection
// Pure function — no closures; defined outside the hook.
// ---------------------------------------------------------------------------

/**
 * Classifies the raw input field value so the UI can show the correct options.
 * @param value — Raw string from the input field.
 */
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

  const [rawInput, setRawInput] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otp, setOtp] = useState<string[]>(EMPTY_OTP);
  const [mode, setMode] = useState<AuthMode>('input');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [nextRoute, setNextRoute] = useState<NextRoute>(null);
  const [nextRouteParams, setNextRouteParams] =
    useState<NextRouteParams | null>(null);

  // Derived — recalculated on every render, no extra state needed.
  const inputType: InputType = detectInputType(rawInput);

  // ── Navigation signal ──────────────────────────────────────────────────────

  /** Resets the navigation signal after the screen has acted on it. */
  const clearNextRoute = (): void => {
    setNextRoute(null);
    setNextRouteParams(null);
  };

  // ── Input ──────────────────────────────────────────────────────────────────

  /** Clears errors and resets to input mode when the field is emptied. */
  const handleInputChange = (value: string): void => {
    setRawInput(value);
    setError('');
    if (!value || value.trim() === '') setMode('input');
  };

  // ── Post-login routing ─────────────────────────────────────────────────────

  /**
   * Determines which screen to navigate to based on the user's institute/role
   * count. Mirrors the web Login.js routing logic for cross-platform consistency.
   *
   * Route decision:
   *   1 institute + 1 role  → auto-select context → signal 'Dashboard'
   *   1 institute + n roles → signal 'RoleSelect'
   *   n institutes          → signal 'InstituteSelect'
   *
   * @param institutesData — Array of institutes from the API response.
   */
  const resolvePostLoginRoute = async (
    institutesData: Institute[],
  ): Promise<void> => {
    const onlyInstitute = institutesData[0];
    const onlyRole: Role | undefined = onlyInstitute?.roles?.[0];

    if (
      institutesData.length === 1 &&
      onlyInstitute.roles.length === 1 &&
      onlyRole
    ) {
      // Single institute + single role — auto-select and go straight to Dashboard.
      await selectUserContext({
        tenant_id: onlyInstitute.tenant_id,
        institute_id: onlyInstitute.institute_id,
        role_id: onlyRole.role_id,
      });

      await setSelectedInstitute(onlyInstitute);
      await setSelectedRole(onlyRole);
      setNextRoute('Dashboard');
    } else if (institutesData.length === 1) {
      // Single institute but multiple roles — let the user choose.
      await setSelectedInstitute(onlyInstitute);
      setNextRoute('RoleSelect');
      setNextRouteParams({ institute: onlyInstitute });
    } else {
      // Multiple institutes — let the user choose which one to operate in.
      setNextRoute('InstituteSelect');
    }
  };

  // ── Password login ─────────────────────────────────────────────────────────

  /**
   * Authenticates with email + password.
   *   1. Calls login API → receives user + preContextToken.
   *   2. Fetches institutes/roles for the user.
   *   3. Signals the next route via resolvePostLoginRoute.
   */
  const handlePasswordLogin = async (): Promise<void> => {
    if (!password.trim()) {
      setError(STRINGS.ERR_EMPTY_PASSWORD);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { user, preContextToken } = await login(rawInput.trim(), password);
      await setUser(user);

      const institutesData: Institute[] = await fetchInstitutes(
        preContextToken,
      );
      setInstitutes(institutesData);

      await resolvePostLoginRoute(institutesData);
    } catch (err) {
      setError(mapAuthError(err));
      setPassword(''); // Clear so the user can retype without selecting all first
    } finally {
      setLoading(false);
    }
  };

  // ── OTP: Send code ─────────────────────────────────────────────────────────

  /**
   * Requests an OTP sent to the user's phone or email.
   * On success: transitions the UI to OTP entry mode.
   */
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

  // ── OTP: Verify ────────────────────────────────────────────────────────────

  /**
   * Verifies the 6-digit OTP.
   * On success: fetches institutes and signals the next route.
   */
  const handleVerifyOtp = async (): Promise<void> => {
    const code = otp.join('');

    if (code.length < EMPTY_OTP.length) {
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

  /** Switches from OTP mode to password mode. */
  const handleUsePassword = (): void => {
    setError('');
    setMode('password');
  };

  /** Clears the OTP boxes and re-sends the verification code. */
  const handleResendCode = async (): Promise<void> => {
    setOtp(EMPTY_OTP);
    setError('');
    await handleSendCode();
  };

  /** Returns to the initial input screen, resetting all intermediate state. */
  const handleBack = (): void => {
    setMode('input');
    setOtp(EMPTY_OTP);
    setPassword('');
    setError('');
  };

  // ── OTP digit input ────────────────────────────────────────────────────────

  /**
   * Updates a single OTP digit.
   * Focus advancement is handled by the OtpInput component itself.
   *
   * @param index — Zero-based index of the box that changed (0–5).
   * @param digit — The new single digit value (empty string on delete).
   */
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
