import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaUser, FaRunning , FaBullseye, FaPen, FaTimes, FaInfoCircle, FaUtensils, FaAppleAlt,  } from 'react-icons/fa';
import { formatDate } from '../../utils';
import './Profile.css';

const Profile = () => {
  const initialState = {
    userName: '',
    email: '',
    membership: 'Basic',
    personalData: {
      name: '',
      age: '',
      height: '',
      weight: '',
      gender: '',
      email: '',
      photoURL: '',
    },
    fitnessData: {
      mainGoal: '',
      experience: '',
      activityLevel: '',
    },
    calorieInput: {
      mode: 'automatic',
      value: 2000,
    },
    nutrition: {
      mode: 'automatic',
      proteins: '',
      carbs: '',
      fats: ''
    },
    goals: {
      targetWeight: '',
      estimatedDate: '',
      calorieGoal: '',
    }
  };

  const [userData, setUserData] = useState(initialState);
  const [editedData, setEditedData] = useState(initialState);

  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [isEditingFitnessData, setIsEditingFitnessData] = useState(false);
  const [isEditingCalorieInput, setIsEditingCalorieInput] = useState(false);
  const [isEditingMacros, setIsEditingMacros] = useState(false);
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const navigate = useNavigate(); 

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const formattedData = {
            membership: data.membership || 'Basic',
            personalData: {
              name: data.personalData?.name || '',
              age: data.personalData?.age || '',
              height: data.personalData?.height || '',
              weight: data.personalData?.weight || '',
              gender: data.personalData?.gender || '',
              email: data.personalData?.email || '',
              photoURL: data.personalData?.photoURL || '',
            },
            fitnessData: {
              mainGoal: data.fitnessData?.mainGoal || '',
              experience: data.fitnessData?.experience || '',
              activityLevel: data.fitnessData?.activityLevel || '',
            },
            calorieInput: {
              mode: data.calorieInput?.mode || 'automatic',
              value: data.calorieInput?.value || 2000,
            },
            nutrition: {
              mode: data.nutrition?.mode || 'automatic',
              proteins: data.nutrition?.proteins || 150 ,
              carbs: data.nutrition?.carbs || 200 ,
              fats: data.nutrition?.fats || 67 
            },
            goals: {
              targetWeight: data.goals?.targetWeight || '',
              estimatedDate: data.goals?.estimatedDate || '',
              calorieGoal: data.goals?.calorieGoal || '',
            }
          };
          setUserData(formattedData);
          setEditedData(formattedData);
        }
        
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleBackButtonClick = () => {
    navigate('/');
  };

/* Edit data functions */
  const handleEditFitnessData = () => {
    if (isEditingFitnessData) {
      setEditedData(prev => ({...prev, fitnessData: userData.fitnessData}));
    }
    setIsEditingFitnessData(!isEditingFitnessData);
  };

  const handleEditCalorieInput = () => {
    setEditedData(prev => ({
      ...prev,
      calorieInput: userData.calorieInput
    }));
    setIsEditingCalorieInput(!isEditingCalorieInput);
  };

  const handleEditGoals = () => {
    setEditedData(prev => ({
      ...prev,
      goals: userData.goals
    }));
    setIsEditingGoals(!isEditingGoals);
  };

  const handleInputChange = (e) => {
    const value = Number(e.target.value);
    setEditedData((prev) => ({
      ...prev,
      calorieInput: {
        ...prev.calorieInput,
        value: value,
      },
    }));
    if (value > 0) {
      setErrorMessage('');
    }
  };

  /* Cancel handle functions */
  const handleCancelPersonalInfo = () => {
    setEditedData(prev => ({
      ...prev,
      personalInfo: {...userData.personalInfo},
      userName: userData.userName
    }));
    setIsEditingPersonalInfo(false);
  };

  const handleCancelFitnessEdit = () => {
    setEditedData(prev => ({
      ...prev,
      fitnessData: {...userData.fitnessData}
    }));
    setIsEditingFitnessData(false);
  };

  const handleCancelMacrosEdit = () => {
    setEditedData(prev => ({
      ...prev,
      nutrition: {...userData.nutrition}
    }));
    setIsEditingMacros(false);
  };

  const handleCancelGoalsEdit = () => {
    setEditedData(prev => ({
      ...prev,
      goals: {...userData.goals}
    }));
    setIsEditingGoals(false);
  };


 /* Calculations for Calories nad macros */ 
