import React from 'react';
import * as LucideIcons from 'lucide-react';
import Card from './Card';

const SecondaryActionCard = ({ category, onClick }) => {
  const Icon = LucideIcons[category.icon];
  
  const iconColors = {
    'Lightbulb': 'bg-amber-50 text-amber-600',
    'Shield': 'bg-red-50 text-red-600',
    'HelpCircle': 'bg-purple-50 text-purple-600',
    'Star': 'bg-yellow-50 text-yellow-600',
  };
  
  const iconColorClass = iconColors[category.icon] || 'bg-gray-50 text-gray-600';
  
  return (
    <Card hover className="p-6 cursor-pointer group" onClick={onClick}>
      <div className="flex flex-col h-full">
        <div className={`w-14 h-14 rounded-2xl ${iconColorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
          <Icon size={28} />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 text-lg">{category.label}</h3>
        <p className="text-gray-600 text-sm leading-relaxed flex-1">{category.description}</p>
      </div>
    </Card>
  );
};

export default SecondaryActionCard;
