import { STRINGS } from '../constants/strings';

export const mapApiError = (err: unknown): string => {
  const msg =
    (typeof err === 'object' && err !== null && 'message' in err && (err as Error).message) || '';

  if (typeof msg === 'string') {
    const m = msg.toLowerCase();
    if (m.includes('timeout')) return 'Request timed out. Please try again.';
    if (m.includes('network')) return STRINGS.ERR_GENERIC;
    if (m.includes('session expired')) return msg;
    if (msg.trim()) return msg;
  }

  return STRINGS.ERR_GENERIC;
};