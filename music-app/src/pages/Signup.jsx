import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import './Auth.css';

export default function Signup() {
  // MODIFIED: Get triggerAuthPopup from context
  const { login, triggerAuthPopup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required!");
      return;
    }
    
    // Perform Signup and immediate login
    login({ name: form.name, email: form.email });
    
    // NEW: Trigger the success pop-up after signup
    triggerAuthPopup(`Welcome, ${form.name}! Account created.`);

    navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <h2>Create an Account</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" />
        <button type="submit">Signup</button>
      </form>

      {/* NEW NAVIGATION LINK */}
      <p className="auth-link-text">
        Already have an account? 
        <Link to="/login" className="auth-link">Login</Link>
      </p>
    </div>
  );
}