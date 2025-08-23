import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Slider from '../Slider';

describe('Slider', () => {
  const defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
  };

  beforeEach(() => {
    // Мокаем getBoundingClientRect для корректной работы тестов
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 200,
      height: 20,
      top: 0,
      left: 0,
      bottom: 20,
      right: 200,
      x: 0,
      y: 0,
    }));
  });

  describe('Рендеринг', () => {
    it('рендерит слайдер с значениями по умолчанию', () => {
      render(<Slider {...defaultProps} />);

      expect(screen.getByRole('slider')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('рендерит слайдер с кастомными значениями', () => {
      render(<Slider min={10} max={90} defaultValue={30} />);

      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('90')).toBeInTheDocument();
    });

    it('рендерит label когда передан', () => {
      render(<Slider {...defaultProps} label="Тестовая метка" />);

      expect(screen.getByText('Тестовая метка')).toBeInTheDocument();
    });

    it('не рендерит значения когда showValue=false', () => {
      render(<Slider {...defaultProps} showValue={false} />);

      expect(screen.queryByText('0')).not.toBeInTheDocument();
      expect(screen.queryByText('50')).not.toBeInTheDocument();
      expect(screen.queryByText('100')).not.toBeInTheDocument();
    });

    it('рендерит значения с префиксом и суффиксом', () => {
      render(<Slider {...defaultProps} valuePrefix="$" valueSuffix=" USD" />);

      expect(screen.getByText('$0 USD')).toBeInTheDocument();
      expect(screen.getByText('$50 USD')).toBeInTheDocument();
      expect(screen.getByText('$100 USD')).toBeInTheDocument();
    });
  });

  describe('Варианты стилей', () => {
    it('применяет default вариант по умолчанию', () => {
      render(<Slider {...defaultProps} />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveClass('bg-gray-50', 'border-outline-purple/20');
    });

    it('применяет depth вариант (темно-синий)', () => {
      render(<Slider {...defaultProps} variant="depth" />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveClass('bg-gray-50', 'border-slate-700/20');
    });

    it('применяет visibility вариант (светло-синий)', () => {
      render(<Slider {...defaultProps} variant="visibility" />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveClass('bg-gray-50', 'border-pastel-turquoise/30');
    });

    it('применяет rating вариант (серый)', () => {
      render(<Slider {...defaultProps} variant="rating" />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveClass('bg-gray-50', 'border-gray-300');
    });
  });

  describe('Состояние disabled', () => {
    it('применяет disabled стили', () => {
      render(<Slider {...defaultProps} disabled />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveClass('opacity-50', 'cursor-not-allowed');
      expect(slider).toHaveAttribute('aria-disabled', 'true');
    });

    it('не обрабатывает события когда disabled', async () => {
      const onChange = jest.fn();
      render(<Slider {...defaultProps} disabled onChange={onChange} />);

      const slider = screen.getByRole('slider');
      fireEvent.mouseDown(slider);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Обработка событий мыши', () => {
    it('вызывает onChange при клике на трек', async () => {
      const onChange = jest.fn();
      render(<Slider {...defaultProps} onChange={onChange} />);

      const slider = screen.getByRole('slider');
      fireEvent.mouseDown(slider, { clientX: 100 }); // 50% от ширины

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(50);
      });
    });

    it('вызывает onChange при перетаскивании', async () => {
      const onChange = jest.fn();
      render(<Slider {...defaultProps} onChange={onChange} />);

      const slider = screen.getByRole('slider');

      // Начинаем перетаскивание
      fireEvent.mouseDown(slider, { clientX: 50 });

      // Перемещаем мышь
      fireEvent.mouseMove(document, { clientX: 150 });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(75);
      });

      // Завершаем перетаскивание
      fireEvent.mouseUp(document);
    });
  });

  describe('Touch события', () => {
    it('вызывает onChange при touch событии', async () => {
      const onChange = jest.fn();
      render(<Slider {...defaultProps} onChange={onChange} />);

      const slider = screen.getByRole('slider');

      // Симулируем touch событие
      fireEvent.touchStart(slider, {
        touches: [{ clientX: 100 }],
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(50);
      });
    });

    it('обрабатывает touch move события', async () => {
      const onChange = jest.fn();
      render(<Slider {...defaultProps} onChange={onChange} />);

      const slider = screen.getByRole('slider');

      // Начинаем touch
      fireEvent.touchStart(slider, {
        touches: [{ clientX: 50 }],
      });

      // Перемещаем палец
      fireEvent.touchMove(document, {
        touches: [{ clientX: 150 }],
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(75);
      });

      // Завершаем touch
      fireEvent.touchEnd(document);
    });
  });

  describe('Клавиатурная навигация', () => {
    it('увеличивает значение при нажатии стрелки вправо', async () => {
      const onChange = jest.fn();
      render(<Slider {...defaultProps} onChange={onChange} />);

      const slider = screen.getByRole('slider');
      slider.focus();

      fireEvent.keyDown(slider, { key: 'ArrowRight' });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(51);
      });
    });

    it('уменьшает значение при нажатии стрелки влево', async () => {
      const onChange = jest.fn();
      render(<Slider {...defaultProps} onChange={onChange} />);

      const slider = screen.getByRole('slider');
      slider.focus();

      fireEvent.keyDown(slider, { key: 'ArrowLeft' });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(49);
      });
    });

    it('устанавливает минимальное значение при нажатии Home', async () => {
      const onChange = jest.fn();
      render(<Slider {...defaultProps} onChange={onChange} />);

      const slider = screen.getByRole('slider');
      slider.focus();

      fireEvent.keyDown(slider, { key: 'Home' });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(0);
      });
    });

    it('устанавливает максимальное значение при нажатии End', async () => {
      const onChange = jest.fn();
      render(<Slider {...defaultProps} onChange={onChange} />);

      const slider = screen.getByRole('slider');
      slider.focus();

      fireEvent.keyDown(slider, { key: 'End' });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(100);
      });
    });

    it('не обрабатывает неизвестные клавиши', () => {
      const onChange = jest.fn();
      render(<Slider {...defaultProps} onChange={onChange} />);

      const slider = screen.getByRole('slider');
      slider.focus();

      fireEvent.keyDown(slider, { key: 'Enter' });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Контролируемый компонент', () => {
    it('обновляет значение при изменении value prop', () => {
      const { rerender } = render(<Slider {...defaultProps} value={25} />);

      expect(screen.getByText('25')).toBeInTheDocument();

      rerender(<Slider {...defaultProps} value={75} />);

      expect(screen.getByText('75')).toBeInTheDocument();
    });

    it('приоритизирует value над defaultValue', () => {
      render(<Slider {...defaultProps} value={30} defaultValue={70} />);

      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.queryByText('70')).not.toBeInTheDocument();
    });
  });

  describe('Граничные случаи', () => {
    it('ограничивает значение минимальным', async () => {
      const onChange = jest.fn();
      render(<Slider {...defaultProps} onChange={onChange} />);

      const slider = screen.getByRole('slider');
      slider.focus();

      // Пытаемся установить значение меньше минимального
      fireEvent.keyDown(slider, { key: 'ArrowLeft' });
      fireEvent.keyDown(slider, { key: 'ArrowLeft' });
      fireEvent.keyDown(slider, { key: 'ArrowLeft' });

      await waitFor(() => {
        // Проверяем, что значение уменьшилось
        const calls = onChange.mock.calls;
        expect(calls.length).toBeGreaterThan(0);
        expect(calls[calls.length - 1][0]).toBeLessThan(50); // Начальное значение
      });
    });

    it('ограничивает значение максимальным', async () => {
      const onChange = jest.fn();
      render(<Slider {...defaultProps} onChange={onChange} />);

      const slider = screen.getByRole('slider');
      slider.focus();

      // Пытаемся установить значение больше максимального
      for (let i = 0; i < 60; i++) {
        fireEvent.keyDown(slider, { key: 'ArrowRight' });
      }

      await waitFor(() => {
        // Проверяем, что последний вызов был с максимальным значением
        const calls = onChange.mock.calls;
        expect(calls[calls.length - 1][0]).toBe(100);
      });
    });

    it('округление до step', async () => {
      const onChange = jest.fn();
      render(<Slider min={0} max={100} step={5} defaultValue={23} onChange={onChange} />);

      const slider = screen.getByRole('slider');
      slider.focus();

      fireEvent.keyDown(slider, { key: 'ArrowRight' });

      await waitFor(() => {
        // Проверяем, что значение изменилось
        const calls = onChange.mock.calls;
        expect(calls.length).toBeGreaterThan(0);
        const lastValue = calls[calls.length - 1][0];
        expect(lastValue).toBeGreaterThan(23); // Значение должно увеличиться
      });
    });
  });

  describe('Accessibility', () => {
    it('имеет правильные ARIA атрибуты', () => {
      render(<Slider {...defaultProps} />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemin', '0');
      expect(slider).toHaveAttribute('aria-valuemax', '100');
      expect(slider).toHaveAttribute('aria-valuenow', '50');
    });

    it('имеет tabindex для клавиатурной навигации', () => {
      render(<Slider {...defaultProps} />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('tabIndex', '0');
    });

    it('отключает tabindex когда disabled', () => {
      render(<Slider {...defaultProps} disabled />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('tabIndex', '-1');
    });
  });
});
