import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      {/* Brand Title on the far left */}
      <div className="navbar-brand">
        My Heaven Music
      </div>
      
      <ul>
        <li><Link to="/">Home</Link></li>

        {!user ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/about">About</Link></li>
            {/* Using the new CSS class for clean styling */}
       
          </>
        ) : (
          <>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/SongCard">Dashboard</Link></li>
            <li>
              {/* Uses the CSS defined in Navbar.css for red styling */}
              <button onClick={logout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}