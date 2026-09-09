import React from 'react';
import { getStatusBadgeStyle } from '../../utils/formatters';

const StatusBadge = ({ status, className = '' }) => {
  if (!status) return null;
  const style = getStatusBadgeStyle(status);
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export default StatusBadge;
