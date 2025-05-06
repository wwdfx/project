import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState } from '../types';
import { initializeAuthState, saveAuthState, handleAuthCallback } from '../services/spotifyAuth';

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: any; accessToken: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' };

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>({
  state: {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    loading: false,
    error: null
  },
  dispatch: () => null
});

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        loading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initializeAuthState());

  useEffect(() => {
    saveAuthState(state);
  }, [state]);

  useEffect(() => {
    const processAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code && !state.isAuthenticated) {
        dispatch({ type: 'LOGIN_START' });
        
        try {
          const { user, accessToken } = await handleAuthCallback(code);
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, accessToken }
          });
          
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          dispatch({
            type: 'LOGIN_FAILURE',
            payload: 'Authentication failed. Please try again.'
          });
        }
      }
    };
    
    processAuthCallback();
  }, [state.isAuthenticated]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);