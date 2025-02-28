import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import FoodItem from '../TrackFoodItem';

interface Food {
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  serving_weight_grams: number;
  alt_measures: { serving_weight: number; measure: string; qty: number }[];
  serving_unit: string;
}

const mockFood: Food = {
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

describe('FoodItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders food item details', () => {
    render(<FoodItem food={mockFood} />);

    expect(screen.getByText(/banana \(100 kcal\)/i)).toBeInTheDocument();
    expect(screen.getByText(/protein: 1g/i)).toBeInTheDocument();
    expect(screen.getByText(/carbs: 27g/i)).toBeInTheDocument();
    expect(screen.getByText(/fat: 0g/i)).toBeInTheDocument();
    expect(screen.getByText(/fiber: 3g/i)).toBeInTheDocument();
  });

  it('updates macros when quantity is changed', () => {
    render(<FoodItem food={mockFood} />);

    fireEvent.change(screen.getByPlaceholderText('Quantity'), {
      target: { value: '2' },
    });

    expect(screen.getByText(/protein: 2g/i)).toBeInTheDocument();
    expect(screen.getByText(/carbs: 54g/i)).toBeInTheDocument();
    expect(screen.getByText(/fat: 1g/i)).toBeInTheDocument();
    expect(screen.getByText(/fiber: 6g/i)).toBeInTheDocument();
  });

  it('calls trackFoodItem on button click', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({ success: true }),
    } as unknown as Response);

    render(<FoodItem food={mockFood} />);

    fireEvent.change(screen.getByPlaceholderText('Quantity'), {
      target: { value: '2' },
    });

    fireEvent.click(screen.getByText(/track/i));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/track', expect.any(Object));
    });
  });

  it('updates selected unit and recalculates macros', () => {
    render(<FoodItem food={mockFood} />);

    fireEvent.change(screen.getByPlaceholderText('Quantity'), {
      target: { value: '1' },
    });

    fireEvent.change(screen.getByRole('combobox', { name: /unit/i }), {
      target: { value: 'large' },
    });

    expect(screen.getByText(/protein: 2g/i)).toBeInTheDocument();
    expect(screen.getByText(/carbs: 54g/i)).toBeInTheDocument();
    expect(screen.getByText(/fat: 1g/i)).toBeInTheDocument();
    expect(screen.getByText(/fiber: 6g/i)).toBeInTheDocument();
  });

  it('updates selected meal time', () => {
    render(<FoodItem food={mockFood} />);

    fireEvent.change(screen.getByRole('combobox', { name: /meal/i }), {
      target: { value: 'lunch' },
    });

    expect(screen.getByRole('combobox', { name: /meal/i })).toHaveValue('lunch');
  });
});
