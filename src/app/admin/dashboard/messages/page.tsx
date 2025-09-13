"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Form,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  FiMail,
  FiSend,
  FiCornerUpLeft as FiReply,
  FiTrash2,
  FiRefreshCw,
  FiUser,
  FiClock,
  FiMessageSquare,
  FiSearch,
  FiPlus,
} from "react-icons/fi";
import { messageApi, type Message } from "@/lib/messageApi";
import styles from "./page.module.scss";

// Remove the local interface since we're importing it from the API

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Fetch messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await messageApi.getMessages({
          page,
          limit: 20,
          filter: filter === "all" ? undefined : filter,
          category:
            categoryFilter === "all" ? undefined : (categoryFilter as any),
          search: searchQuery || undefined,
          sort: "createdAt",
          order: "desc",
        });

        setMessages(response.data.messages);
        setTotalPages(response.data.pagination.pages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError("Failed to load messages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchMessages, searchQuery ? 500 : 0);
    return () => clearTimeout(timeoutId);
  }, [page, filter, categoryFilter, searchQuery]);

  const getSenderIcon = (type: string) => {
    switch (type) {
      case "customer":
        return <FiUser className={styles.iconCustomer} />;
      case "supplier":
        return <FiMessageSquare className={styles.iconSupplier} />;
      case "admin":
        return <FiUser className={styles.iconAdmin} />;
      case "system":
        return <FiMail className={styles.iconSystem} />;
      default:
        return <FiUser className={styles.iconDefault} />;
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

  const getCategoryBadge = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      support: "primary",
      order: "success",
      product: "info",
      general: "secondary",
      complaint: "danger",
    };

    return (
      <Badge bg={categoryColors[category] || "secondary"}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  const markAsRead = async (id: string) => {
    try {
      await messageApi.markAsRead(id);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
      );
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await messageApi.markAllAsRead();
      setMessages((prev) => prev.map((msg) => ({ ...msg, read: true })));
    } catch (error) {
      console.error("Error marking all messages as read:", error);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await messageApi.deleteMessage(id);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleReply = async () => {
    if (selectedMessage && replyContent.trim()) {
      try {
        await messageApi.replyToMessage(selectedMessage.id, replyContent);
        setReplyContent("");
        setShowReplyModal(false);

        // Refresh the selected message to show the new reply
        const updatedMessage = await messageApi.getMessage(selectedMessage.id);
        setSelectedMessage(updatedMessage.data);

        // Refresh the messages list
        setPage(1); // This will trigger useEffect to refetch
      } catch (error) {
        console.error("Error sending reply:", error);
      }
    }
  };

  const refreshMessages = () => {
    setPage(1);
    setSearchQuery("");
    // This will trigger the useEffect to refetch data
  };

  // Since filtering is now done on the server, we don't need client-side filtering
  const unreadCount = messages.filter((m) => !m.read).length;

  if (loading) {
    return (
      <Container fluid className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <Spinner animation="border" variant="primary" />
          <p>Loading messages...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className={styles.messagesPage}>
      <Row>
        <Col lg={4} className={styles.messagesList}>
          {/* Header */}
          <div className={styles.messagesHeader}>
            <div className={styles.headerTop}>
              <h1 className={styles.pageTitle}>
                <FiMail className={styles.titleIcon} />
                Messages
                {unreadCount > 0 && (
                  <Badge bg="success" className={styles.unreadBadge}>
                    {unreadCount}
                  </Badge>
                )}
              </h1>
              <div className={styles.headerActions}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowComposeModal(true)}
                  className={styles.composeBtn}
                >
                  <FiPlus size={16} />
                  Compose
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className={styles.searchBox}>
              <Form.Control
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <FiSearch className={styles.searchIcon} />
            </div>

            {/* Filters */}
            <div className={styles.filters}>
              <Form.Select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className={styles.filterSelect}
                size="sm"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </Form.Select>

              <Form.Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={styles.filterSelect}
                size="sm"
              >
                <option value="all">All Categories</option>
                <option value="support">Support</option>
                <option value="order">Orders</option>
                <option value="product">Products</option>
                <option value="complaint">Complaints</option>
                <option value="general">General</option>
              </Form.Select>
            </div>

            {/* Actions */}
            <div className={styles.listActions}>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={refreshMessages}
              >
                <FiRefreshCw size={14} />
                Refresh
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={markAllAsRead}
                >
                  Mark All Read
                </Button>
              )}
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setError(null)}
              className="mb-3"
            >
              {error}
            </Alert>
          )}

          {/* Messages List */}
          <div className={styles.messagesListContent}>
            {messages.length === 0 ? (
              <div className={styles.emptyState}>
                <FiMail size={48} className={styles.emptyIcon} />
                <h5>No messages found</h5>
                <p className="text-muted">
                  {searchQuery
                    ? "No messages match your search."
                    : "No messages match your filters."}
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <Card
                  key={message.id}
                  className={`${styles.messageCard} ${
                    !message.read ? styles.unread : ""
                  } ${
                    selectedMessage?.id === message.id ? styles.selected : ""
                  }`}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.read) {
                      markAsRead(message.id);
                    }
                  }}
                >
                  <Card.Body>
                    <div className={styles.messagePreview}>
                      <div className={styles.messageIcon}>
                        {getSenderIcon(message.sender.type)}
                      </div>

                      <div className={styles.messageInfo}>
                        <div className={styles.messageHeader}>
                          <h6 className={styles.senderName}>
                            {message.sender.name}
                            {!message.read && (
                              <span className={styles.unreadDot}></span>
                            )}
                          </h6>
                          <span className={styles.timestamp}>
                            {message.timestamp}
                          </span>
                        </div>

                        <div className={styles.messageSubject}>
                          {message.subject}
                        </div>

                        <div className={styles.messagePreviewText}>
                          {message.content.substring(0, 100)}...
                        </div>

                        <div className={styles.messageBadges}>
                          {getCategoryBadge(message.category)}
                          {getPriorityBadge(message.priority)}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
        </Col>

        <Col lg={8} className={styles.messageDetail}>
          {selectedMessage ? (
            <Card className={styles.messageDetailCard}>
              <Card.Header className={styles.messageDetailHeader}>
                <div className={styles.messageDetailInfo}>
                  <h4 className={styles.messageDetailSubject}>
                    {selectedMessage.subject}
                  </h4>
                  <div className={styles.messageDetailMeta}>
                    <div className={styles.senderInfo}>
                      {getSenderIcon(selectedMessage.sender.type)}
                      <div>
                        <div className={styles.senderName}>
                          {selectedMessage.sender.name}
                        </div>
                        <div className={styles.senderEmail}>
                          {selectedMessage.sender.email}
                        </div>
                      </div>
                    </div>
                    <div className={styles.messageDetailBadges}>
                      {getCategoryBadge(selectedMessage.category)}
                      {getPriorityBadge(selectedMessage.priority)}
                    </div>
                  </div>
                </div>

                <div className={styles.messageDetailActions}>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setShowReplyModal(true)}
                  >
                    <FiReply size={14} />
                    Reply
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteMessage(selectedMessage.id)}
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </Button>
                </div>
              </Card.Header>

              <Card.Body className={styles.messageDetailBody}>
                <div className={styles.messageContent}>
                  <div className={styles.messageTimestamp}>
                    <FiClock size={14} />
                    {selectedMessage.timestamp}
                  </div>
                  <div className={styles.messageText}>
                    {selectedMessage.content}
                  </div>
                </div>

                {/* Replies */}
                {selectedMessage.replies &&
                  selectedMessage.replies.length > 0 && (
                    <div className={styles.messageReplies}>
                      <h6 className={styles.repliesTitle}>Replies</h6>
                      {selectedMessage.replies.map((reply) => (
                        <div key={reply.id} className={styles.replyItem}>
                          <div className={styles.replyHeader}>
                            <div className={styles.replySender}>
                              {getSenderIcon(reply.sender.type)}
                              <span>{reply.sender.name}</span>
                            </div>
                            <span className={styles.replyTimestamp}>
                              {reply.timestamp}
                            </span>
                          </div>
                          <div className={styles.replyContent}>
                            {reply.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </Card.Body>
            </Card>
          ) : (
            <div className={styles.noMessageSelected}>
              <FiMail size={64} className={styles.noMessageIcon} />
              <h4>Select a message</h4>
              <p className="text-muted">
                Choose a message from the list to view its content
              </p>
            </div>
          )}
        </Col>
      </Row>

      {/* Reply Modal */}
      <Modal
        show={showReplyModal}
        onHide={() => setShowReplyModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Reply to Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMessage && (
            <div className={styles.replyModal}>
              <div className={styles.originalMessage}>
                <h6>Original Message:</h6>
                <div className={styles.originalSubject}>
                  Subject: {selectedMessage.subject}
                </div>
                <div className={styles.originalSender}>
                  From: {selectedMessage.sender.name} (
                  {selectedMessage.sender.email})
                </div>
              </div>

              <Form.Group className="mt-3">
                <Form.Label>Your Reply:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your reply here..."
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReplyModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleReply}
            disabled={!replyContent.trim()}
          >
            <FiSend size={14} className="me-2" />
            Send Reply
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Compose Modal */}
      <Modal
        show={showComposeModal}
        onHide={() => setShowComposeModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Compose New Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>To:</Form.Label>
              <Form.Control type="email" placeholder="recipient@email.com" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Subject:</Form.Label>
              <Form.Control type="text" placeholder="Message subject" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category:</Form.Label>
              <Form.Select>
                <option value="general">General</option>
                <option value="support">Support</option>
                <option value="order">Order</option>
                <option value="product">Product</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Message:</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                placeholder="Type your message here..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowComposeModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary">
            <FiSend size={14} className="me-2" />
            Send Message
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
