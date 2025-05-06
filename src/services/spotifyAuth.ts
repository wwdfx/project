import { SpotifyApi } from '@spotify/web-api-ts-sdk';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

const sdk = SpotifyApi.withUserAuthorization(
  CLIENT_ID,
  REDIRECT_URI,
  ['user-read-private', 'user-read-email', 'user-library-read', 'user-read-playback-state', 'user-modify-playback-state', 'streaming']
);

export const getSpotifyAuthUrl = () => {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'user-read-playback-state',
    'user-modify-playback-state',
    'streaming'
  ];

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: scopes.join(' ')
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

export const initializeAuthState = () => {
  try {
    const storedAuth = localStorage.getItem('spotify_auth');
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

export const saveAuthState = (state: any) => {
  try {
    localStorage.setItem('spotify_auth', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save auth state', error);
  }
};

export const handleAuthCallback = async (code: string) => {
  try {
    await sdk.authenticate();
    const profile = await sdk.currentUser.profile();
    return {
      accessToken: sdk.getAccessToken(),
      user: profile
    };
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
};

export const fetchUserInfo = async () => {
  try {
    const profile = await sdk.currentUser.profile();
    return profile;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    throw error;
  }
};

export const getSpotifySDK = () => sdk;

export const logout = () => {
  localStorage.removeItem('spotify_auth');
  window.location.href = '/';
};