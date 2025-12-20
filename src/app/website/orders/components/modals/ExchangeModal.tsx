'use client';

import React, { useState } from 'react';
import { Modal, Form, Button, Badge } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { exchangeReturnService } from '../../../services/exchangeReturnService';
import type { Color } from '../../types/orders.types';

// Exchange validation schema
const exchangeSchema = yup.object().shape({
  size: yup.string().required('Please select a size'),
  color: yup.string().required('Please select a color'),
  agreedToTerms: yup
    .boolean()
    .required()
    .oneOf([true], 'You must agree to the Exchange & Return Policy'),
});

interface ExchangeFormData {
  size: string;
  color: string;
  agreedToTerms: boolean;
}

interface ExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  productId: string;
  availableSizes: string[];
  availableColors: Color[];
  onExchangeSelect?: () => void;
  onReturnSelect?: () => void;
  onSuccess?: () => void;
}

const ExchangeModal: React.FC<ExchangeModalProps> = ({
  isOpen,
  onClose,
  orderId,
  productId,
  availableSizes,
  availableColors,
  onExchangeSelect,
  onReturnSelect,
  onSuccess,
}) => {
  const [step, setStep] = useState<'choice' | 'form'>('choice');
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ExchangeFormData>({
    resolver: yupResolver(exchangeSchema),
    defaultValues: {
      size: '',
      color: '',
      agreedToTerms: false,
    },
  });

  const selectedSize = watch('size');
  const selectedColor = watch('color');

  const handleClose = () => {
    reset();
    setStep('choice');
    onClose();
  };

  const handleExchangeClick = () => {
    setStep('form');
    if (onExchangeSelect) {
      onExchangeSelect();
    }
  };

  const handleReturnClick = () => {
    if (onReturnSelect) {
      onReturnSelect();
    }
    handleClose();
  };

  const onSubmit = async (data: ExchangeFormData) => {
    try {
      setSubmitting(true);

      await exchangeReturnService.submitExchange(orderId, {
        productId,
        size: data.size,
        color: data.color,
        reason: 'Size/Color exchange',
      });

      toast.success('Exchange request submitted successfully');

      if (onSuccess) {
        onSuccess();
      }

      handleClose();
    } catch (error: any) {
      console.error('Error submitting exchange request:', error);
      toast.error(error.message || 'Failed to submit exchange request. Please try again.');
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
              {step === 'choice' ? 'Did you change your mind' : 'Exchange Product'}
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

      <Modal.Body>
        {step === 'choice' ? (
          // Step 1: Choice Screen
          <div>
            <p className="text-muted mb-3">
              Do you want to exchange or return the product
            </p>
            <p className="text-muted small mb-4">
              Contact us to change your size here
            </p>

            <div className="d-flex gap-3">
              <Button
                variant="dark"
                className="flex-fill"
                onClick={handleExchangeClick}
              >
                Exchange Product
              </Button>
              <Button
                variant="outline-dark"
                className="flex-fill"
                onClick={handleReturnClick}
              >
                Return Product
              </Button>
            </div>
          </div>
        ) : (
          // Step 2: Exchange Form
          <Form onSubmit={handleSubmit(onSubmit)}>
            <p className="text-muted small mb-4">
              Exchange the size you want in given the choice
            </p>

            {/* Size Selection */}
            <div className="mb-4">
              <Form.Label className="fw-semibold">Select Size:</Form.Label>
              <Controller
                name="size"
                control={control}
                render={({ field }) => (
                  <>
                    <div className="d-flex gap-2 flex-wrap">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={`btn ${
                            selectedSize === size
                              ? 'btn-dark'
                              : 'btn-outline-dark'
                          }`}
                          style={{ minWidth: '60px' }}
                          onClick={() => field.onChange(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {errors.size && (
                      <div className="text-danger small mt-2">{errors.size.message}</div>
                    )}
                  </>
                )}
              />
            </div>

            {/* Color Selection */}
            <div className="mb-4">
              <Form.Label className="fw-semibold">Choose colour:</Form.Label>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <>
                    <div className="d-flex gap-3 flex-wrap">
                      {availableColors.length > 0 ? (
                        availableColors.map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            className={`btn btn-outline-dark position-relative ${
                              selectedColor === color.name ? 'border-3' : ''
                            }`}
                            style={{
                              minWidth: '100px',
                              backgroundColor:
                                selectedColor === color.name ? '#f8f9fa' : 'white',
                            }}
                            onClick={() => field.onChange(color.name)}
                          >
                            <div
                              className="rounded-circle me-2 d-inline-block"
                              style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: color.hexCode,
                                border: '1px solid #dee2e6',
                              }}
                            />
                            {color.name}
                          </button>
                        ))
                      ) : (
                        // Fallback colors if none provided
                        <>
                          {['Black', 'Tan'].map((colorName) => (
                            <button
                              key={colorName}
                              type="button"
                              className={`btn ${
                                selectedColor === colorName
                                  ? 'btn-dark'
                                  : 'btn-outline-dark'
                              }`}
                              onClick={() => field.onChange(colorName)}
                            >
                              {colorName}
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                    {errors.color && (
                      <div className="text-danger small mt-2">{errors.color.message}</div>
                    )}
                  </>
                )}
              />
            </div>

            {/* Terms Checkbox */}
            <div className="mb-4">
              <Controller
                name="agreedToTerms"
                control={control}
                render={({ field }) => (
                  <Form.Check
                    type="checkbox"
                    id="terms-checkbox"
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
                {submitting ? 'Submitting...' : 'Submit Exchange Request'}
              </Button>
              <Button
                type="button"
                variant="outline-dark"
                className="flex-fill"
                onClick={handleClose}
              >
                Cancel Exchange
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ExchangeModal;
