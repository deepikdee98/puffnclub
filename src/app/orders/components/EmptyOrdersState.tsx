'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiPackage } from 'react-icons/fi';
import ActionButton from './shared/ActionButton';

const EmptyOrdersState: React.FC = () => {
  const router = useRouter();

  const handleContinueShopping = () => {
    router.push('/products');
  };

  return (
    <div className="text-center py-5">
      <div className="d-flex justify-content-center mb-4">
        <div
          className="rounded-circle bg-light d-flex align-items-center justify-content-center"
          style={{ width: '100px', height: '100px' }}
        >
          <FiPackage size={48} className="text-muted" />
        </div>
      </div>

      <h5 className="mb-2">You haven't ordered anything yet.</h5>
      <p className="text-muted mb-4">
        Go shop from our Puffn Club exclusive
      </p>

      <ActionButton
        label="Continue Shopping"
        onClick={handleContinueShopping}
        variant="primary"
      />
    </div>
  );
};

export default EmptyOrdersState;
