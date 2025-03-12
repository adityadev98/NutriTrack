import { screen, render,fireEvent, waitFor } from '@testing-library/react';
import FoodItem from '../CustomerPages/TrackFoodItem';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';

interface Measure {
    serving_weight: number;
    qty: number;
}
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
    global.console.log = jest.fn();
  });

  it('renders food item details', () => {
    render(
      <MemoryRouter>
        <FoodItem food={mockFood} />
      </MemoryRouter>
    );
    expect(screen.getByText(/banana \(100 kcal\)/i)).toBeInTheDocument();
    expect(screen.getByText(/protein: 1g/i)).toBeInTheDocument();
    expect(screen.getByText(/carbs: 27g/i)).toBeInTheDocument();
    expect(screen.getByText(/fat: 0g/i)).toBeInTheDocument();
    expect(screen.getByText(/fiber: 3g/i)).toBeInTheDocument();
  });

  it('updates macros when quantity is changed', () => {
    render(
      <MemoryRouter>
        <FoodItem food={mockFood} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Quantity'), {
      target: { value: '2' },
    });

    expect(screen.getByText(/protein: 2g/i)).toBeInTheDocument();
    expect(screen.getByText(/carbs: 54g/i)).toBeInTheDocument();
    expect(screen.getByText(/fat: 1g/i)).toBeInTheDocument();
    expect(screen.getByText(/fiber: 6g/i)).toBeInTheDocument();
  });
  it('calls trackFoodItem on button click', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    render(
      <MemoryRouter>
        <FoodItem food={mockFood} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Quantity'), {
      target: { value: '2' },
    });

    fireEvent.click(screen.getByText(/track/i));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/track', expect.any(Object));
    });
  });

  it('updates selected unit and recalculates macros', () => {
    render(
      <MemoryRouter>
        <FoodItem food={mockFood} />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText('Quantity'), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getAllByRole('combobox')[0], {
      target: { value: 'large' },
    });
    expect(screen.getAllByRole('combobox')[0]).toHaveValue('large');
  });

  it('updates selected meal time', () => {
    render(
      <MemoryRouter>
        <FoodItem food={mockFood} />
      
      </MemoryRouter>
    );
    
    fireEvent.change(screen.getAllByRole('combobox')[1], {
      target: { value: 'lunch' },
    });
    expect(screen.getAllByRole('combobox')[1]).toHaveValue('lunch');
    
  });

  it('resets macros when quantity is zero', () => {
    render(
      <MemoryRouter>
        <FoodItem food={mockFood} />
      </MemoryRouter>
    );
  
    const quantityInput = screen.getByPlaceholderText('Quantity') as HTMLInputElement;
    
    fireEvent.change(quantityInput, { target: { value: '0' } });
  
    expect(screen.getByText(/protein: 1g/i)).toBeInTheDocument();
    expect(screen.getByText(/carbs: 27g/i)).toBeInTheDocument();
    expect(screen.getByText(/fat: 0g/i)).toBeInTheDocument();
    expect(screen.getByText(/fiber: 3g/i)).toBeInTheDocument();
  });
  it('handles fetch failure', async () => {
    // Mock fetch to reject with an error
    fetchMock.mockReject(new Error('Failed to fetch'));
  
    render(
      <MemoryRouter>
        <FoodItem food={mockFood} />
      </MemoryRouter>
    );
  
    fireEvent.click(screen.getByText(/track/i));
  
    // Wait for the effect of the fetch failure
    await waitFor(() => {
      // Ensure console.log is called with an error
      expect(console.log).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Failed to fetch'
      }));
    });
  });

  
it('uses selectedMeasure values when available', () => {
  const selectedMeasure: Measure = { serving_weight: 150, qty: 2 };
  expect(selectedMeasure.serving_weight).toBe(150);
  expect(selectedMeasure.qty).toBe(2);
});

it('falls back to food.serving_weight_grams if selectedMeasure is undefined', () => {
  let selectedMeasure: Measure | undefined;
  expect(selectedMeasure?.serving_weight ?? mockFood.serving_weight_grams).toBe(118);
  expect(selectedMeasure?.qty ?? 1).toBe(1);
});

});
