import React, { useEffect, useState } from 'react';
import { Search, Library, Home, User } from 'lucide-react';
import { Track } from '../types';
import { useAuth } from '../context/AuthContext';
import { getPlaylistTracks } from '../services/deezerApi';
import VinylRecord from '../components/VinylRecord';
import NowPlaying from '../components/NowPlaying';
import PlayerControls from '../components/PlayerControls';
import TrackList from '../components/TrackList';
import SearchBar from '../components/SearchBar';
import { usePlayer } from '../context/PlayerContext';

const Player: React.FC = () => {
  const { state: authState } = useAuth();
  const { state: playerState } = usePlayer();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'library' | 'profile'>('home');
  const [searchResults, setSearchResults] = useState<Track[]>([]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await getPlaylistTracks(1, authState.accessToken);
        setTracks(response.data);
      } catch (error) {
        console.error('Failed to fetch tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTracks();
  }, [authState.accessToken]);

  const handleSearchResults = (results: Track[]) => {
    setSearchResults(results);
    if (results.length > 0) {
      setActiveTab('search');
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-white transition-colors duration-500"
      style={{
        backgroundColor: playerState.dominantColor 
          ? `${playerState.dominantColor}05` // Very subtle background
          : 'white'
      }}
    >
      {/* Header */}
      <SearchBar onSearchResults={handleSearchResults} />
      
      {/* Main content */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Left panel (vinyl visualization) */}
        <div className="w-full md:w-1/2 p-4 flex flex-col items-center justify-center">
          <VinylRecord track={playerState.currentTrack} />
        </div>
        
        {/* Right panel (tracks list) */}
        <div className="w-full md:w-1/2 bg-white overflow-y-auto shadow-lg">
          {activeTab === 'home' && (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <TrackList tracks={tracks} title="Recommended Tracks" />
              )}
            </>
          )}
          
          {activeTab === 'search' && searchResults.length > 0 && (
            <TrackList tracks={searchResults} title="Search Results" />
          )}
          
          {activeTab === 'library' && (
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Your Library</h2>
              <p className="text-gray-500">Your playlists and saved tracks will appear here.</p>
            </div>
          )}
          
          {activeTab === 'profile' && (
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Profile</h2>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={32} className="text-gray-400" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">{authState.user?.name || 'User'}</h3>
                  <p className="text-sm text-gray-500">Deezer User</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Player controls */}
      {playerState.currentTrack && (
        <div className="w-full">
          <NowPlaying />
          <PlayerControls />
        </div>
      )}
      
      {/* Bottom navigation */}
      <div className="bg-white border-t border-gray-200 flex items-center justify-around py-2">
        <button 
          className={`flex flex-col items-center p-2 ${activeTab === 'home' ? 'text-indigo-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('home')}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button 
          className={`flex flex-col items-center p-2 ${activeTab === 'search' ? 'text-indigo-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('search')}
        >
          <Search size={24} />
          <span className="text-xs mt-1">Search</span>
        </button>
        
        <button 
          className={`flex flex-col items-center p-2 ${activeTab === 'library' ? 'text-indigo-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('library')}
        >
          <Library size={24} />
          <span className="text-xs mt-1">Library</span>
        </button>
        
        <button 
          className={`flex flex-col items-center p-2 ${activeTab === 'profile' ? 'text-indigo-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Player;