import React, { useEffect } from "react";
import "./SongCard.css";
// Import the context hook
import { useMusicPlayer } from '../context/MusicPlayerContext'; 

export default function SongCard() {
    // Use the context hook to access global player state and functions.
    const { songs, activeSong, isPlaying, playSong, setSongs } = useMusicPlayer();
    
    // --- Data Fetching ---
    // This useEffect runs once to fetch data and populate the global 'songs' state via setSongs.
    useEffect(() => {
        // Ensure this path '/songs.json' is correct for your project
        fetch("/songs.json")
          .then((res) => res.json())
          .then((data) => {
            const sortedSongs = data.sort((a, b) => a.id - b.id);
            // Call setSongs from the context to update the global song list
            setSongs(sortedSongs); 
          })
          .catch((err) => console.error("Error fetching songs:", err));
    }, [setSongs]); // setSongs is included in the dependency array as good practice.

    return (
        <div className="song-list">
            {songs.map((song) => (
                <div 
                    key={song.id} 
                    // The class name uses global state (activeSong, isPlaying) for visual feedback
                    className={`song-card ${activeSong?.id === song.id && isPlaying ? 'is-playing' : ''}`}
                    // Clicking the card calls the global playSong function
                    onClick={() => playSong(song)}
                >
                    <img src={song.cover} alt={song.songname} className="cover" />
                    <h4>{song.songname}</h4>
                    {/* Assuming artist is a comma-separated string, displaying the first one */}
                    <p>{song.artist.split(',')[0]}</p> 
                </div>
            ))}
        </div>
    );
}