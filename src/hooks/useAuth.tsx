import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  const { state: { isAuthenticated, isLoading, error, user, tokens }, login, logout, clearError } = context;
  
  const tokenExpiresAt = tokens?.accessTokenInfo?.expiresAt
    ? new Date(tokens.accessTokenInfo.expiresAt).getTime()
    : null;

  return {
    isAuthenticated,
    isLoading,
    error,
    user,
    login,
    logout,
    clearError,
    tokenExpiresAt,
  };
};
