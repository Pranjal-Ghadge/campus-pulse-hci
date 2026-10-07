import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-700 text-white hover:bg-primary-800 focus-visible:ring-primary-500 rounded-lg',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus-visible:ring-primary-500 rounded-lg',
    danger: 'bg-red-700 text-white hover:bg-red-800 focus-visible:ring-red-500 rounded-lg',
    ghost: 'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500 rounded-lg',
    accent: 'bg-accent-600 text-white hover:bg-accent-700 focus-visible:ring-accent-500 rounded-lg',
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
