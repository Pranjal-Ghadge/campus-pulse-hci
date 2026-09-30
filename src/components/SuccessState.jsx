import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessState = ({ 
  title = 'Success!', 
  description = 'Your action was completed successfully.',
  action = null 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
        <CheckCircle size={40} className="text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mb-6">{description}</p>
      {action && action}
    </div>
  );
};

export default SuccessState;
