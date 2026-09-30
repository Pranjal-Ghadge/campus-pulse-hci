import React from 'react';
import { CheckCircle, Clock, AlertCircle, Eye, Wrench, UserCheck } from 'lucide-react';

const StatusBadge = ({ status, size = 'md' }) => {
  const statusConfig = {
    'Reported': {
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      icon: AlertCircle,
    },
    'Under Review': {
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      icon: Eye,
    },
    'Assigned': {
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      borderColor: 'border-indigo-200',
      icon: Clock,
    },
    'In Progress': {
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      icon: Wrench,
    },
    'Resolved': {
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      icon: CheckCircle,
    },
    'Student Verification': {
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
      borderColor: 'border-teal-200',
      icon: UserCheck,
    },
  };

  const config = statusConfig[status] || statusConfig['Reported'];
  const Icon = config.icon;
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizes[size]}`}>
      <Icon size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
      {status}
    </span>
  );
};

export default StatusBadge;
