import React from 'react';

const Card = ({ children, className = '', hover = false, elevated = false, ...props }) => {
  const baseStyles = 'bg-white border rounded-xl';
  const borderStyles = elevated ? 'border-blue-100 shadow-sm' : 'border-blue-100';
  const hoverStyles = hover ? 'transition-colors hover:border-primary-300 hover:shadow-sm' : '';
  
  return (
    <div className={`${baseStyles} ${borderStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
