"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav, Navbar, Collapse } from "react-bootstrap";
import {
  FiHome,
  FiShoppingBag,
  FiShoppingCart,
  FiGlobe,
  FiSettings,
  FiUsers,
  FiBarChart,
  FiTag,
  FiTruck,
  FiCreditCard,
  FiMail,
  FiHelpCircle,
  FiChevronDown,
  FiChevronRight,
  FiBell,
  FiMessageSquare,
} from "react-icons/fi";
import { useOrderStatistics } from "@/hooks/useOrderStatistics";
import styles from "./Sidebar.module.scss";

interface SidebarProps {
  collapsed: boolean;
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: MenuItem[];
  badge?: string;
}

export default function Sidebar({ collapsed, visible, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "products",
    "orders",
  ]);
  const { statistics, loading } = useOrderStatistics();

  // Dynamic menu items with real-time statistics
  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FiHome size={20} />,
      href: "/admin/dashboard",
    },
    {
      id: "products",
      label: "Product Management",
      icon: <FiShoppingBag size={20} />,
      children: [
        {
          id: "products-list",
          label: "All Products",
          icon: <FiShoppingBag size={18} />,
          href: "/admin/dashboard/products",
        },
        {
          id: "products-add",
          label: "Add Product",
          icon: <FiShoppingBag size={18} />,
          href: "/admin/dashboard/products/add",
        },
        {
          id: "categories",
          label: "Categories",
          icon: <FiTag size={18} />,
          href: "/admin/dashboard/categories",
        },
        // {
        //   id: "brands",
        //   label: "Brands",
        //   icon: <FiTag size={18} />,
        //   href: "/admin/dashboard/brands",
        // },
      ],
    },
    {
      id: "orders",
      label: "Order Management",
      icon: <FiShoppingCart size={20} />,
      children: [
        {
          id: "orders-list",
          label: "All Orders",
          icon: <FiShoppingCart size={18} />,
          href: "/admin/dashboard/orders",
          badge: loading ? "..." : statistics.totalOrders.toString(),
        },
        {
          id: "orders-pending",
          label: "Pending Orders",
          icon: <FiShoppingCart size={18} />,
          href: "/admin/dashboard/orders/pending",
          badge: loading ? "..." : statistics.pendingOrders.toString(),
        },
        {
          id: "shipping",
          label: "Shipping",
          icon: <FiTruck size={18} />,
          href: "/admin/dashboard/shipping",
        },
        {
          id: "refunds",
          label: "Refunds",
          icon: <FiCreditCard size={18} />,
          href: "/admin/dashboard/refunds",
        },
      ],
    },
    {
      id: "customers",
      label: "Customers",
      icon: <FiUsers size={20} />,
      href: "/admin/dashboard/customers",
    },
    {
      id: "homepage",
      label: "Homepage Management",
      icon: <FiGlobe size={20} />,
      href: "/admin/dashboard/homepage",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <FiBell size={20} />,
      href: "/admin/dashboard/notifications",
    },
    // {
    //   id: "messages",
    //   label: "Messages",
    //   icon: <FiMessageSquare size={20} />,
    //   href: "/admin/dashboard/messages",
    // },
    // {
    //   id: "analytics",
    //   label: "Analytics",
    //   icon: <FiBarChart size={20} />,
    //   href: "/admin/dashboard/analytics",
    // },
    // {
    //   id: "settings",
    //   label: "Settings",
    //   icon: <FiSettings size={20} />,
    //   href: "/admin/dashboard/settings",
    // },
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  const isParentActive = (children: MenuItem[]) => {
    return children.some((child) => child.href && isActive(child.href));
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isItemActive = item.href ? isActive(item.href) : false;
    const isParentItemActive = hasChildren
      ? isParentActive(item.children!)
      : false;

    if (hasChildren) {
      return (
        <div key={item.id} className={styles.menuGroup}>
          <div
            className={`${styles.menuItem} ${styles.menuParent} ${
              isParentItemActive ? styles.active : ""
            } ${level > 0 ? styles.submenuItem : ""}`}
            onClick={() => !collapsed && toggleExpanded(item.id)}
          >
            <div className={styles.menuItemContent}>
              <div className={styles.menuItemIcon}>{item.icon}</div>
              {!collapsed && (
                <>
                  <span className={styles.menuItemLabel}>{item.label}</span>
                  <div className={styles.menuItemArrow}>
                    {isExpanded ? (
                      <FiChevronDown size={16} />
                    ) : (
                      <FiChevronRight size={16} />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {!collapsed && (
            <Collapse in={isExpanded}>
              <div className={styles.submenu}>
                {item.children!.map((child) =>
                  renderMenuItem(child, level + 1)
                )}
              </div>
            </Collapse>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        href={item.href!}
        className={`${styles.menuItem} ${isItemActive ? styles.active : ""} ${
          level > 0 ? styles.submenuItem : ""
        }`}
        onClick={onClose}
      >
        <div className={styles.menuItemContent}>
          <div className={styles.menuItemIcon}>{item.icon}</div>
          {!collapsed && (
            <>
              <span className={styles.menuItemLabel}>{item.label}</span>
              {item.badge && (
                <span className={styles.menuItemBadge}>{item.badge}</span>
              )}
            </>
          )}
        </div>
      </Link>
    );
  };

  return (
    <>
      <div
        className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""} ${
          visible ? styles.visible : ""
        }`}
      >
        {/* Logo */}
        <div className={styles.sidebarHeader}>
          <Link href="/admin/dashboard" className={styles.logo}>
            <div className={styles.logoIcon}>
              <FiShoppingBag size={24} />
            </div>
            {!collapsed && (
              <div className={styles.logoText}>
                <span className={styles.logoTitle}>Admin Panel</span>
                <span className={styles.logoSubtitle}>E-commerce</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <Nav className={styles.sidebarNav}>
          {menuItems.map((item) => renderMenuItem(item))}
        </Nav>

        {/* Footer */}
        {!collapsed && (
          <div className={styles.sidebarFooter}>
            <div className={styles.footerContent}>
              <p className={styles.footerText}>Admin Panel v1.0</p>
              <p className={styles.footerCopyright}>© 2024 E-commerce</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
