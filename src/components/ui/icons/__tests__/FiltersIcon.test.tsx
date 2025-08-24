import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import FiltersIcon from '../FiltersIcon';

describe('FiltersIcon', () => {
  it('рендерит иконку с дефолтными классами', () => {
    const { container } = render(<FiltersIcon />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-5', 'h-5');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('рендерит иконку с кастомными классами', () => {
    const { container } = render(<FiltersIcon className="custom-class w-6 h-6" />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('custom-class', 'w-6', 'h-6');
    expect(svg).not.toHaveClass('w-5', 'h-5');
  });

  it('содержит правильный path элемент', () => {
    const { container } = render(<FiltersIcon />);
    const path = container.querySelector('path');

    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute('stroke-linecap', 'round');
    expect(path).toHaveAttribute('stroke-linejoin', 'round');
    expect(path).toHaveAttribute('stroke-width', '2');
    expect(path).toHaveAttribute(
      'd',
      'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z',
    );
  });

  it('рендерит без className', () => {
    const { container } = render(<FiltersIcon className="" />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).not.toHaveClass('w-5', 'h-5');
  });

  it('рендерит с undefined className', () => {
    const { container } = render(<FiltersIcon className={undefined} />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-5', 'h-5'); // использует дефолтное значение
  });
});
