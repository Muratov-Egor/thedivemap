import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Chip from '../Chip';

describe('Chip', () => {
  it('renders with default props', () => {
    render(<Chip>Test Chip</Chip>);
    expect(screen.getByRole('button', { name: /test chip/i })).toBeInTheDocument();
  });

  it('renders in selected state', () => {
    render(<Chip selected>Selected Chip</Chip>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders in unselected state', () => {
    render(<Chip>Unselected Chip</Chip>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Chip onClick={handleClick}>Clickable</Chip>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct styles for selected state', () => {
    render(<Chip selected>Selected</Chip>);
    expect(screen.getByRole('button')).toHaveClass(
      'bg-pastel-blue',
      'border-outline-purple',
      'text-outline-purple',
    );
  });

  it('applies correct styles for unselected state', () => {
    render(<Chip>Unselected</Chip>);
    expect(screen.getByRole('button')).toHaveClass(
      'bg-background',
      'border-outline-purple/40',
      'text-slate-700',
      'dark:text-white',
    );
  });

  it('renders with icon only', () => {
    const icon = <span data-testid="icon">🚀</span>;
    render(<Chip icon={icon} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders with icon and text', () => {
    const icon = <span data-testid="icon">🚀</span>;
    render(<Chip icon={icon}>With Icon</Chip>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('renders with icon on right', () => {
    const icon = <span data-testid="icon">🚀</span>;
    render(
      <Chip icon={icon} iconPosition="right">
        With Icon Right
      </Chip>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon Right')).toBeInTheDocument();
  });

  it('renders with text only when no icon provided', () => {
    render(<Chip>Text Only</Chip>);
    expect(screen.getByText('Text Only')).toBeInTheDocument();
  });

  it('renders with default variant', () => {
    render(<Chip variant="default">Default</Chip>);
    expect(screen.getByRole('button')).toHaveClass(
      'bg-background',
      'border-outline-purple/40',
      'text-slate-700',
      'dark:text-white',
    );
  });

  it('renders with subtle variant', () => {
    render(<Chip variant="subtle">Subtle</Chip>);
    expect(screen.getByRole('button')).toHaveClass(
      'bg-background',
      'border-outline-purple/30',
      'text-slate-600',
      'dark:text-white/90',
    );
  });

  it('applies correct styles for subtle variant when selected', () => {
    render(
      <Chip variant="subtle" selected>
        Subtle Selected
      </Chip>,
    );
    expect(screen.getByRole('button')).toHaveClass(
      'bg-pastel-blue/60',
      'border-outline-purple',
      'text-outline-purple',
    );
  });
});
