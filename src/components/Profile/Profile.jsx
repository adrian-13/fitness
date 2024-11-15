import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importuj useNavigate pre navigáciu
import { signOut } from 'firebase/auth'; // Ak chceš pridať funkciu odhlásenia
import { auth } from '../../firebase'; // Importuj Firebase auth

const Profile = () => {
  const [userName, setUserName] = useState("Ján Novák"); // Stav pre používateľské meno
  const navigate = useNavigate(); // Hook pre navigáciu

  // Funkcia na odhlásenie
  const handleLogout = async () => {
    try {
      await signOut(auth); // Odhlásenie používateľa cez Firebase
      navigate('/'); // Presmerovanie späť na prihlasovaciu obrazovku
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Funkcia na uloženie zmien mena
  const handleNameChange = (e) => {
    setUserName(e.target.value); // Aktualizácia používateľského mena
  };

  return (
    <div className="profile">
      <h2>Profil</h2>

      {/* Formulár pre zmenu mena */}
      <div className="name-section">
        <label htmlFor="userName">Meno:</label>
        <input
          type="text"
          id="userName"
          value={userName}
          onChange={handleNameChange}
        />
      </div>

      {/* Tlačidlo na odhlásenie */}
      <button onClick={handleLogout} className="logout-button">Odhlásiť sa</button>
    </div>
  );
};

export default Profile;
