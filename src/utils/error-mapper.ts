/**
 * @file error-mapper.ts
 * @module utils/error-mapper
 * @description Maps backend error codes and raw error messages to
 * user-friendly strings defined in STRINGS.
 */

import { STRINGS } from '../constants/strings';

// ---------------------------------------------------------------------------
// Error type constants
// ---------------------------------------------------------------------------
export const ERROR_TYPES = {
  NETWORK: 'network',
  INVALID_OTP: 'invalid_otp',
  INVALID_CREDENTIALS: 'invalid_credentials',
  SESSION_EXPIRED: 'session_expired',
  EMPTY_INPUT: 'empty_input',
  EMPTY_PASSWORD: 'empty_password',
  SEND_CODE_FAILED: 'send_code_failed',
  GENERIC: 'generic',
} as const;

export type ErrorType = (typeof ERROR_TYPES)[keyof typeof ERROR_TYPES];

// ---------------------------------------------------------------------------
// Keyword-based error classification
// ---------------------------------------------------------------------------
interface KeywordEntry {
  keywords: string[];
  type: ErrorType;
}

const ERROR_KEYWORD_MAP: KeywordEntry[] = [
  {
    keywords: ['network', 'fetch', 'connect', 'timeout'],
    type: ERROR_TYPES.NETWORK,
  },
  { keywords: ['otp', 'code', 'invalid code'], type: ERROR_TYPES.INVALID_OTP },
  {
    keywords: ['credentials', 'password', 'unauthorized', 'invalid'],
    type: ERROR_TYPES.INVALID_CREDENTIALS,
  },
  {
    keywords: ['session', 'expired', 'token'],
    type: ERROR_TYPES.SESSION_EXPIRED,
  },
];

const classifyError = (rawMessage: string): ErrorType => {
  if (!rawMessage) return ERROR_TYPES.GENERIC;

  const lower = rawMessage.toLowerCase();

  for (const entry of ERROR_KEYWORD_MAP) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.type;
    }
  }

  return ERROR_TYPES.GENERIC;
};

// ---------------------------------------------------------------------------
// Error type → display string mapping
// ---------------------------------------------------------------------------
const ERROR_DISPLAY_MAP: Record<ErrorType, string> = {
  [ERROR_TYPES.NETWORK]: STRINGS.ERR_GENERIC,
  [ERROR_TYPES.INVALID_OTP]: STRINGS.ERR_VERIFY_OTP,
  [ERROR_TYPES.INVALID_CREDENTIALS]: STRINGS.ERR_LOGIN,
  [ERROR_TYPES.SESSION_EXPIRED]: STRINGS.ERR_GENERIC,
  [ERROR_TYPES.EMPTY_INPUT]: STRINGS.ERR_EMPTY_INPUT,
  [ERROR_TYPES.EMPTY_PASSWORD]: STRINGS.ERR_EMPTY_PASSWORD,
  [ERROR_TYPES.SEND_CODE_FAILED]: STRINGS.ERR_SEND_CODE,
  [ERROR_TYPES.GENERIC]: STRINGS.ERR_GENERIC,
};

/**
 * Maps any raw error to a safe, user-friendly display string.
 */
export const mapAuthError = (error: unknown): string => {
  const rawMessage =
    error instanceof Error ? error.message : String(error ?? '');
  const lower = rawMessage.toLowerCase();

  if (lower.includes('timeout')) {
    return rawMessage.trim()
      ? rawMessage
      : 'Request timed out. Please try again.';
  }

  const errorType = classifyError(rawMessage);
  return ERROR_DISPLAY_MAP[errorType] ?? STRINGS.ERR_GENERIC;
};
