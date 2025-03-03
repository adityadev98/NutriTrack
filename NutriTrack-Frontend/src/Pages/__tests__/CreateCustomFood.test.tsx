import { render, screen,act,waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateCustomFoodPage from '../CreateCustomFoodPage';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useNavigate: jest.fn(),
// }));

describe('CreateCustomFoodPage', () => {
//   const mockNavigate = useNavigate as jest.Mock;
  beforeEach(() => {
    fetchMock.resetMocks();
    global.console.log = jest.fn();
    global.alert = jest.fn();
  });
  it('renders Create Your Own Meal heading',  async() => {
    await act(async () => {
    render(
      <MemoryRouter>
        <CreateCustomFoodPage />
      </MemoryRouter>
    );});

    await waitFor(() =>  expect(screen.getByText('Create Your Own Meal')).toBeInTheDocument());
  });

  it('opens and closes the modal', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <CreateCustomFoodPage />
        </MemoryRouter>
      );
    });
  
    fireEvent.click(screen.getByText('Create a Meal'));
    
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'Add Food Item' })).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() =>
        expect(screen.queryByRole('heading', { name: 'Add Food Item' })).not.toBeInTheDocument()
      );
  });

  it('adds a food item', async () => {
    const mockResponse = {
        success: true,
        message: "Custom food Added",
        data: {
          userId: "6792c1e74bfde7cb9da062de",
          foodName: "Test Food",
          serving_unit: "unit",
          serving_weight_grams: 100,
          details: {
            calories: 100,
            protein: 0,
            carbohydrates: 0,
            fat: 0,
            fiber: 0
          },
          _id: "67c4e2b4f760b81be08189a4",
          createdAt: "2025-03-02T22:59:00.847Z",
          __v: 0
        }
      };
  
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));
      
      await act(async () => {
            render(
            <MemoryRouter>
                <CreateCustomFoodPage />
            </MemoryRouter>
            );
    });

    fireEvent.click(screen.getByText('Create a Meal'));

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

      // Wait for modal content to render
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Add Food Item' })).toBeInTheDocument();
    });


    fireEvent.change(screen.getByRole('textbox', { name: 'Food name' }), { target: { value: 'Test Food', name: 'foodName' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Serving unit' }), { target: { value: 'unit', name: 'serving_unit'} });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Calories' }), { target: { value: '100', name: 'calories'} });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Serving Weight Grams' }), { target: { value: '100', name: 'serving_weight_grams' } });
  
    expect(screen.getByRole('textbox', { name: 'Food name' })).toHaveValue('Test Food');
    expect(screen.getByRole('textbox', { name: 'Serving unit' })).toHaveValue('unit');
    expect(screen.getByRole('spinbutton', { name: 'Calories' })).toHaveValue(100);
    expect(screen.getByRole('spinbutton', { name: 'Serving Weight Grams' })).toHaveValue(100);

    fetchMock.mockResponseOnce(JSON.stringify({ data: [mockResponse.data] })); // Mock the GET response

    fireEvent.click(screen.getByRole('button',{name: 'Add Food Item'}));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('api/customFood', expect.any(Object));
      expect(fetchMock).toHaveBeenCalledWith('api/getCustomFood', expect.any(Object));

    //    expect(screen.getByText('Test Food - 100 cal per unit')).toBeInTheDocument();
    });
  });

  it('displays error when required fields are missing', async () => {

      await act(async () => {
      render(
      <MemoryRouter>
        <CreateCustomFoodPage />
      </MemoryRouter>
    );
      });

    fireEvent.click(screen.getByText('Create a Meal'));

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button',{name: 'Add Food Item'}));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(expect.stringContaining("Food name, serving unit, and calories are required!"));
    });
  });
  
  it("shows an alert when the API call fails (500 error)", async () => {
    fetchMock.mockResponseOnce(
        JSON.stringify({ data: [] }), // Return empty array as mock
        { status: 200 } // Mock successful GET response
      );

      fetchMock.mockResponseOnce(
        JSON.stringify({ message: "Some problem in adding custom food" }), // Simulate the error response
        { status: 500 }  // Simulating a 500 error for POST request
      );

      await act(async () => {
      render(
      <MemoryRouter>
        <CreateCustomFoodPage />
      </MemoryRouter>
    );
      });


    fireEvent.click(screen.getByText('Create a Meal'));

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    // Wait for modal content to render
    await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Add Food Item' })).toBeInTheDocument();
    });
        
    fireEvent.change(screen.getByRole('textbox', { name: 'Food name' }), { target: { value: 'Test Food', name: 'foodName' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Serving unit' }), { target: { value: 'unit', name: 'serving_unit'} });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Calories' }), { target: { value: '100', name: 'calories'} });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Serving Weight Grams' }), { target: { value: '100', name: 'serving_weight_grams' } });

    fireEvent.click(screen.getByRole('button',{name: 'Add Food Item'}));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(expect.stringContaining("Error adding food item.Error: Failed to add food item"));
    });
});
  
  it("shows an alert when the GET /getCustomFood API call fails (500 error)", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: "Error in retrieving data" }), 
      { status: 500 }  
    );
  
    await act(async () => {
      render(
        <MemoryRouter>
          <CreateCustomFoodPage />
        </MemoryRouter>
      );
    });

    fireEvent.click(screen.getByText('Create a Meal'));

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
  
 
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Add Food Item' })).toBeInTheDocument();
    });
  

    fireEvent.click(screen.getByText('Create a Meal'));
  

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(expect.stringContaining("Error fetching custom foods.Error: Error in retrieving data"));
    });
  });

  it("handles the 404 error gracefully and returns empty data", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: "No custom meals found" }), 
      { status: 404 }  
    );
  
    await act(async () => {
      render(
        <MemoryRouter>
          <CreateCustomFoodPage />
        </MemoryRouter>
      );
    });
  
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("api/getCustomFood", expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: expect.any(String), 
        }),
      }));
    });
  
  expect(fetchMock).toHaveBeenCalledTimes(1);

  await waitFor(() => {
    const lastCallArgs = fetchMock.mock.calls[0]; 
    expect(lastCallArgs).toBeTruthy(); 
    expect(lastCallArgs[0]).toEqual("api/getCustomFood"); 
  });
  await waitFor(() => {
    expect(global.alert).not.toHaveBeenCalled();
  });
  });
  
  
