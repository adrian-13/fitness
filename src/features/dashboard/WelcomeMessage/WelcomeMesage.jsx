import './WelcomeMessage.css'
import React from 'react';

const WelcomeMessage = ({ userName }) => {
  return <div className="welcome-message">Vitaj {userName}!</div>;
};

export default WelcomeMessage;
