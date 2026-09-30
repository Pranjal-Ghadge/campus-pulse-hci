import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-md hover:shadow-lg focus:ring-primary-500 rounded-xl',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md focus:ring-primary-500 rounded-xl',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg focus:ring-red-500 rounded-xl',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500 rounded-lg',
    accent: 'bg-gradient-to-r from-accent-500 to-accent-400 text-white hover:from-accent-600 hover:to-accent-500 shadow-md hover:shadow-lg focus:ring-accent-500 rounded-xl',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
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
