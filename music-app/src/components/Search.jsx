import React, { useState, useEffect, useMemo } from "react";
import { useMusicPlayer } from '../context/MusicPlayerContext';
import "./Search.css";

// Helper key for localStorage
const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_SUGGESTIONS = 5;

// --- LOCAL STORAGE HELPER FUNCTIONS ---

// 1. Function to get recent searches from local storage
const getRecentSearches = () => {
    try {
        const searches = localStorage.getItem(RECENT_SEARCHES_KEY);
        return searches ? JSON.parse(searches) : [];
    } catch (e) {
        console.error("Could not read recent searches from storage:", e);
        return [];
    }
};

// 2. Function to add a new query to recent searches
const addRecentSearch = (newQuery) => {
    if (!newQuery) return;
    
    // Get existing searches and filter out the current one (to move it to the top)
    let searches = getRecentSearches().filter(q => q !== newQuery);
    
    // Add the new query to the beginning of the array
    searches.unshift(newQuery);
    
    // Limit the array size
    searches = searches.slice(0, MAX_SUGGESTIONS);

    try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (e) {
        console.error("Could not save recent search to storage:", e);
    }
};


export default function Search() {
    const [query, setQuery] = useState("");
    const [allSongs, setAllSongs] = useState([]);
    
    // NEW STATE: Holds the list of recent searches
    const [recentSearches, setRecentSearches] = useState(getRecentSearches());
    
    const { activeSong, isPlaying, playSong, setSongs } = useMusicPlayer();

    useEffect(() => {
        // Data Fetching: Load all songs when the component mounts
        fetch("/songs.json")
          .then((res) => res.json())
          .then((data) => {
            const sortedSongs = data.sort((a, b) => a.id - b.id);
            setAllSongs(sortedSongs);
            setSongs(sortedSongs); 
          })
          .catch((err) => console.error("Error fetching songs:", err));
    }, [setSongs]);

    const filteredSongs = useMemo(() => {
        if (!query.trim()) {
            return allSongs; 
        }

        const lowerQuery = query.toLowerCase();

        return allSongs.filter(song => {
            return (
                song.songname.toLowerCase().includes(lowerQuery) ||
                song.artist.toLowerCase().includes(lowerQuery) ||
                // ✅ FIX 1: Use 'moviename' (lowercase) as per JSON structure
                (song.moviename && song.moviename.toLowerCase().includes(lowerQuery)) || 
                // ✅ FIX 2: Use 'characters' (plural) as per JSON structure
                (song.characters && song.characters.toLowerCase().includes(lowerQuery)) || 
                (song.language && song.language.toLowerCase().includes(lowerQuery))
            );
        });
    }, [query, allSongs]);

    // NEW FUNCTION: Handle pressing Enter or clicking away from the input
    const handleSearchSubmit = (e) => {
        // We only want to save and run the search when the user intends to filter the list
        const trimmedQuery = query.trim();
        if (trimmedQuery) {
            // Save the query to local storage
            addRecentSearch(trimmedQuery);
            // Update the component state for immediate display
            setRecentSearches(getRecentSearches());
            // No need to setQuery again here, as typing updates it already.
        }
        
        // Prevent default form submission if this were a form element
        if (e && e.preventDefault) e.preventDefault();
    };

    // NEW FUNCTION: Apply a suggested query
    const applySuggestion = (suggestedQuery) => {
        setQuery(suggestedQuery);
        // Immediately treat this as a search submission to save/update recent list
        addRecentSearch(suggestedQuery); 
        setRecentSearches(getRecentSearches());
    };


    return (
        <div className="search-page-container">
            
            <div className="search-input-area" onBlur={handleSearchSubmit}> 
                <input
                    type="text"
                    placeholder="Search by Song, Artist, Movie, Character, or Language..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    // NEW: Handles the Enter key press
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearchSubmit(e);
                    }}
                />
                
                {/* NEW: Recent Search Suggestions */}
                {recentSearches.length > 0 && (
                    <div className="recent-suggestions">
                        <span className="suggestion-label">Recent Searches:</span>
                        {recentSearches.map((recentQuery) => (
                            <button 
                                key={recentQuery} 
                                className="suggestion-pill"
                                // Clicking a pill applies the search
                                onClick={() => applySuggestion(recentQuery)}
                            >
                                {recentQuery}
                            </button>
                        ))}
                    </div>
                )}

                <p className="search-hint">
                    Showing {filteredSongs.length} of {allSongs.length} songs.
                </p>
            </div>
            
            {/* Filtered Song List */}
            <div className="song-list">
                {filteredSongs.length > 0 ? (
                    filteredSongs.map((song) => (
                        <div 
                            key={song.id} 
                            // Ensure the card uses 'song-card' class, which has shared styles
                            className={`song-card ${activeSong?.id === song.id && isPlaying ? 'is-playing' : ''}`}
                            onClick={() => playSong(song)}
                        >
                            <img src={song.cover} alt={song.songname} className="cover" />
                            <h4>{song.songname}</h4>
                            <p>{song.artist.split(',')[0]}</p>
                            {/* FIX: Use 'moviename' here too */}
                            {song.moviename && <p className="song-detail">Movie: {song.moviename}</p>}
                        </div>
                    ))
                ) : (
                    <p className="no-results">No songs found matching "{query}". Try a different search term.</p>
                )}
            </div>
        </div>
    );
}