import React from 'react';
import { Heart, Share2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const NowPlaying: React.FC = () => {
  const { state } = usePlayer();
  const { currentTrack, dominantColor } = state;

  if (!currentTrack) {
    return null;
  }

  // Generate text color based on dominant color
  const textColor = dominantColor 
    ? (parseInt(dominantColor.slice(1), 16) > 0xffffff / 2 ? '#000' : '#fff')
    : '#fff';

  return (
    <div 
      className="w-full p-4 flex items-center justify-between transition-colors duration-500"
      style={{ 
        backgroundColor: dominantColor,
        color: textColor
      }}
    >
      <div className="flex items-center">
        <img 
          src={currentTrack.album.cover_small} 
          alt={currentTrack.album.title}
          className="w-16 h-16 object-cover rounded shadow-md mr-4"
        />
        
        <div>
          <h3 className="font-bold text-lg">{currentTrack.title}</h3>
          <p className="text-sm opacity-90">{currentTrack.artist.name}</p>
          <p className="text-xs opacity-70">{currentTrack.album.title}</p>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Heart size={20} />
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default NowPlaying;