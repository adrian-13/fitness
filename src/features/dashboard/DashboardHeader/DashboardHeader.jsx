
import './DashboardHeader.css';
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const DashboardHeader = ({ userName, onProfileClick }) => {
  return (
    <div className="header">
      <div className="date"></div>
      <div className="welcome-message">Vitaj {userName}!</div>
      <div className="profile-icon" onClick={onProfileClick}>
        <FaUserCircle size={30} />
      </div>
    </div>
  );
};

export default DashboardHeader;