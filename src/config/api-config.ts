// Central API configuration.
// Prefer setting API_BASE_URL via env (react-native-config) or build-time injection.

const DEFAULT_BASE_URL = 'https://scos-backend.onrender.com';

const runtimeBaseUrl =
  typeof global !== 'undefined' &&
  (global as typeof globalThis & { MENTRIXOS_API_BASE_URL?: string })
    .MENTRIXOS_API_BASE_URL
    ? (global as typeof globalThis & { MENTRIXOS_API_BASE_URL?: string })
        .MENTRIXOS_API_BASE_URL
    : null;

const envBaseUrl =
  typeof process !== 'undefined' &&
  process &&
  process.env &&
  process.env.API_BASE_URL
    ? process.env.API_BASE_URL
    : null;

export const API_BASE_URL: string =
  runtimeBaseUrl || envBaseUrl || DEFAULT_BASE_URL;

export const API_TIMEOUT_MS: number = 15000;