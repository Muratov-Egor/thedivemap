import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import I18nProvider from '../I18nProvider';

// Мокаем react-i18next
jest.mock('react-i18next', () => ({
  I18nextProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="i18next-provider">{children}</div>
  ),
}));

// Мокаем i18n.client
const mockI18n = {
  isInitialized: false,
  on: jest.fn(),
  off: jest.fn(),
};

jest.mock('@/i18n/i18n.client', () => ({
  getI18n: () => mockI18n,
}));

describe('I18nProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockI18n.isInitialized = false;
  });

  it('рендерит children когда i18n инициализирован', async () => {
    mockI18n.isInitialized = true;

    render(
      <I18nProvider>
        <div data-testid="test-child">Test Content</div>
      </I18nProvider>,
    );

    expect(screen.getByTestId('i18next-provider')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('не рендерит children когда i18n не инициализирован', () => {
    mockI18n.isInitialized = false;

    const { container } = render(
      <I18nProvider>
        <div data-testid="test-child">Test Content</div>
      </I18nProvider>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('подписывается на событие initialized когда i18n не инициализирован', () => {
    mockI18n.isInitialized = false;

    render(
      <I18nProvider>
        <div data-testid="test-child">Test Content</div>
      </I18nProvider>,
    );

    expect(mockI18n.on).toHaveBeenCalledWith('initialized', expect.any(Function));
  });

  it('не подписывается на событие когда i18n уже инициализирован', () => {
    mockI18n.isInitialized = true;

    render(
      <I18nProvider>
        <div data-testid="test-child">Test Content</div>
      </I18nProvider>,
    );

    expect(mockI18n.on).not.toHaveBeenCalled();
  });

  it('рендерит children после инициализации i18n', async () => {
    mockI18n.isInitialized = false;

    const { rerender } = render(
      <I18nProvider>
        <div data-testid="test-child">Test Content</div>
      </I18nProvider>,
    );

    // Изначально ничего не рендерится
    expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();

    // Симулируем инициализацию
    mockI18n.isInitialized = true;

    // Получаем callback функцию
    const initializedCallback = mockI18n.on.mock.calls[0][1];

    // Вызываем callback в act()
    act(() => {
      initializedCallback();
    });

    // Перерендериваем компонент
    rerender(
      <I18nProvider>
        <div data-testid="test-child">Test Content</div>
      </I18nProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });
  });

  it('обрабатывает множественные children', () => {
    mockI18n.isInitialized = true;

    render(
      <I18nProvider>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <span data-testid="child-3">Child 3</span>
      </I18nProvider>,
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  it('передает i18n в I18nextProvider', () => {
    mockI18n.isInitialized = true;

    render(
      <I18nProvider>
        <div data-testid="test-child">Test Content</div>
      </I18nProvider>,
    );

    expect(screen.getByTestId('i18next-provider')).toBeInTheDocument();
  });

  it('обрабатывает пустые children', () => {
    mockI18n.isInitialized = true;

    const { container } = render(<I18nProvider>{null}</I18nProvider>);

    expect(screen.getByTestId('i18next-provider')).toBeInTheDocument();
    expect(container.firstChild).toBeInTheDocument();
  });

  it('обрабатывает undefined children', () => {
    mockI18n.isInitialized = true;

    const { container } = render(<I18nProvider>{undefined}</I18nProvider>);

    expect(screen.getByTestId('i18next-provider')).toBeInTheDocument();
    expect(container.firstChild).toBeInTheDocument();
  });
});
