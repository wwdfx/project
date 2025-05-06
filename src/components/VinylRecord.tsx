import React, { useEffect, useState } from 'react';
import { Track } from '../types';
import { extractDominantColor, generateColorPalette } from '../utils/colorExtractor';
import { usePlayer } from '../context/PlayerContext';

interface VinylRecordProps {
  track: Track | null;
}

const VinylRecord: React.FC<VinylRecordProps> = ({ track }) => {
  const { state, dispatch } = usePlayer();
  const [colorPalette, setColorPalette] = useState({
    base: '#333333',
    text: '#ffffff',
    accent: '#222222',
    isLight: false
  });

  // Extract dominant color from album cover when track changes
  useEffect(() => {
    if (track?.album.cover_medium) {
      const extractColor = async () => {
        try {
          const dominantColor = await extractDominantColor(track.album.cover_medium);
          dispatch({ type: 'SET_DOMINANT_COLOR', payload: dominantColor });
          setColorPalette(generateColorPalette(dominantColor));
        } catch (error) {
          console.error('Failed to extract color:', error);
        }
      };
      
      extractColor();
    }
  }, [track, dispatch]);

  if (!track) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 text-lg">No track selected</div>
      </div>
    );
  }

  // Vinyl animation class based on playing state
  const spinClass = state.isPlaying ? 'animate-spin-slow' : '';

  return (
    <div className="flex items-center justify-center p-4">
      <div 
        className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full ${spinClass} transition-all duration-1000 ease-in-out`}
        style={{ 
          background: `radial-gradient(circle at center, ${colorPalette.accent} 0%, ${colorPalette.base} 25%, #000000 50%, ${colorPalette.base} 75%, ${colorPalette.accent} 100%)`,
          boxShadow: `0 0 30px ${colorPalette.base}80`
        }}
      >
        {/* Vinyl grooves */}
        <div className="absolute inset-0 rounded-full opacity-20" 
          style={{ 
            background: `repeating-radial-gradient(circle at center, 
              rgba(255,255,255,0.1) 0px, 
              rgba(0,0,0,0.2) 2px, 
              rgba(255,255,255,0.1) 4px)` 
          }} 
        />

        {/* Highlight reflection */}
        <div className="absolute top-0 left-[10%] w-[80%] h-[50%] bg-white opacity-5 rounded-t-full" />

        {/* Center label with album art */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full overflow-hidden border-4 border-white">
          <img 
            src={track.album.cover_medium} 
            alt={track.album.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Center hole */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[7%] h-[7%] rounded-full bg-black border border-gray-600" />
      </div>
    </div>
  );
};

export default VinylRecord;