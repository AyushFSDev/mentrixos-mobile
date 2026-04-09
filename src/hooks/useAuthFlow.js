/**
 * @file useAuthFlow.js
 * @module hooks/useAuthFlow
 * @description Manages all state and logic for the multi-step authentication flow.
 *
 * The flow supports two login paths:
 *   A. OTP path  — phone number or email → send code → verify OTP
 *   B. Password path — email → enter password → login
 *
 * ── Input type detection ────────────────────────────────────────────────────
 *   'empty'  — nothing entered yet
 *   'phone'  — input contains only digits
 *   'email'  — input contains letters, @, or other email characters
 *
 * ── Mode ────────────────────────────────────────────────────────────────────
 *   'input'    — initial screen: phone/email field
 *   'otp'      — OTP verification step
 *   'password' — password login step (email only)
 *
 * ── Post-login navigation logic ─────────────────────────────────────────────
 *   1 institute + 1 role         → auto-select context → Dashboard
 *   1 institute + multiple roles → RoleSelect screen
 *   multiple institutes          → InstituteSelect screen
 *
 * Usage:
 *   const flow = useAuthFlow(navigation);
 *   <TextInput value={flow.rawInput} onChangeText={flow.handleInputChange} />
 */

import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STRINGS } from '../constants/strings';
import { useAuth } from './useAuth';
import {
  loginApi,
  getMyInstitutesRoles,
  selectContext,
  setAccessToken,
  setPreContextToken,
  clearTokens,
} from '../services/api-service';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const EMPTY_OTP = ['', '', '', '', '', ''];

// ---------------------------------------------------------------------------
// Input type detection helper
// ---------------------------------------------------------------------------

/**
 * Determines whether the raw input looks like a phone number or an email.
 * @param {string} value — Raw string from the input field.
 * @returns {'empty' | 'phone' | 'email'}
 */
