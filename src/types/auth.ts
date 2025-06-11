export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string; 
  expiresAt: string | Date;
}

export interface AuthState {
  user: { email: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  tokens?: AuthTokens | null; 
}

