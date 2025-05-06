import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import Login from './pages/Login';
import Player from './pages/Player';
import Callback from './pages/Callback'; // Ensure the Callback.tsx file exists in the ./pages directory

// Add animation keyframes for vinyl spinning
import './styles.css';

const AppContent: React.FC = () => {
  const { state } = useAuth();
  
  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return state.isAuthenticated ? <Player /> : <Login />;
};

function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Router>
          <Routes>
            <Route path="/callback" element={<Callback />} />
            <Route path="*" element={<AppContent />} />
          </Routes>
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;