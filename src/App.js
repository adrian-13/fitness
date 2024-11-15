import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GoalForm from './components/GoalForm/GoalForm';
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <WelcomeScreen onLoginSuccess={handleLoginSuccess} />
            } 
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? 
              <Dashboard /> : 
              <Navigate to="/" replace />
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? 
              <Profile /> : 
              <Navigate to="/" replace />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;