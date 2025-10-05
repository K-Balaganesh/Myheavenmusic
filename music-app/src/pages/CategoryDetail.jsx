import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useMusicPlayer } from '../context/MusicPlayerContext';
// Reuse the SongCard styles for the basic card look
import "../components/SongCard.css"; 
// Import the new/consolidated detail page specific styles
import "./CategoryDetail.css"; 

export default function CategoryDetail() {
    // Get parameters from the URL (e.g., /categories/trending)
    const { categoryId } = useParams();
    // Get the data passed during navigation (title and song list)
    const location = useLocation();
    const { title, songs } = location.state || {};
    
    // Get music player functions
    const { activeSong, isPlaying, playSong } = useMusicPlayer();

    if (!songs || songs.length === 0) {
        return (
            <div className="category-detail-page">
                <h1 className="detail-title">{title || categoryId}</h1>
                <p className="loading-message">No songs found in this playlist/category. Try adding some!</p>
            </div>
        );
    }
    
    // Render the list of songs
    const renderSongCard = (song) => (
        <div  
            // Use the base song-card class for shared styling
            className={`song-card ${activeSong?.id === song.id && isPlaying ? 'is-playing' : ''}`} 
            onClick={() => playSong(song)} 
            key={song.id} 
        > 
            <img  
                src={song.cover || "https://placehold.co/200x200/404040/ffffff?text=No+Cover"}  
                alt={song.songname || "Unknown Song"}  
                className="cover"  
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x200/404040/ffffff?text=No+Cover"; }} 
            /> 
            {/* Added styling classes for text below */}
            <div className="song-info">
                <h4>{song.songname || 'Unknown Title'}</h4> 
                <p className="artist-name">{song.artist ? song.artist.split(',')[0] : 'Unknown Artist'}</p> 
                {song.moviename && <p className="movie-name">Movie: {song.moviename}</p>} 
            </div>
        </div> 
    );

    return (
        <div className="category-detail-page">
            <h1 className="detail-title">{title || `Category: ${categoryId}`}</h1>
            <p className="song-count">{songs.length} songs found. Click any card to play!</p>
            
            {/* Use the new song-grid class for the layout */}
            <div className="song-grid"> 
                {songs.map(renderSongCard)}
            </div>
        </div>
    );
}
