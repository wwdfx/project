import { SpotifyApi } from '@spotify/web-api-ts-sdk';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

// Generate a random string for the code_verifier
const generateCodeVerifier = () => {
  const array = new Uint8Array(128);
  window.crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Generate a code challenge from the code_verifier
const generateCodeChallenge = async (codeVerifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Initialize the Spotify SDK with PKCE
const sdk = SpotifyApi.withUserAuthorization(
  CLIENT_ID,
  REDIRECT_URI,
  ['user-read-private', 'user-read-email', 'user-library-read', 'user-read-playback-state', 'user-modify-playback-state', 'streaming']
);

export const getSpotifyAuthUrl = async () => {
  const codeVerifier = generateCodeVerifier();
  console.log('Generated code_verifier:', codeVerifier); // Log the generated code_verifier
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store the code_verifier in sessionStorage
  sessionStorage.setItem('spotify_code_verifier', codeVerifier);

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
    scope: scopes.join(' '),
    code_challenge_method: 'S256',
    code_challenge: codeChallenge
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
  const codeVerifier = sessionStorage.getItem('spotify_code_verifier');
  console.log('Retrieved code_verifier:', codeVerifier); // Log the retrieved code_verifier
  if (!codeVerifier) {
    throw new Error('No verifier found in cache - can\'t validate query string callback parameters.');
  }

  try {
    // Log the payload for debugging
    console.log('Sending token request with payload:', {
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    });

    // Authenticate using the SDK with the code and code_verifier
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorResponse = await tokenResponse.json();
      console.error('Token request failed:', errorResponse);
      throw new Error(`Failed to fetch token: ${errorResponse.error_description || 'Unknown error'}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('Token response:', tokenData);

    const sdkWithToken = SpotifyApi.withAccessToken(
      tokenData.access_token,
      tokenData.expires_in
    );

    // Save the access token in localStorage
    localStorage.setItem('spotify_auth', JSON.stringify({
      accessToken: tokenData.access_token,
      expiresIn: tokenData.expires_in,
      refreshToken: tokenData.refresh_token,
    }));

    const profile = await sdkWithToken.currentUser.profile();
    return {
      accessToken: tokenData.access_token,
      user: profile
    };
  } catch (error) {
    console.error('Error during handleAuthCallback:', error);
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
  sessionStorage.removeItem('spotify_code_verifier');
  window.location.href = '/';
};