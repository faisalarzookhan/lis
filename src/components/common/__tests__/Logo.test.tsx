import React from 'react';
import { render, screen } from '@testing-library/react';
import Logo from '../Logo';

describe('Logo', () => {
  it('renders the company name', () => {
    render(<Logo />);
    const companyName = screen.getByText(/Limitless Infotech/i);
    expect(companyName).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<Logo />);
    const tagline = screen.getByText(/Where Innovation Meets Execution/i);
    expect(tagline).toBeInTheDocument();
  });
});
