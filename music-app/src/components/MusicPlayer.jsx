import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import './SongCard.css';

// NEW: Pop-up component
const AddedToPlaylistPopup = ({ show }) => {
  return (
    <div className={`add-popup ${show ? 'show' : ''}`}>
      Added to My Favourites!
    </div>
  );
};

export default function MusicPlayer() {
  const {
    activeSong,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
    currentTime,
    duration,
    handleSeek,
    handleAddToPlaylist,
    // NEW: Get showPopup state
    showPopup 
  } = useMusicPlayer();

  if (!activeSong) {
    return (
      <div className="player-footer" style={{ justifyContent: 'center', color: '#b3b3b3' }}>
        Select a song to start playing.
      </div>
    );
  }

  const formatTime = (time) => {
    if (isNaN(time) || time < 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <>
      <div className="player-footer">
        {/* Left: Song info */}
        <div className="player-info">
          <img src={activeSong.cover} alt={activeSong.songname} className="player-cover" />
          <div>
            <h4>{activeSong.songname}</h4>
            <p>{activeSong.artist}</p>
          </div>
        </div>

        {/* Center: Controls + Progress */}
        <div className="progress-container">
          <div className="player-controls">
            <button onClick={playPrevious} aria-label="Previous track">«</button>
            <button onClick={togglePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? '❚❚' : '►'}
            </button>
            <button onClick={playNext} aria-label="Next track">»</button>
          </div>

          <div className="progress-bar-wrapper">
            <span className="progress-time">{formatTime(currentTime)}</span>
            <input
              type="range"
              className="progress-bar"
              min="0"
              max={duration || 0}
              value={currentTime || 0}
              onChange={(e) => handleSeek(e.target.value)}
            />
            <span className="progress-time">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Add to playlist */}
        <div className="player-options-right">
          <button 
            className="add-to-playlist-btn" 
            onClick={handleAddToPlaylist} 
            aria-label="Add to favorites"
            // NEW: Added title attribute for hover text ("Add Playlist" functionality)
            title="Add to My Favourites" 
          >
            +
          </button>
        </div>
      </div>
      
      {/* NEW: Render the celebration popup component */}
      <AddedToPlaylistPopup show={showPopup} />
    </>
  );
}