/**
 * @file auth-service.ts
 * @module services/auth/auth-service
 * @description Higher-level auth helpers that keep token lifecycle and
 * error-mapping out of UI screens.
 */

import {
  clearTokens,
  getMyInstitutesRoles,
  loginApi,
  selectContext,
  setAccessToken,
  setPreContextToken,
} from '../api-service';
import { STRINGS } from '../../constants/strings';

interface SelectContextPayload {
  tenant_id: string;
  institute_id: string;
  role_id: string;
}

/**
 * Exchanges pre_context_token for access_token and persists it.
 */
export async function finalizeContext(payload: SelectContextPayload): Promise<string> {
  const res = await selectContext(payload) as { access_token: string };
  await clearTokens();
  await setAccessToken(res.access_token);
  return res.access_token;
}

/**
 * Email+password login.
 */
export async function login(
  emailOrPhone: string,
  password: string,
): Promise<{ user: unknown; preContextToken: string }> {
  const loginRes = await loginApi(emailOrPhone.trim(), password) as {
    pre_context_token?: string;
    user?: unknown;
    message?: string;
    [key: string]: unknown;
  };

  // DEBUG — remove before production
  console.log('[auth-service] login raw response:', JSON.stringify(loginRes));

  if (!loginRes?.pre_context_token) {
    // Show actual backend message if available, not generic string
    const backendMsg = loginRes?.message;
    console.warn('[auth-service] pre_context_token missing. Response keys:', Object.keys(loginRes ?? {}));
    throw new Error(backendMsg ?? STRINGS.ERR_LOGIN);
  }

  await setPreContextToken(loginRes.pre_context_token);
  return { user: loginRes.user, preContextToken: loginRes.pre_context_token };
}

/**
 * Fetch institutes+roles for the logged-in user.
 */
export async function fetchInstitutes(preContextToken: string): Promise<unknown[]> {
  const res = await getMyInstitutesRoles(preContextToken) as { data: unknown[] };
  return res.data;
}

/**
 * Higher-level context selection (pre_context_token -> access_token).
 */
export async function selectUserContext(payload: SelectContextPayload): Promise<string> {
  return finalizeContext(payload);
}