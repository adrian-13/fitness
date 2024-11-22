import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

import DateNavigator from './DateNavigator/DateNavigator';
import NutritionChart from './NutritionChart/NutritionChart';
import DashboardHeader from '../dashboard/DashboardHeader/DashboardHeader';
import NutritionLog from '../dashboard/NutritionLog/NutritionLog';
import { useUserData } from './hooks/useUserData';
import { useMobileDetection } from './hooks/useMobileDetection';


const INITIAL_CONSUMED_STATE = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fats: 0,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { userName, dailyGoals, loading } = useUserData();
  const isMobile = useMobileDetection();
  
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [consumed, setConsumed] = useState(INITIAL_CONSUMED_STATE);

  const handleNutritionDataUpdate = (nutritionData) => {
    setConsumed({
      calories: nutritionData.calories || 0,
      protein: nutritionData.protein || 0,
      carbs: nutritionData.carbs || 0,
      fats: nutritionData.fats || 0,
    });
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setConsumed(INITIAL_CONSUMED_STATE);
  };

  if (loading) {
    return <div>Načítavam...</div>;
  }
  
  return (
    <div className="dashboard">
      <DashboardHeader 
        userName={userName}
        onProfileClick={() => navigate('/profile')}
      />

      <DateNavigator 
        selectedDate={selectedDate} 
        onDateChange={handleDateChange}
      />

      <NutritionChart 
        consumed={consumed}
        dailyGoals={dailyGoals}
        isMobile={isMobile}
      />

      <div className="nutrition-log-wrapper">
        <NutritionLog 
          selectedDate={selectedDate} 
          onNutritionDataUpdate={handleNutritionDataUpdate} 
        />
      </div>
    </div>
  );
};

export default Dashboard;