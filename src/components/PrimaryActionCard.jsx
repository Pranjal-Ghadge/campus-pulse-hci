import React from 'react';
import * as LucideIcons from 'lucide-react';
import Button from './Button';

const PrimaryActionCard = ({ category, onClick }) => {
  const Icon = LucideIcons[category.icon];
  
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
        <Icon size={20} />
      </div>
      <h3 className="font-semibold text-gray-900">{category.label}</h3>
      <p className="mt-1 text-sm leading-5 text-gray-600">
        Something on campus needs attention?
      </p>
      <Button onClick={onClick} className="mt-4 w-full">
        Raise an issue
      </Button>
    </div>
  );
};

export default PrimaryActionCard;
