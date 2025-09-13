"use client";

import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  ProgressBar,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiShoppingCart,
  FiUsers,
  FiDollarSign,
  FiPackage,
  FiEye,
  FiEdit,
  FiMoreVertical,
  FiArrowUpRight,
  FiArrowDownRight,
  FiRefreshCw,
} from "react-icons/fi";
import Link from "next/link";
import {
  formatCurrency,
  formatNumber,
  formatRelativeTime,
} from "@/utils/helpers";
import { getImageSrc, handleImageError } from "@/utils/imageUtils";
import MetricsCard from "./components/MetricsCard";
import SalesChart from "./components/SalesChart";
import NotificationSummary from "./components/NotificationSummary";
import { useDashboard } from "@/hooks/useDashboard";
import styles from "./page.module.scss";

export default function DashboardPage() {
  const { metrics, recentOrders, topProducts, loading, error, refreshData } =
    useDashboard();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "processing":
        return "info";
      case "pending":
        return "warning";
      case "shipped":
        return "primary";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock < 20) return { variant: "danger", text: "Low Stock" };
    if (stock < 50) return { variant: "warning", text: "Medium Stock" };
    return { variant: "success", text: "In Stock" };
  };

  return (
    <div className={styles.dashboardPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <Row className="align-items-center">
          <Col>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <p className={styles.pageSubtitle}>
              Welcome back! Here's what's happening with your store today.
            </p>
          </Col>
          <Col xs="auto">
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                onClick={refreshData}
                disabled={loading}
              >
                <FiRefreshCw
                  className={`me-2 ${
                    loading ? "spinner-border spinner-border-sm" : ""
                  }`}
                />
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                variant="primary"
                as="a"
                href="/admin/dashboard/analytics"
              >
                <FiTrendingUp className="me-2" />
                View Analytics
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-4" dismissible>
          <strong>Error:</strong> {error}
          <Button
            variant="outline-danger"
            size="sm"
            className="ms-2"
            onClick={refreshData}
          >
            Retry
          </Button>
        </Alert>
      )}

      {/* Metrics Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <MetricsCard
            title="Today's Revenue"
            value={metrics ? formatCurrency(metrics.revenue.today) : "---"}
            subtitle={
              metrics
                ? `This week: ${formatCurrency(metrics.revenue.week)}`
                : "---"
            }
            growth={metrics?.revenue.growth || 0}
            trend={metrics?.revenue.trend || "up"}
            icon={<FiDollarSign size={24} />}
            iconColor="#1976d2"
            iconBg="#e3f2fd"
          />
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <MetricsCard
            title="Total Orders"
            value={metrics ? formatNumber(metrics.orders.total) : "---"}
            subtitle={metrics ? `Pending: ${metrics.orders.pending}` : "---"}
            growth={metrics?.orders.growth || 0}
            trend={metrics?.orders.trend || "up"}
            icon={<FiShoppingCart size={24} />}
            iconColor="#7b1fa2"
            iconBg="#f3e5f5"
          />
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <MetricsCard
            title="Total Customers"
            value={metrics ? formatNumber(metrics.customers.total) : "---"}
            subtitle={metrics ? `New: ${metrics.customers.new}` : "---"}
            growth={metrics?.customers.growth || 0}
            trend={metrics?.customers.trend || "up"}
            icon={<FiUsers size={24} />}
            iconColor="#388e3c"
            iconBg="#e8f5e8"
          />
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <MetricsCard
            title="Total Products"
            value={metrics ? formatNumber(metrics.products.total) : "---"}
            subtitle={
              metrics ? `${metrics.products.lowStock} Low Stock` : "---"
            }
            growth={metrics?.products.growth || 0}
            trend={metrics?.products.trend || "up"}
            icon={<FiPackage size={24} />}
            iconColor="#f57c00"
            iconBg="#fff3e0"
          />
        </Col>
      </Row>

      {/* Charts and Analytics */}
      <Row className="mb-4">
        <Col lg={8} className="mb-4">
          <SalesChart />
        </Col>
        <Col lg={4} className="mb-4">
          <NotificationSummary />
        </Col>
      </Row>

      {/* Main Content */}
      <Row>
        {/* Recent Orders */}
        <Col lg={8} className="mb-4">
          <Card className={styles.contentCard}>
            <Card.Header className={styles.cardHeader}>
              <div className={styles.cardHeaderContent}>
                <h5 className={styles.cardTitle}>Recent Orders</h5>
                <Button
                  variant="outline-primary"
                  size="sm"
                  as="a"
                  href="/admin/dashboard/orders"
                >
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center p-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">
                      Loading recent orders...
                    </span>
                  </Spinner>
                  <span className="ms-3">Loading recent orders...</span>
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center p-5">
                  <FiShoppingCart size={48} className="text-muted mb-3" />
                  <h6 className="text-muted">No Recent Orders</h6>
                  <p className="text-muted mb-0">
                    Recent orders will appear here once customers start
                    purchasing.
                  </p>
                </div>
              ) : (
                <div className={styles.tableWrapper}>
                  <Table responsive hover className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Order Number</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order._id}>
                          <td>
                            <span className={styles.orderId}>
                              {order.orderNumber || `#${order._id.slice(-6)}`}
                            </span>
                          </td>
                          <td>
                            <div className={styles.customerInfo}>
                              <div className={styles.customerName}>
                                {order.user?.name ||
                                  order.customer?.name ||
                                  "Guest User"}
                              </div>
                              <div className={styles.customerEmail}>
                                {order.user?.email ||
                                  order.customer?.email ||
                                  "No email"}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={styles.orderTotal}>
                              {formatCurrency(order.total || 0)}
                            </span>
                          </td>
                          <td>
                            <Badge
                              bg={getStatusVariant(order.status)}
                              className={styles.statusBadge}
                            >
                              {order.status || "Pending"}
                            </Badge>
                          </td>
                          <td>
                            <span className={styles.orderDate}>
                              {formatRelativeTime(order.createdAt)}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionButtons}>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                as={Link}
                                href={`/admin/dashboard/orders/${order._id}`}
                                title="View Order Details"
                              >
                                <FiEye size={14} />
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                as={Link}
                                href={`/admin/dashboard/orders/${order._id}/edit`}
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
        </Col>

        {/* Top Products */}
        <Col lg={4} className="mb-4">
          <Card className={styles.contentCard}>
            <Card.Header className={styles.cardHeader}>
              <div className={styles.cardHeaderContent}>
                <h5 className={styles.cardTitle}>Top Products</h5>
                <Button
                  variant="outline-primary"
                  size="sm"
                  as="a"
                  href="/admin/dashboard/products"
                >
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center p-4">
                  <Spinner animation="border" size="sm" role="status">
                    <span className="visually-hidden">Loading products...</span>
                  </Spinner>
                  <span className="ms-2">Loading products...</span>
                </div>
              ) : topProducts.length === 0 ? (
                <div className="text-center p-4">
                  <FiPackage size={32} className="text-muted mb-2" />
                  <h6 className="text-muted">No Products Data</h6>
                  <p className="text-muted small mb-0">
                    Top selling products will appear here.
                  </p>
                </div>
              ) : (
                <div className={styles.productList}>
                  {topProducts.map((product, index) => {
                    const imageSrc = getImageSrc(
                      product.image || product.images?.[0],
                      null,
                      "product"
                    );

                    return (
                      <div
                        key={product._id || product.id}
                        className={styles.productItem}
                      >
                        <div className={styles.productRank}>#{index + 1}</div>
                        <div className={styles.productImage}>
                          {/* Try image first, fallback to emoji if it fails */}
                          <img
                            src={imageSrc}
                            alt={product.name || "Product"}
                            onError={(e) => {
                              // If SVG fails, show emoji fallback
                              e.currentTarget.style.display = "none";
                              const fallback =
                                e.currentTarget.nextElementSibling;
                              if (fallback) fallback.style.display = "flex";
                            }}
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              backgroundColor: "#f5f5f5",
                              border: "1px solid #ddd",
                              display: "block",
                            }}
                          />
                          {/* Emoji fallback (hidden by default) */}
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              backgroundColor: "#e3f2fd",
                              border: "1px solid #2196f3",
                              borderRadius: "8px",
                              display: "none",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "18px",
                            }}
                          >
                            📷
                          </div>
                        </div>
                        <div className={styles.productInfo}>
                          <div className={styles.productName}>
                            {product.name}
                          </div>
                          <div className={styles.productCategory}>
                            {product.category || "Uncategorized"}
                          </div>
                        </div>
                        <div className={styles.productStats}>
                          <span className={styles.productSales}>
                            {product.sales || 0} sales
                          </span>
                          <span className={styles.productRevenue}>
                            {formatCurrency(
                              (product.sales || 0) * (product.price || 0)
                            )}
                          </span>
                        </div>
                        <div className={styles.productStock}>
                          <Badge
                            bg={getStockStatus(product.stock || 0).variant}
                            className={styles.stockBadge}
                          >
                            {getStockStatus(product.stock || 0).text}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
