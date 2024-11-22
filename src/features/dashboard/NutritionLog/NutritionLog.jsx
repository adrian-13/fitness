import './NutritionLog.css';
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';

const NutritionLog = ({ selectedDate, onNutritionDataUpdate }) => {
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    foodItems: []
  });

  useEffect(() => {
    const fetchDailyNutrition = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const today = selectedDate || format(new Date(), 'yyyy-MM-dd');
      const docRef = doc(db, 'users', user.uid, 'daily_nutrition', today);
      
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDailyNutrition({
            calories: data.calories || 0,
            protein: data.protein || 0,
            carbs: data.carbs || 0,
            fats: data.fats || 0,
            foodItems: data.foodItems || []
          });
          
          onNutritionDataUpdate({
            calories: data.calories || 0,
            protein: data.protein || 0,
            carbs: data.carbs || 0,
            fats: data.fats || 0
          });
        } else {
          // Reset values if document doesn't exist
          setDailyNutrition({
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            foodItems: []
          });
          
          onNutritionDataUpdate({
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0
          });
        }
      } catch (error) {
        console.error("Error fetching daily nutrition:", error);
        // Reset values on error as well
        setDailyNutrition({
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
          foodItems: []
        });
        
        onNutritionDataUpdate({
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0
        });
      }
    };

    fetchDailyNutrition();
  }, [selectedDate, onNutritionDataUpdate]);

  return (
    <div>
      <h3>Nutrition Log for {selectedDate}</h3>

      <div className="daily-nutrition-info">
        <p>Calories: {dailyNutrition.calories}</p>
        <p>Protein: {dailyNutrition.protein} g</p>
        <p>Carbs: {dailyNutrition.carbs} g</p>
        <p>Fats: {dailyNutrition.fats} g</p>
      </div>

      <div className="food-items-list">
        <h4>Food Items</h4>
        {dailyNutrition.foodItems.length > 0 ? (
          dailyNutrition.foodItems.map((item, index) => (
            <div key={index}>
              {item.foodName}: {item.calories} kcal
              (P: {item.protein}g, C: {item.carbs}g, F: {item.fats}g)
            </div>
          ))
        ) : (
          <p>No food items logged for this day</p>
        )}
      </div>
    </div>
  );
};

export default NutritionLog;