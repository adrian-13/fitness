import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../services/firebase';

export const useUserData = () => {
  const [userData, setUserData] = useState({
    userName: '',
    dailyGoals: {
      calories: 2000, // default values
      protein: 0,
      carbs: 0,
      fats: 0,
    },
    loading: true,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData({
              userName: data.personalData.name || 'N/A',
              dailyGoals: {
                calories: data.calorieInput.value || 2000,
                protein: data.nutrition.proteins || 0,
                carbs: data.nutrition.carbs || 0,
                fats: data.nutrition.fats || 0,
              },
              loading: false,
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(prev => ({ ...prev, loading: false }));
        }
      }
    };

    fetchUserData();
  }, []);

  return userData;
};