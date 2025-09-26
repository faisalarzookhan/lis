import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error
const ErrorComponent = () => {
  throw new Error('Test error');
  return <div>Should not render</div>;
};

// Component that doesn't throw
const SafeComponent = () => <div>Safe component</div>;

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Clear any console.error calls from previous tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe component')).toBeInTheDocument();
  });

  it('renders fallback UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('We apologize for the inconvenience. An unexpected error occurred.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('shows error details in development mode', () => {
    // Mock NODE_ENV to be 'development'
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error details (development only)')).toBeInTheDocument();
    expect(screen.getByText(/Test error/)).toBeInTheDocument();

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalEnv;
  });

  it('does not show error details in production mode', () => {
    // Mock NODE_ENV to be 'production'
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Error details (development only)')).not.toBeInTheDocument();

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalEnv;
  });

  it('retries when try again button is clicked', () => {
    let throwCount = 0;

    const RetryErrorComponent = () => {
      throwCount++;
      if (throwCount === 1) {
        throw new Error('Test error');
      }
      return <div>Safe component</div>;
    };

    render(
      <ErrorBoundary>
        <RetryErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Click retry button
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));

    expect(screen.getByText('Safe component')).toBeInTheDocument();
  });

  it('logs errors to console', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Uncaught error:',
      expect.any(Error),
      expect.any(Object)
    );

    consoleSpy.mockRestore();
  });
});
