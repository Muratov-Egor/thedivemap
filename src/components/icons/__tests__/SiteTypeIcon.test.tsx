import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SiteTypeIcon from '../SiteTypeIcon';

// Мокаем react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('SiteTypeIcon', () => {
  it('renders reef icon for site type id 1', () => {
    render(<SiteTypeIcon siteTypeId={1} />);
    const iconContainer = screen.getByTestId('site-type-icon-reef');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveStyle({ backgroundImage: 'url("/img/Reef.svg")' });
  });

  it('renders wreck icon for site type id 2', () => {
    render(<SiteTypeIcon siteTypeId={2} />);
    const iconContainer = screen.getByTestId('site-type-icon-wreck');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveStyle({ backgroundImage: 'url("/img/Wreck.svg")' });
  });

  it('renders cave icon for site type id 3', () => {
    render(<SiteTypeIcon siteTypeId={3} />);
    const iconContainer = screen.getByTestId('site-type-icon-cave');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveStyle({ backgroundImage: 'url("/img/Cave.svg")' });
  });

  it('renders bay icon for site type id 4', () => {
    render(<SiteTypeIcon siteTypeId={4} />);
    const iconContainer = screen.getByTestId('site-type-icon-bay');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveStyle({ backgroundImage: 'url("/img/Bay.svg")' });
  });

  it('renders wall emoji for site type id 5', () => {
    render(<SiteTypeIcon siteTypeId={5} />);
    const iconContainer = screen.getByTestId('site-type-icon-mark');
    expect(iconContainer).toBeInTheDocument();
  });

  it('renders artificial reef icon for site type id 6', () => {
    render(<SiteTypeIcon siteTypeId={6} />);
    const iconContainer = screen.getByTestId('site-type-icon-artificial-reef');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveStyle({ backgroundImage: 'url("/img/Artificial%20Reef.svg")' });
  });

  it('renders pinnacle icon for site type id 9', () => {
    render(<SiteTypeIcon siteTypeId={9} />);
    const iconContainer = screen.getByTestId('site-type-icon-pinnacle');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveStyle({ backgroundImage: 'url("/img/Pinnacle.svg")' });
  });

  it('renders coral garden icon for site type id 10', () => {
    render(<SiteTypeIcon siteTypeId={10} />);
    const iconContainer = screen.getByTestId('site-type-icon-coral-garden');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveStyle({ backgroundImage: 'url("/img/Coral%20Garden.svg")' });
  });

  it('renders lake icon for site type id 11', () => {
    render(<SiteTypeIcon siteTypeId={11} />);
    const iconContainer = screen.getByTestId('site-type-icon-lake');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveStyle({ backgroundImage: 'url("/img/Lake.svg")' });
  });

  it('renders default icon for site type id 12', () => {
    render(<SiteTypeIcon siteTypeId={12} />);
    const iconContainer = screen.getByTestId('site-type-icon-mark');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveStyle({ backgroundImage: 'url("/img/Mask.svg")' });
  });

  it('renders default icon for unknown site type id', () => {
    render(<SiteTypeIcon siteTypeId={999} />);
    const iconContainer = screen.getByTestId('site-type-icon-mark');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveStyle({ backgroundImage: 'url("/img/Mask.svg")' });
  });

  it('applies custom className', () => {
    render(<SiteTypeIcon siteTypeId={1} className="w-6 h-6" />);
    const iconContainer = screen.getByTestId('site-type-icon-reef');
    expect(iconContainer).toHaveClass('w-6 h-6');
  });

  it('uses default className when not provided', () => {
    render(<SiteTypeIcon siteTypeId={1} />);
    const iconContainer = screen.getByTestId('site-type-icon-reef');
    expect(iconContainer).toHaveClass('w-4 h-4');
  });
});
