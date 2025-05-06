# Vinyl Music Player

A beautifully designed music player with Deezer integration and a dynamic vinyl record visualization.

## Features

- Deezer OAuth authentication for accessing your music
- Animated spinning vinyl record with album art
- Dynamic color adaptation based on album artwork
- Music playback controls
- Track search and browsing
- Playlist management
- Responsive design

## Setup

1. Create a Deezer Developer account at [developers.deezer.com](https://developers.deezer.com/)
2. Create a new application to get your App ID
3. Set the redirect URL to match your local development environment (e.g., `http://localhost:5173/callback`)
4. Update the `.env` file with your Deezer App ID
5. Run `npm install` to install dependencies
6. Run `npm run dev` to start the development server

## Technologies Used

- React with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Deezer API for music data

## Notes

- This application uses the 30-second previews available through the Deezer API for demonstration purposes
- For a full implementation, you would need to handle token exchange securely via a backend