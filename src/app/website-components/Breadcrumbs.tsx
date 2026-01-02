"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import styles from "./Breadcrumbs.module.scss";

interface BreadcrumbProps {
  customLabels?: Record<string, string>;
  excludePaths?: string[];
}

export default function Breadcrumbs({ customLabels = {}, excludePaths = [] }: BreadcrumbProps) {
  const pathname = usePathname();

  // Don't show breadcrumbs on homepage
  if (pathname === "/website" || pathname === "/") {
    return null;
  }

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter((path) => path);
    const breadcrumbs = [];

    // Always start with Home
    breadcrumbs.push({
      label: "Home page",
      href: "/website",
      active: false,
    });

    let currentPath = "";
    let pathIndex = 0;
    paths.forEach((path, index) => {
      // Skip 'website' in the path as it's represented by 'Home page'
      if (path === "website") return;

      // Skip paths that should be excluded (like dynamic IDs)
      if (excludePaths.includes(path)) return;

      currentPath += `/${path}`;
      pathIndex++;
      const isLast = index === paths.length - 1;

      // Check if there's a custom label for this path
      const label = customLabels[path] || formatPathSegment(path);

      breadcrumbs.push({
        label,
        href: `/website${currentPath}`,
        active: isLast,
      });
    });

    return breadcrumbs;
  };

  // Format path segment to readable text
  const formatPathSegment = (segment: string): string => {
    // Handle special cases
    const specialCases: Record<string, string> = {
      aboutus: "About Us",
      contactus: "Contact Us",
      products: "Products",
      collections: "New Collection",
      cart: "Shopping Cart",
      checkout: "Checkout",
      profile: "My Profile",
      orders: "My Orders",
      wishlist: "Wishlist",
      auth: "Authentication",
      login: "Login",
      register: "Register",
      address: "Address",
      edit: "Edit",
      add: "Add",
      faq: "FAQ",
      privacy: "Privacy Policy",
      "terms-of-services": "Terms of Service",
    };

    if (specialCases[segment]) {
      return specialCases[segment];
    }

    // If it's a dynamic ID (MongoDB ObjectId format or UUID), return generic label
    if (/^[a-f\d]{24}$/i.test(segment) || /^[a-f\d-]{36}$/i.test(segment)) {
      return "Details";
    }

    // Convert kebab-case or snake_case to Title Case
    return segment
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't render if only home breadcrumb
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumbNav}>
      <ol className={styles.breadcrumb}>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className={styles.breadcrumbItem}>
            {index > 0 && (
              <span className={styles.breadcrumbSeparator}>
                <FiChevronRight size={14} />
              </span>
            )}
            {crumb.active ? (
              <span className={styles.breadcrumbTextActive}>{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className={styles.breadcrumbLink}>
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
