import { AuthState } from '../types';

const DEEZER_AUTH_URL = 'https://connect.deezer.com/oauth/auth.php';
const APP_ID = import.meta.env.VITE_DEEZER_APP_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

// The URL to redirect to for OAuth login
export const getDeezerAuthUrl = () => {
  const url = new URL(DEEZER_AUTH_URL);
  url.searchParams.append('app_id', APP_ID);
  url.searchParams.append('redirect_uri', REDIRECT_URI);
  url.searchParams.append('perms', 'basic_access,email,offline_access,manage_library,listening_history');
  
  return url.toString();
};

// Handle the OAuth callback
export const handleAuthCallback = async (code: string): Promise<string> => {
  // In a real app, you would exchange the code for a token via a backend
  // For this example, we'll mock the token exchange
  // Note: In production, never expose your app secret in frontend code
  
  // Simulating a token fetch
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo purposes only - in a real app, this would be an actual API call
      resolve('mock_access_token_' + Math.random().toString(36).substring(2, 15));
    }, 500);
  });
};

// Initialize auth state from localStorage
export const initializeAuthState = (): AuthState => {
  try {
    const storedAuth = localStorage.getItem('deezer_auth');
    if (storedAuth) {
      return JSON.parse(storedAuth);
    }
  } catch (error) {
    console.error('Failed to parse stored auth', error);
  }
  
  return {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    loading: false,
    error: null
  };
};

// Save auth state to localStorage
export const saveAuthState = (state: AuthState): void => {
  try {
    localStorage.setItem('deezer_auth', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save auth state', error);
  }
};

// Get user info from Deezer API
export const fetchUserInfo = async (accessToken: string) => {
  // In a production app, this would be a real API call
  // For demo purposes, we'll return mock data
  return {
    id: 12345,
    name: 'Demo User',
    image: 'https://via.placeholder.com/100'
  };
};

// Log out user
export const logout = (): void => {
  localStorage.removeItem('deezer_auth');
  window.location.href = '/';
};