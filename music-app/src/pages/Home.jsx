import React, { useState, useEffect, useMemo } from "react";
import { useMusicPlayer } from '../context/MusicPlayerContext';
import "./Home.css";
import "../components/Search.css"; // Reusing Song Card styles

const SONGS_PER_ROW = 6;
const HISTORY_KEY = 'playedSongHistory'; // Key used in MusicPlayerContext for history

// --- AUTHENTICATION HOOK (MOCK IMPLEMENTATION) ---
// ⚠️ REPLACE THIS WITH YOUR ACTUAL AUTHENTICATION LOGIC ⚠️
const useAuth = () => {
    // In a real app, this state would come from your global authentication context
    // For now, we'll use a local state that defaults to null (unauthenticated).
    const [user, setUser] = useState({ name: null }); // name: 'Vignesh' for authenticated test

    // Simulate an authenticated user after a delay (e.g., after login/signup)
    // useEffect(() => {
    //     // Simulate successful login/signup
    //     setTimeout(() => {
    //         setUser({ name: "JaneDoe" }); // Replace with the actual fetched username
    //     }, 1000);
    // }, []);

    return {
        username: user.name,
        isAuthenticated: !!user.name,
    };
}

// --- LOCAL STORAGE UTILITY ---
const getPlayedHistory = () => {
    try {
        const history = localStorage.getItem(HISTORY_KEY);
        return history ? Array.from(new Set(JSON.parse(history))) : [];
    } catch (e) {
        return [];
    }
};

// --- SongRow Component ---
const SongRow = React.memo(({ title, songs, activeSong, isPlaying, playSong, categoryId }) => {
    if (!songs || songs.length === 0) return null;
    const infiniteSongs = [...songs, ...songs];

    return (
        <section className="song-section">
            <h2 className="section-title" id={`title-${categoryId}`}>{title}</h2>
            <div className={`song-row-container ${categoryId}-scroll-area`}>
                <div className="song-row-content">
                    {infiniteSongs.map((song, index) => (
                        <div
                            key={`${song.id}-${index}`}
                            className={`song-card ${activeSong?.id === song.id && isPlaying ? 'is-playing' : ''}`}
                            onClick={() => playSong(song)}
                        >
                            <img
                                src={song.cover}
                                alt={song.songname}
                                className="cover"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x200/404040/ffffff?text=No+Cover"; }}
                            />
                            <h4>{song.songname}</h4>
                            <p>{song.artist.split(',')[0]}</p>
                            {song.movieName && <p className="song-detail">Movie: {song.movieName}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});

export default function Home() {
    const [allSongs, setAllSongs] = useState([]);
    const { activeSong, isPlaying, playSong } = useMusicPlayer();
    
    // --- USING AUTH HOOK FOR USERNAME and AUTH STATE ---
    const { username, isAuthenticated } = useAuth(); 
    
    // Fetch All Songs
    useEffect(() => {
        fetch("/songs.json")
          .then((res) => res.json())
          .then((data) => {
            setAllSongs(data);
          })
          .catch((err) => console.error("Error fetching songs:", err));
    }, []);

    // --- Song Filtering Logic (Unchanged) ---
    const recentlyPlayed = useMemo(() => {
        const historyIds = getPlayedHistory();
        const songs = historyIds.map(id => allSongs.find(s => s.id === id)).filter(s => s !== undefined);
        return songs.slice(0, SONGS_PER_ROW);
    }, [allSongs]);

    const trendingSongs = useMemo(() => {
        return allSongs
            .filter(song =>
                Array.isArray(song.songvariety) &&
                song.songvariety.some(v => v.toLowerCase() === "trending")
            )
            .slice(0, SONGS_PER_ROW);
    }, [allSongs]);

    const tamilSongs = useMemo(() => {
        return allSongs.filter(song => song.language && song.language.toLowerCase().includes('tamil')).slice(0, SONGS_PER_ROW);
    }, [allSongs]);

    const englishSongs = useMemo(() => {
        return allSongs.filter(song => song.language && song.language.toLowerCase().includes('english')).slice(0, SONGS_PER_ROW);
    }, [allSongs]);
    
    const hindiSongs = useMemo(() => {
        return allSongs.filter(song => song.language && song.language.toLowerCase().includes('hindi')).slice(0, SONGS_PER_ROW);
    }, [allSongs]);

    const isLoading = allSongs.length === 0;

    // --- Personalized Welcome Message JSX (CONDITIONAL LOGIC ADDED) ---
    const welcomeMessage = (
        <h1 className="main-welcome navbar-font">
            <span className="welcome-text">Welcome to </span>
            <span className="username-text">
                <span className="name-color">
                    {/* Conditionally render "[Username]'s" or "My" */}
                    {isAuthenticated ? `${username}'s` : 'My'}
                </span>
                <span className="heaven-color">Heaven Music  </span>
            </span>
        </h1>
    );

    return (
        <div className="home-dashboard">
            
            {/* RENDER THE PERSONALIZED MESSAGE */}
            {welcomeMessage}
            
            {isLoading ? (
                <p className="loading-message">Loading your music library...</p>
            ) : (
                <>
                    <SongRow title="Your Recently Played" songs={recentlyPlayed} categoryId="recent" activeSong={activeSong} isPlaying={isPlaying} playSong={playSong} />
                    <SongRow title="Global Trending Hits" songs={trendingSongs} categoryId="trending" activeSong={activeSong} isPlaying={isPlaying} playSong={playSong} />
                    <SongRow title="Top Tamil Melodies" songs={tamilSongs} categoryId="tamil" activeSong={activeSong} isPlaying={isPlaying} playSong={playSong} />
                    <SongRow title="International English Favorites" songs={englishSongs} categoryId="english" activeSong={activeSong} isPlaying={isPlaying} playSong={playSong} />
                    <SongRow title="Best of Hindi Cinema" songs={hindiSongs} categoryId="hindi" activeSong={activeSong} isPlaying={isPlaying} playSong={playSong} />
                </>
            )}
        </div>
    );
}