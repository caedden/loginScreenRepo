import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, LoginCredentials } from '../types/auth';
import { authService } from '../services/authService';
import { getRefreshToken, isAuthenticated, removeTokens } from '../utils/tokenStorage';

// Initial auth state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auth actions
type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: { email: string }; tokens: AuthTokens } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };


// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
  return {
    ...state,
    isAuthenticated: true,
    isLoading: false,
    user: action.payload.user,
    tokens: action.payload.tokens,
    error: null,
  };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create auth context
interface AuthContextProps {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { email: 'user@example.com' }, 
        });
      }
    };

    checkAuth();
  }, []);

  // Login function
 const login = async (credentials: LoginCredentials) => {
  dispatch({ type: 'LOGIN_REQUEST' });

  try {
    const tokens = await authService.login(credentials); // captura tokens aqui

    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { user: { email: credentials.email }, tokens } // tokens está definido agora
    });
  } catch (error) {
    let errorMessage = 'Login failed. Please try again.';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    dispatch({
      type: 'LOGIN_FAILURE',
      payload: errorMessage,
    });
  }
};


  // Logout function
const logout = async () => {
  try {
    removeTokens(); // limpa o localStorage
  } finally {
    dispatch({ type: 'LOGOUT' }); // atualiza o estado de auth
    window.location.href = '/login'; // redireciona
  }
};


  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};