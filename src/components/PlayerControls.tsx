import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume, VolumeX, Volume1, Volume2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const PlayerControls: React.FC = () => {
  const { state, togglePlayPause, nextTrack, prevTrack, setVolume, seekTo } = usePlayer();
  const { isPlaying, volume, progress, duration, dominantColor } = state;

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle seek bar change
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    seekTo(value);
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
  };

  // Get appropriate volume icon based on level
  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX size={20} />;
    if (volume < 0.3) return <Volume size={20} />;
    if (volume < 0.7) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  // Generate contrasting text color for buttons
  const textColor = dominantColor ? (parseInt(dominantColor.slice(1), 16) > 0xffffff / 2 ? '#000' : '#fff') : '#fff';

  return (
    <div className="w-full px-4 py-3 flex flex-col"
      style={{ backgroundColor: `${dominantColor}20` }}
    >
      {/* Progress bar */}
      <div className="w-full mb-2 flex items-center">
        <span className="text-xs mr-2" style={{ color: textColor }}>
          {formatTime(progress)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={progress}
          onChange={handleSeek}
          className="flex-grow h-1 appearance-none rounded-md bg-gray-300 outline-none cursor-pointer"
          style={{ 
            background: `linear-gradient(to right, ${dominantColor || '#333'} 0%, ${dominantColor || '#333'} ${(progress / duration) * 100}%, rgba(255,255,255,0.3) ${(progress / duration) * 100}%, rgba(255,255,255,0.3) 100%)`,
          }}
        />
        <span className="text-xs ml-2" style={{ color: textColor }}>
          {formatTime(duration)}
        </span>
      </div>
      
      {/* Control buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => setVolume(0)}
            className="p-2 rounded-full hover:bg-black/10 transition-colors"
            style={{ color: textColor }}
          >
            <VolumeIcon />
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 appearance-none rounded-md outline-none cursor-pointer"
            style={{ 
              background: `linear-gradient(to right, ${textColor} 0%, ${textColor} ${volume * 100}%, rgba(255,255,255,0.3) ${volume * 100}%, rgba(255,255,255,0.3) 100%)`,
            }}
          />
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <button 
            onClick={prevTrack}
            className="p-2 rounded-full hover:bg-black/10 transition-colors"
            style={{ color: textColor }}
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlayPause}
            className="p-3 rounded-full transition-colors"
            style={{ 
              backgroundColor: dominantColor || '#333',
              color: textColor
            }}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="p-2 rounded-full hover:bg-black/10 transition-colors"
            style={{ color: textColor }}
          >
            <SkipForward size={24} />
          </button>
        </div>
        
        <div className="w-24 flex justify-end">
          {/* Spacer to balance the layout */}
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;