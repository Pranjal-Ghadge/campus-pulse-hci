import React from 'react';
import { ArrowRight, AlertTriangle, Lightbulb, Shield } from 'lucide-react';

const SecondaryActionCard = ({ category, onClick }) => {
  const iconConfig = {
    problem: { Icon: AlertTriangle, color: 'blue' },
    improvement: { Icon: Lightbulb, color: 'amber' },
    safety: { Icon: Shield, color: 'red' },
  };
  const { Icon, color } = iconConfig[category.id] || iconConfig.problem;
  const colors = {
    blue: {
      icon: 'bg-blue-100 text-blue-700',
      rail: 'bg-blue-500',
      action: 'text-blue-700 group-hover:text-blue-800',
      ring: 'focus-visible:ring-blue-500',
    },
    amber: {
      icon: 'bg-amber-100 text-amber-800',
      rail: 'bg-amber-500',
      action: 'text-amber-800 group-hover:text-amber-900',
      ring: 'focus-visible:ring-amber-500',
    },
    red: {
      icon: 'bg-rose-100 text-rose-700',
      rail: 'bg-rose-500',
      action: 'text-rose-700 group-hover:text-rose-800',
      ring: 'focus-visible:ring-rose-500',
    },
  }[color];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex min-h-52 w-full flex-col items-start rounded-xl border border-blue-100 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 ${colors.ring} focus-visible:ring-offset-2`}
    >
      <span className={`absolute inset-x-0 top-0 h-1 rounded-t-xl ${colors.rail}`} aria-hidden="true" />
      <span className={`mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors.icon}`}>
        <Icon size={24} strokeWidth={1.9} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-gray-900">{category.label}</span>
        <span className="mt-1 block text-sm leading-5 text-gray-600">{category.description}</span>
      </span>
      <span className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${colors.action}`}>
        Start report <ArrowRight size={16} aria-hidden="true" />
      </span>
    </button>
  );
};

export default SecondaryActionCard;
