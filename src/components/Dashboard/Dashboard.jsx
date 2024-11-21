import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import NutritionLog from '../NutritionLog/NutritionLog';
import { PieChart } from '@mui/x-charts/PieChart';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { format, addDays, subDays, parseISO } from 'date-fns';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [calorieValue, setCalorieValue] = useState('');
  const [proteinValue, setProteinValue] = useState('');
  const [carbsValue, setCarbsValue] = useState('');
  const [fatsValue, setFatsValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [consumed, setConsumed] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const navigate = useNavigate();

  const handleNutritionDataUpdate = (nutritionData) => {
    setConsumed({
      calories: nutritionData.calories || 0,
      protein: nutritionData.protein || 0,
      carbs: nutritionData.carbs || 0,
      fats: nutritionData.fats || 0,
    });
  };


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Načítanie dát z Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserName(userData.personalData.name || 'N/A');
          setCalorieValue(userData.calorieInput.value || 2000);
          setProteinValue(userData.nutrition.proteins || 0);
          setCarbsValue(userData.nutrition.carbs || 0);
          setFatsValue(userData.nutrition.fats || 0);
          setLoading(false);
        }
      }
    };
  
    fetchUserData();
  }, []);



  const dailyGoals = {
    calories: calorieValue,
    protein: proteinValue,
    carbs: carbsValue,
    fats: fatsValue,
  };

  // Príprava dát pre grafy
  const caloriesData = [
    { value: consumed.calories || 0, label: 'Prijaté' },
    { 
      value: Math.max(0, (dailyGoals.calories || 0) - (consumed.calories || 0)), 
      label: 'Zostáva' 
    },
  ];

  const proteinData = [
    { value: consumed.protein, label: 'Prijaté' },
    { value: Math.max(0, dailyGoals.protein - consumed.protein), label: 'Zostáva' },
  ];

  const carbsData = [
    { value: consumed.carbs, label: 'Prijaté' },
    { value: Math.max(0, dailyGoals.carbs - consumed.carbs), label: 'Zostáva' },
  ];

  const fatsData = [
    { value: consumed.fats, label: 'Prijaté' },
    { value: Math.max(0, dailyGoals.fats - consumed.fats), label: 'Zostáva' },
  ];

  // Definícia farieb pre grafy
  const caloriesColors = ['#3fcc7c', '#F0F0F0'];
  const proteinColors = ['#ff9500', '#F0F0F0'];
  const carbsColors = ['#ffcc00', '#F0F0F0'];
  const fatsColors = ['#5ac8fa', '#F0F0F0'];

  // Funkcia pre renderovanie nutrientných grafov
  const renderNutrientChart = (data, title, consumedValue, goalValue, colors) => {
    const innerRadiusValue = isMobile ? 15 : 25;
    const fadedInnerRadiusValue = isMobile ? 20 : 35;
    const heightValue = isMobile ? 150 : 200;

    return (
      <div className="nutrient-chart-container">
        <div className="nutrient-chart-wrapper">
          <PieChart
            colors={colors}
            series={[
              {
                data: data,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: {
                  innerRadius: fadedInnerRadiusValue,
                  additionalRadius: isMobile ? -10 : -20,
                },
                innerRadius: innerRadiusValue,
              },
            ]}
            height={heightValue}
            margin={{ right: 5 }}
            slotProps={{ legend: { hidden: true } }}
          />
        </div>
        <div className="nutrient-chart-label">
          <p>{title}</p>
          <p>{consumedValue} z {goalValue} {title === 'Kalórie' ? 'kcal' : 'g'}</p>
        </div>
      </div>
    );
  };

  // Funkcia pre získanie aktuálneho dátumu a okolitých dní
  const getDateRange = () => {
    const currentDate = parseISO(selectedDate) || new Date();
    const today = new Date();
    const formattedCurrentDate = format(currentDate, 'd');
    const formattedPrevDates = Array.from({ length: 3 }).map((_, index) =>
      format(subDays(currentDate, 3 - index), 'd')
    );
    const formattedNextDates = Array.from({ length: 3 }).map((_, index) =>
      format(addDays(currentDate, index + 1), 'd')
    );
    const daysOfWeek = ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'];
    const prevDays = Array.from({ length: 3 }).map((_, index) =>
      daysOfWeek[subDays(currentDate, 3 - index).getDay()]
    );
    const nextDays = Array.from({ length: 3 }).map((_, index) =>
      daysOfWeek[addDays(currentDate, index + 1).getDay()]
    );
    const currentDay = daysOfWeek[currentDate.getDay()];

    const prevFullDates = Array.from({ length: 3 }).map((_, index) =>
      format(subDays(currentDate, 3 - index), 'yyyy-MM-dd')
    );
    const currentFullDate = format(currentDate, 'yyyy-MM-dd');
    const nextFullDates = Array.from({ length: 3 }).map((_, index) =>
      format(addDays(currentDate, index + 1), 'yyyy-MM-dd')
    );

    const todayFullDate = format(today, 'yyyy-MM-dd');

    return {
      currentDate: formattedCurrentDate,
      currentDay,
      prevDates: prevDays,
      nextDates: nextDays,
      formattedPrevDates,
      formattedNextDates,
      prevFullDates,
      currentFullDate,
      nextFullDates,
      todayFullDate
    };
  };


  const handleDateClick = (date) => {
    setSelectedDate(date);
    // Reset consumed values when changing date
    setConsumed({
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    });
  };

  const { 
    currentDate, 
    currentDay,
    prevDates, 
    nextDates, 
    formattedPrevDates, 
    formattedNextDates,
    prevFullDates,
    currentFullDate,
    nextFullDates,
    todayFullDate 
  } = getDateRange();

  // Navigácia na profil
  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Stav načítavania
  if (loading) {
    return <div>Načítavam...</div>;
  }
  
  return (
    <div className="dashboard">
      {/* Hlavička */}
      <div className="header">
        <div className="date">{currentDate}</div>
        <div className="welcome-message">Vitaj {userName}!</div>
        <div className="profile-icon" onClick={handleProfileClick}>
          <FaUserCircle size={30} />
        </div>
      </div>

      {/* Zobrazenie predchádzajúcich a nasledujúcich dní */}
      <div className="calendar">
        <div className="date-range-wrapper">
          {prevDates.map((day, index) => (
            <div 
              key={index} 
              className="calendar-day clickable"
              onClick={() => handleDateClick(prevFullDates[index])}
            >
              <div className="day-name">{day}</div>
              <div className={`day-number-circle ${prevFullDates[index] === selectedDate ? 'selected' : ''}`}>
                {formattedPrevDates[index]}
              </div>
            </div>
          ))}
          <div 
            className="calendar-day current-date clickable"
            onClick={() => handleDateClick(currentFullDate)}
          >
            <div className="day-name">
              {currentFullDate === todayFullDate ? 'Dnes' : currentDay}
            </div>
            <div className={`day-number-circle ${currentFullDate === selectedDate ? 'selected' : ''}`}>
              {currentDate}
            </div>
          </div>
          {nextDates.map((day, index) => (
            <div 
              key={index} 
              className="calendar-day clickable"
              onClick={() => handleDateClick(nextFullDates[index])}
            >
              <div className="day-name">{day}</div>
              <div className={`day-number-circle ${nextFullDates[index] === selectedDate ? 'selected' : ''}`}>
                {formattedNextDates[index]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Súhrn cieľov */}
      <div className="goal-summary">
        <div className="goal">Cieľ: Naberanie svalov</div>
        <div className="calories">Denný príjem kalórií: {calorieValue} kcal</div>
      </div>

      {/* Kontajner so štatistikami */}
      <div className="stats-container">
        <Stack direction="row" width="100%" spacing={2}>
          {/* Hlavný graf kalórií */}
          <Box flexGrow={1} textAlign="center" className="calories-card calories-main-chart">
            {renderNutrientChart(
              caloriesData,
              'Kalórie',
              consumed.calories,
              dailyGoals.calories,
              caloriesColors
            )}
          </Box>
        </Stack>
        <div className="chart-wrapper">
          <Stack direction="row" width="100%" spacing={2}>
            {renderNutrientChart(
              proteinData,
              'Bielkoviny',
              consumed.protein,
              dailyGoals.protein,
              proteinColors
            )}
            {renderNutrientChart(
              carbsData,
              'Sacharidy',
              consumed.carbs,
              dailyGoals.carbs,
              carbsColors
            )}
            {renderNutrientChart(
              fatsData,
              'Tuky',
              consumed.fats,
              dailyGoals.fats,
              fatsColors
            )}
          </Stack>
        </div>
      </div>
        {/* NutritionLog komponent */}
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
