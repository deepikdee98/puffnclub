'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiChevronLeft, FiHelpCircle } from 'react-icons/fi';
import Image from 'next/image';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  showBack?: boolean;
  showHelp?: boolean;
  onBack?: () => void;
  onHelp?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showLogo = true,
  showBack = true,
  showHelp = true,
  onBack,
  onHelp,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleHelp = () => {
    if (onHelp) {
      onHelp();
    } else {
      // TODO: Open help modal or navigate to help page
      console.log('Help clicked');
    }
  };

  return (
    <div className="bg-white border-bottom">
      {/* Logo Section */}
      {showLogo && (
        <div className="container py-3">
          <div className="d-flex justify-content-between align-items-center">
            <Image
              src="/images/puffn-logo.svg"
              alt="PUFFN CLUB"
              width={120}
              height={40}
              className="img-fluid"
              priority
            />
            {showHelp && (
              <button
                onClick={handleHelp}
                className="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-1 p-0"
                aria-label="Help"
              >
                <FiHelpCircle size={18} />
                <span className="small">Help</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Title Section */}
      <div className="container py-3" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="d-flex align-items-center gap-2 mb-2">
          {showBack && (
            <button
              onClick={handleBack}
              className="btn btn-link text-dark p-0 text-decoration-none"
              aria-label="Go back"
            >
              <FiChevronLeft size={24} />
            </button>
          )}
          <h1 className="h4 mb-0 fw-bold">{title}</h1>
        </div>
        {subtitle && (
          <p className="text-muted small mb-0 ms-4" style={{ fontSize: '0.875rem' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
