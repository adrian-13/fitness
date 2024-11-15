import React from 'react';
import './Dashboard.css';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Importuj useNavigate pre navigáciu

// Fictitious data for testing
const userName = "Ján Novák";
const caloriesConsumed = 1450;
const totalCalories = 2000;
const goal = "Naberanie svalov";

const Dashboard = () => {
  const navigate = useNavigate(); // Hook pre navigáciu

  // Funkcia na zobrazenie aktuálneho dátumu
  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('sk-SK', options);
  };

  // Funkcia na presmerovanie na profil
  const handleProfileClick = () => {
    navigate('/profile'); // Po kliknutí sa presmeruje na stránku profilu
  };

  return (
    <div className="dashboard">
      {/* Header section */}
      <div className="header">
        <div className="date">{getCurrentDate()}</div>
        <div className="welcome-message">Dobrý deň, {userName}</div>
        {/* Profile Icon */}
        <div className="profile-icon" onClick={handleProfileClick}>
          <FaUserCircle size={30} />
        </div>
      </div>

      {/* Goal and daily calorie intake */}
      <div className="goal-summary">
        <div className="goal">Cieľ: {goal}</div>
        <div className="calories">Denný príjem kalórií: {totalCalories} kcal</div>
      </div>
    </div>
  );
};

export default Dashboard;
