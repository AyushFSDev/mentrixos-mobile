/**
 * @file api-service.ts
 * @module services/api-service
 * @description Centralized HTTP client for all MentrixOS API calls.
 */

import {
  getToken,
  getPreContextToken,
  setAccessToken,
  setPreContextToken,
  clearTokens,
} from './storage/secure-storage-service';

export { getToken, getPreContextToken, setAccessToken, setPreContextToken, clearTokens };

import { API_BASE_URL, API_TIMEOUT_MS } from '../config/api-config';
import { mapApiError } from '../utils/api-error-mapper';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ApiRequestOptions {
  method?: string;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  token?: string | null;
  signal?: AbortSignal;
  timeoutMs?: number;
  retry?: number;
}

// ---------------------------------------------------------------------------
// Global logout handler
// ---------------------------------------------------------------------------
let _logoutHandler: (() => void) | null = null;

export const setLogoutHandler = (handler: () => void): void => {
  _logoutHandler = handler;
};

// ---------------------------------------------------------------------------
// Core request helper
// ---------------------------------------------------------------------------
export const apiRequest = async (path: string, options: ApiRequestOptions = {}): Promise<unknown> => {
  const {
    method = 'GET',
    body,
    headers: extraHeaders = {},
    token: overrideToken,
    signal,
    timeoutMs = API_TIMEOUT_MS,
    retry = 1,
  } = options;

  const token = overrideToken !== undefined ? overrideToken : await getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const attemptOnce = async (): Promise<unknown> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const onAbort = (): void => controller.abort();
    if (signal) {
      if (signal.aborted) controller.abort();
      else signal.addEventListener('abort', onAbort, { once: true });
    }

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (response.status === 401) {
        await clearTokens();
        _logoutHandler?.();
        throw new Error('Session expired. Please log in again.');
      }

      let data: unknown = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        const shouldRetry = response.status >= 500 || response.status === 429;
        const err = Object.assign(
          new Error((data as any)?.message ?? `Request failed (${response.status})`),
          { __shouldRetry: shouldRetry },
        );
        throw err;
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      throw err;
    } finally {
      clearTimeout(timeout);
      if (signal) signal.removeEventListener('abort', onAbort);
    }
  };

  let attempt = 0;
  while (true) {
    try {
      return await attemptOnce();
    } catch (err: unknown) {
      attempt += 1;

      const transient =
        (err as any)?.__shouldRetry ||
        (typeof (err as any)?.message === 'string' &&
          (err as Error).message.toLowerCase().includes('network'));

      if (!transient || attempt > retry) {
        // Re-throw as-is so auth-service can inspect the original message
        throw err instanceof Error ? err : new Error(mapApiError(err));
      }

      const backoffMs = Math.min(1200, 300 * 2 ** (attempt - 1));
      await new Promise(r => setTimeout(r, backoffMs));
    }
  }
};

// ---------------------------------------------------------------------------
// Auth API
// ---------------------------------------------------------------------------
export const loginApi = (emailOrPhone: string, password: string): Promise<unknown> =>
  apiRequest('/auth/login', { method: 'POST', body: { email: emailOrPhone, password }, token: null });

export const getMyInstitutesRoles = (preContextToken: string): Promise<unknown> =>
  apiRequest('/auth/my-institutes-roles', { token: preContextToken });

export const selectContext = async (payload: {
  tenant_id: string;
  institute_id: string;
  role_id: string;
}): Promise<unknown> => {
  const preContextToken = await getPreContextToken();
  return apiRequest('/auth/select-context', { method: 'POST', body: payload, token: preContextToken });
};

export default { loginApi, getMyInstitutesRoles, selectContext };