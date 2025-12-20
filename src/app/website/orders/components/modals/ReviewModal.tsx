'use client';

import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiStar, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { reviewService } from '../../../services/reviewService';
import { getAuthToken } from '../../../services/api';

// Review validation schema
const reviewSchema = yup.object().shape({
  rating: yup
    .number()
    .min(1, 'Please select a rating')
    .max(5)
    .required('Rating is required'),
  comment: yup
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(500, 'Review must not exceed 500 characters')
    .required('Review is required'),
});

interface ReviewFormData {
  rating: number;
  comment: string;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  productId: string;
  productName: string;
  onSuccess?: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  orderId,
  productId,
  productName,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ReviewFormData>({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const rating = watch('rating');
  const comment = watch('comment');

  const handleClose = () => {
    reset();
    setStep(1);
    onClose();
  };

  const onSubmit = async (data: ReviewFormData) => {
    try {
      setSubmitting(true);

      const token = getAuthToken();
      if (!token) {
        toast.error('Please login to submit a review');
        setSubmitting(false);
        return;
      }

      await reviewService.submitReview(productId, {
        rating: data.rating,
        title: `Review for ${productName}`,
        comment: data.comment,
      }, token);

      toast.success('Review submitted successfully!');
      setStep(3); // Show success screen
      setSubmitting(false);

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Failed to submit review. Please try again.');
      setSubmitting(false);
    }
  };

  const renderStars = (currentRating: number, isInteractive: boolean = false) => {
    return (
      <div className="d-flex gap-2 justify-content-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = isInteractive
            ? star <= (hoveredRating || currentRating)
            : star <= currentRating;

          return (
            <button
              key={star}
              type="button"
              className="btn btn-link p-0 border-0"
              onClick={() => isInteractive && setValue('rating', star)}
              onMouseEnter={() => isInteractive && setHoveredRating(star)}
              onMouseLeave={() => isInteractive && setHoveredRating(0)}
              disabled={!isInteractive}
              style={{ cursor: isInteractive ? 'pointer' : 'default' }}
            >
              <FiStar
                size={32}
                fill={isFilled ? '#FFD700' : 'none'}
                stroke={isFilled ? '#FFD700' : '#D1D5DB'}
                strokeWidth={2}
              />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <Modal show={isOpen} onHide={handleClose} centered contentClassName="shadow-none">
      <Modal.Header className="border-0 pb-0">
        <Modal.Title className="w-100">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              {step === 3 ? 'Thank you for the review' : 'Rate the Product'}
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
        {step === 1 || step === 2 ? (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <p className="text-muted small mb-4">Share your opinion on the product</p>

            {/* Rating Section */}
            <div className="mb-4">
              <Form.Label className="fw-semibold">Rating</Form.Label>
              <p className="text-muted small mb-3">
                {step === 1
                  ? 'Click here help us tailoring the users'
                  : 'Give the rating by lightening the starts'}
              </p>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <>
                    {renderStars(field.value, true)}
                    {errors.rating && (
                      <div className="text-danger small mt-2">{errors.rating.message}</div>
                    )}
                  </>
                )}
              />
            </div>

            {/* Review Section */}
            <div className="mb-4">
              <Form.Label className="fw-semibold">Review</Form.Label>
              <p className="text-muted small mb-2">Write the review about the product</p>
              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      {...field}
                      placeholder="Share your experience with this product..."
                      isInvalid={!!errors.comment}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.comment?.message}
                    </Form.Control.Feedback>
                    <div className="text-end text-muted small mt-1">
                      {field.value.length}/500
                    </div>
                  </>
                )}
              />
            </div>

            <Button
              type="submit"
              variant="dark"
              className="w-100"
              disabled={submitting || rating === 0}
            >
              {submitting ? 'Submitting...' : 'Submit review'}
            </Button>
          </Form>
        ) : (
          // Step 3: Success Message
          <div className="text-center py-4">
            <p className="mb-4">
              Thank you for the review and rating the product & Hope you continue to trust the
              puffn club...
            </p>
            <Button variant="dark" className="w-100" onClick={handleClose}>
              Continue Shopping
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ReviewModal;
