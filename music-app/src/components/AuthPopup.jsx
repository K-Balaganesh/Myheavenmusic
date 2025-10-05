import React from 'react';
import { useAuth } from '../context/AuthContext';
// Assuming Auth.css is available globally or imported into the main App component
// import '../Auth.css'; 

export default function AuthPopup() {
  const { showAuthPopup, authPopupMessage } = useAuth();

  return (
    <div className={`auth-popup ${showAuthPopup ? 'show' : ''}`}>
      {authPopupMessage}
    </div>
  );
}