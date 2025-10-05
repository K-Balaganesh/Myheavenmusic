import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom"; 
// 🔑 CORRECTED IMPORT PATH based on your file structure (src/context/MusicPlayerContext.jsx)
import { useMusicPlayer } from '../context/MusicPlayerContext'; 

import "./Categories.css"; 
import "../components/Search.css"; 

// A default cover image for categories that might not have enough songs
const DEFAULT_COVER = "https://placehold.co/100x100/303030/ffffff?text=Music";

// --- Configuration for all Category/Playlist Cards (Static) ---
const CATEGORIES_CONFIG = [
    // Languages (Not prominently displayed in the image but kept for completeness)
    { id: "tamil", title: " 💃Top Tamil Songs", filter: (song) => song.language?.toLowerCase().includes('tamil') },
    { id: "english", title: "🌍 International English Hits", filter: (song) => song.language?.toLowerCase().includes('english') },
    { id: "hindi", title: "🎼 Bollywood Hindi Hits", filter: (song) => song.language?.toLowerCase().includes('hindi') },
    
    // Moods/Genres (Updated for correct spelling/titles/filters from JSON)
    { id: "trending", title: "🔥 Trending Now Package", filter: (song) => song.songvariety?.includes('trending') },
    { id: "mass", title: "💥 Mass/Kuthu Hits", filter: (song) => song.songvariety?.includes('mass') },
    { id: "love", title: "💖 Pure Love Songs", filter: (song) => song.songvariety?.includes('romantic') || song.songvariety?.includes('love') },
    { id: "sad", title: "😢 Sad/Melody", filter: (song) => song.songvariety?.includes('sad') || song.songvariety?.includes('melancholy') }, // Used 'melancholy' as it appears in the JSON
    { id: "feel-good", title: "😊 Feel Good Hits", filter: (song) => song.songvariety?.includes('feel good') }, // Correctly filtering by 'feel good' in songvariety
    { id: "vibe", title: "🧘 Vibe/Chill Songs", filter: (song) => song.songvariety?.includes('vibe') },
    { id: "party", title: "🥳 Party Starters", filter: (song) => song.songvariety?.includes('party') },
    { id: "dance", title: "💃 Dance Floor Hits", filter: (song) => song.songvariety?.includes('dance') },

    // Artist Playlists (Titles match the image, filters use exact JSON artist names)
    { id: "anirudh", title: "🎤 Anirudh Ravichander Playlist", filter: (song) => song.artist?.includes('Anirudh Ravichander') },
    { id: "sidsriram", title: "🎶 Sid Sriram Collection", filter: (song) => song.artist?.includes('Sid Sriram') },
    { 
  id: "motivational", 
  title: "💪 Motivational", 
  filter: (song) => song.songvariety?.includes('motivational') 
},
// K. S. Chithra is the correct name in the JSON, not just 'Chitra'
    { id: "chitra", title: "🎤 Chitra's Best Melodies", filter: (song) => song.artist?.includes('K. S. Chithra') || song.artist?.includes('Chinmayi') }, // K. S. Chithra for better match, using Chinmayi for 'Chitra-like'
    // Hiphop Tamizha has a space in the JSON's artist field for Hiphop Tamizha songs
    { id: "hiphop-tamizha", title: "🎧 Hiphop Tamizha Swag", filter: (song) => song.artist?.includes('Hiphop Tamizha') },
    { id: "shreya-ghoshal", title: "🌟 Shreya Ghoshal Hits", filter: (song) => song.artist?.includes('Shreya Ghoshal') },
    // Genre Playlists (Titles match the image, filters use correct 'songvariety' values)
    { id: "peppy", title: "⚡ Peppy & Energetic", filter: (song) => song.songvariety?.includes('peppy') },
    { id: "romantic-ballads", title: "💖 Romantic Ballads", filter: (song) => song.songvariety?.includes('romantic') || song.songvariety?.includes('ballad') },
    { id: "instrumental", title: "🎻 Classical Instrumental", filter: (song) => song.songvariety?.includes('instrumental') },
];

// --- Category Card Component (UNCHANGED) ---
const CategoryCard = React.memo(({ category, covers, onSelect }) => {
    // Use 'name' for dynamic playlists, 'title' for static categories
    const cardTitle = category.title || category.name; 
    
    return (
        <div 
            className="category-card" 
            onClick={() => onSelect(category)}
            aria-label={`View songs in ${cardTitle}`}
        >
            <div className="category-images">
                {Array.from({ length: 4 }).map((_, i) => (
                    <img 
                        key={i} 
                        src={covers[i] || DEFAULT_COVER} 
                        alt={`${cardTitle} album cover ${i + 1}`} 
                        onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_COVER; }}
                    />
                ))}
            </div>
            <h3>{cardTitle}</h3>
        </div>
    );
});


