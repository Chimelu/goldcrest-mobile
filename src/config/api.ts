const PRODUCTION_API_BASE_URL = 'https://goldcrest-backend.vercel.app';

/**
 * Base URL for the goldcrest-api server (no trailing slash).
 *
 * This app is locked to the deployed Vercel backend.
 */
export function getApiBaseUrl(): string {
  return PRODUCTION_API_BASE_URL.replace(/\/$/, '');
}

/**
 * Optional helper value you can use for local overrides:
 * http://<your-lan-ip>:4000
 */
export function getSuggestedLocalApiBaseUrl(): string {
  return PRODUCTION_API_BASE_URL.replace(/\/$/, '');
}
