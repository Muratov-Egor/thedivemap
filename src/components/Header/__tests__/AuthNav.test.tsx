import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import AuthNav from '../AuthNav';
import { useAccordion } from '@/hooks/useAccordion';

// Мокаем зависимости
jest.mock('next/navigation');
jest.mock('@/hooks/useMediaQuery');
jest.mock('@/hooks/useAccordion');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'header.profile': 'Профиль',
        'header.logbook': 'Мой лог-бук',
        'header.logout': 'Выйти',
      };
      return translations[key] || key;
    },
  }),
}));

const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
};

const mockOnLogout = jest.fn();
const mockRouter = {
  push: jest.fn(),
};

describe('AuthNav', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAccordion as jest.Mock).mockReturnValue({
      close: jest.fn(),
    });
  });

  describe('Desktop version', () => {
    beforeEach(() => {
      const { useIsMobile } = require('@/hooks/useMediaQuery');
      useIsMobile.mockReturnValue(false);
    });

    it('рендерит кнопку с именем пользователя', () => {
      render(<AuthNav user={mockUser} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('открывает выпадающее меню при клике', () => {
      render(<AuthNav user={mockUser} onLogout={mockOnLogout} />);
      
      fireEvent.click(screen.getByText('Test User'));
      
      expect(screen.getByText('Профиль')).toBeInTheDocument();
      expect(screen.getByText('Мой лог-бук')).toBeInTheDocument();
      expect(screen.getByText('Выйти')).toBeInTheDocument();
    });

    it('навигарует к профилю при клике на "Профиль"', () => {
      render(<AuthNav user={mockUser} onLogout={mockOnLogout} />);
      
      fireEvent.click(screen.getByText('Test User'));
      fireEvent.click(screen.getByText('Профиль'));
      
      expect(mockRouter.push).toHaveBeenCalledWith('/profile');
    });

    it('навигарует к лог-буку при клике на "Мой лог-бук"', () => {
      render(<AuthNav user={mockUser} onLogout={mockOnLogout} />);
      
      fireEvent.click(screen.getByText('Test User'));
      fireEvent.click(screen.getByText('Мой лог-бук'));
      
      expect(mockRouter.push).toHaveBeenCalledWith('/logbook');
    });

    it('вызывает onLogout при клике на "Выйти"', () => {
      render(<AuthNav user={mockUser} onLogout={mockOnLogout} />);
      
      fireEvent.click(screen.getByText('Test User'));
      fireEvent.click(screen.getByText('Выйти'));
      
      expect(mockOnLogout).toHaveBeenCalled();
    });
  });

  describe('Mobile version', () => {
    beforeEach(() => {
      const { useIsMobile } = require('@/hooks/useMediaQuery');
      useIsMobile.mockReturnValue(true);
    });

    it('рендерит имя пользователя и кнопки', () => {
      render(<AuthNav user={mockUser} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Профиль')).toBeInTheDocument();
      expect(screen.getByText('Мой лог-бук')).toBeInTheDocument();
      expect(screen.getByText('Выйти')).toBeInTheDocument();
    });

    it('навигарует к профилю при клике на кнопку "Профиль"', () => {
      render(<AuthNav user={mockUser} onLogout={mockOnLogout} />);
      
      fireEvent.click(screen.getByText('Профиль'));
      
      expect(mockRouter.push).toHaveBeenCalledWith('/profile');
    });

    it('навигарует к лог-буку при клике на кнопку "Мой лог-бук"', () => {
      render(<AuthNav user={mockUser} onLogout={mockOnLogout} />);
      
      fireEvent.click(screen.getByText('Мой лог-бук'));
      
      expect(mockRouter.push).toHaveBeenCalledWith('/logbook');
    });

    it('вызывает onLogout при клике на кнопку "Выйти"', () => {
      render(<AuthNav user={mockUser} onLogout={mockOnLogout} />);
      
      fireEvent.click(screen.getByText('Выйти'));
      
      expect(mockOnLogout).toHaveBeenCalled();
    });
  });

  describe('User display', () => {
    it('отображает имя пользователя если оно есть', () => {
      const userWithName = { ...mockUser, name: 'John Doe' };
      render(<AuthNav user={userWithName} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('отображает email если имя отсутствует', () => {
      const userWithoutName = { ...mockUser, name: undefined };
      render(<AuthNav user={userWithoutName} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });
});