export default function Categories() {
    const [allSongs, setAllSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(''); 
    const navigate = useNavigate(); 
    
    // ⭐️ Get dynamic playlists from the context
    const { playlists } = useMusicPlayer(); 

    // Fetch all songs once from /songs.json (Correct Implementation)
    useEffect(() => { 
        // Using the provided JSON data instead of fetching:
        const data = [
            { "id": 1, "moviename": "Theeran", "songname": "Laali Laali", "artist": "Sathyaprakash D., Priya Hemesh", "language": "Tamil", "songvariety": [ "romantic", "love" ], "characters": "Karthi, Rakul Preet Singh", "url": "/music/Laali Laali.mp3", "duration": "0:30", "cover": "/covers/Laali Laali.jpg" },
             { "id": 2, "moviename": "Aadhavan", "songname": "Vaarayo Vaarayao", "artist": "M. M. Keeravani, K. S. Chithra, S. P. Balasubrahmanyam", "language": "Tamil", "songvariety": [ "love", "party", "dance", "romantic" ], "characters": "Suriya, Nayanthara", "url": "/music/Vaarayo Vaarayo.mp3", "duration": "0:30", "cover": "/covers/Vaarayao Vaarayao.jpg" },
             { "id": 3, "moviename": "Mudhal Nee Mudivum Nee", "songname": "Mudhal Nee Mudivum Nee", "artist": "Sid Sriram", "language": "Tamil", "songvariety": [ "love", "feel good" ], "characters": "Kishen Das, Harini Selvaraj", "url": "/music/Mudhal Nee Mudivum Nee.mp3", "duration": "0:30", "cover": "/covers/Mudhal Nee Mudivum Nee.jpeg" },
             { "id": 4, "moviename": "Vinnaithaandi Varuvaayaa", "songname": "Anbil Avan", "artist": "Devan Ekambaram, Chinmayi Sripada", "language": "Tamil", "songvariety": [ "love", "romantic" ], "characters": "Silambarasan, Trisha", "url": "/music/Anbilavan.mp3", "duration": "0:30", "cover": "/covers/Vinnaithaandi Varuvaayaa.jpeg" },
             { "id": 5, "moviename": "Maragatha Naanayam", "songname": "Nee Kavithaigala", "artist": "Anirudh Ravichander, Sid Sriram", "language": "Tamil", "songvariety": [ "love", "romantic", "feel good" ], "characters": "Aadhi, Nikki Galrani", "url": "/music/Nee Kavithaigala.mp3", "duration": "0:30", "cover": "/covers/Maragatha Naanayam.jpeg" },
             { "id": 6, "moviename": "Engeyum Kadhal", "songname": "Dhimu Dhimu", "artist": "Karthik", "language": "Tamil", "songvariety": [ "love", "melancholy", "feel good" ], "characters": "Jayam Ravi, Hansika Motwani", "url": "/music/DhimuDhimu.mp3", "duration": "0:30", "cover": "/covers/Engeyum Kadhal.jpeg" },
             { "id": 7, "moviename": "I", "songname": "Ennodu Nee Irundhal", "artist": "Sid Sriram, Sunitha Sarathy", "language": "Tamil", "songvariety": [ "love", "feel good" ], "characters": "Vikram, Amy Jackson", "url": "/music/EnnoduNeeIrundhal.mp3", "duration": "0:30", "cover": "/covers/I.jpeg" },
             { "id": 8, "moviename": "Kumki", "songname": "Sollitaley Ava Kaadhala", "artist": "Alphonse Joseph, Sid Sriram, Shreya Ghoshal", "language": "Tamil", "songvariety": [ "love", "romantic", "feel good" ], "characters": "Vikram Prabhu, Lakshmi Menon", "url": "/music/Sollitaley Ava Kaadhala.mp3", "duration": "0:30", "cover": "/covers/kumki.jpeg" },
             { "id": 9, "moviename": "Devara", "songname": "Fear Song", "artist": "Anirudh Ravichander", "language": "Tamil", "songvariety": [ "pop", "vibe", "mass" ], "characters": "N. T. Rama Rao Jr., Saif Ali Khan, Janhvi Kapoor", "url": "/music/Fear Song.mp3", "duration": "0:30", "cover": "/covers/Devara.jpeg" },
             { "id": 10, "moviename": "Meesaya Murukku", "songname": "Vaadi Nee Vaadi", "artist": "Kaushik Krish, Hiphop Tamizha", "language": "Tamil", "songvariety": [ "love", "vibe", "peppy" ], "characters": "Hiphop Tamizha, Aathmika", "url": "/music/Vaadi Nee Vaadi.mp3", "duration": "0:30", "cover": "/covers/Meesaya Murukku.jpeg" },
             { "id": 11, "moviename": "Oh My Kadavule", "songname": "Friendship Than Sotthu", "artist": "Leon James, Maalavika Sundar, Kamalaja Rajagopal, Sindhuri S Pillai", "language": "Tamil", "songvariety": [ "friendship", "motivational", "feel good" ], "characters": "Ashok Selvan, Ritika Singh", "url": "/music/Friendship Than Sotthu.mp3", "duration": "0:30", "cover": "/covers/Oh My Kadavule.jpeg" },
             { "id": 12, "moviename": "Nilavuku En Mel Ennadi Kobam", "songname": "Golden Sparrow", "artist": "G.V. Prakash Kumar, Arivu, Dhanush, Sublahshini", "language": "Tamil", "songvariety": [ "sad", "melancholy", "instrumental", "vibe", "trending" ], "characters": "Silambarasan, Trisha (Film not released, characters based on VTV)", "url": "/music/Golden Sparrow.mp3", "duration": "0:30", "cover": "/covers/Nilavuku En Mel Ennadi Kobam.jpeg" },
             { "id": 13, "moviename": "Vinnaithaandi Varuvaayaa", "songname": "Hosanna", "artist": "Vijay Prakash, Blaaze, Suzanne D'Mello", "language": "Tamil", "songvariety": [ "love", "romantic", "feel good" ], "characters": "Silambarasan, Trisha", "url": "/music/Hosanna.mp3", "duration": "0:30", "cover": "/covers/Vinnaithaandi Varuvaayaa.jpeg" },
             { "id": 14, "moviename": "Imagine Dragons - Single", "songname": "Believer", "artist": "Imagine Dragons", "language": "English", "songvariety": [ "rock", "motivational", "mass" ], "characters": "Dan Reynolds, Dolph Lundgren", "url": "/music/Believer.mp3", "duration": "0:30", "cover": "/covers/Imagine Dragons - Single.jpeg" },
             { "id": 15, "moviename": "Love in the Future", "songname": "All of me", "artist": "John Legend", "language": "English", "songvariety": [ "love", "ballad", "romantic" ], "characters": "Chrissy Teigen (Song dedicated to her)", "url": "/music/All of me.mp3", "duration": "0:30", "cover": "/covers/Love in the Future.jpg" },
             { "id": 16, "moviename": "Naan Mahaan Alla", "songname": "Iragai poley", "artist": "Yuvan Shankar Raja, Tanvi", "language": "Tamil", "songvariety": [ "melancholy", "sad", "feel good" ], "characters": "Karthi, Kajal Aggarwal", "url": "/music/Iragai pole.mp3", "duration": "0:30", "cover": "/covers/Naan Mahaan Alla.jpeg" },
             { "id": 17, "moviename": "Vidaamuyarchi", "songname": "Sawadeeka", "artist": "Hariharan, S. P. B. Charan", "language": "Tamil", "songvariety": [ "party", "vibe", "dance", "peppy", "trending" ], "characters": "Ajith Kumar, Trisha (Based on cast of the film)", "url": "/music/Sawadeeka.mp3", "duration": "0:30", "cover": "/covers/Vidaamuyarchi.jpeg" },
             { "id": 18, "moviename": "Sithira Puthiri", "songname": "Sithira Puthiri", "artist": "Udit Narayan, Shankar Mahadevan", "language": "Tamil", "songvariety": [ "sad", "dance", "peppy", "trending" ], "characters": "Vijay, Meera Jasmine (Based on original film cast)", "url": "/music/Sithira Puthiri.mp3", "duration": "0:30", "cover": "/covers/Sithira Puthiri.jpeg" },
             { "id": 19, "moviename": "Kumki", "songname": "Soi Soi", "artist": "Unnikrishnan, Sujatha", "language": "Tamil", "songvariety": [ "mass", "vibe", "dance" ], "characters": "Vikram Prabhu, Lakshmi Menon", "url": "/music/Soi Soi.mp3", "duration": "0:30", "cover": "/covers/Kumki.jpeg" },
             { "id": 20, "moviename": "Fifty Shades of Grey", "songname": "I love me like you do", "artist": "Ellie Goulding", "language": "English", "songvariety": [ "love", "vibe", "feel good" ], "characters": "Dakota Johnson, Jamie Dornan", "url": "/music/lovemelikeyoudo.mp3", "duration": "0:30", "cover": "/covers/Fifty Shades of Grey.jpeg" },
             { "id": 21, "moviename": "Ratchagan", "songname": "Soniya Soniya", "artist": "Udit Narayan, Mahalakshmi Iyer", "language": "Tamil", "songvariety": [ "dance", "peppy", "vibe", "party", "trending" ], "characters": "Nagarjuna, Sushmita Sen", "url": "/music/Soniya Soniya.mp3", "duration": "0:30", "cover": "/covers/Ratchagan.png" },
             { "id": 22, "moviename": "Kabir Singh", "songname": "Tera Ban Jaunga", "artist": "Arijit Singh, Tulsi Kumar", "language": "Hindi (Dubbed to Tamil)", "songvariety": [ "love", "romantic" ], "characters": "Shahid Kapoor, Kiara Advani", "url": "/music/Tera Ban Jaunga.mp3", "duration": "0:30", "cover": "/covers/Tera Ban Jaunga.jpg" },
             { "id": 23, "moviename": "Ethirum Puthirum", "songname": "Thottu Thottu", "artist": "Hariharan, K. S. Chithra", "language": "Tamil", "songvariety": [ "party", "vibe", "romantic", "trending" ], "characters": "Mammootty, Ramya Krishnan", "url": "/music/Thottu Thottu.mp3", "duration": "0:30", "cover": "/covers/Ethirum Puthirum.jpg" },
             { "id": 24, "moviename": "Madharaasi", "songname": "Salambala", "artist": "Shivaang Aravindan, Anirudh Ravichander", "language": "Tamil", "songvariety": [ "mass", "vibe", "sad", "dance", "trending" ], "characters": "Sivakarthikeyan, Rukmini Vasanth", "url": "/music/Salambala.mp3", "duration": "4:00", "cover": "/covers/Madharaasi.jpeg" },
             { "id": 25, "moviename": "Petta", "songname": "Ullaallaa", "artist": "Nakash Aziz, Innocent Divya, Shweta Mohan", "language": "Tamil", "songvariety": [ "dance", "feel good", "peppy", "vibe" ], "characters": "Rajinikanth, Simran", "url": "/music/Ullaallaa.mp3", "duration": "0:30", "cover": "/covers/petta.jpg" },
             { "id": 26, "moviename": "Meesaya Murukku", "songname": "Adiye Sakkarakatti", "artist": "Hiphop Tamizha", "language": "Tamil", "songvariety": [ "love", "romantic" ], "characters": "Hiphop Tamizha, Aathmika, Vivek", "url": "/music/AdiyeSakkarakatti.mp3", "duration": "0:30", "cover": "/covers/Meesaya Murukku.jpeg" },
             { "id": 27, "moviename": "Kutty", "songname": "Feel My Love", "artist": "Kay Kay", "language": "Tamil", "songvariety": [ "love", "romantic", "feel good" ], "characters": "Dhanush, Shriya Saran", "url": "/music/Feel My Love.mp3", "duration": "0:30", "cover": "/covers/Kutty.jpeg" },
             { "id": 28, "moviename": "Imaikkaa Nodigal", "songname": "Vilambara Idaiveli", "artist": "Christopher Stanley, Sudharshan Ashok, Sameera Bharadwaj", "language": "Tamil", "songvariety": [ "love", "party", "vibe" ], "characters": "Atharvaa, Raashi Khanna", "url": "/music/Vilambara Idaiveli.mp3", "duration": "0:30", "cover": "/covers/Imaikkaa Nodigal.jpg" },
             { "id": 29, "moviename": "3", "songname": "Why This Kolaveri Di", "artist": "Dhanush", "language": "Tamil", "songvariety": [ "vibe", "party", "sad", "dance" ], "characters": "Dhanush, Shruti Haasan", "url": "/music/Why This Kolaveri Di.mp3", "duration": "0:30", "cover": "/covers/3.jpeg" },
             { "id": 30, "moviename": "Thug Life", "songname": "Jinguchaa", "artist": "Mangli, Sri Krishna, Aashima Mahajan, Vaishali Samant", "language": "Tamil", "songvariety": [ "dance", "peppy", "party", "dance", "trending" ], "characters": "Kamal Haasan, Silambarasan, Sanya Malhotra", "url": "/music/Jinguchaa.mp3", "duration": "0:30", "cover": "/covers/Thug Life.jpg" },
             { "id": 31, "moviename": "Imaikkaa Nodigal", "songname": "Kadhalikathey", "artist": "Hiphop Tamizha, Kaushik Krish", "language": "Tamil", "songvariety": [ "vibe", "party", "dance", "sad" ], "characters": "Atharvaa, Raashi Khanna", "url": "/music/Kadhalikathey.mp3", "duration": "0:30", "cover": "/covers/Imaikkaa Nodigal.jpg" },
             { "id": 32, "moviename": "Kanthaswamy", "songname": "Kanimaa", "artist": "Vikram, Chinmayi", "language": "Tamil", "songvariety": [ "love", "dance", "party", "vibe", "trending" ], "characters": "Vikram, Shriya Saran", "url": "/music/Kanimaa.mp3", "duration": "0:30", "cover": "/covers/Kanimaa.jpg" },
             { "id": 33, "moviename": "Naanum Rowdy Dhaan", "songname": "Kannana Kanne", "artist": "Sathyaprakash D.", "language": "Tamil", "songvariety": [ "love", "feel good" ], "characters": "Vijay Sethupathi, Nayanthara", "url": "/music/Kannana Kanne.mp3", "duration": "0:30", "cover": "/covers/Naanum Rowdy Dhaan.jpg" },
             { "id": 34, "moviename": "3", "songname": "Kannazhaga", "artist": "Dhanush, Shruti Haasan", "language": "Tamil", "songvariety": [ "love", "romantic", "feel good" ], "characters": "Dhanush, Shruti Haasan", "url": "/music/Kannazhaga.mp3", "duration": "0:30", "cover": "/covers/3.jpeg" },
             { "id": 35, "moviename": "Just the way you are", "songname": "Just the way you are", "artist": "Bruno Mars", "language": "English", "songvariety": [ "pop", "love", "romantic" ], "characters": "Nathalie Kelley (In Music Video)", "url": "/music/Just the way you are.mp3", "duration": "0:30", "cover": "/covers/Just the way you are.jpg" },
             { "id": 36, "moviename": "Guru", "songname": "Aaruyire", "artist": "A. R. Rahman, Chinmayi Sripada, Murtuza Khan, Qadir Khan", "language": "Tamil", "songvariety": [ "love", "feel good", "trending" ], "characters": "Abhishek Bachchan, Aishwarya Rai", "url": "/music/Aaruyire.mp3", "duration": "0:30", "cover": "/covers/Guru.jpeg" },
             { "id": 37, "moviename": "Engeyum Kadhal", "songname": "Lolita", "artist": "Benny Dayal, Shreya Ghoshal", "language": "Tamil", "songvariety": [ "dance", "peppy", "feel good" ], "characters": "Jayam Ravi, Hansika Motwani", "url": "/music/Lolita.mp3", "duration": "0:30", "cover": "/covers/Engeyum Kadhal.jpeg" },
             { "id": 38, "moviename": "MaaranMeesaya Murukku", "songname": "Machi Engalukku Ellam", "artist": "Hiphop Tamizha, T. M. Soundararajan", "language": "Tamil", "songvariety": [ "mass", "peppy", "vibe", "party", "vibe" ], "characters": "Dhanush, Malavika Mohanan", "url": "/music/Machi Engalukku Ellam.mp3", "duration": "0:30", "cover": "/covers/Meesaya Murukku.jpeg" },
             { "id": 39, "moviename": "Mambattiyan", "songname": "Malaiyurru Nattamai", "artist": "S. P. Balasubrahmanyam, Swarnalatha", "language": "Tamil", "songvariety": [ "mass", "dance", "party", "vibe", "trending" ], "characters": "Prashanth, Meera Jasmine", "url": "/music/Malaiyuru Nattamai.mp3", "duration": "0:30", "cover": "/covers/Malaiyuru.jpeg" },
             { "id": 40, "moviename": "Vinnaithaandi Varuvaayaa", "songname": "Mannippaya", "artist": "A. R. Rahman, Shreya Ghoshal", "language": "Tamil", "songvariety": [ "sad", "feel good", "love" ], "characters": "Silambarasan, Trisha", "url": "/music/Mannipaaya.mp3", "duration": "0:30", "cover": "/covers/Vinnaithaandi Varuvaayaa.jpeg" },
             { "id": 41, "moviename": "Oh My Kadavule", "songname": "Marappadhilai Nerje", "artist": "Sid Sriram", "language": "Tamil", "songvariety": [ "love", "feel good", "sad" ], "characters": "Ashok Selvan, Ritika Singh", "url": "/music/Marappadhilai Nenje.mp3", "duration": "0:30", "cover": "/covers/Oh My Kadavule.jpeg" },
             { "id": 42, "moviename": "Coolie", "songname": "Monica", "artist": "Anirudh Ravichander, Deepthi Suresh, Santhosh Narayanan", "language": "Tamil", "songvariety": [ "dance", "peppy", "party", "vibe", "trending" ], "characters": "Rajinikanth, Shriya Saran", "url": "/music/Monica.mp3", "duration": "0:30", "cover": "/covers/Coolie.jpg" },
             { "id": 43, "moviename": "Thottal Poo Malarum", "songname": "Arabu Naade", "artist": "Haricharan, Yuvan Shankar Raja", "language": "Tamil", "songvariety": [ "dance", "party", "peppy" ], "characters": "Sakthi Vasu, Gowri Munjal", "url": "/music/ArabuNaade.mp3", "duration": "0:30", "cover": "/covers/Thottal Poo Malarum.jpeg" },
             { "id": 44, "moviename": "Thug Life", "songname": "Muththa Mazhai", "artist": "Yazin Nizar, M. M. Manasi", "language": "Tamil", "songvariety": [ "love", "feel good", "instrumental", "trending" ], "characters": "Kamal Haasan, Trisha", "url": "/music/Muththa Mazhai.mp3", "duration": "0:30", "cover": "/covers/Thug Life.jpg" },
             { "id": 45, "moviename": "Dude", "songname": "Nallaru Po", "artist": "Benny Dayal, Haricharan", "language": "Tamil", "songvariety": [ "sad", "feel good", "trending" ], "characters": "Suriya, Tamannaah (Original cast of the film's source material, if applicable)", "url": "/music/Nallaru Po.mp3", "duration": "0:30", "cover": "/covers/Dude.jpeg" },
             { "id": 46, "moviename": "Kutty", "songname": "Nee Kadhalikkum", "artist": "Devi Sri Prasad, Karthik, Anuradha Sriram", "language": "Tamil", "songvariety": [ "love", "sad", "vibe" ], "characters": "Dhanush, Shriya Saran", "url": "/music/Nee Kadhalikkum Ponnu.mp3", "duration": "0:30", "cover": "/covers/Kutty.jpeg" },
             { "id": 47, "moviename": "Coolie", "songname": "Coolie Disco", "artist": "Anirudh Ravichander", "language": "Tamil", "songvariety": [ "dance", "peppy", "mass", "trending" ], "characters": "Rajinikanth", "url": "/music/CoolieDisco.mp3", "duration": "0:30", "cover": "/covers/Coolie.jpg" },
             { "id": 48, "moviename": "Naanum Rowdy Dhaan", "songname": "Neeyum Naanum", "artist": "Neeti Mohan, Dhanush", "language": "Tamil", "songvariety": [ "love", "romantic", "feel good" ], "characters": "Vijay Sethupathi, Nayanthara", "url": "/music/Neeyum Naanum.mp3", "duration": "0:30", "cover": "/covers/Naanum Rowdy Dhaan.jpg" },
             { "id": 49, "moviename": "Imaikkaa Nodigal", "songname": "Neeyum Naanum Anbe", "artist": "Aditya Rao, Hiphop Tamizha", "language": "Tamil", "songvariety": [ "love", "romantic" ], "characters": "Atharvaa, Raashi Khanna", "url": "/music/Neeyum Naanum Anbe.mp3", "duration": "0:30", "cover": "/covers/Imaikkaa Nodigal.jpg" },
             { "id": 50, "moviename": "Kumki", "songname": "Onnum Puriyala", "artist": "Achu Rajamani, G. V. Prakash Kumar", "language": "Tamil", "songvariety": [ "sad", "instrumental", "emotional" ], "characters": "Vikram Prabhu, Lakshmi Menon", "url": "/music/Onnum Puriyala.mp3", "duration": "0:30", "cover": "/covers/kumki.jpeg" },
             { "id": 51, "moviename": "Dude", "songname": "Oorum Blood", "artist": "Anirudh Ravichander, S. P. Balasubrahmanyam", "language": "Tamil", "songvariety": [ "mass", "friendship", "peppy", "trending" ], "characters": "Suriya, Tamannaah (Original cast of the film's source material, if applicable)", "url": "/music/Oorum Blood.mp3", "duration": "0:30", "cover": "/covers/Dude.jpeg" },
             { "id": 52, "moviename": "Madharaasi", "songname": "Animal Instinct", "artist": "Anirudh Ravichander, Deepthi Suresh", "language": "Tamil", "songvariety": [ "theme", "trending", "mass", "instrumental" ], "characters": "Sivakarthikeyan, Rukmini Vasanth, Vidyut Jammwal", "url": "/music/Animal Instinct.mp3", "duration": "0:37", "cover": "/covers/Madharaasi.jpeg" },
             { "id": 53, "moviename": "Vidaamuyarchi", "songname": "Pathikichu", "artist": "Anirudh Ravichander", "language": "Tamil", "songvariety": [ "motivational", "vibe", "mass", "trending" ], "characters": "Ajith Kumar", "url": "/music/Pathikichu.mp3", "duration": "0:30", "cover": "/covers/Vidaamuyarchi.jpeg" },
             { "id": 54, "moviename": "Devara", "songname": "Paththavaikkum", "artist": "Deepthi Suresh", "language": "Tamil", "songvariety": [ "love", "vibe", "romantic", "dance", "instrumental", "trending" ], "characters": "N. T. Rama Rao Jr., Janhvi Kapoor", "url": "/music/Paththavaikkum.mp3", "duration": "0:30", "cover": "/covers/Devara.jpeg" },
             { "id": 55, "moviename": "Pushpa 2", "songname": "Peelings", "artist": "Devi Sri Prasad, Shreya Ghoshal", "language": "Tamil", "songvariety": [ "love", "vibe", "instrumental", "party", "dance", "romantic" ], "characters": "Allu Arjun, Rashmika Mandanna", "url": "/music/Peelings.mp3", "duration": "0:30", "cover": "/covers/Peelings.jpeg" },
             { "id": 56, "moviename": "Perfect", "songname": "Perfect", "artist": "Ed Sheeran", "language": "English", "songvariety": [ "pop", "love", "romantic" ], "characters": "Ed Sheeran, Zoey Deutch (In Music Video)", "url": "/music/Perfect.mp3", "duration": "0:30", "cover": "/covers/Perfect.jpg" },
             { "id": 57, "moviename": "Petta", "songname": "Petta Paraak", "artist": "Anirudh Ravichander", "language": "Tamil", "songvariety": [ "mass", "peppy", "motivational" ], "characters": "Rajinikanth", "url": "/music/Petta Paraak.mp3", "duration": "0:30", "cover": "/covers/petta.jpg" },
             { "id": 58, "moviename": "3", "songname": "Po Nee Po", "artist": "Mohit Chauhan", "language": "Tamil", "songvariety": [ "sad", "emotional", "feel good" ], "characters": "Dhanush, Shruti Haasan", "url": "/music/Po Nee Po.mp3", "duration": "0:30", "cover": "/covers/3.jpeg" },
             { "id": 59, "moviename": "Madharasapattinam", "songname": "Pookal Pookum", "artist": "Hariharan, Shreya Ghoshal, A. R. Raihanah", "language": "Tamil", "songvariety": [ "love", "romantic", "feel good" ], "characters": "Arya, Amy Jackson", "url": "/music/Pookal Pookum.mp3", "duration": "0:30", "cover": "/covers/Madharasapattinam.jpg" },
             { "id": 60, "moviename": "Raabta", "songname": "Raabta", "artist": "Arijit Singh, Shreya Ghoshal", "language": "Hindi", "songvariety": [ "love", "romantic" ], "characters": "Sushant Singh Rajput, Kriti Sanon", "url": "/music/Raabta.mp3", "duration": "0:30", "cover": "/covers/Raabta.jpg" },
             { "id": 61, "moviename": "Raatan Lambiyan", "songname": "Raatan Lambiyan", "artist": "Jubin Nautiyal, Asees Kaur", "language": "Hindi (Dubbed to Tamil)", "songvariety": [ "love", "romantic" ], "characters": "Sidharth Malhotra, Kiara Advani", "url": "/music/Raataan Lambiyan.mp3", "duration": "0:30", "cover": "/covers/Raataan Lambiyan.jpg" },
             { "id": 62, "moviename": "Aashiqui 2", "songname": "Tum Hi Ho", "artist": "Arijit Singh, Palak Muchhal", "language": "Hindi", "songvariety": [ "love", "romantic", "sad" ], "characters": "Aditya Roy Kapur, Shraddha Kapoor", "url": "/music/Tum Hi Ho.mp3", "duration": "0:30", "cover": "/covers/Aashiqui 2.jpg" },
             { "id": 63, "moviename": "Madharaasi", "songname": "Thangapoovey", "artist": "Deepak", "language": "Tamil", "songvariety": [ "melody", "feel good", "love", "romantic", "trending" ], "characters": "Sivakarthikeyan, Rukmini Vasanth", "url": "/music/Thangapoovey.mp3", "duration": "3:44", "cover": "/covers/Madharaasi.jpeg" },
             { "id": 64, "moviename": "Param Sundari", "songname": "Param Sundari", "artist": "Shreya Ghoshal", "language": "Hindi", "songvariety": [ "dance", "vibe", "party", "peppy" ], "characters": "Kriti Sanon", "url": "/music/Param Sundari.mp3", "duration": "0:30", "cover": "/covers/Param Sundari.jpeg" },
             { "id": 65, "moviename": "Thalaivan Thalaivii", "songname": "Pottala Muttaye", "artist": "Gana Balachandar, Santhosh Narayanan", "language": "Tamil", "songvariety": [ "romantic", "trending", "dance", "folk" ], "characters": "Ashok Selvan, Keerthi Pandian", "url": "/music/Pottala Muttaye.mp3", "duration": "3:58", "cover": "/covers/PottalaMuttaye.jpeg" },
            {"id":66,"moviename":"Billa","songname":"Seval Kodi","artist":"Vijay Yesudas, Yuvan Shankar Raja, Chorus","language":"Tamil","songvariety":["tribute","devotional","classic"],"characters":"Ajith Kumar, Nayanthara","url":"/music/SevalKodi.mp3","duration":"4:40","cover":"/covers/SevalKodi.jpeg"},
            {"id":67,"moviename":"Naal Natchathiram","songname":"Vazhgaiye Success","artist":"Hiphop Tamizha","language":"Tamil","songvariety":["motivational"],"characters":"Aathmika","url":"/music/success.mp3","duration":"3:25","cover":"/covers/success.jpeg"}
];

       setAllSongs(data); 
        setIsLoading(false);
    }, []); 

    // MODIFIED: Navigation handler to pass songs
    const handleCategorySelect = (category) => {
        // Navigate to the correct route defined in App.jsx and pass the songs and title
        // We use category.id for the URL parameter and state for the data payload.
        navigate(`/categories/${category.id}`, { 
            state: { 
                title: category.title || category.name,
                songs: category.filteredSongs, // Pass the pre-filtered song list
                categoryId: category.id
            } 
        });
    };

    // Prepare categories, including the dynamic playlists
    const categoriesWithCovers = useMemo(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();

        // 1. Combine Static Categories and Dynamic Playlists
        const staticCategories = CATEGORIES_CONFIG.filter(category => category.id && category.title);

        // Format dynamic playlists to look like a category object
        const dynamicPlaylists = playlists.map(p => ({
            id: p.id,
            name: `⭐ My Playlist: ${p.name}`, // Use 'name' instead of 'title' for distinction
            isDynamic: true, // Flag to identify dynamic playlists
            songs: p.songs, // Carry the song array
        }));

        const allCategories = [...dynamicPlaylists, ...staticCategories];

        // 2. Filter the combined list based on search query
        const searchableCategories = allCategories.filter(category => {
            const titleOrName = category.title || category.name;
            return titleOrName.toLowerCase().includes(lowerCaseQuery) || category.id.includes(lowerCaseQuery);
        });


        // 3. Map and prepare covers/song data
        return searchableCategories.map(category => {
            // Determine the song list based on whether it's dynamic or static
            const songsToUse = category.isDynamic 
                ? category.songs // Use the stored songs array for dynamic lists
                : allSongs.filter(category.filter); // Use the filter function for static lists

            // Extract and limit covers
            const covers = songsToUse
                .slice(0, 4)
                .map(song => song.cover)
                .filter(cover => cover); 

            // Fill up to 4 covers with DEFAULT_COVER
            while (covers.length < 4) {
                covers.push(DEFAULT_COVER);
            }

            return {
                ...category,
                covers,
                filteredSongs: songsToUse, // Store the songs list to be passed in navigation state
                songCount: songsToUse.length
            };
        });
    }, [searchQuery, allSongs, playlists]); // ⭐️ Depend on playlists to re-render when a song is added

    if (isLoading) {
        return <div className="loading">Loading Categories... 🎶</div>;
    }


    return (
        <div className="categories-page">
            <h1 className="page-title">Explore Playlists & Artists</h1>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search Playlists or Artists (e.g., Favourites, Anirudh)"
                    className="search-input" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search categories"
                />
            </div>
            
            {/* ⭐️ Display Dynamic Playlists first */}
            {categoriesWithCovers.some(c => c.isDynamic) && (
                <>
                    <h2 className="section-title">Your Playlists</h2>
                    <div className="categories-grid">
                        {categoriesWithCovers
                            .filter(c => c.isDynamic)
                            .map((category) => (
                                <CategoryCard
                                    key={category.id}
                                    category={category}
                                    covers={category.covers}
                                    onSelect={handleCategorySelect}
                                />
                            ))}
                    </div>
                </>
            )}

            {/* Display Static Categories */}
            <h2 className="section-title">Static Categories</h2>
            <div className="categories-grid">
                {categoriesWithCovers
                    .filter(c => !c.isDynamic)
                    .map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            covers={category.covers}
                            onSelect={handleCategorySelect}
                        />
                    ))}
                {categoriesWithCovers.length === 0 && (
                    <p className="no-results">No playlists match your search: "{searchQuery}"</p>
                )}
            </div>
        </div>
    );
}