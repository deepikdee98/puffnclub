'use client';

import React, { useEffect, useState } from "react";
import { Row, Col, Button, Form, Alert, Spinner } from "react-bootstrap";
import { FiStar } from "react-icons/fi";
import styles from "../styles.module.scss";
import classNames from "classnames";
import { IoIosStar } from "react-icons/io";
import { reviewService, Review } from "../../../services/reviewService";

interface ProductDescriptionAndReviewsProps {
  description: string;
  productId: string;
}

export default function ProductDescriptionAndReviews({
  description,
  productId,
}: ProductDescriptionAndReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
  });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reviewService.getProductReviews(productId, 1, 10);
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setTotalReviews(data.totalReviews);
    } catch (err: any) {
      console.error('Failed to load reviews:', err);
      setError('Failed to load reviews. Please try again later.');
      // Fallback to empty state
      setReviews([]);
      setAverageRating(0);
      setTotalReviews(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if customer is logged in
    const token = localStorage.getItem('customerToken');
    if (!token) {
      setSubmitError('Please login to submit a review');
      return;
    }

    // Validate form
    if (!reviewForm.title.trim() || !reviewForm.comment.trim()) {
      setSubmitError('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);
      
      await reviewService.submitReview(productId, reviewForm, token);
      
      setSubmitSuccess(true);
      setShowReviewForm(false);
      
      // Reset form
      setReviewForm({
        rating: 5,
        title: '',
        comment: '',
      });

      // Refresh reviews
      fetchReviews();

      // Hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to submit review:', err);
      setSubmitError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <IoIosStar
          key={i}
          className={i < fullStars ? "text-warning" : "text-muted"}
          size={20}
        />
      );
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      {/* Description Section */}
      <h5 className="mb-2 mt-4">Description</h5>
      <p className="mb-4">{description}</p>

      {/* Reviews Section */}
      <h6 className="my-3">Reviews & Ratings</h6>

      {/* Success Message */}
      {submitSuccess && (
        <Alert variant="success" dismissible onClose={() => setSubmitSuccess(false)}>
          Review submitted successfully! Thank you for your feedback.
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading reviews...</span>
          </Spinner>
        </div>
      ) : error ? (
        /* Error State */
        <Alert variant="warning">
          {error}
        </Alert>
      ) : (
        <>
          {/* Rating Summary */}
          <div className="mb-4">
            <div className="d-flex align-items-center fw-bold mb-1">
              <span className={styles.reviewScore}>
                {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
              </span>
              <IoIosStar className="text-dark ms-2" size={28} />
            </div>
            <div className={classNames("pb-2 text-dark mt-2", styles.verified)}>
              {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
            </div>

            {/* Write Review Button */}
            {!showReviewForm && (
              <Button
                variant="outline-dark"
                size="sm"
                className="mb-3"
                onClick={() => setShowReviewForm(true)}
              >
                Write a Review
              </Button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="mb-4 p-3 border rounded bg-light">
              <h6 className="mb-3">Write Your Review</h6>
              
              {submitError && (
                <Alert variant="danger" dismissible onClose={() => setSubmitError(null)}>
                  {submitError}
                </Alert>
              )}

              <Form onSubmit={handleSubmitReview}>
                {/* Rating */}
                <Form.Group className="mb-3">
                  <Form.Label>Rating *</Form.Label>
                  <div className="d-flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <IoIosStar
                        key={star}
                        size={32}
                        className={star <= reviewForm.rating ? "text-warning" : "text-muted"}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      />
                    ))}
                  </div>
                </Form.Group>

                {/* Title */}
                <Form.Group className="mb-3">
                  <Form.Label>Review Title *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Sum up your experience"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    maxLength={200}
                    required
                  />
                </Form.Group>

                {/* Comment */}
                <Form.Group className="mb-3">
                  <Form.Label>Your Review *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Share your thoughts about this product"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    maxLength={2000}
                    required
                  />
                  <Form.Text className="text-muted">
                    {reviewForm.comment.length}/2000 characters
                  </Form.Text>
                </Form.Group>

                {/* Buttons */}
                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    variant="dark"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => {
                      setShowReviewForm(false);
                      setSubmitError(null);
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="pb-4">
              {reviews.map((review) => (
                <div key={review._id} className="mb-4 border-bottom pb-4">
                  <div className="d-flex align-items-center mb-2">
                    <span
                      className={classNames(
                        "d-inline-block me-3 text-white fw-normal",
                        styles.ratingBadge
                      )}
                    >
                      {review.rating}★
                    </span>
                    <span className={styles.reviewTitle}>{review.title}</span>
                    {review.isVerifiedPurchase && (
                      <span className="badge bg-success ms-2" style={{ fontSize: '0.7rem' }}>
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="my-3">{review.comment}</div>
                  <div className={styles.reviewBy}>
                    {review.reviewer} | {formatDate(review.date)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}