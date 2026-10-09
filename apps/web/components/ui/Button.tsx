'use client';
import clsx from 'clsx';

type Variant = 'primary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-fame-grad text-white shadow-[0_10px_30px_rgba(229,0,126,.25)] hover:brightness-110',
  ghost:   'bg-white/[.06] text-white hover:bg-white/[.12]',
  outline: 'border border-fame-line text-white hover:border-fame-pink hover:text-fame-pink',
};

const SIZES: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-5 py-3 text-sm rounded-[10px]',
  lg: 'px-6 py-4 text-base rounded-xl',
};

export function Button({
  variant = 'primary', size = 'md', loading, className, children, disabled, ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold transition',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'active:scale-[.97]',
        VARIANTS[variant], SIZES[size], className
      )}
    >
      {loading ? '…' : children}
    </button>
  );
}