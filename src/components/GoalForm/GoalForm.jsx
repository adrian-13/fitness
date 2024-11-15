import React, { useState } from 'react';
import './GoalForm.css';

const GoalForm = () => {
  // Osobné informácie
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityMultiplier, setActivityMultiplier] = useState('');
  const [exerciseLevel, setExerciseLevel] = useState('');
  const [goal, setGoal] = useState('');
  const [guesstimatedMaintenance, setGuesstimatedMaintenance] = useState(null);
  const [recommendedIntake, setRecommendedIntake] = useState(null);

  // Funkcia na výpočet BMR
  const calculateBMR = () => {
    let bmr = 0;
    if (gender === 'muž') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else if (gender === 'žena') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    return bmr;
  };

  // Funkcia na výpočet GUESSTIMATED MAINTENANCE
  const calculateGuesstimatedMaintenance = () => {
    const bmr = calculateBMR();
    if (activityMultiplier && bmr) {
      return bmr * parseFloat(activityMultiplier);
    }
    return null;
  };

  // Funkcia na výpočet odporúčaného príjmu
  const calculateRecommendedIntake = (maintenance) => {
    if (!maintenance) return;

    let intake = maintenance;
    if (goal === 'schudnúť') {
      intake *= 0.8;
    } else if (goal === 'nabrať svaly') {
      if (exerciseLevel === 'beginner') intake *= 1.25;
      else if (exerciseLevel === 'intermediate') intake *= 1.15;
      else if (exerciseLevel === 'advanced') intake *= 1.1;
      else if (exerciseLevel === 'detrained') intake *= 1.2;
    } else if (goal === 'nabrať svaly a schudnúť tuk') {
      if (exerciseLevel === 'beginner' || exerciseLevel === 'intermediate') intake = maintenance;
      else if (exerciseLevel === 'advanced') intake *= 1.05;
      else if (exerciseLevel === 'detrained') {
        intake = maintenance;
      }
    }
    setRecommendedIntake(intake);
  };

  // Funkcia na odoslanie formulára
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kontrola, či sú všetky polia vyplnené
    if (!gender || !age || !weight || !height || !activityMultiplier || !goal || !exerciseLevel) {
      alert("Všetky polia musia byť vyplnené!");
      return;
    }

    // Výpočet a zobrazenie GUESSTIMATED MAINTENANCE
    const maintenance = calculateGuesstimatedMaintenance();
    setGuesstimatedMaintenance(maintenance);

    calculateRecommendedIntake(maintenance);

    // Odoslanie dát na server
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender,
          age,
          weight,
          height,
          activityMultiplier,
          exerciseLevel,
          goal,
          guesstimatedMaintenance: maintenance.toFixed(0),
          recommendedIntake: recommendedIntake.toFixed(0),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Chyba pri ukladaní cieľa: ${errorText}`);
      }
      alert("Cieľ bol úspešne uložený!");
    } catch (error) {
      console.error("Error during submission: ", error);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Osobné informácie */}
      <fieldset>
        <legend>Osobné informácie</legend>
        <label>
          Pohlavie:
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Vyberte pohlavie</option>
            <option value="muž">Muž</option>
            <option value="žena">Žena</option>
          </select>
        </label>

        <label>
          Vek:
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Vek"
            min="0"
            onClick={(e) => e.target.select()}
          />
        </label>

        <label>
          Hmotnosť (kg):
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Hmotnosť"
            min="0"
            onClick={(e) => e.target.select()}
          />
        </label>

        <label>
          Výška (cm):
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Výška"
            min="0"
            onClick={(e) => e.target.select()}
          />
        </label>
      </fieldset>

      {/* Tréningový multiplikátor */}
      <fieldset>
        <legend>Úroveň aktivity</legend>
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
        <label>
          Tréningový multiplikátor:
          <input
            type="number"
            value={activityMultiplier}
            onChange={(e) => setActivityMultiplier(e.target.value)}
            placeholder="Multiplikátor"
            min="1.2"
            max="2.2"
            step="0.1"
            onClick={(e) => e.target.select()}
          />
        </label>
      </fieldset>

      {/* Úroveň cvičenia */}
      <fieldset>
        <legend>Úroveň cvičenia</legend>
        <label>
          Úroveň cvičenia:
          <select
            id="exerciseLevel"
            value={exerciseLevel}
            onChange={(e) => setExerciseLevel(e.target.value)}
          >
            <option value="">Vyberte úroveň</option>
            <option value="beginner">Začiatočník (0 - 2 roky)</option>
            <option value="intermediate">Mierne pokročilý (2 - 5 rokov)</option>
            <option value="advanced">Pokročilý (viac ako 5 rokov)</option>
            <option value="detrained">Človek prestal cvičiť</option>
          </select>
        </label>
      </fieldset>

      {/* Cieľ */}
      <fieldset>
        <legend>Cieľ</legend>
        <label>
          Cieľ:
          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="">Vyberte cieľ</option>
            <option value="schudnúť">Schudnúť</option>
            <option value="nabrať svaly">Nabrať svaly</option>
            <option value="nabrať svaly a schudnúť tuk">Nabrať svaly a schudnúť tuk</option>
          </select>
        </label>
      </fieldset>

      
      {/* Výsledky 
      {guesstimatedMaintenance !== null && (
        <div>
          <h3>Odhadovaný príjem kalórií na udržanie váhy:</h3>
          <p>{`${guesstimatedMaintenance.toFixed(2)} kalórií/deň`}</p>
        </div>
      )}
      */}

      {recommendedIntake && (
        <div>
          <h3>Odporúčaný denný príjem kalórií:</h3>
          <p>{`${recommendedIntake.toFixed(0)} kalórií/deň`}</p>
        </div>
      )}

      <button type="submit">Uložiť cieľ</button>
    </form>
  );
};

export default GoalForm;
