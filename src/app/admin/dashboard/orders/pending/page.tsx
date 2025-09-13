"use client";

import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Form,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import {
  FiEye,
  FiEdit,
  FiClock,
  FiSearch,
  FiShoppingCart,
  FiRefreshCw,
} from "react-icons/fi";
import Link from "next/link";
import { formatCurrency, formatRelativeTime } from "@/utils/helpers";
import { usePendingOrders } from "@/hooks/usePendingOrders";
import { Order, OrderStatus } from "@/types";

import { toast } from "react-toastify";

export default function PendingOrdersPage() {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("Pending");
  const [newPaymentStatus, setNewPaymentStatus] = useState<
    "Paid" | "Pending" | "Failed" | "Refunded"
  >("Pending");

  // Use the pending orders hook
  const { orders, loading, error, refetch, updateOrderStatus } =
    usePendingOrders();

  // Filter orders based on search
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm]);

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!orderToUpdate) return;

    try {
      await updateOrderStatus(orderToUpdate._id, newStatus, newPaymentStatus);
      setShowStatusModal(false);
      setOrderToUpdate(null);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  // Open status update modal
  const openStatusModal = (order: Order) => {
    setOrderToUpdate(order);
    setNewStatus(order.status);
    setNewPaymentStatus(order.paymentStatus);
    setShowStatusModal(true);
  };

  const getPaymentStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "danger";
      case "refunded":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Pending Orders</h1>
          <p className="text-muted mb-0">
            Orders awaiting processing and fulfillment
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            onClick={refetch}
            disabled={loading}
          >
            <FiRefreshCw
              className="me-2"
              style={{
                animation: loading ? "spin 1s linear infinite" : "none",
              }}
            />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          <style jsx>{`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
          <Button
            variant="outline-primary"
            as="a"
            href="/admin/dashboard/orders"
          >
            View All Orders
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-4">
          <strong>Error:</strong> {error}
          <Button
            variant="outline-danger"
            size="sm"
            className="ms-2"
            onClick={refetch}
          >
            Retry
          </Button>
        </Alert>
      )}

      {/* Search Filter */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="bg-light border-0">
          <h5 className="mb-0">
            <FiSearch className="me-2" />
            Search Pending Orders
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Search Orders</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by order number, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Pending Orders Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-light border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FiClock className="me-2" />
              Pending Orders
            </h5>
            <Badge bg="warning">{filteredOrders.length} pending</Badge>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center p-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">
                  Loading pending orders...
                </span>
              </Spinner>
              <span className="ms-3">Loading pending orders...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3">
                {searchTerm ? (
                  <FiSearch size={48} className="text-muted" />
                ) : (
                  <FiClock size={48} className="text-muted" />
                )}
              </div>
              <h6 className="text-muted">
                {searchTerm ? "No Matching Orders Found" : "No Pending Orders"}
              </h6>
              <p className="text-muted mb-4">
                {searchTerm
                  ? "No pending orders match your search criteria. Try adjusting your search terms."
                  : "All orders have been processed. New pending orders will appear here."}
              </p>
              {searchTerm && (
                <Button
                  variant="outline-primary"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Order Number</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment Status</th>
                    <th>Order Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <span className="font-monospace text-primary fw-bold">
                          {order.orderNumber}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div className="fw-semibold">
                            {order.user?.name || "N/A"}
                          </div>
                          <small className="text-muted">
                            {order.user?.email || "N/A"}
                          </small>
                        </div>
                      </td>
                      <td>
                        <span>
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold text-success">
                          {formatCurrency(order.total)}
                        </span>
                      </td>
                      <td>
                        <Badge
                          bg={getPaymentStatusVariant(order.paymentStatus)}
                          className="text-capitalize"
                        >
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td>
                        <span className="text-muted">
                          {formatRelativeTime(order.createdAt)}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            as="a"
                            href={`/admin/dashboard/orders/${order._id}`}
                            title="View Order"
                          >
                            <FiEye size={14} />
                          </Button>

                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => openStatusModal(order)}
                            title="Edit Order"
                          >
                            <FiEdit size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Quick Stats */}
      {filteredOrders.length > 0 && (
        <Row className="mt-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <h4 className="text-warning mb-1">{filteredOrders.length}</h4>
                <small className="text-muted">Total Pending</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <h4 className="text-success mb-1">
                  {formatCurrency(
                    filteredOrders.reduce((sum, order) => sum + order.total, 0)
                  )}
                </h4>
                <small className="text-muted">Total Value</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <h4 className="text-info mb-1">
                  {
                    filteredOrders.filter(
                      (order) => order.paymentStatus?.toLowerCase() === "paid"
                    ).length
                  }
                </h4>
                <small className="text-muted">Paid Orders</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <h4 className="text-warning mb-1">
                  {
                    filteredOrders.filter(
                      (order) =>
                        order.paymentStatus?.toLowerCase() === "pending"
                    ).length
                  }
                </h4>
                <small className="text-muted">Payment Pending</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderToUpdate && (
            <div>
              <p className="mb-3">
                <strong>Order:</strong> {orderToUpdate.orderNumber}
              </p>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Order Status</Form.Label>
                    <Form.Select
                      value={newStatus}
                      onChange={(e) =>
                        setNewStatus(e.target.value as OrderStatus)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Payment Status</Form.Label>
                    <Form.Select
                      value={newPaymentStatus}
                      onChange={(e) =>
                        setNewPaymentStatus(
                          e.target.value as
                            | "Paid"
                            | "Pending"
                            | "Failed"
                            | "Refunded"
                        )
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStatusUpdate}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
