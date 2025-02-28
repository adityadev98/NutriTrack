import {screen, render, fireEvent, waitFor } from '@testing-library/react';
import FoodItem from '../TrackFoodItem';

const mockFood = {
  name: 'banana',
  calories: 100,
  protein: 1,
  carbohydrates: 27,
  fat: 0.3,
  fiber: 3,
  serving_weight_grams: 118,
  alt_measures: [
    { serving_weight: 118, measure: 'medium', qty: 1 },
    { serving_weight: 236, measure: 'large', qty: 1 },
  ],
  serving_unit: 'medium',
};

render(<HistoricalLineGraph historicalData={historicalData} />);

describe('FoodItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders food item details', () => {
    render(<FoodItem food={mockFood} />);

    expect(screen.getByText('Banana (100 Kcal)')).toBeInTheDocument();
    expect(screen.getByText('Protein: 1g')).toBeInTheDocument();
    expect(screen.getByText('Carbs: 27g')).toBeInTheDocument();
    expect(screen.getByText('Fat: 0g')).toBeInTheDocument();
    expect(screen.getByText('Fiber: 3g')).toBeInTheDocument();
  });

  it('updates macros when quantity is changed', () => {
    render(<FoodItem food={mockFood} />);

    fireEvent.change(screen.getByPlaceholderText('Quantity'), {
      target: { value: '2' },
    });

    expect(screen.getByText('Protein: 2g')).toBeInTheDocument();
    expect(screen.getByText('Carbs: 54g')).toBeInTheDocument();
    expect(screen.getByText('Fat: 1g')).toBeInTheDocument();
    expect(screen.getByText('Fiber: 6g')).toBeInTheDocument();
  });

  it('calls trackFoodItem on button click', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      })
    ) as jest.Mock;

    render(<FoodItem food={mockFood} />);

    fireEvent.change(screen.getByPlaceholderText('Quantity'), {
      target: { value: '2' },
    });

    fireEvent.click(screen.getByText('Track'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/track', expect.any(Object));
    });
  });

  it('updates selected unit and recalculates macros', () => {
    render(<FoodItem food={mockFood} />);

    fireEvent.change(screen.getByPlaceholderText('Quantity'), {
      target: { value: '1' },
    });

    fireEvent.change(screen.getByDisplayValue('grams'), {
      target: { value: 'large' },
    });

    expect(screen.getByText('Protein: 2g')).toBeInTheDocument();
    expect(screen.getByText('Carbs: 54g')).toBeInTheDocument();
    expect(screen.getByText('Fat: 1g')).toBeInTheDocument();
    expect(screen.getByText('Fiber: 6g')).toBeInTheDocument();
  });

  it('updates selected meal time', () => {
    render(<FoodItem food={mockFood} />);

    fireEvent.change(screen.getByDisplayValue('breakfast'), {
      target: { value: 'lunch' },
    });

    expect(screen.getByDisplayValue('lunch')).toBeInTheDocument();
  });
});
