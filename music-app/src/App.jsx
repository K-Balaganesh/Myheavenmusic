import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import SongCard from "./components/SongCard.jsx";
import Search from "./components/Search.jsx";
import Categories from "./pages/Categories.jsx";
import About from "./pages/About.jsx";
import CategoryDetail from "./pages/CategoryDetail.jsx"; 
import MusicPlayer from "./components/MusicPlayer.jsx";

import { MusicPlayerProvider } from "./context/MusicPlayerContext.jsx"; 
// MODIFIED: Import AuthProvider and AuthPopup
import { AuthProvider } from "./context/AuthContext.jsx"; 
import AuthPopup from "./components/AuthPopup.jsx";

export default function App() {
  return (
    <MusicPlayerProvider> 
      {/* MODIFIED: AuthProvider is now active */}
      <AuthProvider>
        <Router>
          <Navbar />
          <main style={{ minHeight: '100vh', paddingBottom: '120px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/songcard" element={<SongCard />} /> 
              <Route path="/search" element={<Search />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:categoryId" element={<CategoryDetail />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <MusicPlayer />
        </Router>
        {/* MODIFIED: Render the popup globally */}
        <AuthPopup />
      </AuthProvider>
    </MusicPlayerProvider>
  );
}