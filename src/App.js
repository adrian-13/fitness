import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth } from './services/firebase'; // Import Firebase authentication
import { onAuthStateChanged } from 'firebase/auth';
import WelcomeScreen from '../src/features/welcomeScreen/WelcomeScreen'; // Tvoje komponenty
import Dashboard from '../src/features/dashboard/Dashboard';
import Profile from '../src/features/profile/Profile';

const App = () => {
  const [user, setUser] = useState(null); // Stav prihláseného používateľa
  const [isLoading, setIsLoading] = useState(true); // Stav načítavania

  useEffect(() => {
    // Načítanie používateľa pri každom načítaní aplikácie
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Ak je používateľ prihlásený, nastavíme ho do stavu
      } else {
        setUser(null); // Ak nie je prihlásený, nastavíme používateľa na null
      }
      setIsLoading(false); // Ukončíme načítavanie
    });

    return () => unsubscribe(); // Vyčisti listener pri odchode z komponentu
  }, []);

  // Pokiaľ sa načítava stav prihlásenia, nezobrazujeme aplikáciu
  if (isLoading) {
    return <div>Načítavam...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <WelcomeScreen />} />
        <Route path="/profile" element={user ? <Profile /> : <WelcomeScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
