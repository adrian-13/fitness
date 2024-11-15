import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaUser, FaDumbbell, FaBullseye, FaPen, FaTimes } from 'react-icons/fa';
import { formatDate } from '../../utils';
import './Profile.css';

const Profile = () => {
  const [editedData, setEditedData] = useState({
    userName: '',
    email: '',
    membership: 'Basic',
    personalInfo: {
      name: '',
      age: null,
      height: null,
      weight: null,
      gender: '',
    },
    fitnessData: {
      experience: '',
      activityLevel: '',
    },
    goals: {
      mainGoal: '',
      targetWeight: null,
      estimatedDate: '',
      calorieGoal: null,
    }
  });

  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [isEditingFitnessData, setIsEditingFitnessData] = useState(false);
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setEditedData({
          userName: userData.name || '',
          email: userData.email || '',
          membership: userData.membership || 'Basic',
          personalInfo: {
            name: userData.name || '',
            age: userData.age || 30,
            height: userData.height || 180,
            weight: userData.weight || 75,
            gender: userData.gender || 'Muž',
          },
          fitnessData: {
            experience: userData.fitnessData?.experience || 'Začiatočník',
            activityLevel: userData.fitnessData?.activityLevel || 'Sedavá',
          },
          goals: {
            mainGoal: userData.goals?.mainGoal || 'Naberanie svalov',
            targetWeight: userData.goals?.targetWeight || 80,
            estimatedDate: userData.goals?.estimatedDate || '2025-01-01',
            calorieGoal: userData.goals?.calorieGoal || 2500,
          }
        });
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleBackButtonClick = () => {
    navigate('/');
  };

  const handleEditPersonalInfo = () => {
    setIsEditingPersonalInfo(!isEditingPersonalInfo);
    if (isEditingPersonalInfo) {
      fetchUserData();
    }
  };

  const handleEditFitnessData = () => {
    setIsEditingFitnessData(!isEditingFitnessData);
    if (isEditingFitnessData) {
      fetchUserData();
    }
  };

  const handleEditGoals = () => {
    setIsEditingGoals(!isEditingGoals);
    if (isEditingGoals) {
      fetchUserData();
    }
  };

  const handleSavePersonalInfo = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, {
          name: editedData.userName,
          age: editedData.personalInfo.age,
          height: editedData.personalInfo.height,
          weight: editedData.personalInfo.weight,
          gender: editedData.personalInfo.gender,
        });
        setIsEditingPersonalInfo(false);
      }
    } catch (error) {
      console.error('Error saving personal info:', error);
      alert('Error saving personal info changes');
    }
  };

  const handleSaveFitnessData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, {
          'fitnessData.experience': editedData.fitnessData.experience,
          'fitnessData.activityLevel': editedData.fitnessData.activityLevel,
        });
        setIsEditingFitnessData(false);
      }
    } catch (error) {
      console.error('Error saving fitness data:', error);
      alert('Error saving fitness data changes');
    }
  };

  const handleSaveGoals = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, {
          'goals.mainGoal': editedData.goals.mainGoal,
          'goals.targetWeight': editedData.goals.targetWeight,
          'goals.estimatedDate': editedData.goals.estimatedDate,
          'goals.calorieGoal': editedData.goals.calorieGoal,
        });
        setIsEditingGoals(false);
      }
    } catch (error) {
      console.error('Error saving goals:', error);
      alert('Error saving goals changes');
    }
  };

  const handlePersonalInfoChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleFitnessDataChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      fitnessData: {
        ...prev.fitnessData,
        [field]: value
      }
    }));
  };

  const handleGoalsChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      goals: {
        ...prev.goals,
        [field]: value
      }
    }));
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="user-details">
          <FaUserCircle className="avatar" />
          <div className="user-info">
            <h2>{editedData.userName}</h2>
          </div>
        </div>
        <div className="action-section">
          <span className={`membership-badge ${editedData.membership.toLowerCase()}`}>
            {editedData.membership}
          </span>
        </div>
      </div>

      <div className="button-container">
        <button className="back-button" onClick={handleBackButtonClick}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="profile-section">
      <h3 className="section-header">
            <div className="title-container">
                <FaUser className="section-icon" /> Osobné Informácie
            </div>
            {isEditingPersonalInfo ? (
                <FaTimes className="close-icon" onClick={handleEditPersonalInfo} />
            ) : (
                <FaPen className="edit-icon" onClick={handleEditPersonalInfo} />
            )}
        </h3>
        {isEditingPersonalInfo ? (
          <>
            <label>
              Meno:
              <input
                type="text"
                value={editedData.userName}
                onChange={(e) => setEditedData(prev => ({
                  ...prev,
                  userName: e.target.value
                }))}
              />
            </label>
            <label>
              Vek:
              <input
                type="number"
                value={editedData.personalInfo.age}
                onChange={(e) => handlePersonalInfoChange('age', e.target.value)}
              />
            </label>
            <label>
              Výška:
              <input
                type="number"
                value={editedData.personalInfo.height}
                onChange={(e) => handlePersonalInfoChange('height', e.target.value)}
              />
            </label>
            <label>
              Váha:
              <input
                type="number"
                value={editedData.personalInfo.weight}
                onChange={(e) => handlePersonalInfoChange('weight', e.target.value)}
              />
            </label>
            <label>
              Pohlavie:
              <select
                value={editedData.personalInfo.gender}
                onChange={(e) => handlePersonalInfoChange('gender', e.target.value)}
              >
                <option value="Muž">Muž</option>
                <option value="Žena">Žena</option>
              </select>
            </label>
            <div className="save-button-container">
                <button className="save-button" onClick={handleSavePersonalInfo}>
                    Uložiť
                </button>
            </div>
          </>
        ) : (
          <>
            <p><span className="highlight">Meno:</span> {editedData.userName}</p>
            <p><span className="highlight">Vek:</span> {editedData.personalInfo.age}</p>
            <p><span className="highlight">Výška:</span> {editedData.personalInfo.height} cm</p>
            <p><span className="highlight">Váha:</span> {editedData.personalInfo.weight} kg</p>
            <p><span className="highlight">Pohlavie:</span> {editedData.personalInfo.gender}</p>
          </>
        )}
      </div>

      <div className="profile-section">
      <h3 className="section-header">
            <div className="title-container">
                <FaDumbbell className="section-icon" /> Fitness Údaje
            </div>
            {isEditingFitnessData ? (
                <FaTimes className="close-icon" onClick={handleEditFitnessData} />
            ) : (
                <FaPen className="edit-icon" onClick={handleEditFitnessData} />
            )}
        </h3>
        {isEditingFitnessData ? (
          <>
            <label>
              Skúsenosti:
              <select
                value={editedData.fitnessData.experience}
                onChange={(e) => handleFitnessDataChange('experience', e.target.value)}
              >
                <option value="Začiatočník">Začiatočník</option>
                <option value="Mierne pokročilý">Mierne pokročilý</option>
                <option value="Pokročilý">Pokročilý</option>
              </select>
            </label>
            <label>
              Úroveň aktivity:
              <select
                value={editedData.fitnessData.activityLevel}
                onChange={(e) => handleFitnessDataChange('activityLevel', e.target.value)}
              >
                <option value="Sedavá">Sedavá</option>
                <option value="Mierna">Mierna</option>
                <option value="Aktívna">Aktívna</option>
              </select>
            </label>
            <div className="save-button-container">
                <button className="save-button" onClick={handleSaveFitnessData}>
                    Uložiť
                </button>
            </div>
          </>
        ) : (
          <>
            <p><span className="highlight">Skúsenosti:</span> {editedData.fitnessData.experience}</p>
            <p><span className="highlight">Úroveň aktivity:</span> {editedData.fitnessData.activityLevel}</p>
          </>
        )}
      </div>

      <div className="profile-section">
      <h3 className="section-header">
            <div className="title-container">
                <FaBullseye className="section-icon" /> Ciele
            </div>
            {isEditingGoals ? (
                <FaTimes className="close-icon" onClick={handleEditGoals} />
            ) : (
                <FaPen className="edit-icon" onClick={handleEditGoals} />
            )}
        </h3>
        {isEditingGoals ? (
          <>
            <label>
              Hlavný cieľ:
            <select value={editedData.goals.mainGoal} onChange={(e) => handleGoalsChange('mainGoal', e.target.value)}>
                <option value="Budovanie svalov">Budovanie svalov</option>
                <option value="Chudnutie">Chudnutie</option>
                <option value="Udržiavanie hmotnosti">Udržiavanie hmotnosti</option>
            </select>
            </label>
            <label>
              Cieľová váha:
              <input
                type="number"
                value={editedData.goals.targetWeight}
                onChange={(e) => handleGoalsChange('targetWeight', e.target.value)}
              />
            </label>
            <label>
              Predpokladaný dátum:
              <input
                type="date"
                value={editedData.goals.estimatedDate}
                onChange={(e) => handleGoalsChange('estimatedDate', e.target.value)}
              />
            </label>
            <label>
              Kalorický príjem:
              <input
                type="number"
                value={editedData.goals.calorieGoal}
                onChange={(e) => handleGoalsChange('calorieGoal', e.target.value)}
              />
            </label>
            <div className="save-button-container">
                <button className="save-button" onClick={handleSaveGoals}>
                    Uložiť
                </button>
            </div>
          </>
        ) : (
          <>
            <p><span className="highlight">Hlavný cieľ:</span> {editedData.goals.mainGoal}</p>
            <p><span className="highlight">Cieľová váha:</span> {editedData.goals.targetWeight} kg</p>
            <p><span className="highlight">Predpokladaný dátum:</span> {formatDate(editedData.goals.estimatedDate)}</p>
            <p><span className="highlight">Kalorický príjem:</span> {editedData.goals.calorieGoal} kcal</p>
          </>
        )}
      </div>

      <div className="profile-footer">
        <button onClick={() => auth.signOut()}>Odhlásiť sa</button>
      </div>
    </div>
  );
};

export default Profile;