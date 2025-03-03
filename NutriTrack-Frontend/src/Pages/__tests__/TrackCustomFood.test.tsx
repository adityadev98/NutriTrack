import { render, screen,fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FoodItem from '../TrackCustomFoodPage';
import fetchMock from 'jest-fetch-mock';

interface Food {
  foodName: string;
  details: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
  };
  serving_unit: string;
  serving_weight_grams: number;
}

const mockFood: Food = {
  foodName: 'banana',
  details: {
    calories: 100,
    protein: 1,
    carbohydrates: 27,
    fat: 0.3,
    fiber: 3,
  },
  serving_unit: 'banana',
  serving_weight_grams: 118,
};

describe('FoodItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.console.log = jest.fn();
    fetchMock.resetMocks();
  });

  it('renders food item details', () => {
    render(
        <MemoryRouter initialEntries={[{ state: { food: mockFood } }]}>
          <FoodItem food={mockFood} />
        </MemoryRouter>
      );
  

    expect(screen.getByText(/banana \(100 Kcal\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Protein: 1g/i)).toBeInTheDocument();
    expect(screen.getByText(/Carbs: 27g/i)).toBeInTheDocument();
    expect(screen.getByText(/Fat: 0g/i)).toBeInTheDocument();
    expect(screen.getByText(/Fiber: 3g/i)).toBeInTheDocument();
  });

  it('updates macros when quantity is changed', () => {
    render(
        <MemoryRouter initialEntries={[{ state: { food: mockFood } }]}>
          <FoodItem food={mockFood} />
        </MemoryRouter>
      );
  
    fireEvent.change(screen.getByPlaceholderText('Quantity'), {
      target: { value: '2' },
    });

    expect(screen.getByText(/Protein: 2g/i)).toBeInTheDocument();
    expect(screen.getByText(/Carbs: 54g/i)).toBeInTheDocument();
    expect(screen.getByText(/Fat: 1g/i)).toBeInTheDocument();
    expect(screen.getByText(/Fiber: 6g/i)).toBeInTheDocument();
  });

  it('calls trackFoodItem on button click', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    render(
        <MemoryRouter initialEntries={[{ state: { food: mockFood } }]}>
          <FoodItem food={mockFood} />
        </MemoryRouter>
      );

    fireEvent.change(screen.getByPlaceholderText('Quantity'), {
      target: { value: '2' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Track/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('api/track', expect.any(Object));
    });
  });

  it('updates selected meal time', () => {
    render(
        <MemoryRouter initialEntries={[{ state: { food: mockFood } }]}>
          <FoodItem food={mockFood} />
        </MemoryRouter>
      );
    fireEvent.change(screen.getAllByRole('combobox')[0], {
      target: { value: 'lunch' },
    });

    expect(screen.getAllByRole('combobox')[0]).toHaveValue('lunch');
  });

  it('resets macros when quantity is zero', () => {
    render(
        <MemoryRouter initialEntries={[{ state: { food: mockFood } }]}>
          <FoodItem food={mockFood} />
        </MemoryRouter>
      );
    const quantityInput = screen.getByPlaceholderText('Quantity') as HTMLInputElement;

    fireEvent.change(quantityInput, { target: { value: '0' } });

    expect(screen.getByText(/Protein: 1g/i)).toBeInTheDocument();
    expect(screen.getByText(/Carbs: 27g/i)).toBeInTheDocument();
    expect(screen.getByText(/Fat: 0g/i)).toBeInTheDocument();
    expect(screen.getByText(/Fiber: 3g/i)).toBeInTheDocument();
  });

  it('handles fetch failure', async () => {
    // Mock fetch to reject with an error
    fetchMock.mockReject(new Error('Failed to fetch'));

    render(
        <MemoryRouter initialEntries={[{ state: { food: mockFood } }]}>
          <FoodItem food={mockFood} />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByRole('button', { name: /Track/i }));


    // Wait for the effect of the fetch failure
    await waitFor(() => {
      // Ensure console.log is called with an error
      expect(console.log).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Failed to fetch'
      }));
    });
  });
  it('renders default values when location.state does not contain food', () => {
    render(
      <MemoryRouter initialEntries={[{ state: {} }]}>
        <FoodItem />
      </MemoryRouter>
    );

    expect(screen.getByText(/\(0 Kcal\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Protein: 0g/i)).toBeInTheDocument();
    expect(screen.getByText(/Carbs: 0g/i)).toBeInTheDocument();
    expect(screen.getByText(/Fat: 0g/i)).toBeInTheDocument();
    expect(screen.getByText(/Fiber: 0g/i)).toBeInTheDocument();
  });

});