import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrackSearch from '../TrackSearch';
import { searchFoodAPI, fetchFoodDetailsAPI } from '../../Services/nutritionixAPI';

jest.mock('../../Services/nutritionixAPI');

const mockSetSelectedFood = jest.fn();

describe('TrackSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input', () => {
    render(<TrackSearch setSelectedFood={mockSetSelectedFood} />);
    expect(screen.getByPlaceholderText('Search Food Item')).toBeInTheDocument();
  });

  it('calls searchFoodAPI and displays results', async () => {
    const mockResults = [
      { food_name: 'banana', photo: { thumb: 'banana.jpg' } },
      { food_name: 'apple', photo: { thumb: 'apple.jpg' } },
    ];
    (searchFoodAPI as jest.Mock).mockResolvedValue(mockResults);

    render(<TrackSearch setSelectedFood={mockSetSelectedFood} />);

    fireEvent.change(screen.getByPlaceholderText('Search Food Item'), {
      target: { value: 'ba' },
    });

    await waitFor(() => {
      expect(searchFoodAPI).toHaveBeenCalledWith('ba');
      expect(screen.getByText('banana')).toBeInTheDocument();
      expect(screen.getByText('apple')).toBeInTheDocument();
    });
  });

  it('calls fetchFoodDetailsAPI and sets selected food', async () => {
    const mockFoodDetails = {
      food_name: 'banana',
      nf_calories: 100,
      nf_protein: 1,
      nf_total_carbohydrate: 27,
      nf_dietary_fiber: 3,
      nf_total_fat: 0.3,
      photo: { thumb: 'banana.jpg' },
      alt_measures: [],
      serving_weight_grams: 118,
      serving_unit: 'medium',
    };
    (fetchFoodDetailsAPI as jest.Mock).mockResolvedValue(mockFoodDetails);

    render(<TrackSearch setSelectedFood={mockSetSelectedFood} />);

    fireEvent.change(screen.getByPlaceholderText('Search Food Item'), {
      target: { value: 'banana' },
    });

    await waitFor(() => {
      expect(screen.getByText('banana')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('banana'));

    await waitFor(() => {
      expect(fetchFoodDetailsAPI).toHaveBeenCalledWith('banana');
      expect(mockSetSelectedFood).toHaveBeenCalledWith({
        name: 'banana',
        calories: 100,
        protein: 1,
        carbohydrates: 27,
        fiber: 3,
        fat: 0.3,
        image: 'banana.jpg',
        alt_measures: [],
        serving_weight_grams: 118,
        serving_unit: 'medium',
      });
    });
  });

  it('clears food items when input is cleared', async () => {
    const mockResults = [
      { food_name: 'banana', photo: { thumb: 'banana.jpg' } },
    ];
    (searchFoodAPI as jest.Mock).mockResolvedValue(mockResults);

    render(<TrackSearch setSelectedFood={mockSetSelectedFood} />);

    fireEvent.change(screen.getByPlaceholderText('Search Food Item'), {
      target: { value: 'banana' },
    });

    await waitFor(() => {
      expect(screen.getByText('banana')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Search Food Item'), {
      target: { value: '' },
    });

    await waitFor(() => {
      expect(screen.queryByText('banana')).not.toBeInTheDocument();
    });
  });
});