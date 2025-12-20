'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import PageHeader from '../../components/shared/PageHeader';
import TrackingTimeline from '../../components/TrackingTimeline';
import ProductCard from '../../components/shared/ProductCard';
import ActionButton from '../../components/shared/ActionButton';
import ReviewModal from '../../components/modals/ReviewModal';
import ExchangeModal from '../../components/modals/ExchangeModal';
import ReturnProductModal from '../../components/modals/ReturnProductModal';
import CancelOrderModal from '../../components/modals/CancelOrderModal';
import { orderService } from '../../../services/orderService';
import {
  generateTrackingStages,
  canCancelOrder,
  canExchangeOrReturn,
  canReviewOrder,
  getFirstProduct,
} from '../../utils/orderHelpers';
import type { Order } from '../../types/orders.types';

export default function TrackOrderPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params?.orderId as string;
  const action = searchParams?.get('action');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  useEffect(() => {
    // Open modal based on URL query parameter
    if (order && action) {
      switch (action) {
        case 'review':
          setShowReviewModal(true);
          break;
        case 'exchange':
          setShowExchangeModal(true);
          break;
        case 'cancel':
          setShowCancelModal(true);
          break;
      }
    }
  }, [order, action]);

  const [trackingData, setTrackingData] = useState<any>(null);
  const [loadingTracking, setLoadingTracking] = useState(false);

  const loadTrackingData = async () => {
    try {
      setLoadingTracking(true);
      const response = await orderService.getOrderTracking(orderId);
      setTrackingData(response.tracking);
    } catch (err: any) {
      console.error('Error loading tracking data:', err);
      // Don't show error toast as tracking might not be available yet
    } finally {
      setLoadingTracking(false);
    }
  };

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getOrderById(orderId);
      setOrder(response.order as unknown as Order);
      
      // Load tracking data if order has tracking info
      loadTrackingData();
    } catch (err: any) {
      console.error('Error loading order:', err);
      setError('Failed to load order details');
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSuccess = () => {
    setShowCancelModal(false);
    loadOrder(); // Reload order data
    toast.success('Order cancelled successfully');
  };

  const handleReviewSuccess = () => {
    setShowReviewModal(false);
    loadOrder(); // Reload order data
  };

  const handleExchangeSuccess = () => {
    setShowExchangeModal(false);
    toast.success('Exchange request submitted successfully');
    // Optionally redirect to exchange tracking page
    // router.push(`/website/orders/${orderId}/exchange-tracking`);
  };

  const handleReturnSuccess = () => {
    setShowReturnModal(false);
    toast.success('Return request submitted successfully');
  };

  const handleShareOrder = () => {
    // TODO: Implement share functionality when design is provided
    const shareUrl = `${window.location.origin}/website/orders/${orderId}/track`;

    if (navigator.share) {
      navigator.share({
        title: `Order ${order?.orderNumber}`,
        text: 'Track my order',
        url: shareUrl,
      }).catch((err) => console.log('Error sharing:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      toast.success('Order link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="dark" />
          <p className="mt-3 text-muted">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <p className="text-danger mb-3">{error || 'Order not found'}</p>
          <button onClick={() => router.back()} className="btn btn-dark">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Helper function to generate stages from tracking data
  const generateTrackingStagesFromTrackingData = (order: Order, tracking: any): any[] => {
    const stages = generateTrackingStages(order);
    
    // Update stages with real tracking data if available
    if (tracking.trackingHistory && tracking.trackingHistory.length > 0) {
      // Map tracking history to stages
      const history = tracking.trackingHistory.reverse(); // Most recent first
      
      stages.forEach((stage) => {
        // Try to match tracking events to stages
        const matchingEvent = history.find((event: any) => 
          event.status?.toLowerCase().includes(stage.label.toLowerCase()) ||
          event.location?.toLowerCase().includes(stage.label.toLowerCase())
        );
        
        if (matchingEvent) {
          stage.status = 'completed';
          stage.timestamp = matchingEvent.timestamp || matchingEvent.date;
        }
      });
    }
    
    return stages;
  };

  // Use tracking data if available, otherwise generate from order
  const trackingStages = trackingData 
    ? generateTrackingStagesFromTrackingData(order, trackingData)
    : generateTrackingStages(order);
  
  const firstProduct = getFirstProduct(order);
  const isDelivered = order.orderStatus === 'delivered' || trackingData?.status === 'delivered';
  const canCancel = canCancelOrder(order);
  const canExchange = canExchangeOrReturn(order);
  const canReview = canReviewOrder(order);

  return (
    <>
      <PageHeader
        title="Track Order"
        subtitle="Check the order update to acknowledge the details of shipment."
        showLogo={true}
        showBack={true}
        showHelp={true}
      />

      <Container className="py-4">
        <Row className="g-4">
          {/* Left Column - Tracking Timeline */}
          <Col lg={6} md={12}>
            <div className="bg-white p-4 rounded">
              <TrackingTimeline stages={trackingStages} />
            </div>
          </Col>

          {/* Right Column - Product Card & Actions */}
          <Col lg={6} md={12}>
            <div className="d-flex flex-column gap-3">
              {/* Product Card */}
              <ProductCard product={firstProduct} size="large" />

              {/* Action Buttons */}
              <div className="d-flex flex-column flex-md-row gap-3">
                {isDelivered ? (
                  <>
                    {/* Delivered Order Actions */}
                    {canExchange && (
                      <ActionButton
                        label="Return / Exchange"
                        onClick={() => setShowExchangeModal(true)}
                        variant="primary"
                        fullWidth
                      />
                    )}
                    {canReview && (
                      <ActionButton
                        label="Review Product"
                        onClick={() => setShowReviewModal(true)}
                        variant="outline"
                        fullWidth
                      />
                    )}
                  </>
                ) : (
                  <>
                    {/* In-Progress Order Actions */}
                    {canCancel && (
                      <ActionButton
                        label="Cancel Order"
                        onClick={() => setShowCancelModal(true)}
                        variant="primary"
                        fullWidth
                      />
                    )}
                    <ActionButton
                      label="Share Order details"
                      onClick={handleShareOrder}
                      variant="outline"
                      fullWidth
                    />
                  </>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modals */}
      {order && firstProduct && (
        <>
          <ReviewModal
            isOpen={showReviewModal}
            onClose={() => setShowReviewModal(false)}
            orderId={order._id}
            productId={firstProduct.product._id}
            productName={firstProduct.product.name}
            onSuccess={handleReviewSuccess}
          />

          <ExchangeModal
            isOpen={showExchangeModal}
            onClose={() => setShowExchangeModal(false)}
            orderId={order._id}
            productId={firstProduct.product._id}
            availableSizes={firstProduct.availableSizes || ['S', 'M', 'L', 'XL']}
            availableColors={firstProduct.availableColors || []}
            onExchangeSelect={() => {
              setShowExchangeModal(false);
              // Exchange form will be shown in the same modal
            }}
            onReturnSelect={() => {
              setShowExchangeModal(false);
              setShowReturnModal(true);
            }}
            onSuccess={handleExchangeSuccess}
          />

          <ReturnProductModal
            isOpen={showReturnModal}
            onClose={() => setShowReturnModal(false)}
            orderId={order._id}
            productId={firstProduct.product._id}
            product={firstProduct}
            onSuccess={handleReturnSuccess}
          />

          <CancelOrderModal
            isOpen={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            orderId={order._id}
            orderStatus={order.orderStatus}
            onSuccess={handleCancelSuccess}
          />
        </>
      )}
    </>
  );
}
