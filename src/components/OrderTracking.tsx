import React, { useState, useEffect } from 'react';

interface TrackingDetail {
  location: string;
  status: string;
  date: string;
  time: string;
}

interface TrackingInfo {
  status: string;
  awbCode?: string;
  courierName?: string;
  trackingUrl?: string;
  currentLocation?: string;
  estimatedDelivery?: string;
  trackingHistory: TrackingDetail[];
  shipmentDetails: any;
}

interface OrderTrackingProps {
  orderId: string;
  customerToken: string;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId, customerToken }: OrderTrackingProps) => {
  const [tracking, setTracking] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrackingInfo();
  }, [orderId]);

  const fetchTrackingInfo = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/website/orders/${orderId}/tracking`, {
        headers: {
          'Authorization': `Bearer ${customerToken}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setTracking(data.tracking);
      } else {
        setError(data.error || 'Failed to fetch tracking information');
      }
    } catch (err) {
      setError('Failed to fetch tracking information');
      console.error('Tracking fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-purple-100 text-purple-800',
      'shipped': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'PICKUP_SCHEDULED': 'bg-blue-100 text-blue-800',
      'PICKED_UP': 'bg-purple-100 text-purple-800',
      'IN_TRANSIT': 'bg-indigo-100 text-indigo-800',
      'OUT_FOR_DELIVERY': 'bg-orange-100 text-orange-800',
      'DELIVERED': 'bg-green-100 text-green-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading tracking information...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchTrackingInfo}
          className="mt-2 text-sm text-red-800 hover:text-red-900 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No tracking information available</p>
      </div>
    );
  }

  return (
    <div className="order-tracking">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Order Tracking</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tracking.status)}`}>
            {formatStatus(tracking.status)}
          </span>
        </div>

        {/* Tracking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {tracking.awbCode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AWB Code
              </label>
              <p className="text-gray-900 font-mono">{tracking.awbCode}</p>
            </div>
          )}

          {tracking.courierName && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Courier Partner
              </label>
              <p className="text-gray-900">{tracking.courierName}</p>
            </div>
          )}

          {tracking.currentLocation && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Location
              </label>
              <p className="text-gray-900">{tracking.currentLocation}</p>
            </div>
          )}

          {tracking.estimatedDelivery && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Delivery
              </label>
              <p className="text-gray-900">
                {new Date(tracking.estimatedDelivery).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>

        {/* External Tracking Link */}
        {tracking.trackingUrl && (
          <div className="mb-6">
            <a
              href={tracking.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Track on Courier Website
            </a>
          </div>
        )}

        {/* Tracking History */}
        {tracking.trackingHistory && tracking.trackingHistory.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tracking History</h3>
            <div className="space-y-4">
              {tracking.trackingHistory.map((detail, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {formatStatus(detail.status)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {detail.date} {detail.time}
                      </p>
                    </div>
                    {detail.location && (
                      <p className="text-sm text-gray-600 mt-1">{detail.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Tracking History */}
        {(!tracking.trackingHistory || tracking.trackingHistory.length === 0) && (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-600">Your order is being processed</p>
            <p className="text-sm text-gray-500 mt-1">Tracking details will appear once the order is shipped</p>
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchTrackingInfo}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Refresh Tracking Information
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;