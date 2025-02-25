import { render } from '@testing-library/react';
import DailyPieChart from '../DailyPieChart';
import '@testing-library/jest-dom';

describe('DailyPieChart', () => {
  const dailyData = {
    calorieData: [
      { name: 'Breakfast', totalCalories: 500 },
      { name: 'Lunch', totalCalories: 700 },
      { name: 'Dinner', totalCalories: 800 },
    ],
    nutrientData: [
      { name: 'Protein', value: 50 },
      { name: 'Carbs', value: 100 },
      { name: 'Fat', value: 30 },
    ],
  };

  it('should render customized label correctly', () => {
    const { getByText } = render(<DailyPieChart dailyData={dailyData} />);
    
    // Check if the customized labels are rendered correctly
    expect(getByText('Protein')).toBeInTheDocument();
    expect(getByText('Carbs')).toBeInTheDocument();
    expect(getByText('Fat')).toBeInTheDocument();
  });
});