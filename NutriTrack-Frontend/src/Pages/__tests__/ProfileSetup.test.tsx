import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfileSetup from '../CustomerPages/ProfileSetup';

jest.mock('../../utils/env', () => ({
  BACKEND_URL: 'http://localhost:5000',
}));

describe('ProfileSetup', () => {
  test('renders ProfileSetup form', () => {
    render(
      <BrowserRouter>
        <ProfileSetup />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age \(years\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Activity Level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Height \(cm\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Weight \(kg\)/i)).toBeInTheDocument();
  });

  test('allows user to fill out the form', () => {
    render(
      <BrowserRouter>
        <ProfileSetup />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Age \(years\)/i), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'male' } });
    fireEvent.change(screen.getByLabelText(/Activity Level/i), { target: { value: 'moderate' } });
    fireEvent.change(screen.getByLabelText(/Height \(cm\)/i), { target: { value: '180' } });
    fireEvent.change(screen.getByLabelText(/Weight \(kg\)/i), { target: { value: '75' } });

    expect(screen.getByLabelText(/Name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/Age \(years\)/i)).toHaveValue(30);
    expect(screen.getByLabelText(/Gender/i)).toHaveValue('male');
    expect(screen.getByLabelText(/Activity Level/i)).toHaveValue('moderate');
    expect(screen.getByLabelText(/Height \(cm\)/i)).toHaveValue(180);
    expect(screen.getByLabelText(/Weight \(kg\)/i)).toHaveValue(75);
  });

  test('submits the form', () => {
    render(
      <BrowserRouter>
        <ProfileSetup />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Age \(years\)/i), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'male' } });
    fireEvent.change(screen.getByLabelText(/Activity Level/i), { target: { value: 'moderate' } });
    fireEvent.change(screen.getByLabelText(/Height \(cm\)/i), { target: { value: '180' } });
    fireEvent.change(screen.getByLabelText(/Weight \(kg\)/i), { target: { value: '75' } });

    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    // Add your assertions here to check if the form submission was successful
    // For example, you can mock the axios.post call and check if it was called with the correct data
  });
  

  // test('shows validation errors when submitting an empty form', async () => {
  //   render(
  //     <BrowserRouter>
  //       <ProfileSetup />
  //     </BrowserRouter>
  //   );
  
  //   fireEvent.click(screen.getByRole('button', { name: /Save/i }));
  
  //   expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
  //   // expect(await screen.findByText(/Age is required/i)).toBeInTheDocument();
  //   // expect(await screen.findByText(/Gender is required/i)).toBeInTheDocument();
  //   // expect(await screen.findByText(/Activity Level is required/i)).toBeInTheDocument();
  //   // expect(await screen.findByText(/Height is required/i)).toBeInTheDocument();
  //   // expect(await screen.findByText(/Weight is required/i)).toBeInTheDocument();
  // });

  

});