import React from 'react';
import { render } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders without crashing', () => {
    const { container } = render(<LoadingSpinner />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('has correct structure', () => {
    const { container } = render(<LoadingSpinner />);

    const spinnerContainer = container.firstChild;
    expect(spinnerContainer).toHaveClass('flex', 'justify-center', 'items-center', 'py-20');

    const spinner = spinnerContainer?.firstChild;
    expect(spinner).toBeInTheDocument();
  });
});
