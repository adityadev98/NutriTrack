import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RecipePage from '../CustomerPages/RecipePage';
import { act } from 'react';
import { fetchMealsByName, fetchMealsByFilter, fetchRecipeDetails, fetchCategoriesByName, fetchArea } from '../../Services/recipeAPI';

jest.mock('../../Services/recipeAPI');

jest.mock('../../utils/env', () => ({
  BACKEND_URL: 'http://localhost:5000',
}));

const mockMeal = {
    idMeal: '12345',
    strMeal: 'Test Meal',
    strMealThumb: 'test-image.jpg',
    strInstructions: 'Test instructions.',
    strCategory: 'Test Category',
    strArea: 'Test Area',
    ingredients: ['1 cup Sugar', '2 tsp Salt']
};

describe('RecipePage', () => {
    beforeEach(() => {
        (fetchMealsByName as jest.Mock).mockResolvedValue([mockMeal]);
        (fetchMealsByFilter as jest.Mock).mockResolvedValue([mockMeal]);
        (fetchRecipeDetails as jest.Mock).mockResolvedValue([mockMeal]);
        (fetchCategoriesByName as jest.Mock).mockResolvedValue(['Category1', 'Category2']);
        (fetchArea as jest.Mock).mockResolvedValue(['Area1', 'Area2']);
    });

    test('renders the recipe search input', () => {
        render(<RecipePage />);
        expect(screen.getByPlaceholderText('Search meal by name')).toBeInTheDocument();
    });

    test('searches for meals when input changes', async () => {
        await act(async () => {
          render(<RecipePage />);
        });
      
        fireEvent.change(screen.getByPlaceholderText('Search meal by name'), {
          target: { value: 'Test' }
        });
      
        await waitFor(() => {
          expect(fetchMealsByName).toHaveBeenCalledWith('Test');
          expect(screen.getByText('Test Meal')).toBeInTheDocument();
        });
      });
      

    test('opens meal details modal on click', async () => {
        render(<RecipePage />);
        fireEvent.change(screen.getByPlaceholderText('Search meal by name'), { target: { value: 'Test' } });
        
        await waitFor(() => screen.getByText('Test Meal'));
        fireEvent.click(screen.getByText('Test Meal'));
        
        await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
        const ingredientsText = await screen.findByText('Ingredients:');
        expect(ingredientsText).toBeInTheDocument();
    });

    test('filters meals by category', async () => {
        render(<RecipePage />);

        fireEvent.change(screen.getByTestId('filterType-select'), { target: { value: 'category' } });
        await waitFor(() => expect(screen.getByTestId('category-select')).toBeInTheDocument());

        fireEvent.change(screen.getByTestId('category-select'), { target: { value: 'Category1' } });
        fireEvent.click(screen.getByRole('button',{name: 'Filter'}));

        await waitFor(() => expect(fetchMealsByFilter).toHaveBeenCalledWith('category', 'Category1'));
        expect(screen.getByText('Test Meal')).toBeInTheDocument();
    });
    test('filters meals by area', async () => {
        render(<RecipePage />);

        fireEvent.change(screen.getByTestId('filterType-select'), { target: { value: 'area' } });
        await waitFor(() => expect(screen.getByTestId('area-select')).toBeInTheDocument());

        fireEvent.change(screen.getByTestId('area-select'), { target: { value: 'Category1' } });
        fireEvent.click(screen.getByRole('button',{name: 'Filter'}));

        await waitFor(() => expect(fetchMealsByFilter).toHaveBeenCalledWith('category', 'Category1'));
        expect(screen.getByText('Test Meal')).toBeInTheDocument();
    });
});