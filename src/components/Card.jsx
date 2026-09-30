import React from 'react';

const Card = ({ children, className = '', hover = false, elevated = false, ...props }) => {
  const baseStyles = 'bg-white border transition-all duration-300';
  const radiusStyles = elevated ? 'rounded-2xl' : 'rounded-xl';
  const borderStyles = elevated ? 'border-gray-100 shadow-md' : 'border-gray-200 shadow-sm';
  const hoverStyles = hover ? 'hover:shadow-lg hover:-translate-y-0.5' : '';
  
  return (
    <div className={`${baseStyles} ${radiusStyles} ${borderStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
