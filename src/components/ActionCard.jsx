import React from 'react';
import * as LucideIcons from 'lucide-react';
import Card from './Card';

const ActionCard = ({ category, onClick }) => {
  const Icon = LucideIcons[category.icon];
  
  return (
    <Card 
      hover 
      className="p-6 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors duration-200">
          <Icon size={32} className="text-primary-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{category.label}</h3>
          <p className="text-sm text-gray-600">{category.description}</p>
        </div>
      </div>
    </Card>
  );
};

export default ActionCard;
