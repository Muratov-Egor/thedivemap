import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DropdownMenu from '../DropdownMenu';

const mockItems = [
  {
    id: 'profile',
    label: 'Профиль',
    onClick: jest.fn(),
  },
  {
    id: 'logbook',
    label: 'Мой лог-бук',
    onClick: jest.fn(),
  },
  {
    id: 'logout',
    label: 'Выйти',
    onClick: jest.fn(),
    variant: 'danger' as const,
  },
];

const defaultTrigger = <button>Пользователь</button>;

describe('DropdownMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('рендерит триггер кнопку', () => {
    render(<DropdownMenu trigger={defaultTrigger} items={mockItems} />);
    
    expect(screen.getByText('Пользователь')).toBeInTheDocument();
  });

  it('открывает меню при клике на триггер', () => {
    render(<DropdownMenu trigger={defaultTrigger} items={mockItems} />);
    
    fireEvent.click(screen.getByText('Пользователь'));
    
    expect(screen.getByText('Профиль')).toBeInTheDocument();
    expect(screen.getByText('Мой лог-бук')).toBeInTheDocument();
    expect(screen.getByText('Выйти')).toBeInTheDocument();
  });

  it('вызывает onClick при клике на пункт меню', () => {
    render(<DropdownMenu trigger={defaultTrigger} items={mockItems} />);
    
    fireEvent.click(screen.getByText('Пользователь'));
    fireEvent.click(screen.getByText('Профиль'));
    
    expect(mockItems[0].onClick).toHaveBeenCalledTimes(1);
  });

  it('закрывает меню после клика на пункт', () => {
    render(<DropdownMenu trigger={defaultTrigger} items={mockItems} />);
    
    fireEvent.click(screen.getByText('Пользователь'));
    fireEvent.click(screen.getByText('Профиль'));
    
    expect(screen.queryByText('Профиль')).not.toBeInTheDocument();
  });

  it('закрывает меню при клике вне области', () => {
    render(<DropdownMenu trigger={defaultTrigger} items={mockItems} />);
    
    fireEvent.click(screen.getByText('Пользователь'));
    expect(screen.getByText('Профиль')).toBeInTheDocument();
    
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Профиль')).not.toBeInTheDocument();
  });

  it('применяет правильные стили для опасных пунктов', () => {
    render(<DropdownMenu trigger={defaultTrigger} items={mockItems} />);
    
    fireEvent.click(screen.getByText('Пользователь'));
    
    const logoutButton = screen.getByText('Выйти');
    expect(logoutButton).toHaveClass('text-red-600');
  });

  it('переключает состояние открытия/закрытия при повторном клике', () => {
    render(<DropdownMenu trigger={defaultTrigger} items={mockItems} />);
    
    const trigger = screen.getByText('Пользователь');
    
    // Открываем
    fireEvent.click(trigger);
    expect(screen.getByText('Профиль')).toBeInTheDocument();
    
    // Закрываем
    fireEvent.click(trigger);
    expect(screen.queryByText('Профиль')).not.toBeInTheDocument();
  });
});