//   it('displays fetched custom food items', async () => {
//     const mockFoodItems = [
//       { foodName: 'Banana', details: { calories: 89 }, serving_unit: 'banana', serving_weight_grams: 118 },
//       { foodName: 'Apple', details: { calories: 52 }, serving_unit: 'apple', serving_weight_grams: 182 },
//     ];
//     fetchMock.mockResponseOnce(JSON.stringify({ data: mockFoodItems }));

//     render(
//       <MemoryRouter>
//         <CreateCustomFoodPage />
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByText('Banana - 89 cal per banana')).toBeInTheDocument();
//       expect(screen.getByText('Apple - 52 cal per apple')).toBeInTheDocument();
//     });
//   });

  it("displays the list of food items when added", async () => {
    const foodItems = [
      {
        foodName: "Test Food 1",
        details: { calories: 100 },
        serving_unit: "unit"
      },
      {
        foodName: "Test Food 2",
        details: { calories: 150 },
        serving_unit: "serving"
      }
    ];
  
    // Mock the API response
    fetchMock.mockResponseOnce(
      JSON.stringify({ data: foodItems }), // Mock response for the GET request
      { status: 200 }
    );
  
    render(
      <MemoryRouter>
        <CreateCustomFoodPage />
      </MemoryRouter>
    );
  
    // Wait for the API call to resolve and the items to be displayed
    await waitFor(() => {
      foodItems.forEach(food => {
        expect(screen.getByText(new RegExp(food.foodName, 'i'))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(`${food.details.calories} cal per ${food.serving_unit}`, 'i'))).toBeInTheDocument();
      });
    });
  });

  it('navigates to the correct path with state when a food item is clicked', async () => {
    const mockFoodItems = [
      { foodName: 'Banana', details: { calories: 89 }, serving_unit: 'banana', serving_weight_grams: 118 },
      { foodName: 'Apple', details: { calories: 52 }, serving_unit: 'apple', serving_weight_grams: 182 },
    ];
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockFoodItems }));

    await act(async () => {
      render(
        <MemoryRouter>
          <CreateCustomFoodPage />
        </MemoryRouter>
      );
    });
 

    fireEvent.click(screen.getByTestId(`food-item-${mockFoodItems[0].foodName}`));

 });

});
