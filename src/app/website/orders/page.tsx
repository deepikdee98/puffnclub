'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Tab, Tabs, Table } from 'react-bootstrap';
import { FiPackage, FiTruck, FiCheck, FiX, FiEye, FiDownload } from 'react-icons/fi';
import Link from 'next/link';
import { LoadingSpinner } from '@/app/components';
import { orderService, Order, OrderFilters } from '../services/orderService';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';



export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders();
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await orderService.cancelOrder(orderId);
      loadOrders(); // Reload orders
      toast.success('Order cancelled');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'primary';
      case 'processing': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <FiCheck />;
      case 'shipped': return <FiTruck />;
      case 'processing': return <FiPackage />;
      case 'cancelled': return <FiX />;
      default: return <FiPackage />;
    }
  };

  const filterOrders = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  const filteredOrders = filterOrders(activeTab);

  const renderOrderCard = (order: any) => (
    <Card key={order.id} className="border-0 shadow-sm mb-4">
      <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-1">Order {order.orderNumber}</h6>
          <small className="text-muted">Placed on {formatDate(order.date)}</small>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Badge bg={getStatusVariant(order.status)} className="d-flex align-items-center gap-1">
            {getStatusIcon(order.status)}
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
          <Button variant="outline-primary" size="sm">
            <FiEye className="me-1" />
            View Details
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={8}>
            <div className="order-items">
              {order.items.map((item: any, index: number) => (
                <div key={item.id} className="d-flex align-items-center mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="rounded me-3"
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.name}</h6>
                    <div className="d-flex gap-3 text-muted small">
                      <span>Size: {item.size}</span>
                      <span>Color: {item.color}</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="fw-bold">{formatCurrency(item.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Col>
          <Col md={4}>
            <div className="order-summary">
              <div className="d-flex justify-content-between mb-2">
                <span>Total Amount:</span>
                <span className="fw-bold">{formatCurrency(order.total)}</span>
              </div>
              <div className="mb-3">
                <small className="text-muted">
                  <strong>Shipping Address:</strong><br />
                  {order.shippingAddress.name}<br />
                  {order.shippingAddress.address}
                </small>
              </div>
              {order.trackingNumber && (
                <div className="mb-2">
                  <small className="text-muted">
                    <strong>Tracking:</strong> {order.trackingNumber}
                  </small>
                </div>
              )}
              {order.estimatedDelivery && (
                <div className="mb-3">
                  <small className="text-muted">
                    <strong>Est. Delivery:</strong> {formatDate(order.estimatedDelivery)}
                  </small>
                </div>
              )}
              <div className="d-flex gap-2">
                {order.status === 'shipped' && (
                  <Button variant="outline-primary" size="sm" className="flex-fill">
                    Track Order
                  </Button>
                )}
                {order.status === 'delivered' && (
                  <Button variant="outline-secondary" size="sm" className="flex-fill">
                    <FiDownload className="me-1" />
                    Invoice
                  </Button>
                )}
                {(order.status === 'pending' || order.status === 'processing') && (
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    className="flex-fill"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>My Orders</h2>
            <Button variant="outline-primary">
              <FiDownload className="me-2" />
              Download All Invoices
            </Button>
          </div>

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k || 'all')}
            className="mb-4"
          >
            <Tab eventKey="all" title={`All Orders (${orders.length})`}>
              <div className="orders-list">
                {loading ? (
                  <div className="text-center py-5">
                    <LoadingSpinner />
                    <p className="mt-3 text-muted">Loading your orders...</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-5">
                    <FiPackage size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">No orders found</h5>
                    <p className="text-muted">You haven't placed any orders yet.</p>
                    <Button as="a" href="/website/products" variant="primary">
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  filteredOrders.map(renderOrderCard)
                )}
              </div>
            </Tab>

            <Tab eventKey="processing" title={`Processing (${filterOrders('processing').length})`}>
              <div className="orders-list">
                {filterOrders('processing').length === 0 ? (
                  <div className="text-center py-5">
                    <FiPackage size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">No processing orders</h5>
                    <p className="text-muted">You don't have any orders being processed.</p>
                  </div>
                ) : (
                  filterOrders('processing').map(renderOrderCard)
                )}
              </div>
            </Tab>

            <Tab eventKey="shipped" title={`Shipped (${filterOrders('shipped').length})`}>
              <div className="orders-list">
                {filterOrders('shipped').length === 0 ? (
                  <div className="text-center py-5">
                    <FiTruck size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">No shipped orders</h5>
                    <p className="text-muted">You don't have any orders that have been shipped.</p>
                  </div>
                ) : (
                  filterOrders('shipped').map(renderOrderCard)
                )}
              </div>
            </Tab>

            <Tab eventKey="delivered" title={`Delivered (${filterOrders('delivered').length})`}>
              <div className="orders-list">
                {filterOrders('delivered').length === 0 ? (
                  <div className="text-center py-5">
                    <FiCheck size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">No delivered orders</h5>
                    <p className="text-muted">You don't have any delivered orders.</p>
                  </div>
                ) : (
                  filterOrders('delivered').map(renderOrderCard)
                )}
              </div>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}