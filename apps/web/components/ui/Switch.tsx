'use client';
import clsx from 'clsx';

interface SwitchProps { checked: boolean; onChange: (v: boolean) => void; label?: string }

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors',
        checked ? 'bg-fame-grad' : 'bg-fame-surface2'
      )}
    >
      <span
        className={clsx(
          'absolute top-[3px] left-[3px] h-[18px] w-[18px] rounded-full bg-white',
          'transition-transform duration-200',
          checked && 'translate-x-[18px]'
        )}
      />
    </button>
  );
}