const calculateCalories = () => {
  const { weight, height, age, gender } = editedData.personalData;
  const { activityLevel, mainGoal, experience } = editedData.fitnessData;

  if (!weight || !height || !age || !activityLevel || isNaN(weight) || isNaN(height) || isNaN(age)) {
    return 0;
  }
  
  // Calculate BMR (Basal Metabolic Rate)
  const bmr =
    gender === 'Muž'
      ? 10 * weight + 6.25 * height - 5.7 * age + 5
      : 10 * weight + 6.25 * height - 4.3 * age - 161;

  const maintenanceCalories = Math.round(bmr * activityLevel);

  let recommendedIntake = maintenanceCalories;
  
  switch (mainGoal) {
    case 'Chudnutie':
      recommendedIntake = Math.round(maintenanceCalories * 0.8);
      break;
    case 'Budovanie svalov':
      switch (experience) {
        case 'Začiatočník':
          recommendedIntake = Math.round(maintenanceCalories * 1.25);
          break;
        case 'Mierne pokročilý':
          recommendedIntake = Math.round(maintenanceCalories * 1.15);
          break;
        case 'Pokročilý':
          recommendedIntake = Math.round(maintenanceCalories * 1.1);
          break;
        case 'Prestal som cvičiť':
          recommendedIntake = Math.round(maintenanceCalories * 1.2);
          break;
        default:
          recommendedIntake = maintenanceCalories;
          break;
      }
      break;
    case 'Udržiavanie hmotnosti':
      recommendedIntake = maintenanceCalories;
      break;
    default:
      recommendedIntake = maintenanceCalories;
      break;
  }

  return recommendedIntake;
};


const calculateMacros = (totalCalories) => {
  const { mainGoal } = editedData.fitnessData;
  //const { weight } = editedData.personalInfo;
  
  let proteinPercentage, carbsPercentage, fatsPercentage;
  
  switch (mainGoal) {
    case 'Budovanie svalov':
      proteinPercentage = 30;
      carbsPercentage = 45;
      fatsPercentage = 25;
      break;
    case 'Chudnutie':
      proteinPercentage = 35;
      carbsPercentage = 35;
      fatsPercentage = 30;
      break;
    default: // Udržiavanie hmotnosti a ostatné
      proteinPercentage = 30;
      carbsPercentage = 40;
      fatsPercentage = 30;
  }

  // Výpočet gramov na základe percent a celkových kalórií
  const proteinCalories = totalCalories * (proteinPercentage / 100);
  const carbsCalories = totalCalories * (carbsPercentage / 100);
  const fatsCalories = totalCalories * (fatsPercentage / 100);

  return {
    proteins: {
      grams: Math.round(proteinCalories / 4), // 4 kcal/g pre proteíny
      percentage: proteinPercentage
    },
    carbs: {
      grams: Math.round(carbsCalories / 4), // 4 kcal/g pre sacharidy
      percentage: carbsPercentage
    },
    fats: {
      grams: Math.round(fatsCalories / 9), // 9 kcal/g pre tuky
      percentage: fatsPercentage
    }
  };
};


