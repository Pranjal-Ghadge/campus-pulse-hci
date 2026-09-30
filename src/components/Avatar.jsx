import React from 'react';

const Avatar = ({ src, alt = 'User', size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`${sizes[size]} rounded-full bg-primary-100 flex items-center justify-center overflow-hidden ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-primary-700 font-semibold">
          {alt.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
};

export default Avatar;
