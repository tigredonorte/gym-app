import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { PersistentAlert } from './PersistentAlert';

describe('PersistentAlert Component', () => {
  it('renders correctly with required props', () => {
    render(<PersistentAlert message="Test message" severity="info" />);

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('displays title when provided', () => {
    render(<PersistentAlert message="Test message" severity="success" title="Test Title" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInstanceOf(HTMLDivElement);
  });

  it('applies custom styles (sx prop)', () => {
    render(<PersistentAlert message="Test message" severity="warning" sx={{ marginTop: '20px' }} />);

    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveStyle('margin-top: 20px');
  });

  it('passes additional alertProps to the Alert component', () => {
    render(<PersistentAlert message="Test message" severity="error" alertProps={{ role: 'status' }} />);

    const alertElement = screen.getByRole('status');
    expect(alertElement).toBeInTheDocument();
  });

  it('does not display title when not provided', () => {
    render(<PersistentAlert message="Test message" severity="info" />);
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });
});
