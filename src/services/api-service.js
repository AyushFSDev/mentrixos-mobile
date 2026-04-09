/**
 * @file api-service.js
 * @module services/api-service
 * @description Centralized HTTP client for all MentrixOS API calls.
 *
 * ── Token strategy ───────────────────────────────────────────────────────────
 *
 * The app uses two tokens at different points in the auth flow:
 *
 *   pre_context_token — Issued immediately after login. Used to fetch the
 *                       user's institute/role list and to call select-context.
 *                       Short-lived; removed once a full access token is obtained.
 *
 *   access_token      — Issued after the user selects an institute + role via
 *                       select-context. Used for all subsequent authenticated
 *                       requests.
 *
 * getToken() prefers access_token and falls back to pre_context_token so that
 * the generic request() helper always attaches the best available credential.
 * Individual API functions can override this by passing `token` explicitly.
 *
 * ── 401 handling ─────────────────────────────────────────────────────────────
 *
 * Any 401 response clears both tokens and calls the registered logout handler
 * so the app navigates back to the login screen automatically.
 * Register the handler once at app boot via setLogoutHandler().
 *
 * ── Usage ────────────────────────────────────────────────────────────────────
 *
 *   import { loginApi, getMyInstitutesRoles, selectContext } from './api-service';
 *
 *   const res = await loginApi('user@example.com', 'password');
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ---------------------------------------------------------------------------
// Base URL
// ---------------------------------------------------------------------------
const BASE_URL = 'https://scos-backend.onrender.com';

// ---------------------------------------------------------------------------
// AsyncStorage keys — kept in sync with useAuth.js STORAGE_KEYS
// ---------------------------------------------------------------------------
const TOKEN_KEYS = {
  ACCESS: 'access_token',
  PRE_CONTEXT: 'pre_context_token',
};

// ---------------------------------------------------------------------------
// Global logout handler
// Set once at app boot so a 401 can trigger navigation without a circular import.
// ---------------------------------------------------------------------------
let _logoutHandler = null;

/**
 * Registers a callback that is invoked whenever a 401 Unauthorized response
 * is received. Typically used to navigate the user back to the login screen.
 *
 * @param {function} handler — Zero-argument callback.
 */
export const setLogoutHandler = handler => {
  _logoutHandler = handler;
};

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------

/**
 * Returns the best available auth token.
 * Prefers the full access_token; falls back to pre_context_token during the
 * institute/role selection phase of the login flow.
 *
 * @returns {Promise<string|null>}
 */
export const getToken = async () => {
  const accessToken = await AsyncStorage.getItem(TOKEN_KEYS.ACCESS);
  if (accessToken) return accessToken;
  return AsyncStorage.getItem(TOKEN_KEYS.PRE_CONTEXT);
};

/**
 * Persists the full access token issued after select-context.
 * @param {string} token
 */
export const setAccessToken = async token => {
  await AsyncStorage.setItem(TOKEN_KEYS.ACCESS, token);
};

/**
 * Persists the pre-context token issued immediately after login.
 * @param {string} token
 */
export const setPreContextToken = async token => {
  await AsyncStorage.setItem(TOKEN_KEYS.PRE_CONTEXT, token);
};

/**
 * Removes both tokens from storage. Called on logout and on 401 responses.
 */
export const clearTokens = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEYS.ACCESS, TOKEN_KEYS.PRE_CONTEXT]);
};

// ---------------------------------------------------------------------------
// Core request helper
// ---------------------------------------------------------------------------

/**
 * Makes an authenticated HTTP request to the MentrixOS backend.
 *
 * @param {string} path                  — API path, e.g. '/auth/login'
 * @param {object} options
 * @param {string} [options.method]      — HTTP method. Default: 'GET'
 * @param {object} [options.body]        — Request body (serialized to JSON automatically)
 * @param {object} [options.headers]     — Additional headers to merge
 * @param {string|null} [options.token]  — Override the token. Pass `null` for
 *                                         unauthenticated requests (e.g. login).
 *                                         Omit to use getToken() automatically.
 * @returns {Promise<object>} Parsed JSON response body
 * @throws {Error} On HTTP errors or network failures
 */
const request = async (path, options = {}) => {
  const {
    method = 'GET',
    body,
    headers: extraHeaders = {},
    token: overrideToken,
  } = options;

  // Use the explicitly provided token when given; otherwise read from storage.
  // `overrideToken !== undefined` allows callers to pass `null` to send an
  // unauthenticated request (e.g. the login endpoint itself).
  const token = overrideToken !== undefined ? overrideToken : await getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // 401 — session expired or token invalid. Clear credentials and signal the app.
  if (response.status === 401) {
    await clearTokens();
    _logoutHandler?.();
    throw new Error('Session expired. Please log in again.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? `Request failed (${response.status})`);
  }

  return data;
};

// ---------------------------------------------------------------------------
// Auth API
// ---------------------------------------------------------------------------

/**
 * Authenticates the user with email and password.
 * No token is sent — this is the unauthenticated entry point.
 *
 * POST /auth/login
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ pre_context_token: string, user: object }>}
 */
export const loginApi = (email, password) =>
  request('/auth/login', {
    method: 'POST',
    body: { email, password },
    token: null, // Unauthenticated — no token needed for login
  });

/**
 * Fetches all institutes and roles available to the authenticated user.
 * Must be called with the pre_context_token, not the full access_token.
 *
 * GET /auth/my-institutes-roles
 * @param {string} preContextToken — Token received from loginApi
 * @returns {Promise<{ data: object[] }>}
 */
export const getMyInstitutesRoles = preContextToken =>
  request('/auth/my-institutes-roles', {
    token: preContextToken, // Must use pre_context_token — access_token is not yet issued
  });

/**
 * Selects an institute + role context and exchanges the pre_context_token
 * for a full access_token.
 *
 * POST /auth/select-context
 * @param {{ tenant_id: string, institute_id: string, role_id: string }} payload
 * @returns {Promise<{ access_token: string }>}
 */
export const selectContext = async payload => {
  // Explicitly reads pre_context_token — the full access_token does not exist yet
  // at this stage of the login flow.
  const preContextToken = await AsyncStorage.getItem(TOKEN_KEYS.PRE_CONTEXT);

  return request('/auth/select-context', {
    method: 'POST',
    body: payload,
    token: preContextToken,
  });
};

// ---------------------------------------------------------------------------
// Default export — named map for convenience
// ---------------------------------------------------------------------------
export default {
  loginApi,
  getMyInstitutesRoles,
  selectContext,
  getToken,
  setAccessToken,
  setPreContextToken,
  clearTokens,
};
