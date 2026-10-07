import React from 'react';
import * as LucideIcons from 'lucide-react';

const ActionCard = ({ category, onClick }) => {
  const Icon = LucideIcons[category.icon];
  
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left transition-colors hover:border-primary-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
        <Icon size={20} aria-hidden="true" />
      </span>
      <span>
        <span className="block font-semibold text-gray-900">{category.label}</span>
        <span className="mt-1 block text-sm leading-5 text-gray-600">{category.description}</span>
      </span>
    </button>
  );
};

export default ActionCard;
