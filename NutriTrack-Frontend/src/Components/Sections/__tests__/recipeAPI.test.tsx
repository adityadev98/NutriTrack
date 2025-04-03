import {
    fetchMealsByName,
    fetchMealsByFilter,
    fetchRecipeDetails,
    fetchCategoriesByName,
    fetchArea
  } from '../../../Services/recipeAPI';

// Define the type for our mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe('Meal API Functions', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Replace global fetch with our mock
    global.fetch = mockFetch;
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error in tests
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore(); // Properly restore the spy
  });

  // fetchMealsByName tests
  describe('fetchMealsByName', () => {
    test('successfully fetches meals by name', async () => {
      const mockMeals = [{ idMeal: '1', strMeal: 'Test Meal' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: mockMeals })
      } as Response);

      const result = await fetchMealsByName('test');
      expect(mockFetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=test');
      expect(result).toEqual(mockMeals);
    });

    test('returns empty array when no meals found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: null })
      } as Response);

      const result = await fetchMealsByName('test');
      expect(result).toEqual([]);
    });

    test('handles fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchMealsByName('test');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch meals:', expect.any(Error));
      expect(result).toEqual([]);
    });
  });

  // fetchMealsByFilter tests
  describe('fetchMealsByFilter', () => {
    test('successfully fetches meals by category', async () => {
      const mockMeals = [{ idMeal: '1', strMeal: 'Test Meal' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: mockMeals })
      } as Response);

      const result = await fetchMealsByFilter('category', 'Beef');
      expect(mockFetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/filter.php?c=Beef');
      expect(result).toEqual(mockMeals);
    });

    test('successfully fetches meals by area', async () => {
      const mockMeals = [{ idMeal: '1', strMeal: 'Test Meal' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: mockMeals })
      } as Response);

      const result = await fetchMealsByFilter('area', 'Italian');
      expect(mockFetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/filter.php?a=Italian');
      expect(result).toEqual(mockMeals);
    });

    test('handles fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchMealsByFilter('category', 'Beef');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch filtered meals:', expect.any(Error));
      expect(result).toEqual([]);
    });
  });

  // fetchRecipeDetails tests
  describe('fetchRecipeDetails', () => {
    test('successfully fetches recipe details', async () => {
      const mockRecipe = { idMeal: '1', strMeal: 'Test Recipe' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: [mockRecipe] })
      } as Response);

      const result = await fetchRecipeDetails('1');
      expect(mockFetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/lookup.php?i=1');
      expect(result).toEqual(mockRecipe);
    });

    test('returns null when no recipe found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: null })
      } as Response);

      const result = await fetchRecipeDetails('1');
      expect(result).toBeNull();
    });

    test('handles fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchRecipeDetails('1');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch recipe details:', expect.any(Error));
      expect(result).toBeNull();
    });
  });

  // fetchCategoriesByName tests
  describe('fetchCategoriesByName', () => {
    test('successfully fetches categories', async () => {
      const mockCategories = [{ strCategory: 'Beef' }, { strCategory: 'Chicken' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: mockCategories })
      } as Response);

      const result = await fetchCategoriesByName();
      expect(mockFetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
      expect(result).toEqual(['Beef', 'Chicken']);
    });

    test('handles HTTP error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({})
      } as Response);

      const result = await fetchCategoriesByName();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch categories:', expect.any(Error));
      expect(result).toEqual([]);
    });

    test('handles fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchCategoriesByName();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch categories:', expect.any(Error));
      expect(result).toEqual([]);
    });
  });

  // fetchArea tests
  describe('fetchArea', () => {
    test('successfully fetches areas', async () => {
      const mockAreas = [{ strArea: 'Italian' }, { strArea: 'Mexican' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: mockAreas })
      } as Response);

      const result = await fetchArea();
      expect(mockFetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
      expect(result).toEqual(['Italian', 'Mexican']);
    });

    test('handles HTTP error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({})
      } as Response);

      const result = await fetchArea();
      expect(mockFetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch area:', expect.any(Error));
      expect(result).toEqual([]);
    });

    test('handles fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchArea();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch area:', expect.any(Error));
      expect(result).toEqual([]);
    });
  });
});