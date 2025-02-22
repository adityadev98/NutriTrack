import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HistoricalLineGraph from '../HistoricalLineGraph';

test('renders HistoricalLineGraph component', () => {
  const historicalData = [
    { aggTime: 1627849200000, totalCalories: 2000, totalProtein: 50, totalFat: 70, totalFiber: 30, totalCarbohydrate: 250 },
    { aggTime: 1627935600000, totalCalories: 1800, totalProtein: 60, totalFat: 65, totalFiber: 25, totalCarbohydrate: 230 },
  ];


  render(<HistoricalLineGraph historicalData={historicalData} />);

  expect(screen.getByText(/Calories/i)).toBeInTheDocument();
});