import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MealsConsumedPage from '../CustomerPages/MealConsumedPage';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

const mockMeals = [
  {
    foodName: 'banana',
    eatenWhen: 'breakfast',
    details: {
      calories: 100,
      protein: 1,
      carbohydrates: 27,
      fat: 0.3,
      fiber: 3,
    },
  },
  {
    foodName: 'apple',
    eatenWhen: 'lunch',
    details: {
      calories: 95,
      protein: 0.5,
      carbohydrates: 25,
      fat: 0.3,
      fiber: 4,
    },
  },
];

describe('MealsConsumedPage', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('renders loading state', () => {
    fetchMock.mockResponseOnce(() => new Promise(() => {})); // Never resolves
    render(
      <MemoryRouter>
        <MealsConsumedPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading meals.../i)).toBeInTheDocument();
  });

  it('renders error state', async () => {
    fetchMock.mockRejectOnce(new Error('Error fetching meals data'));
    render(
      <MemoryRouter>
        <MealsConsumedPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No meals tracked today/i)).toBeInTheDocument();
    });
  });

  it('renders meals', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockMeals }));
    render(
      <MemoryRouter>
        <MealsConsumedPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Meals Consumed Today/i)).toBeInTheDocument();
      expect(screen.getByText(/Banana/i)).toBeInTheDocument();
      expect(screen.getByText(/Apple/i)).toBeInTheDocument();
      expect(screen.getByText(/Calories: 100/i)).toBeInTheDocument();
      expect(screen.getByText(/Calories: 95/i)).toBeInTheDocument();
    });
  });

  it('renders total nutrients', async () => {
    const mockMeals = [
        {
          foodName: 'banana',
          eatenWhen: 'breakfast',
          details: {
            calories: 100,
            protein: 1,
            carbohydrates: 27,
            fat: 0.3,
            fiber: 3,
          },
        },
        {
          foodName: 'apple',
          eatenWhen: 'lunch',
          details: {
            calories: 95,
            protein: 0.5,
            carbohydrates: 25,
            fat: 0.3,
            fiber: 4,
          },
        },
      ];
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockMeals }));
    render(
      <MemoryRouter>
        <MealsConsumedPage />
      </MemoryRouter>
    );
    await waitFor(() => {
        expect(screen.getByText((_, element) => {
            return element?.textContent === 'Total Nutrients';
          })).toBeInTheDocument();
          expect(screen.getByText((_, element) => {
            return element?.textContent === 'Total Calories';
          })).toBeInTheDocument();
          expect(screen.getByText('195')).toBeInTheDocument(); // 100 + 95
          expect(screen.getByText((_, element) => {
            return element?.textContent === 'Total Protein';
          })).toBeInTheDocument();
          expect(screen.getByText('1.5g')).toBeInTheDocument(); // 1 + 0.5
          expect(screen.getByText((_, element) => {
            return element?.textContent === 'Total Carbohydrates';
          })).toBeInTheDocument();
          expect(screen.getByText('52g')).toBeInTheDocument(); // 27 + 25
          expect(screen.getByText((_, element) => {
            return element?.textContent === 'Total Fat';
          })).toBeInTheDocument();
          expect(screen.getByText('0.6g')).toBeInTheDocument(); // 0.3 + 0.3
          expect(screen.getByText((_, element) => {
            return element?.textContent === 'Total Fiber';
          })).toBeInTheDocument();
          expect(screen.getByText('7g')).toBeInTheDocument(); // 3 + 4
    });
  });
//   it('navigates to track page on Search Food button click', async () => {
//     await act(async () => {
//       render(
//         <MemoryRouter initialEntries={['/mealsConsumed']}>
//           <MealsConsumedPage />
//         </MemoryRouter>
//       );
//     });
//     fireEvent.click(screen.getByTestId('search-food'));
//     // fireEvent.click(screen.getByRole('button', { name: /Search Food/i }));
//     expect(window.location.pathname).toBe('/track');
//   });

//   it('navigates to custom food page on Add Your Own Meal button click', async () => {
//     await act(async () => {
//       render(
//         <MemoryRouter initialEntries={['/mealsConsumed']}>
//           <MealsConsumedPage />
//         </MemoryRouter>
//       );
//     });
//     fireEvent.click(screen.getByTestId('Add-Your-Own-Meal'));
//     fireEvent.click(screen.getByRole('button', { name: /Add Your Own Meal/i }));
//     expect(window.location.pathname).toBe('/customFood');
//   });
});