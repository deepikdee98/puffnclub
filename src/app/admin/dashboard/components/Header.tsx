"use client";

import { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Dropdown,
  Badge,
  Form,
  InputGroup,
} from "react-bootstrap";
import {
  FiMenu,
  FiSearch,
  FiBell,
  FiMail,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notificationApi, type Notification } from "@/lib/notificationApi";
import { messageApi, type Message } from "@/lib/messageApi";
import styles from "./Header.module.scss";

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleMobileSidebar: () => void;
  sidebarCollapsed: boolean;
}

export default function Header({
  onToggleSidebar,
  onToggleMobileSidebar,
  sidebarCollapsed,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch notifications and messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch recent notifications (limit 5 for dropdown)
        const notificationResponse = await notificationApi.getNotifications({
          limit: 5,
          filter: "unread",
        });

        // Fetch recent messages (limit 5 for dropdown)
        const messageResponse = await messageApi.getMessages({
          limit: 5,
          filter: "unread",
        });

        setNotifications(notificationResponse.data.notifications);
        setMessages(messageResponse.data.messages);
        setNotificationCount(notificationResponse.data.unreadCount);
        setMessageCount(messageResponse.data.unreadCount);
      } catch (error) {
        console.error("Error fetching header data:", error);
        // Keep mock data as fallback
        setNotificationCount(3);
        setMessageCount(2);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    // Clear authentication data from all storage locations
    localStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_token");
    localStorage.removeItem("admin_remember");

    // Redirect to login
    router.push("/admin/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <Navbar className={styles.header} expand="lg">
      <div className={styles.headerContent}>
        {/* Left Section */}
        <div className={styles.headerLeft}>
          {/* Desktop Sidebar Toggle */}
          <button
            className={`${styles.sidebarToggle} d-none d-lg-flex`}
            onClick={onToggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <FiMenu size={20} />
          </button>

          {/* Mobile Sidebar Toggle */}
          <button
            className={`${styles.sidebarToggle} d-lg-none`}
            onClick={onToggleMobileSidebar}
            aria-label="Toggle Mobile Sidebar"
          >
            <FiMenu size={20} />
          </button>
        </div>

        {/* Right Section */}
        <div className={styles.headerRight}>
          {/* Notifications */}
          <Dropdown align="end" className={styles.headerDropdown}>
            <Dropdown.Toggle
              variant="link"
              className={styles.notificationToggle}
              id="notifications-dropdown"
            >
              <div className={styles.notificationIcon}>
                <FiBell size={20} />
                {notificationCount > 0 && (
                  <Badge bg="danger" className={styles.notificationBadge}>
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </Badge>
                )}
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className={styles.notificationMenu}>
              <div className={styles.notificationHeader}>
                <h6>Notifications</h6>
                <Badge bg="primary">{notificationCount} New</Badge>
              </div>

              <div className={styles.notificationList}>
                {loading ? (
                  <div className="text-center p-3">
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <Dropdown.Item
                      key={notification.id}
                      className={styles.notificationItem}
                      as={Link}
                      href={
                        notification.actionUrl ||
                        "/admin/dashboard/notifications"
                      }
                    >
                      <div className={styles.notificationContent}>
                        <div className={styles.notificationTitle}>
                          {notification.title}
                        </div>
                        <div className={styles.notificationText}>
                          {notification.message}
                        </div>
                        <div className={styles.notificationTime}>
                          {notification.timestamp}
                        </div>
                      </div>
                    </Dropdown.Item>
                  ))
                ) : (
                  <div className="text-center p-3 text-muted">
                    <small>No new notifications</small>
                  </div>
                )}
              </div>

              <Dropdown.Divider />
              <Dropdown.Item
                as={Link}
                href="/admin/dashboard/notifications"
                className={styles.viewAllLink}
              >
                View All Notifications
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Messages */}
          <Dropdown align="end" className={styles.headerDropdown}>
            <Dropdown.Toggle
              variant="link"
              className={styles.messageToggle}
              id="messages-dropdown"
            >
              <div className={styles.messageIcon}>
                <FiMail size={20} />
                {messageCount > 0 && (
                  <Badge bg="success" className={styles.messageBadge}>
                    {messageCount > 99 ? "99+" : messageCount}
                  </Badge>
                )}
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className={styles.messageMenu}>
              <div className={styles.messageHeader}>
                <h6>Messages</h6>
                <Badge bg="success">{messageCount} New</Badge>
              </div>

              <div className={styles.messageList}>
                {loading ? (
                  <div className="text-center p-3">
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((message) => (
                    <Dropdown.Item
                      key={message.id}
                      className={styles.messageItem}
                      as={Link}
                      href={`/admin/dashboard/messages/${message.id}`}
                    >
                      <div className={styles.messageContent}>
                        <div className={styles.messageTitle}>
                          {message.sender.name}
                        </div>
                        <div className={styles.messageText}>
                          {message.subject}
                        </div>
                        <div className={styles.messageTime}>
                          {message.timestamp}
                        </div>
                      </div>
                    </Dropdown.Item>
                  ))
                ) : (
                  <div className="text-center p-3 text-muted">
                    <small>No new messages</small>
                  </div>
                )}
              </div>

              <Dropdown.Divider />
              <Dropdown.Item
                as={Link}
                href="/admin/dashboard/messages"
                className={styles.viewAllLink}
              >
                View All Messages
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* User Profile */}
          <Dropdown align="end" className={styles.headerDropdown}>
            <Dropdown.Toggle
              variant="link"
              className={styles.userToggle}
              id="user-dropdown"
            >
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  <FiUser size={18} />
                </div>
                <div className={styles.userDetails}>
                  <span className={styles.userName}>Admin User</span>
                  <span className={styles.userRole}>Administrator</span>
                </div>
                <FiChevronDown size={14} className={styles.userArrow} />
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className={styles.userMenu}>
              <div className={styles.userMenuHeader}>
                <div className={styles.userMenuAvatar}>
                  <FiUser size={24} />
                </div>
                <div className={styles.userMenuInfo}>
                  <div className={styles.userMenuName}>Admin User</div>
                  <div className={styles.userMenuEmail}>admin@example.com</div>
                </div>
              </div>

              <Dropdown.Divider />

              <Dropdown.Item as={Link} href="/admin/dashboard/profile">
                <FiUser size={16} className="me-2" />
                My Profile
              </Dropdown.Item>

              <Dropdown.Item
                onClick={handleLogout}
                className={styles.logoutItem}
              >
                <FiLogOut size={16} className="me-2" />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </Navbar>
  );
}
