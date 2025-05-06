export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  preview_url: string;
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  images: Array<{
    url: string;
  }>;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  images: Array<{
    url: string;
  }>;
  tracks: {
    total: number;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: SpotifyUser | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

export interface SpotifyAPIResponse<T> {
  items: T[];
  total: number;
  next?: string;
  previous?: string;
}