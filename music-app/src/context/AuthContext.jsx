import { createContext, useContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // NEW: Pop-up state and message
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [authPopupMessage, setAuthPopupMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);
  
  // NEW: Function to display the pop-up
  const triggerAuthPopup = useCallback((message) => {
    setAuthPopupMessage(message);
    setShowAuthPopup(true);
    const timer = setTimeout(() => {
      setShowAuthPopup(false);
      setAuthPopupMessage("");
    }, 2500); // Popup shown for 2.5 seconds
    return () => clearTimeout(timer);
  }, []);

  const login = (userData) => {
    // In a real app, this would involve API calls and token storage
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    // NOTE: Pop-up trigger moved to Login/Signup components for contextual messaging
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, showAuthPopup, authPopupMessage, triggerAuthPopup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);