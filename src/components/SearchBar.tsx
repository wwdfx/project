import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { searchTracks } from '../services/deezerApi';
import { Track } from '../types';
import { useAuth } from '../context/AuthContext';

interface SearchBarProps {
  onSearchResults: (tracks: Track[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchResults }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { state: authState } = useAuth();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    try {
      const results = await searchTracks(query, authState.accessToken);
      onSearchResults(results.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    onSearchResults([]);
  };

  return (
    <form onSubmit={handleSearch} className="w-full px-4 py-3">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for tracks, artists, albums..."
          className="w-full px-10 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring focus:ring-blue-300 placeholder-gray-400"
        />
        
        <div className="absolute left-3 text-gray-400">
          <Search size={18} />
        </div>
        
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;