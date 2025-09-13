"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Dropdown,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  FiBell,
  FiCheck,
  FiTrash2,
  FiFilter,
  FiRefreshCw,
  FiSettings,
  FiPackage,
  FiDollarSign,
  FiAlertTriangle,
  FiInfo,
  FiCheckCircle,
} from "react-icons/fi";
import { notificationApi, type Notification } from "@/lib/notificationApi";
import styles from "./page.module.scss";

// Remove the local interface since we're importing it from the API

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await notificationApi.getNotifications({
          page,
          limit: 20,
          filter: filter === "all" ? undefined : filter,
          type: typeFilter === "all" ? undefined : (typeFilter as any),
          sort: "createdAt",
          order: "desc",
        });

        setNotifications(response.data.notifications);
        setTotalPages(response.data.pagination.pages);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [page, filter, typeFilter]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <FiPackage className={styles.iconOrder} />;
      case "payment":
        return <FiDollarSign className={styles.iconPayment} />;
      case "stock":
        return <FiAlertTriangle className={styles.iconStock} />;
      case "system":
        return <FiSettings className={styles.iconSystem} />;
      case "info":
        return <FiInfo className={styles.iconInfo} />;
      default:
        return <FiBell className={styles.iconDefault} />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge bg="danger">High</Badge>;
      case "medium":
        return <Badge bg="warning">Medium</Badge>;
      case "low":
        return <Badge bg="secondary">Low</Badge>;
      default:
        return null;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const refreshNotifications = () => {
    setPage(1);
    // This will trigger the useEffect to refetch data
  };

  // Since filtering is now done on the server, we don't need client-side filtering
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <Container fluid className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <Spinner animation="border" variant="primary" />
          <p>Loading notifications...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className={styles.notificationsPage}>
      <Row>
        <Col>
          {/* Header */}
          <div className={styles.pageHeader}>
            <div className={styles.headerLeft}>
              <h1 className={styles.pageTitle}>
                <FiBell className={styles.titleIcon} />
                Notifications
                {unreadCount > 0 && (
                  <Badge bg="danger" className={styles.unreadBadge}>
                    {unreadCount}
                  </Badge>
                )}
              </h1>
              <p className={styles.pageSubtitle}>
                Stay updated with your store activities
              </p>
            </div>
            <div className={styles.headerRight}>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={refreshNotifications}
                className={styles.refreshBtn}
              >
                <FiRefreshCw size={16} />
                Refresh
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={markAllAsRead}
                  className={styles.markAllBtn}
                >
                  <FiCheckCircle size={16} />
                  Mark All Read
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <Card className={styles.filtersCard}>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={6}>
                  <div className={styles.filterGroup}>
                    <Form.Label className={styles.filterLabel}>
                      <FiFilter size={16} />
                      Filter by Status:
                    </Form.Label>
                    <Form.Select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as any)}
                      className={styles.filterSelect}
                    >
                      <option value="all">All Notifications</option>
                      <option value="unread">Unread Only</option>
                      <option value="read">Read Only</option>
                    </Form.Select>
                  </div>
                </Col>
                <Col md={6}>
                  <div className={styles.filterGroup}>
                    <Form.Label className={styles.filterLabel}>
                      Filter by Type:
                    </Form.Label>
                    <Form.Select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="all">All Types</option>
                      <option value="order">Orders</option>
                      <option value="payment">Payments</option>
                      <option value="stock">Stock Alerts</option>
                      <option value="system">System</option>
                      <option value="info">Information</option>
                    </Form.Select>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Notifications List */}
          <div className={styles.notificationsList}>
            {notifications.length === 0 ? (
              <Card className={styles.emptyState}>
                <Card.Body className="text-center py-5">
                  <FiBell size={48} className={styles.emptyIcon} />
                  <h4>No notifications found</h4>
                  <p className="text-muted">
                    {filter === "unread"
                      ? "You're all caught up! No unread notifications."
                      : "No notifications match your current filters."}
                  </p>
                </Card.Body>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`${styles.notificationCard} ${
                    !notification.read ? styles.unread : ""
                  }`}
                >
                  <Card.Body>
                    <div className={styles.notificationContent}>
                      <div className={styles.notificationIcon}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className={styles.notificationDetails}>
                        <div className={styles.notificationHeader}>
                          <h5 className={styles.notificationTitle}>
                            {notification.title}
                            {!notification.read && (
                              <span className={styles.unreadDot}></span>
                            )}
                          </h5>
                          <div className={styles.notificationMeta}>
                            {getPriorityBadge(notification.priority)}
                            <span className={styles.timestamp}>
                              {notification.timestamp}
                            </span>
                          </div>
                        </div>

                        <p className={styles.notificationMessage}>
                          {notification.message}
                        </p>

                        <div className={styles.notificationActions}>
                          {notification.actionUrl && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              href={notification.actionUrl}
                              className={styles.actionBtn}
                            >
                              View Details
                            </Button>
                          )}

                          {!notification.read && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className={styles.markReadBtn}
                            >
                              <FiCheck size={14} />
                              Mark Read
                            </Button>
                          )}

                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className={styles.deleteBtn}
                          >
                            <FiTrash2 size={14} />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
