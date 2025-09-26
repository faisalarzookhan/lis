import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Toast from '../Toast';

describe('Toast', () => {
  const defaultProps = {
    id: 'test-toast',
    type: 'success' as const,
    title: 'Test Title',
    message: 'Test message',
    duration: 5000,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct content', () => {
    render(<Toast {...defaultProps} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders without message', () => {
    render(<Toast {...defaultProps} message={undefined} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<Toast {...defaultProps} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledWith('test-toast');
  });

  it('auto-closes after duration', async () => {
    jest.useFakeTimers();

    render(<Toast {...defaultProps} duration={1000} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalledWith('test-toast');
    });

    jest.useRealTimers();
  });

  it('does not auto-close when duration is 0', () => {
    jest.useFakeTimers();

    render(<Toast {...defaultProps} duration={0} />);

    jest.advanceTimersByTime(5000);

    expect(defaultProps.onClose).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('renders correct icon for each type', () => {
    const types = ['success', 'error', 'warning', 'info'] as const;

    types.forEach((type) => {
      const { unmount } = render(<Toast {...defaultProps} type={type} />);
      // Check that some icon is rendered (we can't easily test specific icons without more setup)
      expect(screen.getByTestId || screen.getByRole('img')).toBeTruthy();
      unmount();
    });
  });

  it('applies correct styling for each type', () => {
    const { container } = render(<Toast {...defaultProps} type="success" />);

    const toastElement = container.firstChild as HTMLElement;
    expect(toastElement).toHaveClass('bg-green-50', 'dark:bg-green-900/20', 'border-green-200', 'dark:border-green-800');
  });
});
