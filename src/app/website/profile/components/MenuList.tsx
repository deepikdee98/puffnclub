"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiChevronRight } from "react-icons/fi";
import styles from "./MenuList.module.scss";

interface MenuItem {
  icon: string;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    icon: "/images/orders-icon.svg",
    label: "Orders",
    href: "/website/orders",
  },
  {
    icon: "/images/saved-address-icon.svg",
    label: "Saved Address",
    href: "/website/profile/addresses",
  },
  {
    icon: "/images/contact-us-icon.svg",
    label: "Contact Us",
    href: "/website/contactus",
  },
  {
    icon: "/images/t&c-icon.svg",
    label: "Terms & Conditions",
    href: "/website/terms-of-services",
  },
  {
    icon: "/images/privacy-policy-icon.svg",
    label: "Privacy policy",
    href: "/website/privacy",
  },
];

const MenuList: React.FC = () => {
  return (
    <div className="rounded-3 overflow-hidden">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={`${styles.menuItem} d-flex align-items-center justify-content-between text-decoration-none text-dark`}
        >
          <div className="d-flex align-items-center gap-3">
            <span className="d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
              <Image
                src={item.icon}
                alt={item.label}
                width={24}
                height={24}
                style={{ objectFit: 'contain' }}
              />
            </span>
            <span className={styles.menuLabel}>{item.label}</span>
          </div>
          <FiChevronRight size={20} className={styles.chevron} />
        </Link>
      ))}
    </div>
  );
};

export default MenuList;
