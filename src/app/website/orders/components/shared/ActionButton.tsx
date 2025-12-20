'use client';

import React from 'react';
import { Button, Spinner } from 'react-bootstrap';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'outline' | 'light';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-dark';
      case 'outline':
        return 'btn-outline-dark';
      case 'light':
        return 'btn-light border';
      default:
        return 'btn-dark';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'btn-sm';
      case 'lg':
        return 'btn-lg';
      default:
        return '';
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${getVariantClass()} ${getSizeClass()} ${fullWidth ? 'w-100' : ''} ${className}`}
      style={{ minWidth: fullWidth ? '100%' : '120px' }}
    >
      {loading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="me-2"
          />
          Loading...
        </>
      ) : (
        label
      )}
    </Button>
  );
};

export default ActionButton;
