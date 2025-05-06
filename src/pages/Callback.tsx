import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { handleAuthCallback } from '../services/spotifyAuth';

const Callback: React.FC = () => {
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        dispatch({ type: 'LOGIN_START' });

        try {
          const { user, accessToken } = await handleAuthCallback(code);
          if (typeof accessToken === 'string') {
            dispatch({ type: 'LOGIN_SUCCESS', payload: { user, accessToken } });
          } else {
            throw new Error('Invalid access token');
          }
          navigate('/'); // Redirect to home page
        } catch (error) {
          dispatch({ type: 'LOGIN_FAILURE', payload: 'Authentication failed. Please try again.' });
          navigate('/'); // Redirect to home page
        }
      } else {
        navigate('/'); // Redirect to home page
      }
    };

    processCallback();
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
};

export default Callback;
