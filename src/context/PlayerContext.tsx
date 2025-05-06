import React, { createContext, useContext, useReducer, useEffect, ReactNode, useRef } from 'react';
import { SpotifyTrack } from '../types';

interface PlayerState {
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  volume: number;
  queue: SpotifyTrack[];
  currentTrackIndex: number;
  progress: number;
  duration: number;
  dominantColor: string;
}

type PlayerAction =
  | { type: 'SET_TRACK'; payload: SpotifyTrack }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_QUEUE'; payload: SpotifyTrack[] }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREV_TRACK' }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_DOMINANT_COLOR'; payload: string };

interface PlayerContextType {
  state: PlayerState;
  dispatch: React.Dispatch<PlayerAction>;
  audioRef: React.RefObject<HTMLAudioElement>;
  playTrack: (track: SpotifyTrack) => void;
  playQueue: (tracks: SpotifyTrack[], startIndex?: number) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  queue: [],
  currentTrackIndex: 0,
  progress: 0,
  duration: 0,
  dominantColor: '#333333'
};

const PlayerContext = createContext<PlayerContextType>({
  state: initialState,
  dispatch: () => null,
  audioRef: { current: null },
  playTrack: () => {},
  playQueue: () => {},
  togglePlayPause: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  setVolume: () => {},
  seekTo: () => {}
});

const playerReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
  switch (action.type) {
    case 'SET_TRACK':
      return {
        ...state,
        currentTrack: action.payload,
        isPlaying: true,
        progress: 0
      };
    case 'PLAY':
      return {
        ...state,
        isPlaying: true
      };
    case 'PAUSE':
      return {
        ...state,
        isPlaying: false
      };
    case 'SET_VOLUME':
      return {
        ...state,
        volume: action.payload
      };
    case 'SET_QUEUE':
      return {
        ...state,
        queue: action.payload,
        currentTrackIndex: 0
      };
    case 'NEXT_TRACK':
      const nextIndex = (state.currentTrackIndex + 1) % state.queue.length;
      return {
        ...state,
        currentTrackIndex: nextIndex,
        currentTrack: state.queue[nextIndex],
        progress: 0,
        isPlaying: true
      };
    case 'PREV_TRACK':
      const prevIndex = state.currentTrackIndex === 0 
        ? state.queue.length - 1 
        : state.currentTrackIndex - 1;
      return {
        ...state,
        currentTrackIndex: prevIndex,
        currentTrack: state.queue[prevIndex],
        progress: 0,
        isPlaying: true
      };
    case 'SET_PROGRESS':
      return {
        ...state,
        progress: action.payload
      };
    case 'SET_DURATION':
      return {
        ...state,
        duration: action.payload
      };
    case 'SET_DOMINANT_COLOR':
      return {
        ...state,
        dominantColor: action.payload
      };
    default:
      return state;
  }
};

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (state.isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Failed to play:', error);
          dispatch({ type: 'PAUSE' });
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [state.isPlaying, state.currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateProgress = () => {
      if (audio) {
        dispatch({ type: 'SET_PROGRESS', payload: audio.currentTime });
      }
    };
    
    const handleTimeUpdate = () => {
      updateProgress();
    };
    
    const handleLoadedMetadata = () => {
      if (audio) {
        dispatch({ type: 'SET_DURATION', payload: audio.duration });
      }
    };
    
    const handleEnded = () => {
      nextTrack();
    };
    
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
    }
    
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  const playTrack = (track: SpotifyTrack) => {
    dispatch({ type: 'SET_QUEUE', payload: [track] });
    dispatch({ type: 'SET_TRACK', payload: track });
  };

  const playQueue = (tracks: SpotifyTrack[], startIndex = 0) => {
    if (tracks.length === 0) return;
    
    dispatch({ type: 'SET_QUEUE', payload: tracks });
    dispatch({ type: 'SET_TRACK', payload: tracks[startIndex] });
  };

  const togglePlayPause = () => {
    if (state.isPlaying) {
      dispatch({ type: 'PAUSE' });
    } else {
      dispatch({ type: 'PLAY' });
    }
  };

  const nextTrack = () => {
    if (state.queue.length <= 1) return;
    dispatch({ type: 'NEXT_TRACK' });
  };

  const prevTrack = () => {
    if (state.queue.length <= 1) return;
    dispatch({ type: 'PREV_TRACK' });
  };

  const setVolume = (volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      dispatch({ type: 'SET_PROGRESS', payload: time });
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        state,
        dispatch,
        audioRef,
        playTrack,
        playQueue,
        togglePlayPause,
        nextTrack,
        prevTrack,
        setVolume,
        seekTo
      }}
    >
      {children}
      <audio ref={audioRef} src={state.currentTrack?.preview_url || ''} />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);