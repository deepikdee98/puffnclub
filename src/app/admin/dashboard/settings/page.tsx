"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Nav,
  Tab,
  Badge,
  Modal,
} from "react-bootstrap";
import {
  FiUser,
  FiSettings,
  FiLock,
  FiSave,
  FiEdit,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiShield,
  FiUsers,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import styles from "./page.module.scss";

// Validation schemas
const profileSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup.string().required("Phone is required"),
  adminProfile: yup.object().shape({
    title: yup.string(),
    department: yup.string(),
    bio: yup.string().max(500, "Bio must not exceed 500 characters"),
  }),
});

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

const storeSettingsSchema = yup.object().shape({
  storeName: yup.string().required("Store name is required"),
  storeDescription: yup.string().required("Store description is required"),
  storeTagline: yup.string(),
  contactInfo: yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().required("Phone is required"),
    website: yup.string().url("Invalid URL"),
  }),
});

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isSuperAdmin: boolean;
  adminProfile: {
    title: string;
    department: string;
    bio: string;
    avatar: string;
    permissions: {
      canManageProducts: boolean;
      canManageOrders: boolean;
      canManageUsers: boolean;
      canViewAnalytics: boolean;
      canManageSettings: boolean;
    };
    lastLogin: string;
    isActive: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface StoreSettings {
  storeName: string;
  storeDescription: string;
  storeTagline: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  contactInfo: {
    email: string;
    phone: string;
    website: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  businessInfo: {
    registrationNumber: string;
    taxId: string;
    businessType: string;
    industry: string;
    foundedYear: number;
    employeeCount: string;
  };
  featureCards: Array<{
    title: string;
    description: string;
    icon: string;
    isActive: boolean;
  }>;
  systemSettings: {
    timezone: string;
    currency: {
      code: string;
      symbol: string;
      position: string;
    };
    dateFormat: string;
    language: string;
  };
  securitySettings: {
    requireTwoFactor: boolean;
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
  };
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form configurations
  const profileForm = useForm({
    resolver: yupResolver(profileSchema),
    mode: "onChange",
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
    mode: "onChange",
  });

  const storeForm = useForm({
    resolver: yupResolver(storeSettingsSchema),
    mode: "onChange",
  });

  // Fetch admin profile and store settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =
          localStorage.getItem("admin_token") ||
          sessionStorage.getItem("admin_token");

        if (!token) {
          toast.error("Please login first");
          return;
        }

        // Fetch admin profile
        const profileResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (profileResponse.ok) {
          const profile = await profileResponse.json();
          setAdminProfile(profile);
          profileForm.reset({
            name: profile.name,
            phone: profile.phone,
            adminProfile: {
              title: profile.adminProfile?.title || "",
              department: profile.adminProfile?.department || "",
              bio: profile.adminProfile?.bio || "",
            },
          });
        }

        // Fetch store settings
        const settingsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/settings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (settingsResponse.ok) {
          const settings = await settingsResponse.json();
          setStoreSettings(settings);
          storeForm.reset({
            storeName: settings.storeName,
            storeDescription: settings.storeDescription,
            storeTagline: settings.storeTagline,
            contactInfo: {
              email: settings.contactInfo?.email || "",
              phone: settings.contactInfo?.phone || "",
              website: settings.contactInfo?.website || "",
            },
          });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update admin profile
  const onUpdateProfile = async (data: any) => {
    setSaving(true);
    try {
      const token =
        localStorage.getItem("admin_token") ||
        sessionStorage.getItem("admin_token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setAdminProfile(result.admin);
        toast.success("Profile updated successfully!");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const onChangePassword = async (data: any) => {
    setSaving(true);
    try {
      const token =
        localStorage.getItem("admin_token") ||
        sessionStorage.getItem("admin_token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          }),
        }
      );

      if (response.ok) {
        toast.success("Password changed successfully!");
        passwordForm.reset();
        setShowPassword({ current: false, new: false, confirm: false });
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      toast.error("Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  // Update store settings (Super Admin only)
  const onUpdateStoreSettings = async (data: any) => {
    if (!adminProfile?.isSuperAdmin) {
      toast.error("Only Super Admin can update store settings");
      return;
    }

    setSaving(true);
    try {
      const token =
        localStorage.getItem("admin_token") ||
        sessionStorage.getItem("admin_token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setStoreSettings(result.settings);
        toast.success("Store settings updated successfully!");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update store settings");
      }
    } catch (error) {
      console.error("Store settings update error:", error);
      toast.error("Failed to update store settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <Container fluid className={styles.settingsContainer}>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className={styles.pageTitle}>Settings</h1>
              <p className={styles.pageSubtitle}>
                Manage your profile and store configuration
              </p>
            </div>
            <Badge bg={adminProfile?.isSuperAdmin ? "danger" : "primary"}>
              {adminProfile?.isSuperAdmin ? "Super Admin" : "Admin"}
            </Badge>
          </div>

          <Tab.Container
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k || "profile")}
          >
            <Row>
              <Col md={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="profile" className={styles.navLink}>
                      <FiUser className="me-2" />
                      Profile
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="security" className={styles.navLink}>
                      <FiLock className="me-2" />
                      Security
                    </Nav.Link>
                  </Nav.Item>
                  {adminProfile?.isSuperAdmin && (
                    <>
                      <Nav.Item>
                        <Nav.Link eventKey="store" className={styles.navLink}>
                          <FiSettings className="me-2" />
                          Store Settings
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="admins" className={styles.navLink}>
                          <FiUsers className="me-2" />
                          Admin Management
                        </Nav.Link>
                      </Nav.Item>
                    </>
                  )}
                </Nav>
              </Col>

              <Col md={9}>
                <Tab.Content>
                  {/* Profile Tab */}
                  <Tab.Pane eventKey="profile">
                    <Card className={styles.settingsCard}>
                      <Card.Header>
                        <h5 className="mb-0">
                          <FiUser className="me-2" />
                          Profile Information
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <Form
                          onSubmit={profileForm.handleSubmit(onUpdateProfile)}
                        >
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Full Name</Form.Label>
                                <Controller
                                  name="name"
                                  control={profileForm.control}
                                  render={({ field }) => (
                                    <Form.Control
                                      {...field}
                                      type="text"
                                      placeholder="Enter your full name"
                                      isInvalid={
                                        !!profileForm.formState.errors.name
                                      }
                                    />
                                  )}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {profileForm.formState.errors.name?.message}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Phone Number</Form.Label>
                                <Controller
                                  name="phone"
                                  control={profileForm.control}
                                  render={({ field }) => (
                                    <Form.Control
                                      {...field}
                                      type="tel"
                                      placeholder="Enter your phone number"
                                      isInvalid={
                                        !!profileForm.formState.errors.phone
                                      }
                                    />
                                  )}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {profileForm.formState.errors.phone?.message}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Job Title</Form.Label>
                                <Controller
                                  name="adminProfile.title"
                                  control={profileForm.control}
                                  render={({ field }) => (
                                    <Form.Control
                                      {...field}
                                      type="text"
                                      placeholder="e.g., Store Manager"
                                    />
                                  )}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Department</Form.Label>
                                <Controller
                                  name="adminProfile.department"
                                  control={profileForm.control}
                                  render={({ field }) => (
                                    <Form.Control
                                      {...field}
                                      type="text"
                                      placeholder="e.g., Operations"
                                    />
                                  )}
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          <Form.Group className="mb-3">
                            <Form.Label>Bio</Form.Label>
                            <Controller
                              name="adminProfile.bio"
                              control={profileForm.control}
                              render={({ field }) => (
                                <Form.Control
                                  {...field}
                                  as="textarea"
                                  rows={3}
                                  placeholder="Tell us about yourself..."
                                  isInvalid={
                                    !!profileForm.formState.errors.adminProfile
                                      ?.bio
                                  }
                                />
                              )}
                            />
                            <Form.Control.Feedback type="invalid">
                              {
                                profileForm.formState.errors.adminProfile?.bio
                                  ?.message
                              }
                            </Form.Control.Feedback>
                          </Form.Group>

                          <div className="d-flex justify-content-between align-items-center">
                            <div className="text-muted small">
                              <FiMail className="me-1" />
                              {adminProfile?.email}
                            </div>
                            <Button
                              type="submit"
                              variant="primary"
                              disabled={
                                saving || !profileForm.formState.isDirty
                              }
                            >
                              {saving ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <FiSave className="me-2" />
                                  Save Changes
                                </>
                              )}
                            </Button>
                          </div>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  {/* Security Tab */}
                  <Tab.Pane eventKey="security">
                    <Card className={styles.settingsCard}>
                      <Card.Header>
                        <h5 className="mb-0">
                          <FiLock className="me-2" />
                          Change Password
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <Form
                          onSubmit={passwordForm.handleSubmit(onChangePassword)}
                        >
                          <Form.Group className="mb-3">
                            <Form.Label>Current Password</Form.Label>
                            <div className="position-relative">
                              <Controller
                                name="currentPassword"
                                control={passwordForm.control}
                                render={({ field }) => (
                                  <Form.Control
                                    {...field}
                                    type={
                                      showPassword.current ? "text" : "password"
                                    }
                                    placeholder="Enter current password"
                                    isInvalid={
                                      !!passwordForm.formState.errors
                                        .currentPassword
                                    }
                                  />
                                )}
                              />
                              <Button
                                variant="link"
                                className="position-absolute end-0 top-0 border-0"
                                onClick={() =>
                                  setShowPassword((prev) => ({
                                    ...prev,
                                    current: !prev.current,
                                  }))
                                }
                                style={{ zIndex: 10 }}
                              >
                                {showPassword.current ? (
                                  <FiEyeOff />
                                ) : (
                                  <FiEye />
                                )}
                              </Button>
                            </div>
                            <Form.Control.Feedback type="invalid">
                              {
                                passwordForm.formState.errors.currentPassword
                                  ?.message
                              }
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>New Password</Form.Label>
                                <div className="position-relative">
                                  <Controller
                                    name="newPassword"
                                    control={passwordForm.control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        type={
                                          showPassword.new ? "text" : "password"
                                        }
                                        placeholder="Enter new password"
                                        isInvalid={
                                          !!passwordForm.formState.errors
                                            .newPassword
                                        }
                                      />
                                    )}
                                  />
                                  <Button
                                    variant="link"
                                    className="position-absolute end-0 top-0 border-0"
                                    onClick={() =>
                                      setShowPassword((prev) => ({
                                        ...prev,
                                        new: !prev.new,
                                      }))
                                    }
                                    style={{ zIndex: 10 }}
                                  >
                                    {showPassword.new ? (
                                      <FiEyeOff />
                                    ) : (
                                      <FiEye />
                                    )}
                                  </Button>
                                </div>
                                <Form.Control.Feedback type="invalid">
                                  {
                                    passwordForm.formState.errors.newPassword
                                      ?.message
                                  }
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Confirm New Password</Form.Label>
                                <div className="position-relative">
                                  <Controller
                                    name="confirmPassword"
                                    control={passwordForm.control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        type={
                                          showPassword.confirm
                                            ? "text"
                                            : "password"
                                        }
                                        placeholder="Confirm new password"
                                        isInvalid={
                                          !!passwordForm.formState.errors
                                            .confirmPassword
                                        }
                                      />
                                    )}
                                  />
                                  <Button
                                    variant="link"
                                    className="position-absolute end-0 top-0 border-0"
                                    onClick={() =>
                                      setShowPassword((prev) => ({
                                        ...prev,
                                        confirm: !prev.confirm,
                                      }))
                                    }
                                    style={{ zIndex: 10 }}
                                  >
                                    {showPassword.confirm ? (
                                      <FiEyeOff />
                                    ) : (
                                      <FiEye />
                                    )}
                                  </Button>
                                </div>
                                <Form.Control.Feedback type="invalid">
                                  {
                                    passwordForm.formState.errors
                                      .confirmPassword?.message
                                  }
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Button
                            type="submit"
                            variant="primary"
                            disabled={
                              saving ||
                              !passwordForm.formState.isDirty ||
                              !passwordForm.formState.isValid
                            }
                          >
                            {saving ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Changing...
                              </>
                            ) : (
                              <>
                                <FiShield className="me-2" />
                                Change Password
                              </>
                            )}
                          </Button>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  {/* Store Settings Tab (Super Admin only) */}
                  {adminProfile?.isSuperAdmin && (
                    <Tab.Pane eventKey="store">
                      <Card className={styles.settingsCard}>
                        <Card.Header>
                          <h5 className="mb-0">
                            <FiSettings className="me-2" />
                            Store Settings
                          </h5>
                        </Card.Header>
                        <Card.Body>
                          <Form
                            onSubmit={storeForm.handleSubmit(
                              onUpdateStoreSettings
                            )}
                          >
                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Store Name</Form.Label>
                                  <Controller
                                    name="storeName"
                                    control={storeForm.control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        type="text"
                                        placeholder="Enter store name"
                                        isInvalid={
                                          !!storeForm.formState.errors.storeName
                                        }
                                      />
                                    )}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {
                                      storeForm.formState.errors.storeName
                                        ?.message
                                    }
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Store Tagline</Form.Label>
                                  <Controller
                                    name="storeTagline"
                                    control={storeForm.control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        type="text"
                                        placeholder="Enter store tagline"
                                      />
                                    )}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>

                            <Form.Group className="mb-3">
                              <Form.Label>Store Description</Form.Label>
                              <Controller
                                name="storeDescription"
                                control={storeForm.control}
                                render={({ field }) => (
                                  <Form.Control
                                    {...field}
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter store description"
                                    isInvalid={
                                      !!storeForm.formState.errors
                                        .storeDescription
                                    }
                                  />
                                )}
                              />
                              <Form.Control.Feedback type="invalid">
                                {
                                  storeForm.formState.errors.storeDescription
                                    ?.message
                                }
                              </Form.Control.Feedback>
                            </Form.Group>

                            <h6 className="mt-4 mb-3">Contact Information</h6>
                            <Row>
                              <Col md={4}>
                                <Form.Group className="mb-3">
                                  <Form.Label>
                                    <FiMail className="me-1" />
                                    Email
                                  </Form.Label>
                                  <Controller
                                    name="contactInfo.email"
                                    control={storeForm.control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        type="email"
                                        placeholder="Enter email"
                                        isInvalid={
                                          !!storeForm.formState.errors
                                            .contactInfo?.email
                                        }
                                      />
                                    )}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {
                                      storeForm.formState.errors.contactInfo
                                        ?.email?.message
                                    }
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group className="mb-3">
                                  <Form.Label>
                                    <FiPhone className="me-1" />
                                    Phone
                                  </Form.Label>
                                  <Controller
                                    name="contactInfo.phone"
                                    control={storeForm.control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        type="tel"
                                        placeholder="Enter phone"
                                        isInvalid={
                                          !!storeForm.formState.errors
                                            .contactInfo?.phone
                                        }
                                      />
                                    )}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {
                                      storeForm.formState.errors.contactInfo
                                        ?.phone?.message
                                    }
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group className="mb-3">
                                  <Form.Label>
                                    <FiGlobe className="me-1" />
                                    Website
                                  </Form.Label>
                                  <Controller
                                    name="contactInfo.website"
                                    control={storeForm.control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        type="url"
                                        placeholder="Enter website URL"
                                        isInvalid={
                                          !!storeForm.formState.errors
                                            .contactInfo?.website
                                        }
                                      />
                                    )}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {
                                      storeForm.formState.errors.contactInfo
                                        ?.website?.message
                                    }
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                            </Row>

                            <Button
                              type="submit"
                              variant="primary"
                              disabled={saving || !storeForm.formState.isDirty}
                            >
                              {saving ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <FiSave className="me-2" />
                                  Save Store Settings
                                </>
                              )}
                            </Button>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Tab.Pane>
                  )}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
}
