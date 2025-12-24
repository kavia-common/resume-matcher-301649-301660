import { render, screen } from '@testing-library/react';
import App from './App';
import ResultsCard from './components/ResultsCard';

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

test('ResultsCard renders object errors as readable text, not [object Object]', () => {
  const fakeErr = { message: 'Bad Request', code: 'BAD_REQ', info: { reason: 'invalid file' } };
  render(<ResultsCard loading={false} error={fakeErr} data={null} />);
  expect(screen.getByRole('alert')).toHaveTextContent('Bad Request');
  expect(screen.getByRole('alert').textContent).not.toContain('[object Object]');
});
