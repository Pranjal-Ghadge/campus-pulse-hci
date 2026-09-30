import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorState = ({ 
  title = 'Something went wrong', 
  description = 'An error occurred. Please try again later.',
  action = null 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <AlertCircle size={40} className="text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mb-6">{description}</p>
      {action && action}
    </div>
  );
};

export default ErrorState;
