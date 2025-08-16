import React from 'react';
import { render, screen } from '@testing-library/react';
import SiteTypeIcon from '../SiteTypeIcon';

describe('SiteTypeIcon', () => {
  it('renders reef icon for site type id 1', () => {
    render(<SiteTypeIcon siteTypeId={1} />);
    const svg = screen.getByTestId('site-type-icon');
    expect(svg).toBeInTheDocument();
  });

  it('renders wreck icon for site type id 2', () => {
    render(<SiteTypeIcon siteTypeId={2} />);
    const svg = screen.getByTestId('site-type-icon');
    expect(svg).toBeInTheDocument();
  });

  it('renders cave icon for site type id 3', () => {
    render(<SiteTypeIcon siteTypeId={3} />);
    const svg = screen.getByTestId('site-type-icon');
    expect(svg).toBeInTheDocument();
  });

  it('renders bay icon for site type id 4', () => {
    render(<SiteTypeIcon siteTypeId={4} />);
    const svg = screen.getByTestId('site-type-icon');
    expect(svg).toBeInTheDocument();
  });

  it('renders wall icon for site type id 5', () => {
    render(<SiteTypeIcon siteTypeId={5} />);
    const svg = screen.getByTestId('site-type-icon');
    expect(svg).toBeInTheDocument();
  });

  it('renders artificial reef icon for site type id 6', () => {
    render(<SiteTypeIcon siteTypeId={6} />);
    const svg = screen.getByTestId('site-type-icon');
    expect(svg).toBeInTheDocument();
  });

  it('renders pinnacle icon for site type id 9', () => {
    render(<SiteTypeIcon siteTypeId={9} />);
    const svg = screen.getByTestId('site-type-icon');
    expect(svg).toBeInTheDocument();
  });

  it('renders coral garden icon for site type id 10', () => {
    render(<SiteTypeIcon siteTypeId={10} />);
    const svg = screen.getByTestId('site-type-icon');
    expect(svg).toBeInTheDocument();
  });

  it('renders lake icon for site type id 11', () => {
    render(<SiteTypeIcon siteTypeId={11} />);
    const svg = screen.getByTestId('site-type-icon');
    expect(svg).toBeInTheDocument();
  });

  it('renders default icon for site type id 12', () => {
    render(<SiteTypeIcon siteTypeId={12} />);
    const svg = screen.getByTestId('site-type-icon');
    expect(svg).toBeInTheDocument();
  });

  it('renders default icon for unknown site type id', () => {
    render(<SiteTypeIcon siteTypeId={999} />);
    const svg = screen.getByTestId('site-type-icon');
    expect(svg).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<SiteTypeIcon siteTypeId={1} className="w-6 h-6" />);
    const icon = screen.getByTestId('site-type-icon');
    expect(icon).toHaveClass('w-6 h-6');
  });

  it('uses default className when not provided', () => {
    render(<SiteTypeIcon siteTypeId={1} />);
    const icon = screen.getByTestId('site-type-icon');
    expect(icon).toHaveClass('w-4 h-4');
  });

  it('renders correct emoji for each site type', () => {
    const { rerender } = render(<SiteTypeIcon siteTypeId={1} />);
    expect(screen.getByText('🪸')).toBeInTheDocument();

    rerender(<SiteTypeIcon siteTypeId={2} />);
    expect(screen.getByText('🚢')).toBeInTheDocument();

    rerender(<SiteTypeIcon siteTypeId={3} />);
    expect(screen.getByText('🕳️')).toBeInTheDocument();

    rerender(<SiteTypeIcon siteTypeId={4} />);
    expect(screen.getByText('🌊')).toBeInTheDocument();

    rerender(<SiteTypeIcon siteTypeId={5} />);
    expect(screen.getByText('🏔️')).toBeInTheDocument();

    rerender(<SiteTypeIcon siteTypeId={6} />);
    expect(screen.getByText('🏗️')).toBeInTheDocument();

    rerender(<SiteTypeIcon siteTypeId={9} />);
    expect(screen.getByText('🗻')).toBeInTheDocument();

    rerender(<SiteTypeIcon siteTypeId={10} />);
    expect(screen.getByText('🌸')).toBeInTheDocument();

    rerender(<SiteTypeIcon siteTypeId={11} />);
    expect(screen.getByText('🏞️')).toBeInTheDocument();

    rerender(<SiteTypeIcon siteTypeId={12} />);
    expect(screen.getByText('📍')).toBeInTheDocument();
  });
});
