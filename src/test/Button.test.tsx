import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../../components/common/Button';

describe('Button Component', () => {
  it('renders correctly with default solid variant', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('renders correctly with each variant', () => {
    const variants: Array<'solid' | 'glass' | 'ghost' | 'primary' | 'secondary' | 'danger'> = [
      'solid',
      'glass',
      'ghost',
      'primary',
      'secondary',
      'danger',
    ];

    variants.forEach((variant) => {
      const { unmount } = render(
        <Button variant={variant}>Variant {variant}</Button>
      );
      const button = screen.getByRole('button', { name: new RegExp(`Variant ${variant}`, 'i') });
      expect(button).toBeInTheDocument();
      unmount();
    });
  });

  it('handles click events properly', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);

    const button = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
