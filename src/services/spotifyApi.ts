import { getSpotifySDK } from './spotifyAuth';

const sdk = getSpotifySDK();

export const searchTracks = async (query: string) => {
  try {
    const response = await sdk.search(query, ['track'], undefined, 20);
    return response.tracks.items;
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
};

export const getUserPlaylists = async () => {
  try {
    const response = await sdk.currentUser.playlists.playlists();
    return response.items;
  } catch (error) {
    console.error('Failed to fetch playlists:', error);
    throw error;
  }
};

export const getPlaylistTracks = async (playlistId: string) => {
  try {
    const response = await sdk.playlists.getPlaylistItems(playlistId);
    return response.items.map(item => item.track);
  } catch (error) {
    console.error('Failed to fetch playlist tracks:', error);
    throw error;
  }
};

export const getRecommendations = async () => {
  try {
    const topTracks = await sdk.currentUser.topItems.tracks();
    const seedTracks = topTracks.items.slice(0, 5).map(track => track.id);
    
    const recommendations = await sdk.recommendations.get({
      seed_tracks: seedTracks
    });
    
    return recommendations.tracks;
  } catch (error) {
    console.error('Failed to fetch recommendations:', error);
    throw error;
  }
};