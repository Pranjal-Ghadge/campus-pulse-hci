import React, { useState } from 'react';
import { MapPin, Users, Calendar, Heart, Check } from 'lucide-react';
import Card from './Card';
import StatusBadge from './StatusBadge';
import Button from './Button';

const IssueCard = ({ issue, onClick, showSupportButton = false }) => {
  const [isSupported, setIsSupported] = useState(false);

  const handleSupport = (e) => {
    e.stopPropagation();
    setIsSupported((current) => !current);
  };

  return (
    <Card hover className="p-6 cursor-pointer group" onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold mb-2">
            {issue.category}
          </span>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {issue.title}
          </h3>
        </div>
        <StatusBadge status={issue.status} size="sm" />
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={16} className="flex-shrink-0 text-gray-400" />
          <span className="line-clamp-1">{issue.location}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={16} className="flex-shrink-0 text-gray-400" />
          <span className="font-medium">{issue.supporters + (isSupported ? 1 : 0)} students affected</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={16} className="flex-shrink-0" />
            <span>{new Date(issue.dateReported).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
          {showSupportButton && (
            <Button 
              variant="ghost" 
              size="sm"
              aria-pressed={isSupported}
              onClick={handleSupport}
              className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
            >
              {isSupported ? <Check size={16} className="mr-1" /> : <Heart size={16} className="mr-1" />}
              {isSupported ? 'Supported' : 'Support'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default IssueCard;
