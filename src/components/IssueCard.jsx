import React, { useState } from 'react';
import { MapPin, Users, Calendar, Heart, Check, Wifi, Building2, Utensils, Wrench, Shield, BookOpen, Lightbulb } from 'lucide-react';
import Card from './Card';
import StatusBadge from './StatusBadge';
import Button from './Button';

const IssueCard = ({ issue, onClick, showSupportButton = false }) => {
  const [isSupported, setIsSupported] = useState(false);
  const categoryIcons = {
    Internet: Wifi,
    Infrastructure: Building2,
    'Campus Life': Utensils,
    Laboratory: Wrench,
    Safety: Shield,
    Library: BookOpen,
    Appreciation: Heart,
    Suggestions: Lightbulb,
  };
  const CategoryIcon = categoryIcons[issue.category] || Wrench;

  const handleSupport = (e) => {
    e.stopPropagation();
    setIsSupported((current) => !current);
  };

  return (
    <Card hover elevated className="h-full cursor-pointer p-4 group transition-shadow hover:shadow-md" onClick={onClick}>
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
          <CategoryIcon size={19} aria-hidden="true" />
        </span>
        <div className="flex-1 pr-4">
          <span className="mb-1 block text-xs font-medium text-primary-700">
            {issue.category}
          </span>
          <h3 className="text-base font-semibold leading-5 text-gray-900 line-clamp-2 group-hover:text-primary-700 transition-colors">
            {issue.title}
          </h3>
        </div>
      </div>
      <div className="mb-4">
        <StatusBadge status={issue.status} size="sm" />
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <MapPin size={15} className="flex-shrink-0 text-gray-400" />
        <span className="line-clamp-1">{issue.location}</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg border border-blue-50 bg-blue-50/70 px-3 py-2.5">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <Users size={14} className="flex-shrink-0 text-gray-500" />
          <span className="font-medium">{issue.supporters + (isSupported ? 1 : 0)} affected</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar size={14} className="flex-shrink-0" />
          <span>{new Date(issue.dateReported).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
        {showSupportButton && (
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={isSupported}
            onClick={handleSupport}
            className="text-primary-700 hover:text-primary-800 hover:bg-white"
          >
            {isSupported ? <Check size={16} className="mr-1" /> : <Heart size={16} className="mr-1" />}
            {isSupported ? 'Supported' : 'Support'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default IssueCard;
