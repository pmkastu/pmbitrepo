import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export function LogoIcon({ className = '', size = 'md' }: LogoProps) {
  return (
    <img
      src="/Designer.png"
      alt="Logo"
      className={`${sizeMap[size]} ${className} rounded-full object-cover`}
    />
  );
}
