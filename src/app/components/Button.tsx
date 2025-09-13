import React from 'react';
import { Button as BootstrapButton, ButtonProps } from 'react-bootstrap';
import classNames from 'classnames';

interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<CustomButtonProps> = ({
  children,
  loading = false,
  icon,
  iconPosition = 'left',
  className,
  disabled,
  ...props
}) => {
  const buttonClasses = classNames(
    'btn-custom',
    className
  );

  return (
    <BootstrapButton
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <span className="me-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <span className="ms-2">{icon}</span>
      )}
    </BootstrapButton>
  );
};

export default Button;