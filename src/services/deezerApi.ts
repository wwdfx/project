import { Track, DeezerAPIResponse, Playlist } from '../types';

const API_BASE_URL = 'https://api.deezer.com';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// Helper function to make authenticated API requests
const apiRequest = async <T>(endpoint: string, accessToken: string | null): Promise<T> => {
  // In a real app, you'd use the actual token
  // For demo purposes, we'll bypass the token and use mock data if needed
  
  try {
    // In production, you would add the token to requests
    // The CORS proxy is needed for browser requests to Deezer API
    const response = await fetch(`${CORS_PROXY}${API_BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed', error);
    throw error;
  }
};

// Fetch track details
export const getTrack = async (trackId: number, accessToken: string | null): Promise<Track> => {
  return await apiRequest<Track>(`/track/${trackId}`, accessToken);
};

// Search tracks
export const searchTracks = async (query: string, accessToken: string | null): Promise<DeezerAPIResponse<Track>> => {
  return await apiRequest<DeezerAPIResponse<Track>>(`/search?q=${encodeURIComponent(query)}`, accessToken);
};

// Get user's playlists
export const getUserPlaylists = async (accessToken: string | null): Promise<DeezerAPIResponse<Playlist>> => {
  // For demo, we'll return mock data
  return {
    data: [
      {
        id: 1,
        title: 'Favorite Tracks',
        cover: 'https://e-cdns-images.dzcdn.net/images/cover/1200x1200-000000-80-0-0.jpg',
        tracks_count: 25
      },
      {
        id: 2,
        title: 'Workout Mix',
        cover: 'https://e-cdns-images.dzcdn.net/images/cover/1200x1200-000000-80-0-0.jpg',
        tracks_count: 18
      }
    ],
    total: 2
  };
};

// Get tracks in a playlist
export const getPlaylistTracks = async (playlistId: number, accessToken: string | null): Promise<DeezerAPIResponse<Track>> => {
  // For demo, we'll return mock data
  const mockTracks: Track[] = [
    {
      id: 1,
      title: "Vroom Vroom",
      duration: 156,
      artist: { id: 101, name: "Charli XCX" },
      album: {
        id: 201,
        title: "Vroom Vroom EP",
        cover: "https://e-cdns-images.dzcdn.net/images/cover/4be7695dbb9287f5917b22de40256742/1000x1000-000000-80-0-0.jpg",
        cover_small: "https://e-cdns-images.dzcdn.net/images/cover/4be7695dbb9287f5917b22de40256742/56x56-000000-80-0-0.jpg",
        cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/4be7695dbb9287f5917b22de40256742/250x250-000000-80-0-0.jpg",
        cover_big: "https://e-cdns-images.dzcdn.net/images/cover/4be7695dbb9287f5917b22de40256742/500x500-000000-80-0-0.jpg"
      },
      preview: "https://cdns-preview-8.dzcdn.net/stream/c-8ed1373cd56a39fc854b3e35649d6034-5.mp3"
    },
    {
      id: 2,
      title: "Taste",
      duration: 201,
      artist: { id: 102, name: "Sabrina Carpenter" },
      album: {
        id: 202,
        title: "Emails I Can't Send",
        cover: "https://e-cdns-images.dzcdn.net/images/cover/d3a3b560290449e18dba388ecd8c15c5/1000x1000-000000-80-0-0.jpg",
        cover_small: "https://e-cdns-images.dzcdn.net/images/cover/d3a3b560290449e18dba388ecd8c15c5/56x56-000000-80-0-0.jpg",
        cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/d3a3b560290449e18dba388ecd8c15c5/250x250-000000-80-0-0.jpg",
        cover_big: "https://e-cdns-images.dzcdn.net/images/cover/d3a3b560290449e18dba388ecd8c15c5/500x500-000000-80-0-0.jpg"
      },
      preview: "https://cdns-preview-8.dzcdn.net/stream/c-853d19a12a694ccc35c2b7d1e8a94bcf-4.mp3"
    },
    {
      id: 3,
      title: "Murder Song (5, 4, 3, 2, 1)",
      duration: 184,
      artist: { id: 103, name: "AURORA" },
      album: {
        id: 203,
        title: "Running With The Wolves",
        cover: "https://e-cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/1000x1000-000000-80-0-0.jpg",
        cover_small: "https://e-cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/56x56-000000-80-0-0.jpg",
        cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/250x250-000000-80-0-0.jpg",
        cover_big: "https://e-cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/500x500-000000-80-0-0.jpg"
      },
      preview: "https://cdns-preview-9.dzcdn.net/stream/c-9eee58da0cfd7dfaacf702cad5067ed2-3.mp3"
    },
    {
      id: 4,
      title: "Maniac",
      duration: 180,
      artist: { id: 104, name: "Conan Gray" },
      album: {
        id: 204,
        title: "Kid Krow",
        cover: "https://e-cdns-images.dzcdn.net/images/cover/74531410d29dd41a92c288b24a874e83/1000x1000-000000-80-0-0.jpg",
        cover_small: "https://e-cdns-images.dzcdn.net/images/cover/74531410d29dd41a92c288b24a874e83/56x56-000000-80-0-0.jpg",
        cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/74531410d29dd41a92c288b24a874e83/250x250-000000-80-0-0.jpg",
        cover_big: "https://e-cdns-images.dzcdn.net/images/cover/74531410d29dd41a92c288b24a874e83/500x500-000000-80-0-0.jpg"
      },
      preview: "https://cdns-preview-d.dzcdn.net/stream/c-d5a91f3d9a47e747df2c068a31c79f93-6.mp3"
    }
  ];
  
  return {
    data: mockTracks,
    total: mockTracks.length
  };
};

// Get recommendations
export const getRecommendations = async (accessToken: string | null): Promise<DeezerAPIResponse<Track>> => {
  // In a real app, you'd get personalized recommendations
  return await getPlaylistTracks(1, accessToken);
};