/* Save functions */
const handleSavePersonalInfo = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      
      // Pridajte kontrolu existencie dát pred uložením
      await updateDoc(docRef, {
        'personalData.name': editedData.personalData.name,
        'personalData.age': editedData.personalData.age,
        'personalData.height': editedData.personalData.height,
        'personalData.weight': editedData.personalData.weight,
        'personalData.gender': editedData.personalData.gender, // Skontrolujte, či je tento riadok správne
        'personalData.email': editedData.personalData.email,
        'personalData.photoURL': editedData.personalData.photoURL,
      }, { merge: true });  // Pridajte merge pre čiastočné updaty

      setUserData(prev => ({
        ...prev,
        userName: editedData.personalData.name,
        personalData: {...editedData.personalData}
      }));
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
              'fitnessData.mainGoal': editedData.fitnessData.mainGoal,
              'fitnessData.experience': editedData.fitnessData.experience,
              'fitnessData.activityLevel': editedData.fitnessData.activityLevel,
          });
          setUserData((prev) => ({
              ...prev,
              fitnessData: editedData.fitnessData,
          }));
          setIsEditingFitnessData(false);
      }
  } catch (error) {
      console.error('Error saving fitness data:', error);
      alert('Error saving fitness data changes');
  }
};


const handleSaveCalorieInput = async () => {
  try {
    const manualInputField = document.getElementById('manualInputField');
    
    if (
      editedData.calorieInput.mode === 'manual' &&
      (!editedData.calorieInput.value || editedData.calorieInput.value <= 0)
    ) {
      setErrorMessage('Prosím zadajte hodnotu kalorického príjmu väčšiu ako 0.');
      if (manualInputField) {
        manualInputField.style.borderColor = 'red';
        manualInputField.style.borderWidth = '2px';
      }
      return;
    } else {
      if (manualInputField) {
        manualInputField.style.borderColor = '';
        manualInputField.style.borderWidth = '';
      }
    }

    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);

      const calorieValue = editedData.calorieInput.mode === 'automatic'
        ? calculateCalories()
        : editedData.calorieInput.value;

      await updateDoc(docRef, {
        calorieInput: {
          mode: editedData.calorieInput.mode,
          value: calorieValue,
        },
        'goals.calorieGoal': calorieValue,
      });

      setUserData((prev) => ({
        ...prev,
        calorieInput: {
          mode: editedData.calorieInput.mode,
          value: calorieValue,
        },
      }));
      setErrorMessage('');
      setIsEditingCalorieInput(false);
    }
  } catch (error) {
    console.error('Error saving calorie input:', error);
    setErrorMessage('Nastala chyba pri ukladaní údajov. Skúste to znova.');
  }
};


const handleSaveMacros = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);

      const totalCalories =
        editedData.calorieInput.mode === 'automatic'
          ? calculateCalories()
          : editedData.calorieInput.value;

      let nutritionToSave;
      if (editedData.nutrition.mode === 'automatic') {
        const calculatedMacros = calculateMacros(totalCalories);
        nutritionToSave = {
          mode: 'automatic',
          proteins: calculatedMacros.proteins.grams,
          carbs: calculatedMacros.carbs.grams,
          fats: calculatedMacros.fats.grams
        };
      } else {
        nutritionToSave = {
          mode: 'manual',
          proteins: Number(editedData.nutrition.proteins),
          carbs: Number(editedData.nutrition.carbs),
          fats: Number(editedData.nutrition.fats)
        };
      }

      await updateDoc(docRef, {
        nutrition: nutritionToSave
      });

      setUserData((prev) => ({
        ...prev,
        nutrition: nutritionToSave
      }));
      
      setErrorMessage('');
      setIsEditingMacros(false);
    }
  } catch (error) {
    console.error('Error saving macros:', error);
    alert('Error saving macros');
  }
};

