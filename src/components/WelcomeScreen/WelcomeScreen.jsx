import React from 'react';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google sign in...');
      
      // 1. Prihlásenie cez Google
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign in successful:', result.user);
      
      const user = result.user;

      // 2. Príprava údajov používateľa
      const userData = {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };
      console.log('User data prepared:', userData);

      try {
        // 3. Poslanie údajov na server
        const response = await axios.post('http://localhost:5000/api/user', userData);
        console.log('Server response:', response.data);
      } catch (serverError) {
        console.error('Server error:', serverError);
        // Pokračujeme aj keď server zlyhá
      }

      // 4. Nastavenie autentifikácie a presmerovanie
      console.log('Calling onLoginSuccess...');
      onLoginSuccess();
      
      console.log('Navigating to dashboard...');
      // Skúsime použiť timeout pre presmerovanie
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
      
    } catch (error) {
      console.error('Error in handleGoogleSignIn:', error);
    }
  };

  return (
    <div className="welcome-screen">
      <div className="top-section">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1>Tvoja cesta k zdravšiemu životnému štýlu</h1>
        <h3>Sleduj stravu, cvič, dosahuj ciele</h3>
      </div>

      <div className="middle-section">
        <button 
          className="google-button" 
          onClick={() => {
            console.log('Google button clicked');
            handleGoogleSignIn();
          }}
        >
          Pokračovať s Google
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;