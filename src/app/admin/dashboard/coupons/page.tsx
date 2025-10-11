"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Form,
  InputGroup,
  Spinner,
  Pagination,
  Modal,
} from "react-bootstrap";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiPercent,
  FiDollarSign,
  FiCalendar,
  FiUsers,
  FiClock,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { couponsAPI } from "@/lib/api";
import styles from "./page.module.scss";

interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumPurchase: number;
  maximumDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  perUserLimit: number | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  status: string;
  remainingUses: number | null;
  freeShipping: boolean;
  applicableToAll: boolean;
  firstTimeUserOnly: boolean;
  createdAt: string;
}

interface CouponStats {
  total: number;
  active: number;
  expired: number;
  scheduled: number;
  inactive: number;
}

export default function CouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState<CouponStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchCoupons();
    fetchStats();
  }, [page, statusFilter, search]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response: any = await couponsAPI.getCoupons({
        page,
        limit,
        search,
        status: statusFilter as any,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      setCoupons(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error: any) {
      console.error("Error fetching coupons:", error);
      toast.error(error.response?.data?.message || "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response: any = await couponsAPI.getCouponStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleDelete = async () => {
    if (!couponToDelete) return;

    try {
      setDeleting(couponToDelete._id);
      await couponsAPI.deleteCoupon(couponToDelete._id);
      toast.success("Coupon deleted successfully");
      setShowDeleteModal(false);
      setCouponToDelete(null);
      fetchCoupons();
      fetchStats();
    } catch (error: any) {
      console.error("Error deleting coupon:", error);
      toast.error(error.response?.data?.message || "Failed to delete coupon");
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    try {
      await couponsAPI.toggleCouponStatus(coupon._id);
      toast.success(
        `Coupon ${coupon.isActive ? "deactivated" : "activated"} successfully`
      );
      fetchCoupons();
      fetchStats();
    } catch (error: any) {
      console.error("Error toggling coupon status:", error);
      toast.error(
        error.response?.data?.message || "Failed to toggle coupon status"
      );
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { variant: string; text: string }> = {
      active: { variant: "success", text: "Active" },
      inactive: { variant: "secondary", text: "Inactive" },
      expired: { variant: "danger", text: "Expired" },
      scheduled: { variant: "info", text: "Scheduled" },
      limit_reached: { variant: "warning", text: "Limit Reached" },
    };

    const badge = badges[status] || { variant: "secondary", text: status };
    return <Badge bg={badge.variant}>{badge.text}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}%`;
    }
    return `₹${coupon.discountValue}`;
  };

  return (
    <Container fluid className={styles.couponsPage}>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                <FiPercent className="me-2" />
                Coupons Management
              </h1>
              <p className={styles.pageSubtitle}>
                Create and manage discount coupons for your store
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push("/admin/dashboard/coupons/add")}
            >
              <FiPlus className="me-2" />
              Create Coupon
            </Button>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      {stats && (
        <Row className="mb-4">
          <Col md={6} lg={3} className="mb-3">
            <Card className={styles.statCard}>
              <Card.Body>
                <div className={styles.statIcon} style={{ background: "#e3f2fd" }}>
                  <FiPercent size={24} color="#1976d2" />
                </div>
                <div className={styles.statContent}>
                  <h3>{stats.total}</h3>
                  <p>Total Coupons</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3} className="mb-3">
            <Card className={styles.statCard}>
              <Card.Body>
                <div className={styles.statIcon} style={{ background: "#e8f5e9" }}>
                  <FiToggleRight size={24} color="#388e3c" />
                </div>
                <div className={styles.statContent}>
                  <h3>{stats.active}</h3>
                  <p>Active Coupons</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3} className="mb-3">
            <Card className={styles.statCard}>
              <Card.Body>
                <div className={styles.statIcon} style={{ background: "#fff3e0" }}>
                  <FiClock size={24} color="#f57c00" />
                </div>
                <div className={styles.statContent}>
                  <h3>{stats.scheduled}</h3>
                  <p>Scheduled</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3} className="mb-3">
            <Card className={styles.statCard}>
              <Card.Body>
                <div className={styles.statIcon} style={{ background: "#ffebee" }}>
                  <FiCalendar size={24} color="#d32f2f" />
                </div>
                <div className={styles.statContent}>
                  <h3>{stats.expired}</h3>
                  <p>Expired</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6} className="mb-3 mb-md-0">
              <InputGroup>
                <InputGroup.Text>
                  <FiSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by code or description..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="scheduled">Scheduled</option>
                <option value="expired">Expired</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Coupons Table */}
      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading coupons...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-5">
              <FiPercent size={48} className="text-muted mb-3" />
              <h5>No coupons found</h5>
              <p className="text-muted">
                {search || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first coupon to get started"}
              </p>
              {!search && statusFilter === "all" && (
                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={() => router.push("/admin/dashboard/coupons/add")}
                >
                  <FiPlus className="me-2" />
                  Create Coupon
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className={styles.couponsTable}>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Discount</th>
                      <th>Usage</th>
                      <th>Valid Period</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon) => (
                      <tr key={coupon._id}>
                        <td>
                          <div className={styles.couponCode}>
                            <strong>{coupon.code}</strong>
                            {coupon.description && (
                              <small className="text-muted d-block">
                                {coupon.description}
                              </small>
                            )}
                            <div className="mt-1">
                              {coupon.freeShipping && (
                                <Badge bg="info" className="me-1">
                                  Free Shipping
                                </Badge>
                              )}
                              {coupon.firstTimeUserOnly && (
                                <Badge bg="warning" className="me-1">
                                  First Time Only
                                </Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={styles.discountInfo}>
                            <strong>{formatDiscount(coupon)}</strong>
                            {coupon.minimumPurchase > 0 && (
                              <small className="text-muted d-block">
                                Min: ₹{coupon.minimumPurchase}
                              </small>
                            )}
                            {coupon.maximumDiscount && (
                              <small className="text-muted d-block">
                                Max: ₹{coupon.maximumDiscount}
                              </small>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className={styles.usageInfo}>
                            <strong>
                              {coupon.usageCount}
                              {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                            </strong>
                            {coupon.remainingUses !== null && (
                              <small className="text-muted d-block">
                                {coupon.remainingUses} remaining
                              </small>
                            )}
                            {coupon.perUserLimit && (
                              <small className="text-muted d-block">
                                {coupon.perUserLimit} per user
                              </small>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className={styles.dateInfo}>
                            <small className="d-block">
                              <FiCalendar className="me-1" />
                              {formatDate(coupon.startDate)}
                            </small>
                            <small className="text-muted d-block">
                              to {formatDate(coupon.endDate)}
                            </small>
                          </div>
                        </td>
                        <td>{getStatusBadge(coupon.status)}</td>
                        <td>
                          <div className={styles.actions}>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/admin/dashboard/coupons/${coupon._id}/edit`
                                )
                              }
                              title="Edit"
                            >
                              <FiEdit2 />
                            </Button>
                            <Button
                              variant={
                                coupon.isActive
                                  ? "outline-warning"
                                  : "outline-success"
                              }
                              size="sm"
                              onClick={() => handleToggleStatus(coupon)}
                              title={
                                coupon.isActive ? "Deactivate" : "Activate"
                              }
                            >
                              {coupon.isActive ? (
                                <FiToggleRight />
                              ) : (
                                <FiToggleLeft />
                              )}
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                setCouponToDelete(coupon);
                                setShowDeleteModal(true);
                              }}
                              disabled={deleting === coupon._id}
                              title="Delete"
                            >
                              {deleting === coupon._id ? (
                                <Spinner
                                  animation="border"
                                  size="sm"
                                  as="span"
                                />
                              ) : (
                                <FiTrash2 />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                    />
                    <Pagination.Prev
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={page === index + 1}
                        onClick={() => setPage(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => setPage(totalPages)}
                      disabled={page === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Coupon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the coupon{" "}
          <strong>{couponToDelete?.code}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting !== null}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleting !== null}
          >
            {deleting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}