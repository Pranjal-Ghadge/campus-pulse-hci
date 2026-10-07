import React from 'react';
import { AlertTriangle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Button from './Button';

const PrimaryActionCard = ({ category, onClick }) => {
  const Icon = LucideIcons[category.icon];
  
  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div className="flex items-start justify-between mb-6">
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Icon size={32} className="text-white" />
        </div>
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <AlertTriangle size={20} className="text-white" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold mb-2">{category.label}</h3>
      <p className="text-white/90 mb-6 leading-relaxed">
        Something on campus needs attention?
      </p>
      
      <Button 
        variant="secondary" 
        onClick={onClick}
        className="w-full bg-white text-primary-700 hover:bg-gray-50"
      >
        Report now →
      </Button>
    </div>
  );
};

export default PrimaryActionCard;