const handleSaveGoals = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        'goals.targetWeight': editedData.goals.targetWeight,
        'goals.estimatedDate': editedData.goals.estimatedDate,
        'goals.calorieGoal': editedData.goals.calorieGoal,
      });

      setUserData((prev) => ({
        ...prev,
        goals: editedData.goals,
      }));

      setIsEditingGoals(false);
    }
  } catch (error) {
    console.error('Error saving goals:', error);
    alert('Error saving goals changes');
  }
};
  

  /* Change functions */

  const handlePersonalInfoChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      personalData: {
        ...prev.personalData,
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

  const handleCalorieModeChange = (mode) => {
    const value = mode === 'automatic' ? calculateCalories() : editedData.calorieInput.value;
    setEditedData((prev) => ({
      ...prev,
      calorieInput: {
        mode,
        value,
      },
    }));
  };

  const handleMacroModeChange = (mode) => {
    setEditedData(prev => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        mode
      }
    }));
  };

  const handleMacroChange = (macro, value) => {
    setEditedData(prev => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        [macro]: Number(value)
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
    <>
      <div className="profile">
        <div className="profile-header">
          <div className="user-details">
            <FaUserCircle className="avatar" />
            <div className="user-info">
              <h2>{editedData.personalData.name}</h2>
            </div>
          </div>
          <div className="action-section">
            <span className={`membership-badge ${editedData.membership.toLowerCase()}`}>
              {editedData.membership}
            </span>
          </div>
        </div>

        <div className="profile-section">
          <h3 className="section-header">
            <div className="title-container">
              <FaUser className="section-icon" /> Osobné Informácie
            </div>
            {isEditingPersonalInfo ? (
              <FaTimes className="close-icon" onClick={handleCancelPersonalInfo} />
            ) : (
              <FaPen className="edit-icon" onClick={() => setIsEditingPersonalInfo(true)} />
            )}
          </h3>
          {isEditingPersonalInfo ? (
            <>
              <label>
                Meno:
                <input
                  type="text"
                  value={editedData.personalData.name}
                  onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                />
              </label>
              <label>
                Vek:
                <input
                  type="number"
                  value={editedData.personalData.age}
                  onChange={(e) => handlePersonalInfoChange('age', e.target.value)}
                />
              </label>
              <label>
                Výška:
                <input
                  type="number"
                  value={editedData.personalData.height}
                  onChange={(e) => handlePersonalInfoChange('height', e.target.value)}
                />
              </label>
              <label>
                Váha:
                <input
                  type="number"
                  value={editedData.personalData.weight}
                  onChange={(e) => handlePersonalInfoChange('weight', e.target.value)}
                />
              </label>
              <label>
                Pohlavie:
                <select
                  value={editedData.personalData.gender}
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
              <p><span className="highlight">Meno:</span> {editedData.personalData.name}</p>
              <p><span className="highlight">Vek:</span> {editedData.personalData.age}</p>
              <p><span className="highlight">Výška:</span> {editedData.personalData.height} cm</p>
              <p><span className="highlight">Váha:</span> {editedData.personalData.weight} kg</p>
              <p><span className="highlight">Pohlavie:</span> {editedData.personalData.gender}</p>
            </>
          )}
        </div>

      <div className="profile-section">
      <h3 className="section-header">
            <div className="title-container">
                <FaRunning style={{ color: "orange" }} className="section-icon" /> Fitness Údaje
            </div>
            {isEditingFitnessData ? (
                <FaTimes className="close-icon" onClick={handleCancelFitnessEdit} />
            ) : (
                <FaPen className="edit-icon" onClick={handleEditFitnessData} />
            )}
        </h3>
        {isEditingFitnessData ? (
          <>
            <label>
              Hlavný cieľ:
              <select value={editedData.fitnessData.mainGoal} onChange={(e) => handleFitnessDataChange('mainGoal', e.target.value)}>
                <option value="Budovanie svalov">Budovanie svalov</option>
                <option value="Chudnutie">Chudnutie</option>
                <option value="Udržiavanie hmotnosti">Udržiavanie hmotnosti</option>
              </select>
            </label>
            <label>
              Skúsenosti:
              <select
                value={editedData.fitnessData.experience}
                onChange={(e) => handleFitnessDataChange('experience', e.target.value)}
              >
                <option value="Začiatočník">Začiatočník (0 - 2 roky)</option>
                <option value="Mierne pokročilý">Mierne pokročilý (2 - 5 rokov)</option>
                <option value="Pokročilý">Pokročilý (viac ako 5 rokov)</option>
                <option value="Prestal som cvičiť">Prestal som cvičiť</option>
              </select>
            </label>
            <label>
              Koeficient aktivity:
            <div className="info-icon">
            <FaInfoCircle />
            <span className="tooltip">
                <table>
                <thead>
                    <tr>
                    <th>Úroveň aktivity</th>
                    <th>Multiplikátor</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>Sedentárny (veľmi málo aktivity, sedavý spôsob života)</td>
                    <td>1.2 - 1.5</td>
                    </tr>
                    <tr>
                    <td>Ľahko aktívny (ľahká aktivita, napr. prechádzky alebo krátka aktivita každý deň)</td>
                    <td>1.5 - 1.8</td>
                    </tr>
                    <tr>
                    <td>Stredne aktívny (pravidelný pohyb, napr. každodenné aktivity plus cvičenie)</td>
                    <td>1.8 - 2.0</td>
                    </tr>
                    <tr>
                    <td>Veľmi aktívny (fyzická práca alebo intenzívne tréningy každý deň)</td>
                    <td>2.0 - 2.2</td>
                    </tr>
                </tbody>
                </table>
            </span>
            </div>
            <input
                type="number"
                value={editedData.fitnessData.activityLevel}
                onChange={(e) => handleFitnessDataChange('activityLevel', e.target.value)}
              />
            </label>
            <div className="save-button-container">
                <button className="save-button" onClick={handleSaveFitnessData}>
                    Uložiť
                </button>
            </div>
          </>
        ) : (
          <>
            <p><span className="highlight">Hlavný cieľ:</span> {editedData.fitnessData.mainGoal}</p>
            <p><span className="highlight">Skúsenosti:</span> {editedData.fitnessData.experience}</p>
            <p><span className="highlight">Koeficient aktivity:</span> {editedData.fitnessData.activityLevel}</p>
          </>
        )}
      </div>

      <div className="profile-section">
      <h3 className="section-header">
          <div className="title-container">
            <FaUtensils style={{ color: "green" }} className="section-icon" /> Kalorický príjem
          </div>
          {isEditingCalorieInput ? (
            <FaTimes className="close-icon" onClick={() => handleEditCalorieInput()} />
          ) : (
            <FaPen className="edit-icon" onClick={() => setIsEditingCalorieInput(true)} />
          )}
        </h3>
        {isEditingCalorieInput ? (
        <>
          <div className="calorie-mode-container">
            <label>
              <input
                type="radio"
                value="automatic"
                checked={editedData.calorieInput.mode === 'automatic'}
                onChange={(e) => handleCalorieModeChange(e.target.value)}
              />
              <span>Automatický výpočet (na základe údajov)</span>
            </label>
            
            <label>
              <input
                type="radio"
                value="manual"
                checked={editedData.calorieInput.mode === 'manual'}
                onChange={(e) => handleCalorieModeChange(e.target.value)}
              />
              <span>Manuálne zadanie</span>
            </label>
            
            {editedData.calorieInput.mode === 'manual' && (
              <div className="calorie-manual-input">
                <label>
                  <span>Kalorický príjem:</span>
                  <input
                    id="manualInputField"
                    type="number"
                    value={editedData.calorieInput.value}
                    onChange={handleInputChange}
                    placeholder={errorMessage || 'Zadajte hodnotu'}
                    className={errorMessage ? 'input-error' : ''}
                  />
                </label>
              </div>
            )}
          </div>
          <div className="save-button-container">
            <button className="save-button" onClick={handleSaveCalorieInput}>
              Uložiť
            </button>
          </div>
        </>
      ) : (
        <p>
          <span className="highlight">Kalorický cieľ:</span>{' '}
          {editedData.calorieInput.value} kcal 
          ({editedData.calorieInput.mode === 'automatic' ? 'automaticky' : 'manuálne'})
        </p>
      )}
      </div>

      <div className="profile-section">
        <h3 className="section-header">
          <div className="title-container">
            <FaAppleAlt style={{ color: "lightblue" }} className="section-icon" /> Makronutrienty
          </div>
          {isEditingMacros ? (
            <FaTimes className="close-icon" onClick={handleCancelMacrosEdit} />
          ) : (
            <FaPen className="edit-icon" onClick={() => setIsEditingMacros(true)} />
          )}
        </h3>
        {isEditingMacros ? (
          <>
            <div className="calorie-mode-container">
              <label>
                <input
                  type="radio"
                  value="automatic"
                  checked={editedData.nutrition.mode === 'automatic'}
                  onChange={(e) => handleMacroModeChange(e.target.value)}
                />
                Automatický výpočet
              </label>
              <label>
                <input
                  type="radio"
                  value="manual"
                  checked={editedData.nutrition.mode === 'manual'}
                  onChange={(e) => handleMacroModeChange(e.target.value)}
                />
                Manuálne zadanie
              </label>
            </div>
            
            {editedData.nutrition.mode === 'manual' && (
            <div className="macro-inputs">
              <label>
                Proteíny (g):
                <input
                  type="number"
                  value={editedData.nutrition.proteins}
                  onChange={(e) => handleMacroChange('proteins', e.target.value)}
                />
              </label>
              <label>
                Sacharidy (g):
                <input
                  type="number"
                  value={editedData.nutrition.carbs}
                  onChange={(e) => handleMacroChange('carbs', e.target.value)}
                />
              </label>
              <label>
                Tuky (g):
                <input
                  type="number"
                  value={editedData.nutrition.fats}
                  onChange={(e) => handleMacroChange('fats', e.target.value)}
                />
              </label>
            </div>
          )}
            
            <div className="save-button-container">
              <button className="save-button" onClick={handleSaveMacros}>
                Uložiť
              </button>
            </div>
          </>
        ) : (
          <div className="macro-display">
          {editedData.nutrition.mode === 'automatic' ? (
            (() => {
              const totalCalories = editedData.calorieInput.mode === 'automatic' 
                ? calculateCalories()
                : editedData.calorieInput.value;
              const macros = calculateMacros(totalCalories);
              return (
                <>
                  <p><span className="highlight">Proteíny:</span> {macros.proteins.grams}g ({macros.proteins.percentage}%)</p>
                  <p><span className="highlight">Sacharidy:</span> {macros.carbs.grams}g ({macros.carbs.percentage}%)</p>
                  <p><span className="highlight">Tuky:</span> {macros.fats.grams}g ({macros.fats.percentage}%)</p>
                </>
              );
            })()
          ) : (
            <>
              <p><span className="highlight">Proteíny:</span> {editedData.nutrition.proteins}g</p>
              <p><span className="highlight">Sacharidy:</span> {editedData.nutrition.carbs}g</p>
              <p><span className="highlight">Tuky:</span> {editedData.nutrition.fats}g</p>
            </>
          )}
          </div>
        )}
      </div>

      <div className="profile-section">
      <h3 className="section-header">
            <div className="title-container">
                <FaBullseye style={{ color: "gold" }} className="section-icon" /> Ciele
            </div>
            {isEditingGoals ? (
              <FaTimes className="close-icon" onClick={handleCancelGoalsEdit} />
            ) : (
              <FaPen className="edit-icon" onClick={handleEditGoals} />
            )}
        </h3>
        {isEditingGoals ? (
          <>
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
            <p><span className="highlight">Cieľová váha:</span> {editedData.goals.targetWeight} kg</p>
            <p><span className="highlight">Predpokladaný dátum:</span> {formatDate(editedData.goals.estimatedDate)}</p>
            <p><span className="highlight">Kalorický príjem:</span> {editedData.goals.calorieGoal} kcal</p>
          </>
        )}
      </div>

      <div className="logout-container">
        <button className="logout-button" onClick={() => auth.signOut()}>

          Odhlásiť sa
        </button>
      </div>
    </div>
    <div className="button-container">
        <button className="back-button" onClick={handleBackButtonClick}>
          ← Back to Dashboard
        </button>
      </div>
    </>
  );
};

export default Profile;