import './NutritionChart.css';
import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

const NutritionChart = ({ consumed, dailyGoals, isMobile }) => {
  // Príprava dát pre grafy
  const prepareChartData = (consumed, goal) => [
    { value: consumed || 0, label: 'Prijaté' },
    { value: Math.max(0, (goal || 0) - (consumed || 0)), label: 'Zostáva' }
  ];

  const caloriesData = prepareChartData(consumed.calories, dailyGoals.calories);
  const proteinData = prepareChartData(consumed.protein, dailyGoals.protein);
  const carbsData = prepareChartData(consumed.carbs, dailyGoals.carbs);
  const fatsData = prepareChartData(consumed.fats, dailyGoals.fats);

  // Definícia farieb pre grafy
  const chartColors = {
    calories: ['#3fcc7c', '#F0F0F0'],
    protein: ['#ff9500', '#F0F0F0'],
    carbs: ['#ffcc00', '#F0F0F0'],
    fats: ['#5ac8fa', '#F0F0F0']
  };

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

  return (
    <div className="stats-container">
      <Stack direction="row" width="100%" spacing={2}>
        {/* Hlavný graf kalórií */}
        <Box flexGrow={1} textAlign="center" className="calories-card calories-main-chart">
          {renderNutrientChart(
            caloriesData,
            'Kalórie',
            consumed.calories,
            dailyGoals.calories,
            chartColors.calories
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
            chartColors.protein
          )}
          {renderNutrientChart(
            carbsData,
            'Sacharidy',
            consumed.carbs,
            dailyGoals.carbs,
            chartColors.carbs
          )}
          {renderNutrientChart(
            fatsData,
            'Tuky',
            consumed.fats,
            dailyGoals.fats,
            chartColors.fats
          )}
        </Stack>
      </div>
    </div>
  );
};

export default NutritionChart;