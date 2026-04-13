import AsyncStorage from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';

let mmkv = null;
try {
  // MMKV needs JSI (not available in Chrome remote debugger).
  mmkv = new MMKV({ id: 'mentrixos-secure-storage' });
} catch (e) {
  console.warn(
    '[secure-storage] MMKV unavailable, using AsyncStorage fallback:',
    e?.message ?? e,
  );
}

const TOKEN_KEYS = {
  ACCESS: 'access_token',
  PRE_CONTEXT: 'pre_context_token',
};

export const getAccessToken = async () => {
  if (mmkv) return mmkv.getString(TOKEN_KEYS.ACCESS) ?? null;
  return AsyncStorage.getItem(TOKEN_KEYS.ACCESS);
};
export const getPreContextToken = async () => {
  if (mmkv) return mmkv.getString(TOKEN_KEYS.PRE_CONTEXT) ?? null;
  return AsyncStorage.getItem(TOKEN_KEYS.PRE_CONTEXT);
};

export const getToken = async () => {
  const access = await getAccessToken();
  return access || getPreContextToken();
};

export const setAccessToken = async token => {
  if (mmkv) {
    mmkv.set(TOKEN_KEYS.ACCESS, token);
    return;
  }
  await AsyncStorage.setItem(TOKEN_KEYS.ACCESS, token);
};

export const setPreContextToken = async token => {
  if (mmkv) {
    mmkv.set(TOKEN_KEYS.PRE_CONTEXT, token);
    return;
  }
  await AsyncStorage.setItem(TOKEN_KEYS.PRE_CONTEXT, token);
};

export const clearTokens = async () => {
  if (mmkv) {
    mmkv.delete(TOKEN_KEYS.ACCESS);
    mmkv.delete(TOKEN_KEYS.PRE_CONTEXT);
    return;
  }
  await AsyncStorage.multiRemove([TOKEN_KEYS.ACCESS, TOKEN_KEYS.PRE_CONTEXT]);
};

