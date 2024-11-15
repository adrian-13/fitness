import React, { useEffect, useState } from 'react';
import { auth, googleProvider, db } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './WelcomeScreen.css';
import logo from "../../assets/logo.png"

const WelcomeScreen = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [isUserExist, setIsUserExist] = useState(false); // Stav pre kontrolu existencie používateľa v databáze

  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google sign in...');
      
      // 1. Prihlásenie cez Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Google sign in successful:', user);

      // 2. Skontrolujeme, či používateľ už existuje v databáze
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Ak používateľ neexistuje, nastavíme meno z Google účtu
        const userData = {
          name: user.displayName || 'Neznámy používateľ',
          email: user.email,
          photoURL: user.photoURL,
        };

        // Uložíme používateľské údaje do Firestore
        await setDoc(docRef, userData);
        console.log('User data saved to Firestore:', userData);
      } else {
        // Ak používateľ už existuje, načítame jeho meno
        const userData = docSnap.data();
        console.log('User already exists, data fetched:', userData);
        setIsUserExist(true); // Nastavíme, že používateľ existuje
      }

      // 3. Nastavenie autentifikácie a presmerovanie
      console.log('Calling onLoginSuccess...');
      onLoginSuccess();
      console.log('Navigating to dashboard...');
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);

    } catch (error) {
      console.error('Error in handleGoogleSignIn:', error);
    }
  };

  useEffect(() => {
    // Ak je používateľ prihlásený, skontrolujeme, či existuje v databáze
    const user = auth.currentUser;
    if (user) {
      const checkUserExists = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIsUserExist(true); // Používateľ už existuje
        } else {
          setIsUserExist(false); // Používateľ neexistuje
        }
      };
      checkUserExists();
    }
  }, []);

  return (
    <div className="welcome-screen">
      <div className="top-section">
        <img src= {logo} alt="Logo" className="logo" />
        <h1>Tvoja cesta k zdravšiemu životnému štýlu</h1>
        <h3>Sleduj stravu, cvič, dosahuj ciele</h3>
      </div>

      <div className="middle-section">
        <button 
          className="google-button" 
          onClick={handleGoogleSignIn}
          disabled={isUserExist} // Ak používateľ už existuje, tlačidlo bude neaktívne
        >
          Pokračovať s Google
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
