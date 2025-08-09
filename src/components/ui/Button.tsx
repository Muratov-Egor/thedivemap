import { forwardRef, type ButtonHTMLAttributes, type ReactNode, useState } from 'react';

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  /** Делает кнопку полностью круглой (круглая иконка-кнопка) */
  circular?: boolean;
  /** Иконка слева от текста или единственная иконка для icon-only варианта */
  startIcon?: ReactNode;
  /** Иконка справа от текста */
  endIcon?: ReactNode;
  /** Рекомендуется указать при icon-only для доступности */
  ariaLabel?: string;
}

function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

const sizeStyles: Record<
  ButtonSize,
  { regular: string; circular: string; iconGap: string; text: string }
> = {
  sm: {
    regular: 'sm:h-10 h-8 px-3 rounded-md',
    circular: 'sm:h-10 h-8 w-8',
    iconGap: 'gap-1.5',
    text: 'text-sm',
  },
  md: {
    regular: 'sm:h-12 h-10 px-4 rounded-md',
    circular: 'sm:h-12 h-10 w-10',
    iconGap: 'gap-2',
    text: 'text-sm',
  },
  lg: {
    regular: 'sm:h-14 h-12 px-5',
    circular: 'sm:h-14 h-12 w-12',
    iconGap: 'gap-2.5',
    text: 'text-base',
  },
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'text-white bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800',
  secondary:
    'text-gray-900 bg-gradient-to-b from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300',
  outline: 'border border-gray-300 text-gray-900 bg-transparent hover:bg-gray-50',
  ghost: 'bg-transparent text-gray-900 hover:bg-gray-100',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    size = 'md',
    variant = 'primary',
    circular = false,
    startIcon,
    endIcon,
    ariaLabel,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  const isIconOnly = !children && !!startIcon && !endIcon;

  const base = cn(
    // layout
    'group relative overflow-hidden inline-flex items-center justify-center select-none font-medium',
    circular ? 'rounded-full' : 'rounded-md',
    // variant
    variantStyles[variant],
  );

  const sizeClass = circular ? sizeStyles[size].circular : sizeStyles[size].regular;

  const gapClass = cn(
    startIcon && children ? sizeStyles[size].iconGap : '',
    children && endIcon ? sizeStyles[size].iconGap : '',
  );

  const textClass = sizeStyles[size].text;
  const [shineDirection, setShineDirection] = useState<'forward' | 'reverse' | 'idle'>('idle');

  return (
    <button
      ref={ref}
      type={type}
      aria-label={isIconOnly ? ariaLabel : rest['aria-label']}
      className={cn(base, sizeClass, className)}
      onMouseEnter={(e) => {
        rest.onMouseEnter?.(e);
        setShineDirection('forward');
      }}
      onMouseLeave={(e) => {
        rest.onMouseLeave?.(e);
        setShineDirection('reverse');
      }}
      {...rest}
    >
      {shineDirection !== 'idle' && (
        <span
          aria-hidden="true"
          onAnimationEnd={() => setShineDirection('idle')}
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 h-full w-1/3 skew-x-12',
            'bg-gradient-to-r from-transparent via-white/40 to-transparent',
            shineDirection === 'forward' && 'animate-shine',
            shineDirection === 'reverse' && 'animate-shineReverse',
          )}
        />
      )}
      <span className={cn('relative z-10 inline-flex items-center justify-center', gapClass)}>
        {/* Иконка слева или единственная иконка для icon-only */}
        {startIcon}
        {/* Текст, если передан */}
        {children ? <span className={textClass}>{children}</span> : null}
        {/* Иконка справа */}
        {endIcon}
      </span>
    </button>
  );
});

export default Button;
