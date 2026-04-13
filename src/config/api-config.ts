/**
 * @file api-config.ts
 * @module services/api-config
 * @description Central API configuration — base URL and request defaults.
 *
 * ── Base URL resolution priority ────────────────────────────────────────────
 *   1. Runtime override  — set `global.MENTRIXOS_API_BASE_URL` before the app
 *                          boots (e.g. from a native module or test harness).
 *   2. Build-time env    — set `API_BASE_URL` in your .env file and read it
 *                          via react-native-config or a Babel env plugin.
 *   3. Hard-coded default — points to the staging backend; safe for development.
 *
 * ── Changing the URL for different environments ──────────────────────────────
 *   Create .env.development / .env.production with:
 *     API_BASE_URL=https://api.mentrixos.com
 *   Then inject it via react-native-config:
 *     import Config from 'react-native-config';
 *     // Config.API_BASE_URL is available here
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Extends the global object to allow a runtime base URL override. */
type GlobalWithApiOverride = typeof globalThis & {
  MENTRIXOS_API_BASE_URL?: string;
};

// ---------------------------------------------------------------------------
// URL resolution
// ---------------------------------------------------------------------------

const DEFAULT_BASE_URL = 'https://scos-backend.onrender.com';

/**
 * Reads the runtime override injected via the global object.
 * Returns null if not set so the fallback chain continues.
 */
const getRuntimeUrl = (): string | null => {
  if (typeof global === 'undefined') return null;
  return (global as GlobalWithApiOverride).MENTRIXOS_API_BASE_URL ?? null;
};

/**
 * Reads the build-time environment variable.
 * Returns null if process / process.env is unavailable (e.g. in some bundlers).
 */
const getEnvUrl = (): string | null => {
  if (typeof process === 'undefined' || !process?.env) return null;
  return process.env.API_BASE_URL ?? null;
};

// ---------------------------------------------------------------------------
// Exported config values
// ---------------------------------------------------------------------------

/**
 * Resolved API base URL.
 * Components and services should import this instead of hardcoding the URL.
 */
export const API_BASE_URL: string =
  getRuntimeUrl() ?? getEnvUrl() ?? DEFAULT_BASE_URL;

/**
 * Request timeout in milliseconds.
 * Requests that exceed this duration should be aborted by the caller.
 */
export const API_TIMEOUT_MS: number = 15_000;
