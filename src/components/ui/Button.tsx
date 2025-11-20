import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm': variant === 'primary',
            'border border-slate-200 bg-white hover:bg-slate-100 text-slate-900': variant === 'outline',
            'hover:bg-slate-100 text-slate-900': variant === 'ghost',
            'h-9 px-4 text-sm': size === 'sm',
            'h-10 px-6 py-2': size === 'md',
            'h-11 px-8 text-lg': size === 'lg',
          },
          className
        )
      )}
      {...props}
    />
  );
};

export default Button;