const detectInputType = value => {
  if (!value || value.trim() === '') return 'empty';
  if (/[a-zA-Z@._\-+]/.test(value)) return 'email';
  if (/^\d+$/.test(value)) return 'phone';
  return 'empty';
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export const useAuthFlow = navigation => {
  const { setUser, setInstitutes, setSelectedInstitute, setSelectedRole } =
    useAuth();

  const [rawInput, setRawInput] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(EMPTY_OTP);
  const [mode, setMode] = useState('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Derived — recalculated on every render, no extra state needed.
  const inputType = detectInputType(rawInput);

  // ── Input field ────────────────────────────────────────────────────────────

  /** Clears any displayed error and resets to input mode when the field is emptied. */
  const handleInputChange = value => {
    setRawInput(value);
    setError('');
    if (!value || value.trim() === '') setMode('input');
  };

  // ── Post-login navigation ──────────────────────────────────────────────────

  /**
   * Decides where to send the user after a successful login based on the
   * number of institutes and roles available to them.
   *
   * Mirrors the web Login.js handleLogin routing logic exactly so both
   * platforms behave consistently.
   *
   * @param {object[]} institutesData  — Array returned by getMyInstitutesRoles
   * @param {string}   preContextToken — Token from the login response
   */
  const handlePostLogin = async (institutesData, preContextToken) => {
    const onlyInstitute = institutesData[0];
    const onlyRole = onlyInstitute?.roles?.[0];

    if (institutesData.length === 1 && onlyInstitute.roles.length === 1) {
      // Single institute + single role — skip the selection screens entirely.
      const res = await selectContext({
        tenant_id: onlyInstitute.tenant_id,
        institute_id: onlyInstitute.institute_id,
        role_id: onlyRole.role_id,
      });

      // Swap the pre-context token for the full access token.
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('pre_context_token');
      await AsyncStorage.setItem('access_token', res.access_token);

      setSelectedInstitute(onlyInstitute);
      setSelectedRole(onlyRole);

      navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
    } else if (institutesData.length === 1) {
      // Single institute but multiple roles — let the user pick their role.
      setSelectedInstitute(onlyInstitute);
      navigation.navigate('RoleSelect', { institute: onlyInstitute });
    } else {
      // Multiple institutes — let the user pick which one to operate in.
      navigation.replace('InstituteSelect');
    }
  };

  // ── Password login (email path) ────────────────────────────────────────────

  /**
   * Authenticates with email + password.
   * On success: fetches institutes/roles, then routes via handlePostLogin.
   * On failure: displays the error message and clears the password field.
   */
  const handlePasswordLogin = async () => {
    if (!password.trim()) {
      setError(STRINGS.ERR_EMPTY_PASSWORD);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1 — Authenticate and receive a pre-context token.
      const loginRes = await loginApi(rawInput.trim(), password);

      if (!loginRes.pre_context_token) {
        throw new Error(loginRes.message ?? 'Login failed. Please try again.');
      }

      const { pre_context_token, user } = loginRes;

      await setPreContextToken(pre_context_token);
      await setUser(user);

      // Step 2 — Fetch the list of institutes and roles for this user.
      const institutesRes = await getMyInstitutesRoles(pre_context_token);
      const institutesData = institutesRes.data;

      setInstitutes(institutesData);

      // Step 3 — Route to the appropriate next screen.
      await handlePostLogin(institutesData, pre_context_token);
    } catch (err) {
      setError(err.message ?? STRINGS.ERR_LOGIN);
      setPassword(''); // Clear the password so the user can retype it cleanly.
    } finally {
      setLoading(false);
    }
  };

  // ── OTP: Send code ─────────────────────────────────────────────────────────

  /**
   * Requests an OTP be sent to the user's phone or email.
   * On success: transitions the UI to OTP entry mode.
   */
  const handleSendCode = async () => {
    if (!rawInput.trim()) {
      setError(STRINGS.ERR_EMPTY_INPUT);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: await authApi.sendOtp({ contact: rawInput.trim() });
      setMode('otp');
    } catch {
      setError(STRINGS.ERR_SEND_CODE);
    } finally {
      setLoading(false);
    }
  };

  // ── OTP: Verify ────────────────────────────────────────────────────────────

  /**
   * Verifies the 6-digit OTP the user typed.
   * On success: calls handlePostLogin to route to the correct next screen.
   */
  const handleVerifyOtp = async () => {
    const code = otp.join('');

    if (code.length < 6) {
      setError(STRINGS.ERR_INVALID_OTP);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: const res = await authApi.verifyOtp({ contact: rawInput, otp: code });
      // TODO: await handlePostLogin(res.institutes, res.pre_context_token);
    } catch {
      setError(STRINGS.ERR_VERIFY_OTP);
    } finally {
      setLoading(false);
    }
  };

  // ── Mode transitions ───────────────────────────────────────────────────────

  /** Switches from OTP mode to password mode. */
  const handleUsePassword = () => {
    setError('');
    setMode('password');
  };

  /** Clears the OTP boxes and re-sends the code. */
  const handleResendCode = async () => {
    setOtp(EMPTY_OTP);
    setError('');
    await handleSendCode();
  };

  /** Returns to the initial input screen, resetting all intermediate state. */
  const handleBack = () => {
    setMode('input');
    setOtp(EMPTY_OTP);
    setPassword('');
    setError('');
  };

  // ── OTP input handlers ─────────────────────────────────────────────────────

  /**
   * Updates a single OTP digit and advances focus to the next box.
   * Called by the OtpInput component on each keystroke.
   *
   * @param {number}   index — Index of the box that changed (0–5).
   * @param {string}   digit — The new single digit value.
   * @param {object[]} refs  — Array of TextInput ref elements from OtpInput.
   */
  const handleOtpChange = (index, digit, refs) => {
    const updated = [...otp];
    updated[index] = digit;
    setOtp(updated);

    // Auto-advance focus — OtpInput also handles this, but keeping it here
    // ensures the hook works correctly if OtpInput is replaced.
    if (digit && index < otp.length - 1 && refs?.[index + 1]?.current) {
      refs[index + 1].current.focus();
    }
  };

  /**
   * Moves focus back to the previous OTP box when Backspace is pressed on
   * an already-empty box.
   *
   * @param {number}   index — Index of the box where Backspace was pressed.
   * @param {object[]} refs  — Array of TextInput ref elements from OtpInput.
   */
  const handleOtpBackspace = (index, refs) => {
    if (!otp[index] && index > 0 && refs?.[index - 1]?.current) {
      refs[index - 1].current.focus();
    }
  };

  // ── Public API ─────────────────────────────────────────────────────────────
  return {
    // State
    rawInput,
    password,
    otp,
    mode,
    inputType,
    loading,
    error,

    // Setters exposed for direct use where needed
    setPassword,
    setError,

    // Handlers
    handleInputChange,
    handleSendCode,
    handleUsePassword,
    handleVerifyOtp,
    handlePasswordLogin,
    handleResendCode,
    handleOtpChange,
    handleOtpBackspace,
    handleBack,
  };
};
