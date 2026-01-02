'use client';

import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { exchangeReturnService } from '../../../services/exchangeReturnService';
import { formatPrice, formatDate } from '../../utils/orderHelpers';
import type { OrderItem } from '../../types/orders.types';

// Return validation schema
const returnSchema = yup.object().shape({
  agreedToTerms: yup
    .boolean()
    .required()
    .oneOf([true], 'You must agree to the Exchange & Return Policy'),
});

interface ReturnFormData {
  agreedToTerms: boolean;
}

interface ReturnProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  productId: string;
  product: OrderItem;
  onSuccess?: () => void;
}

const ReturnProductModal: React.FC<ReturnProductModalProps> = ({
  isOpen,
  onClose,
  orderId,
  productId,
  product,
  onSuccess,
}) => {
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReturnFormData>({
    resolver: yupResolver(returnSchema),
    defaultValues: {
      agreedToTerms: false,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ReturnFormData) => {
    try {
      setSubmitting(true);

      await exchangeReturnService.submitReturn(orderId, {
        productId,
        reason: 'Product return',
        refundMethod: 'original_payment',
      });

      toast.success('Return request submitted successfully');

      if (onSuccess) {
        onSuccess();
      }

      handleClose();
    } catch (error: any) {
      console.error('Error submitting return request:', error);
      toast.error(error.message || 'Failed to submit return request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={isOpen} onHide={handleClose} centered contentClassName="shadow-none">
      <Modal.Header className="border-0 pb-0">
        <Modal.Title className="w-100">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Return Product</h5>
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

      <Modal.Body>
        <p className="text-muted small mb-4">
          Easily exchange any product in just a few clicks.
        </p>

        {/* Product Details Card */}
        <div className="border rounded p-3 mb-4">
          <div className="d-flex gap-3">
            <img
              src={product.product.images?.[0] || '/default-image.png'}
              alt={product.product.name}
              className="rounded"
              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
            />
            <div className="flex-grow-1">
              <h6 className="mb-2">{product.product.name}</h6>
              <div className="small text-muted">
                <div>Order ID: #{orderId.slice(-8).toUpperCase()}</div>
                <div>Amount Paid: {formatPrice(product.price)}</div>
                {/* Assuming delivered date would come from order */}
                {/* <div>Delivered on: {formatDate(deliveredDate)}</div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Terms Checkbox */}
          <div className="mb-4">
            <Controller
              name="agreedToTerms"
              control={control}
              render={({ field }) => (
                <Form.Check
                  type="checkbox"
                  id="return-terms-checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  isInvalid={!!errors.agreedToTerms}
                  label={
                    <small className="text-muted">
                      <FiAlertCircle className="me-1" />
                      Item should be dispatched from our Terms & Conditions; please review our{' '}
                      <strong>Exchange & Return Policy</strong> before sending your product
                    </small>
                  }
                  feedback={errors.agreedToTerms?.message}
                  feedbackType="invalid"
                />
              )}
            />
          </div>

          {/* Buttons */}
          <div className="d-flex gap-3">
            <Button
              type="submit"
              variant="dark"
              className="flex-fill"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Return Request'}
            </Button>
            <Button
              type="button"
              variant="outline-dark"
              className="flex-fill"
              onClick={handleClose}
            >
              Cancel Return
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ReturnProductModal;
