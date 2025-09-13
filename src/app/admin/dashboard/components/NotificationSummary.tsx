"use client";

import { useState, useEffect } from "react";
import { Card, Badge, Button, ListGroup, Spinner } from "react-bootstrap";
import { FiBell, FiMail, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { notificationApi, type Notification } from "@/lib/notificationApi";
import { messageApi, type Message } from "@/lib/messageApi";
import styles from "./NotificationSummary.module.scss";

export default function NotificationSummary() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch recent unread notifications (limit 3)
        const notificationResponse = await notificationApi.getNotifications({
          limit: 3,
          filter: "unread",
        });

        // Fetch recent unread messages (limit 3)
        const messageResponse = await messageApi.getMessages({
          limit: 3,
          filter: "unread",
        });

        setNotifications(notificationResponse.data.notifications);
        setMessages(messageResponse.data.messages);
        setNotificationCount(notificationResponse.data.unreadCount);
        setMessageCount(messageResponse.data.unreadCount);
      } catch (error) {
        console.error("Error fetching summary data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className={styles.summaryCard}>
        <Card.Header className={styles.cardHeader}>
          <h5 className="mb-0">Recent Activity</h5>
        </Card.Header>
        <Card.Body className="text-center py-4">
          <Spinner animation="border" size="sm" />
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className={styles.summaryCard}>
      <Card.Header className={styles.cardHeader}>
        <h5 className="mb-0">Recent Activity</h5>
        <div className={styles.badges}>
          {notificationCount > 0 && (
            <Badge bg="danger" className="me-2">
              {notificationCount} notifications
            </Badge>
          )}
          {messageCount > 0 && (
            <Badge bg="success">{messageCount} messages</Badge>
          )}
        </div>
      </Card.Header>

      <Card.Body className={styles.cardBody}>
        {/* Notifications Section */}
        {notifications.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <FiBell size={16} />
              <span>Recent Notifications</span>
            </div>
            <ListGroup variant="flush" className={styles.itemList}>
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={
                    notification.actionUrl || "/admin/dashboard/notifications"
                  }
                  passHref
                >
                  <ListGroup.Item className={styles.item}>
                    <div className={styles.itemContent}>
                      <div className={styles.itemTitle}>
                        {notification.title}
                      </div>
                      <div className={styles.itemText}>
                        {notification.message}
                      </div>
                      <div className={styles.itemTime}>
                        {notification.timestamp}
                      </div>
                    </div>
                    <Badge
                      bg={
                        notification.priority === "high"
                          ? "danger"
                          : notification.priority === "medium"
                          ? "warning"
                          : "secondary"
                      }
                      className={styles.priorityBadge}
                    >
                      {notification.priority}
                    </Badge>
                  </ListGroup.Item>
                </Link>
              ))}
            </ListGroup>
            <div className={styles.sectionFooter}>
              <Link href="/admin/dashboard/notifications" passHref>
                <Button variant="outline-primary" size="sm">
                  View All <FiArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Messages Section */}
        {messages.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <FiMail size={16} />
              <span>Recent Messages</span>
            </div>
            <ListGroup variant="flush" className={styles.itemList}>
              {messages.map((message) => (
                <Link
                  key={message.id}
                  href={`/admin/dashboard/messages/${message.id}`}
                  passHref
                >
                  <ListGroup.Item className={styles.item}>
                    <div className={styles.itemContent}>
                      <div className={styles.itemTitle}>
                        From: {message.sender.name}
                      </div>
                      <div className={styles.itemText}>{message.subject}</div>
                      <div className={styles.itemTime}>{message.timestamp}</div>
                    </div>
                    <Badge
                      bg={
                        message.priority === "high"
                          ? "danger"
                          : message.priority === "medium"
                          ? "warning"
                          : "secondary"
                      }
                      className={styles.priorityBadge}
                    >
                      {message.priority}
                    </Badge>
                  </ListGroup.Item>
                </Link>
              ))}
            </ListGroup>
            <div className={styles.sectionFooter}>
              <Link href="/admin/dashboard/messages" passHref>
                <Button variant="outline-success" size="sm">
                  View All <FiArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {notifications.length === 0 && messages.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FiBell size={32} />
            </div>
            <h6>All caught up!</h6>
            <p className="text-muted mb-0">No new notifications or messages</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
