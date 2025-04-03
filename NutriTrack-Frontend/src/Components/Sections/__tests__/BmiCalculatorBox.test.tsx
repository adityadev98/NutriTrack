import { render, screen, fireEvent } from '@testing-library/react';
import BmiCalculatorBox from '../HomepageSections/BmiCalculatorBox'; 
import '@testing-library/jest-dom';

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    ...originalModule,
    Slider: ({ value, onChange, min, max }: { value: number; onChange: (value: number) => void; min: number; max: number }) => (
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        data-testid="slider"
      />
    ),
    SliderTrack: () => <div data-testid="slider-track" />,
    SliderFilledTrack: () => <div data-testid="slider-filled" />,
    SliderThumb: () => <div data-testid="slider-thumb" />,
  };
});

describe('BmiCalculatorBox', () => {
  test('renders with initial values', () => {
    render(<BmiCalculatorBox />);
    
    expect(screen.getByText('CHECK YOUR BMI')).toBeInTheDocument();
    expect(screen.getByText('Height (cm)')).toBeInTheDocument();
    expect(screen.getByText('170 cm')).toBeInTheDocument();
    expect(screen.getByText('Weight (kg)')).toBeInTheDocument();
    expect(screen.getByText('70 kg')).toBeInTheDocument();
    expect(screen.getByText('Your BMI')).toBeInTheDocument();
    expect(screen.getByText('24.2')).toBeInTheDocument();
    expect(screen.getByText('Great going! You are in a healthy BMI range.')).toBeInTheDocument();
  });

  test('calculates BMI and shows correct feedback for underweight', () => {
    render(<BmiCalculatorBox />);
    
    const sliders = screen.getAllByTestId('slider');
    const heightSlider = sliders[0];
    const weightSlider = sliders[1];
    
    fireEvent.change(heightSlider, { target: { value: '170' } });
    fireEvent.change(weightSlider, { target: { value: '50' } });
    
    expect(screen.getByText('17.3')).toBeInTheDocument();
    expect(screen.getByText('You are underweight. Consider a balanced diet.')).toBeInTheDocument();
  });

  test('calculates BMI and shows correct feedback for overweight', () => {
    render(<BmiCalculatorBox />);
    
    const sliders = screen.getAllByTestId('slider');
    const heightSlider = sliders[0];
    const weightSlider = sliders[1];
    
    fireEvent.change(heightSlider, { target: { value: '170' } });
    fireEvent.change(weightSlider, { target: { value: '80' } });
    
    expect(screen.getByText('27.7')).toBeInTheDocument();
    expect(screen.getByText('You are overweight. Consider some lifestyle changes.')).toBeInTheDocument();
  });

  test('calculates BMI and shows correct feedback for obese', () => {
    render(<BmiCalculatorBox />);
    
    const sliders = screen.getAllByTestId('slider');
    const heightSlider = sliders[0];
    const weightSlider = sliders[1];
    
    fireEvent.change(heightSlider, { target: { value: '170' } });
    fireEvent.change(weightSlider, { target: { value: '100' } });
    
    expect(screen.getByText('34.6')).toBeInTheDocument();
    expect(screen.getByText('You are in the obese category. Please consult a health professional.')).toBeInTheDocument();
  });
});