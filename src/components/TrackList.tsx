import React from 'react';
import { Music, Play } from 'lucide-react';
import { Track } from '../types';
import { usePlayer } from '../context/PlayerContext';

interface TrackListProps {
  tracks: Track[];
  title?: string;
}

const TrackList: React.FC<TrackListProps> = ({ tracks, title }) => {
  const { state, playTrack, playQueue } = usePlayer();
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlayTrack = (track: Track, index: number) => {
    // Play this track, but add the rest of the tracks to the queue
    playQueue(tracks, index);
  };

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-xl font-semibold mb-4 px-4">{title}</h2>
      )}
      
      <div className="divide-y divide-gray-100">
        {tracks.map((track, index) => {
          const isCurrentTrack = state.currentTrack?.id === track.id;
          
          return (
            <div 
              key={track.id}
              className={`flex items-center p-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                isCurrentTrack ? 'bg-gray-50' : ''
              }`}
              onClick={() => handlePlayTrack(track, index)}
            >
              <div className="w-12 h-12 mr-3 relative flex-shrink-0">
                {track.album.cover_small ? (
                  <img 
                    src={track.album.cover_small} 
                    alt={track.album.title}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <Music size={20} className="text-gray-400" />
                  </div>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-40 transition-opacity rounded">
                  {isCurrentTrack && state.isPlaying ? (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  ) : (
                    <Play size={20} className="text-white opacity-0 group-hover:opacity-100" />
                  )}
                </div>
              </div>
              
              <div className="flex-grow">
                <p className={`font-medium ${isCurrentTrack ? 'text-blue-600' : 'text-gray-800'}`}>
                  {track.title}
                </p>
                <p className="text-sm text-gray-500">{track.artist.name}</p>
              </div>
              
              <div className="text-sm text-gray-400 mr-1">
                {formatTime(track.duration)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackList;