import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header brand', () => {
  render(<App />);
  const brand = screen.getByText(/ATS Resume Matcher/i);
  expect(brand).toBeInTheDocument();
});

test('renders inputs and results areas', () => {
  render(<App />);
  expect(screen.getByText(/Resume Upload/i)).toBeInTheDocument();
  expect(screen.getByText(/Job Description/i)).toBeInTheDocument();
  expect(screen.getByText(/Results/i)).toBeInTheDocument();
});
