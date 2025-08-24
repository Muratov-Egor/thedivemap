import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Notification, { NotificationProps } from '../Notification';

// Мокаем react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'notification.close': 'Закрыть уведомление',
      };
      return translations[key] || key;
    },
  }),
}));

const renderNotification = (props: Partial<NotificationProps> & { message: string }) => {
  return render(<Notification {...props} />);
};

describe('Notification', () => {
  const defaultProps = {
    message: 'Test message',
    description: 'Test description',
    type: 'info' as const,
    show: true,
  };

  it('отображает сообщение и описание', () => {
    renderNotification(defaultProps);

    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('не отображается когда show=false', () => {
    renderNotification({ ...defaultProps, show: false });

    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('вызывает onClose при клике на кнопку закрытия', async () => {
    const onClose = jest.fn();
    renderNotification({ ...defaultProps, onClose });

    const closeButton = screen.getByTestId('notification-close');
    fireEvent.click(closeButton);

    await waitFor(
      () => {
        expect(onClose).toHaveBeenCalled();
      },
      { timeout: 500 },
    );
  });

  it('автоматически скрывается через указанное время', async () => {
    const onClose = jest.fn();
    renderNotification({ ...defaultProps, onClose, duration: 100 });

    await waitFor(
      () => {
        expect(onClose).toHaveBeenCalled();
      },
      { timeout: 500 },
    );
  });

  it('не скрывается автоматически когда duration=0', async () => {
    const onClose = jest.fn();
    renderNotification({ ...defaultProps, onClose, duration: 0 });

    // Ждем больше времени чем стандартный duration
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('применяет правильные стили для разных типов', () => {
    const { rerender } = renderNotification({ ...defaultProps, type: 'info' });
    const notificationContainer = screen
      .getByTestId('notification')
      .querySelector('.flex.items-start');
    expect(notificationContainer).toHaveClass(
      'bg-white',
      'border-l-4',
      'border-primary-action',
    );

    rerender(<Notification {...defaultProps} type="warning" />);
    expect(notificationContainer).toHaveClass(
      'bg-white',
      'border-l-4',
      'border-warning-accent',
    );

    rerender(<Notification {...defaultProps} type="error" />);
    expect(notificationContainer).toHaveClass(
      'bg-white',
      'border-l-4',
      'border-danger-accent',
    );

    rerender(<Notification {...defaultProps} type="success" />);
    expect(notificationContainer).toHaveClass(
      'bg-white',
      'border-l-4',
      'border-success-accent',
    );
  });

  it('отображается внизу экрана с правильным позиционированием', () => {
    renderNotification(defaultProps);

    const notification = screen.getByTestId('notification');
    expect(notification).toHaveClass(
      'fixed',
      'bottom-4',
      'left-4',
      'right-4',
      'sm:left-1/2',
      'sm:right-auto',
      'sm:transform',
      'sm:-translate-x-1/2',
    );
  });

  it('имеет правильный z-index', () => {
    renderNotification(defaultProps);

    const notification = screen.getByTestId('notification');
    expect(notification).toHaveClass('z-[9999]');
  });

  it('отображает иконку в зависимости от типа', () => {
    renderNotification({ ...defaultProps, type: 'info' });

    // Проверяем наличие SVG иконки
    const svg = screen.getByTestId('notification').querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('применяет дополнительные классы через className', () => {
    renderNotification({ ...defaultProps, className: 'custom-class' });

    expect(screen.getByTestId('notification')).toHaveClass('custom-class');
  });

  it('применяет кастомные стили через пропсы', () => {
    renderNotification({
      ...defaultProps,
      containerClassName: 'custom-container',
      iconClassName: 'custom-icon',
      closeButtonClassName: 'custom-close',
    });

    const notification = screen.getByTestId('notification');
    expect(notification.querySelector('.flex.items-start')).toHaveClass('custom-container');
    expect(notification.querySelector('.flex-shrink-0')).toHaveClass('custom-icon');
    expect(screen.getByTestId('notification-close')).toHaveClass('custom-close');
  });

  it('отображает кастомную иконку', () => {
    const customIcon = <div data-testid="custom-icon">🚨</div>;
    renderNotification({ ...defaultProps, icon: customIcon });

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('не отображает иконку для custom типа без кастомной иконки', () => {
    renderNotification({ ...defaultProps, type: 'custom' });

    // Проверяем, что нет иконки типа (кнопка закрытия не считается)
    // Ищем SVG, который не является кнопкой закрытия
    const svgElements = screen.getByTestId('notification').querySelectorAll('svg');
    const nonCloseButtonSvgs = Array.from(svgElements).filter(
      (svg) => !svg.closest('[data-testid="notification-close"]'),
    );
    expect(nonCloseButtonSvgs).toHaveLength(0);
  });

  it('отображает кастомную иконку для custom типа', () => {
    const customIcon = <div data-testid="custom-icon">🎯</div>;
    renderNotification({ ...defaultProps, type: 'custom', icon: customIcon });

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});
