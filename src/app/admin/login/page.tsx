"use client";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import styles from "./page.module.scss";
import { FiSettings, FiTrendingUp, FiShoppingBag } from "react-icons/fi";

// Dynamic icon mapping
const iconMap = {
  FiTrendingUp,
  FiShoppingBag,
  FiSettings,
  FiArrowRight,
  FiMail,
  FiLock,
};

// Interface for store settings
interface StoreSettings {
  storeName: string;
  storeDescription: string;
  storeTagline: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  featureCards: Array<{
    title: string;
    description: string;
    icon: string;
    isActive: boolean;
  }>;
  contactInfo: {
    email: string;
    phone: string;
    website: string;
  };
}

// Validation schema using Yup
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .trim()
    .lowercase(),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must not exceed 50 characters"),
  rememberMe: yup.boolean().default(false),
});

// TypeScript interface for form data
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>({
    storeName: "E-commerce Admin Panel",
    storeDescription:
      "Comprehensive management system for your online store. Manage products, orders, customers, and analytics all in one place.",
    storeTagline: "Your Business, Simplified",
    logo: "",
    primaryColor: "#667eea",
    secondaryColor: "#764ba2",
    featureCards: [
      {
        title: "Dashboard Analytics",
        description: "Real-time insights into your business performance.",
        icon: "FiTrendingUp",
        isActive: true,
      },
      {
        title: "Product Management",
        description: "Complete product catalog management.",
        icon: "FiShoppingBag",
        isActive: true,
      },
      {
        title: "Order Processing",
        description: "Streamlined order management system.",
        icon: "FiSettings",
        isActive: true,
      },
      {
        title: "Easy Navigation",
        description: "Intuitive interface for efficient workflow.",
        icon: "FiArrowRight",
        isActive: true,
      },
    ],
    contactInfo: {
      email: "admin@store.com",
      phone: "+1 (555) 123-4567",
      website: "https://yourstore.com",
    },
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const router = useRouter();

  // React Hook Form setup with Yup resolver
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onChange", // Validate on change for real-time feedback
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Fetch store settings on component mount
  useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        console.log(
          "Fetching store settings from:",
          `${process.env.NEXT_PUBLIC_API_URL}/admin/store-settings`
        );

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/store-settings`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Response status:", response.status);

        if (response.ok) {
          const settings = await response.json();
          console.log("Store settings loaded:", settings);
          setStoreSettings(settings);
        }
      } catch (error) {
        console.error("Failed to fetch store settings:", error);
        console.error("Error details:", {
          message: error.message,
          name: error.name,
          stack: error.stack,
        });
        // Keep current default settings on error
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchStoreSettings();
  }, []);

  // Form submission handler
  const onSubmit = async (data: LoginFormData) => {
    console.log("Form submitted with data:", data);
    setIsLoading(true);
    clearErrors(); // Clear any previous errors

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const result = await response.json();
      const accessToken = result.accessToken || result.token;

      // Store token and admin info
      if (data.rememberMe) {
        localStorage.setItem("admin_token", accessToken);
        if (result.admin) {
          localStorage.setItem("admin_info", JSON.stringify(result.admin));
        }
      } else {
        sessionStorage.setItem("admin_token", accessToken);
        if (result.admin) {
          sessionStorage.setItem("admin_info", JSON.stringify(result.admin));
        }
      }

      toast.success("Login successful! Redirecting...");
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      setError("root", {
        type: "manual",
        message: error.message || "Login failed",
      });
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form errors
  const onError = (errors: any) => {
    console.error("Form validation errors:", errors);

    // Show first validation error as toast
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      toast.error(firstError.message);
    }
  };

  // Reset form handler
  const handleReset = () => {
    reset();
    clearErrors();
    setShowPassword(false);
  };

  // Show loading state while fetching settings
  if (settingsLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading store settings...</p>
        </div>
      </div>
    );
  }

  // Render dynamic icon
  const renderIcon = (iconName: string, size: number = 32) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? (
      <IconComponent size={size} />
    ) : (
      <FiSettings size={size} />
    );
  };

  return (
    <div>
      <Row className="h-100 min-vh-100">
        <Col
          md={6}
          className={`${styles.leftSection} d-flex align-items-center`}
          style={{
            background:
              storeSettings?.primaryColor && storeSettings?.secondaryColor
                ? `linear-gradient(135deg, ${storeSettings.primaryColor} 0%, ${storeSettings.secondaryColor} 100%)`
                : undefined,
          }}
        >
          <div className={styles.contentWrapper}>
            <div className={styles.heroSection}>
              {storeSettings?.logo && (
                <div className="text-center mb-4">
                  <img
                    src={storeSettings.logo}
                    alt="Store Logo"
                    style={{ maxHeight: "80px", maxWidth: "200px" }}
                    className="img-fluid"
                  />
                </div>
              )}
              <h1 className={styles.heroTitle}>
                {storeSettings?.storeName || "E-commerce Admin Panel"}
              </h1>
              <p className={styles.heroSubtitle}>
                {storeSettings?.storeDescription ||
                  "Comprehensive management system for your online store. Manage products, orders, customers, and analytics all in one place."}
              </p>

              <div className={styles.featureCards}>
                <Row>
                  {storeSettings?.featureCards?.map((card, index) => (
                    <Col md={6} className="mb-4" key={index}>
                      <Card className={`${styles.featureCard} h-100`}>
                        <Card.Body className="text-center">
                          <div className={styles.featureIcon}>
                            {renderIcon(card.icon)}
                          </div>
                          <Card.Title className="h6">{card.title}</Card.Title>
                          <Card.Text className="small">
                            {card.description}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </div>
        </Col>
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center"
        >
          <Card className={styles.loginCard}>
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h1 className={styles.loginTitle}>Admin Login</h1>
                <p className={styles.loginSubtitle}>
                  Sign in to access your admin dashboard
                </p>
              </div>

              {/* Display root-level errors */}
              {errors.root && (
                <Alert variant="danger" className={styles.errorAlert}>
                  {errors.root.message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                {/* Email Field */}
                <Form.Group className="mb-3">
                  <Form.Label className={styles.formLabel}>
                    <FiMail className="me-2" />
                    Email Address
                  </Form.Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        className={styles.formControl}
                        isInvalid={!!errors.email}
                        disabled={isLoading}
                        autoComplete="email"
                        autoFocus
                      />
                    )}
                  />
                  {errors.email && (
                    <Form.Control.Feedback type="invalid">
                      {errors.email.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-4">
                  <Form.Label className={styles.formLabel}>
                    <FiLock className="me-2" />
                    Password
                  </Form.Label>
                  <div className={styles.passwordWrapper}>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <Form.Control
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className={styles.formControl}
                          isInvalid={!!errors.password}
                          disabled={isLoading}
                          autoComplete="current-password"
                        />
                      )}
                    />
                    <Button
                      variant="link"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                      disabled={isLoading}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {errors.password.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Remember Me and Forgot Password */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Controller
                    name="rememberMe"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Form.Check
                        type="checkbox"
                        id="remember-me"
                        label="Remember me"
                        checked={value}
                        onChange={onChange}
                        className={styles.checkboxCustom}
                        disabled={isLoading}
                      />
                    )}
                  />
                  <Link
                    href="/admin/forgot-password"
                    className={styles.forgotLink}
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className={`${styles.loginButton} w-100`}
                  disabled={isLoading || !isDirty || !isValid}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <FiArrowRight className="ms-2" />
                    </>
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className={styles.helpText}>
                  Need help?{" "}
                  <a
                    href={`mailto:${
                      storeSettings?.contactInfo?.email || "admin@store.com"
                    }`}
                    className={styles.helpLink}
                  >
                    Contact Support
                  </a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
