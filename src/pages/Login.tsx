import React from 'react';
import { Music } from 'lucide-react';
import { getSpotifyAuthUrl } from '../services/spotifyAuth';

const Login: React.FC = () => {
  const handleLogin = async () => {
    const authUrl = await getSpotifyAuthUrl();
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-600 to-green-900 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-3 rounded-full">
            <Music size={40} className="text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Vinyl Music Player</h1>
        <p className="text-gray-600 mb-8">Listen to your favorite music with a beautiful vinyl experience</p>
        
        <button
          onClick={handleLogin}
          className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Connect with Spotify
        </button>
        
        <p className="mt-4 text-sm text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Don't have a Spotify account? 
            <a href="https://www.spotify.com/signup" target="_blank" rel="noopener noreferrer" className="text-green-600 ml-1 hover:underline">
              Sign up for free
            </a>
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center text-white text-sm opacity-80">
        <p>© 2025 Vinyl Music Player. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;