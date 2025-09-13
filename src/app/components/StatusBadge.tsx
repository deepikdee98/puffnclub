import React from 'react';
import { Badge } from 'react-bootstrap';

interface StatusBadgeProps {
  status: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
}

const statusVariants: Record<string, string> = {
  active: 'success',
  inactive: 'secondary',
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  draft: 'secondary',
  published: 'success',
  processing: 'info',
  completed: 'success',
  cancelled: 'danger',
  shipped: 'primary',
  delivered: 'success',
  refunded: 'warning'
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant
}) => {
  const badgeVariant = variant || statusVariants[status.toLowerCase()] || 'secondary';
  
  return (
    <Badge bg={badgeVariant} className="badge-custom">
      {status}
    </Badge>
  );
};

export default StatusBadge;