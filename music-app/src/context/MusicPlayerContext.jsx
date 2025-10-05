import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const MusicPlayerContext = createContext();
export const useMusicPlayer = () => useContext(MusicPlayerContext);

const initialPlaylists = [
  { id: 'p1', name: 'My Favourites', songs: [] },
];

export const MusicPlayerProvider = ({ children }) => {
  const [songs, setSongs] = useState([]); 
  const [activeSong, setActiveSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const [playlists, setPlaylists] = useState(initialPlaylists);
  
  // NEW: State for the popup
  const [showPopup, setShowPopup] = useState(false); 
  
  // Function to show the popup for a short duration
  const triggerPopup = useCallback(() => {
    setShowPopup(true);
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 2000); // Popup shown for 2 seconds
    return () => clearTimeout(timer);
  }, []);


  // --- Playback controls (omitted for brevity, assume unchanged) ---
  const playNext = useCallback(() => {
    if (!songs || songs.length === 0) return;
    if (!activeSong) {
      setActiveSong(songs[0]);
      setIsPlaying(true);
      return;
    }
    const idx = songs.findIndex(s => s.id === activeSong.id);
    const nextIndex = (idx + 1) % songs.length;
    setActiveSong(songs[nextIndex]);
    setIsPlaying(true);
  }, [activeSong, songs]);

  const playPrevious = useCallback(() => {
    if (!songs || songs.length === 0) return;
    if (!activeSong) {
      setActiveSong(songs[0]);
      setIsPlaying(true);
      return;
    }
    const idx = songs.findIndex(s => s.id === activeSong.id);
    const prevIndex = (idx - 1 + songs.length) % songs.length;
    setActiveSong(songs[prevIndex]);
    setIsPlaying(true);
  }, [activeSong, songs]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      setIsPlaying(prev => !prev);
      return;
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => setIsPlaying(true))
         .catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  const playSong = useCallback((song) => {
    if (!song) return;
    if (!activeSong || activeSong.id !== song.id) {
      setActiveSong(song);
      setIsPlaying(true);
    } else {
      togglePlayPause();
    }
  }, [activeSong, togglePlayPause]);

  const handleSeek = useCallback((valueOrEvent) => {
    const audio = audioRef.current;
    const value = typeof valueOrEvent === 'object' ? parseFloat(valueOrEvent.target.value) : parseFloat(valueOrEvent);
    if (!isNaN(value) && audio) {
      audio.currentTime = value;
      setCurrentTime(value);
    }
  }, []);

  const addToPlaylist = useCallback((playlistId, song) => {
    if (!song) return;
    setPlaylists(prev =>
      prev.map(pl => pl.id === playlistId
        ? (pl.songs.some(s => s.id === song.id) ? pl : { ...pl, songs: [...pl.songs, song] })
        : pl
      )
    );
  }, []);

  const createPlaylist = useCallback((name, initialSong = null) => {
    const newPlaylist = {
      id: Date.now().toString(),
      name: name || `New Playlist`,
      songs: initialSong ? [initialSong] : []
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist;
  }, []);

  // MODIFIED: Calls triggerPopup after adding the song
  const handleAddToPlaylist = useCallback(() => {
    if (!activeSong) return;
    let favourites = playlists.find(p => p.name === "My Favourites");

    // Only add and show popup if the song is not already in the playlist
    if (!favourites || !favourites.songs.some(s => s.id === activeSong.id)) {
      if (!favourites) {
        createPlaylist("My Favourites", activeSong);
      } else {
        addToPlaylist(favourites.id, activeSong);
      }
      triggerPopup(); // <-- Trigger the success popup here
    }
  }, [activeSong, playlists, addToPlaylist, createPlaylist, triggerPopup]);

  // --- Audio events ---
  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration || 0);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) setCurrentTime(audio.currentTime || 0);
  }, []);

  const playNextOrFallback = useCallback(() => {
    if (!songs || songs.length === 0) return setIsPlaying(false);
    if (activeSong) {
      playNext();
    } else {
      setActiveSong(songs[0]);
      setIsPlaying(true);
    }
  }, [activeSong, songs, playNext]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', playNextOrFallback);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', playNextOrFallback);
    };
  }, [handleLoadedMetadata, handleTimeUpdate, playNextOrFallback]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = activeSong ? activeSong.url : '';
    if (activeSong) {
      audio.currentTime = 0;
      setCurrentTime(0);
      setDuration(0);
    }

    if (isPlaying) {
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => setIsPlaying(true))
         .catch(() => setIsPlaying(false));
      }
    } else {
      try { audio.pause(); } catch(e) {}
    }
  }, [activeSong, isPlaying]);

  const contextValue = {
    activeSong,
    isPlaying,
    currentTime,
    duration,
    songs,
    setSongs,
    playSong,
    togglePlayPause,
    playNext,
    playPrevious,
    handleSeek,
    playlists,
    addToPlaylist,
    createPlaylist,
    handleAddToPlaylist,
    // NEW: Add showPopup to context value
    showPopup 
  };

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </MusicPlayerContext.Provider>
  );
}; 