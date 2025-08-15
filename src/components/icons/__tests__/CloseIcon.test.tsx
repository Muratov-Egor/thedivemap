import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CloseIcon from '../CloseIcon';

describe('CloseIcon', () => {
  it('рендерит иконку с дефолтными классами', () => {
    const { container } = render(<CloseIcon />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-5', 'h-5');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('рендерит иконку с кастомными классами', () => {
    const { container } = render(<CloseIcon className="custom-class w-6 h-6" />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('custom-class', 'w-6', 'h-6');
    expect(svg).not.toHaveClass('w-5', 'h-5');
  });

  it('содержит правильный path элемент', () => {
    const { container } = render(<CloseIcon />);
    const path = container.querySelector('path');

    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute('stroke-linecap', 'round');
    expect(path).toHaveAttribute('stroke-linejoin', 'round');
    expect(path).toHaveAttribute('stroke-width', '2');
    expect(path).toHaveAttribute('d', 'M6 18L18 6M6 6l12 12');
  });

  it('рендерит без className', () => {
    const { container } = render(<CloseIcon className="" />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).not.toHaveClass('w-5', 'h-5');
  });

  it('рендерит с undefined className', () => {
    const { container } = render(<CloseIcon className={undefined} />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-5', 'h-5'); // использует дефолтное значение
  });
});
