import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import './Auth.css';

export default function Login() {
  // MODIFIED: Get triggerAuthPopup from context
  const { login, triggerAuthPopup } = useAuth(); 
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Enter email & password");
    
    // Perform Login
    login({ email }); 
    
    // NEW: Trigger the success pop-up after login
    triggerAuthPopup(`Logged in as ${email}`); 
    
    navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
      
      {/* NEW NAVIGATION LINK */}
      <p className="auth-link-text">
        Don't have an account? 
        <Link to="/signup" className="auth-link">Sign Up First</Link>
      </p>
    </div>
  );
}