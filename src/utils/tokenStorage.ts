import { AuthTokens } from '../types/auth';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

export const setTokens = (tokens: AuthTokens): void => {
  localStorage.setItem('auth_tokens', JSON.stringify(tokens));
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};


export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};
export const getTokens = (): AuthTokens | null => {
  const tokensStr = localStorage.getItem('auth_tokens');
  if (!tokensStr) return null;
  return JSON.parse(tokensStr);
};

export const removeTokens = (): void => {
  localStorage.removeItem('auth_tokens');
};
export const getTokenExpiration = (): string | null => {
  return localStorage.getItem('auth_token_expires_at');
};
/**
 * Check if user is authenticated based on tokens
 */
export const isAuthenticated = (): boolean => {
  const tokens = getTokens();
  return !!tokens?.accessToken;
};