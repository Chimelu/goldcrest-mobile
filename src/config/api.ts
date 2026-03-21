import { Platform } from 'react-native';
import Constants from 'expo-constants';

const DEFAULT_PORT = 4000;

/**
 * Metro / Expo dev server reports the host machine (e.g. 192.168.1.5:8081).
 * The API on the same laptop should use that IP so physical devices on Wi‑Fi can reach it.
 */
function getLanHostFromExpo(): string | undefined {
  const expoConfig = Constants.expoConfig as { hostUri?: string } | undefined;
  const hostUri =
    expoConfig?.hostUri ??
    (Constants.expoGoConfig as { debuggerHost?: string } | undefined)?.debuggerHost ??
    (Constants.manifest as { debuggerHost?: string } | undefined)?.debuggerHost;

  if (typeof hostUri !== 'string' || !hostUri.length) return undefined;
  const host = hostUri.split(':')[0];
  if (!host || host === 'localhost' || host === '127.0.0.1') return undefined;
  return host;
}

/**
 * Base URL for the goldcrest-api server (no trailing slash).
 *
 * - Set `EXPO_PUBLIC_API_BASE_URL` in `.env` to override (recommended for CI / production).
 * - In dev, we try the Expo LAN host first (works with Expo Go on a real phone).
 * - Android emulator: `10.0.2.2` maps to your computer's localhost.
 * - iOS simulator: `localhost` works.
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }

  if (!__DEV__) {
    // Production builds should set EXPO_PUBLIC_API_BASE_URL
    return `http://localhost:${DEFAULT_PORT}`;
  }

  const lan = getLanHostFromExpo();
  if (lan) {
    return `http://${lan}:${DEFAULT_PORT}`;
  }

  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${DEFAULT_PORT}`;
  }

  return `http://localhost:${DEFAULT_PORT}`;
}
