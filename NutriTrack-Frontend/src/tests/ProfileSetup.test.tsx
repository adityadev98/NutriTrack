// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import ProfileSetup from '../Pages/ProfileSetup';
// import axios from 'axios';
// import '@testing-library/jest-dom';

// // Mock axios to prevent actual API calls
// jest.mock('axios');
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// jest.mock('axios', () => ({
//   create: jest.fn(() => ({
//     interceptors: {
//       request: {
//         use: jest.fn(),
//       },
//     },
//   })),
// }));

// describe('Profile Setup Page', () => {
//   test('renders the form correctly', () => {
//     render(
//       <MemoryRouter>
//         <ProfileSetup />
//       </MemoryRouter>
//     );

//     // Check if the form elements are present
//     expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Activity Level/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Height/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Weight/i)).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
//   });

//   test('allows user to fill out the form', () => {
//     render(
//       <MemoryRouter>
//         <ProfileSetup />
//       </MemoryRouter>
//     );

//     const nameInput = screen.getByLabelText(/Name/i);
//     fireEvent.change(nameInput, { target: { value: 'John Doe' } });
//     expect(nameInput).toHaveValue('John Doe');

//     const ageInput = screen.getByLabelText(/Age/i);
//     fireEvent.change(ageInput, { target: { value: 25 } });
//     expect(ageInput).toHaveValue(25);
//   });

//   test('submits form with correct data', async () => {
//     render(
//       <MemoryRouter>
//         <ProfileSetup />
//       </MemoryRouter>
//     );

//     // Mock API response
//     mockedAxios.post.mockResolvedValue({ data: { success: true } });

//     // Fill out the form
//     fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Jane Doe' } });
//     fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: 30 } });
//     fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'female' } });
//     fireEvent.change(screen.getByLabelText(/Activity Level/i), { target: { value: 'moderate' } });
//     fireEvent.change(screen.getByLabelText(/Height/i), { target: { value: 170 } });
//     fireEvent.change(screen.getByLabelText(/Weight/i), { target: { value: 65 } });

//     // Click the submit button
//     fireEvent.click(screen.getByRole('button', { name: /save/i }));

//     // Ensure axios was called with correct data
//     await waitFor(() => {
//       expect(mockedAxios.post).toHaveBeenCalledWith(
//         '/api/user/profile/setup',
//         {
//           name: 'Jane Doe',
//           age: 30,
//           gender: 'female',
//           activityLevel: 'moderate',
//           height: 170,
//           weight: 65
//         },
//         { headers: { Authorization: expect.any(String) } }
//       );
//     });
//   });
// });


import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfileSetup from '../Pages/ProfileSetup';
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock axiosInstance
//"c:/Users/Karan Arora/Desktop/NutriTrack/NutriTrack/NutriTrack-Frontend/src/utils/axiosInstance"
jest.mock('../utils/axiosInstance', () => ({
  default: {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    post: jest.fn().mockResolvedValue({ data: { success: true } }),
  },
}));



describe('Profile Setup Page', () => {
  test('renders the form correctly', () => {
    render(
      <MemoryRouter>
        <ProfileSetup />
      </MemoryRouter>
    );

    // Check if the form elements are present
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Activity Level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Height/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Weight/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  test('submits form with correct data', async () => {
    render(
      <MemoryRouter>
        <ProfileSetup />
      </MemoryRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: 30 } });
    fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'female' } });
    fireEvent.change(screen.getByLabelText(/Activity Level/i), { target: { value: 'moderate' } });
    fireEvent.change(screen.getByLabelText(/Height/i), { target: { value: 170 } });
    fireEvent.change(screen.getByLabelText(/Weight/i), { target: { value: 65 } });

    // Click the submit button
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Ensure axios was called with correct data
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        '/api/user/profile/setup',
        {
          name: 'Jane Doe',
          age: 30,
          gender: 'female',
          activityLevel: 'moderate',
          height: 170,
          weight: 65
        },
        { headers: { Authorization: expect.any(String) } }
      );
    });
  });
});
