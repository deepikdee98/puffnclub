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
  Pagination,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import {
  FiEye,
  FiEdit,
  FiDownload,
  FiFilter,
  FiSearch,
  FiShoppingCart,
} from "react-icons/fi";
import Link from "next/link";
import { formatCurrency, formatRelativeTime } from "@/utils/helpers";
import { useOrders } from "@/hooks/useOrders";
import { useDebounce } from "@/hooks/useDebounce";
import { Order, OrderStatus } from "@/types";

import { exportAllOrdersToPDF } from "@/utils/bulkExport";
import { toast } from "react-toastify";
import styles from "./page.module.scss";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("Pending");
  const [newPaymentStatus, setNewPaymentStatus] = useState<
    "Paid" | "Pending" | "Failed" | "Refunded"
  >("Pending");
  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Use the orders hook with current filters
  const {
    orders,
    loading,
    error,
    pagination,
    statistics,
    refetch,
    updateOrderStatus,
    deleteOrder,
  } = useOrders({
    page: currentPage,
    limit: ordersPerPage,
    status: statusFilter || undefined,
    paymentStatus: paymentFilter || undefined,
    search: debouncedSearchTerm || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, paymentFilter, debouncedSearchTerm]);

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

  // Handle order deletion
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      await deleteOrder(orderToDelete);
      setShowDeleteModal(false);
      setOrderToDelete(null);
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

  // Open delete confirmation modal
  const openDeleteModal = (orderId: string) => {
    setOrderToDelete(orderId);
    setShowDeleteModal(true);
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "delivered":
        return "success";
      case "processing":
        return "info";
      case "shipped":
        return "primary";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
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

  // Handle bulk export of all orders
  const handleExport = async () => {
    try {
      if (orders.length === 0) {
        toast.error("No orders to export");
        return;
      }

      await exportAllOrdersToPDF(orders);
      toast.success(`Successfully exported ${orders.length} orders to PDF!`);
    } catch (error: any) {
      console.error("Error exporting all orders:", error);
      toast.error(`Failed to export orders: ${error.message}`);
    }
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(
      pagination.totalPages,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={!pagination.hasPrevPage}
        onClick={() => setCurrentPage(currentPage - 1)}
      />
    );

    // First page
    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis1" />);
      }
    }

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    // Last page
    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis2" />);
      }
      items.push(
        <Pagination.Item
          key={pagination.totalPages}
          onClick={() => setCurrentPage(pagination.totalPages)}
        >
          {pagination.totalPages}
        </Pagination.Item>
      );
    }

    // Next button
    items.push(
      <Pagination.Next
        key="next"
        disabled={!pagination.hasNextPage}
        onClick={() => setCurrentPage(currentPage + 1)}
      />
    );

    return <Pagination>{items}</Pagination>;
  };

  return (
    <div className={styles.ordersPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <Row className="align-items-center">
          <Col>
            <h1 className={styles.pageTitle}>Orders</h1>
            <p className={styles.pageSubtitle}>
              Manage and track all customer orders
            </p>
          </Col>
          <Col xs="auto">
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                as="a"
                href="/admin/dashboard/orders/search"
              >
                <FiSearch className="me-2" />
                Search Orders
              </Button>
              <Button variant="outline-primary" onClick={handleExport}>
                <FiDownload className="me-2" />
                Export
              </Button>
              {/* Create Order button removed as per requirements */}
            </div>
          </Col>
        </Row>
      </div>

      {/* Filters */}
      <Card className={styles.filtersCard}>
        <Card.Header className={styles.filtersHeader}>
          <h5 className={styles.filtersTitle}>
            <FiFilter className="me-2" />
            Filters
          </h5>
        </Card.Header>
        <Card.Body className={styles.filtersBody}>
          <Row className={styles.filterRow}>
            <Col md={4}>
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
            <Col md={4}>
              <Form.Group>
                <Form.Label>Order Status</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Payment Status</Form.Label>
                <Form.Select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                >
                  <option value="">All Payment Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Orders Table */}
      <Card className={styles.ordersCard}>
        <Card.Header className={styles.ordersHeader}>
          <div className={styles.ordersHeaderContent}>
            <h5 className={styles.ordersTitle}>
              <FiShoppingCart className="me-2" />
              Orders
            </h5>
            <Badge bg="primary" className={styles.ordersCount}>
              {pagination.totalOrders} orders
            </Badge>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          {error && (
            <Alert variant="danger" className="m-3">
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

          {loading ? (
            <div className="d-flex justify-content-center align-items-center p-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading orders...</span>
              </Spinner>
              <span className="ms-3">Loading orders...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FiShoppingCart size={48} />
              </div>
              <h6 className={styles.emptyTitle}>No Orders Found</h6>
              <p className={styles.emptyText}>
                {searchTerm || statusFilter || paymentFilter
                  ? "No orders match your current filters. Try adjusting your search criteria."
                  : "No orders have been placed yet. Orders will appear here once customers start purchasing."}
              </p>
              {/* CTA removed: no admin-side order creation */}
            </div>
          ) : (
            <>
              <div className={styles.tableWrapper}>
                <Table responsive hover className={styles.ordersTable}>
                  <thead>
                    <tr>
                      <th>Order Number</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <span className={styles.orderId}>
                            {order.orderNumber}
                          </span>
                        </td>
                        <td>
                          <div className={styles.customerInfo}>
                            <div className={styles.customerName}>
                              {order.user?.name || "N/A"}
                            </div>
                            <div className={styles.customerEmail}>
                              {order.user?.email || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span>
                            {order.items.length} item
                            {order.items.length !== 1 ? "s" : ""}
                          </span>
                        </td>
                        <td>
                          <span className={styles.orderTotal}>
                            {formatCurrency(order.total)}
                          </span>
                        </td>
                        <td>
                          <Badge
                            bg={getStatusVariant(order.status)}
                            className={styles.statusBadge}
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td>
                          <Badge
                            bg={getPaymentStatusVariant(order.paymentStatus)}
                            className={styles.statusBadge}
                          >
                            {order.paymentStatus}
                          </Badge>
                        </td>
                        <td>
                          <span className={styles.orderDate}>
                            {formatRelativeTime(order.createdAt)}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              as="a"
                              href={`/admin/dashboard/orders/${order._id}`}
                              title="View Details"
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

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className={styles.paginationWrapper}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted">
                      Showing {(currentPage - 1) * ordersPerPage + 1} to{" "}
                      {Math.min(
                        currentPage * ordersPerPage,
                        pagination.totalOrders
                      )}{" "}
                      of {pagination.totalOrders} orders
                    </div>
                    {renderPagination()}
                  </div>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderToUpdate && (
            <>
              <p>
                <strong>Order:</strong> {orderToUpdate.orderNumber}
              </p>
              <p>
                <strong>Customer:</strong> {orderToUpdate.user?.name}
              </p>

              <Form.Group className="mb-3">
                <Form.Label>Order Status</Form.Label>
                <Form.Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Payment Status</Form.Label>
                <Form.Select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value as any)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </Form.Select>
              </Form.Group>
            </>
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this order?</p>
          <p className="text-muted">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteOrder}>
            Delete Order
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
