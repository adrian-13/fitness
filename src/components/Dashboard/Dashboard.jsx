import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserName(docSnap.data().name);
        } else {
          console.log('No such document!');
        }
      }
      setLoading(false);
    };

    fetchUserName();
  }, []);

  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('sk-SK', options);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  if (loading) {
    return <div>Načítavam...</div>;
  }

  return (
    <div className="dashboard">
      <div className="header">
        <div className="date">{getCurrentDate()}</div>
        <div className="welcome-message">Dobrý deň, {userName}</div>
        <div className="profile-icon" onClick={handleProfileClick}>
          <FaUserCircle size={30} />
        </div>
      </div>

      <div className="goal-summary">
        <div className="goal">Cieľ: Naberanie svalov</div>
        <div className="calories">Denný príjem kalórií: 2000 kcal</div>
      </div>
    </div>
  );
};

export default Dashboard;
