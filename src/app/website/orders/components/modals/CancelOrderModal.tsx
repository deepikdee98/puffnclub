'use client';

import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { orderService } from '../../../services/orderService';
import { ERROR_MESSAGES } from '../../utils/orderConstants';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderStatus: string;
  onSuccess?: () => void;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  onClose,
  orderId,
  orderStatus,
  onSuccess,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);

  // Check if order can be cancelled
  const canCancel = ['pending', 'confirmed', 'processing'].includes(orderStatus);
  const isDispatched = ['shipped', 'delivered'].includes(orderStatus);

  const handleClose = () => {
    setShowError(false);
    onClose();
  };

  const handleCancelOrder = async () => {
    if (!canCancel) {
      setShowError(true);
      return;
    }

    try {
      setSubmitting(true);

      // Call API to cancel order
      await orderService.cancelOrder(orderId);

      toast.success('Order cancelled successfully');

      if (onSuccess) {
        onSuccess();
      }

      handleClose();
    } catch (error: any) {
      console.error('Error cancelling order:', error);

      // Check if error is due to order being dispatched
      if (error.response?.status === 400 || isDispatched) {
        setShowError(true);
      } else {
        toast.error('Failed to cancel order. Please try again.');
        handleClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={isOpen} onHide={handleClose} centered contentClassName="shadow-none">
      <Modal.Header className="border-0 pb-0">
        <Modal.Title className="w-100">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              {showError ? 'Order not Cancelled' : 'Did you change your mind?'}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
              style={{ fontSize: '0.75rem', boxShadow: 'none !important' }}
            />
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center py-4">
        {showError ? (
          <>
            <p className="mb-4">
              You cant cancel the order, because order sent to the delivery partner. you can
              return the product after reaching it
            </p>
            <Button variant="dark" className="w-100" onClick={handleClose}>
              Okay
            </Button>
          </>
        ) : (
          <>
            <p className="mb-3">
              Do you want to cancel the order.
            </p>
            <p className="text-muted small mb-4">
              You cant cancel the order once the product is dispatched and sent to the delivery
              partner
            </p>
            <Button
              variant="dark"
              className="w-100"
              onClick={handleCancelOrder}
              disabled={submitting}
            >
              {submitting ? 'Cancelling...' : 'Cancel Order'}
            </Button>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CancelOrderModal;
