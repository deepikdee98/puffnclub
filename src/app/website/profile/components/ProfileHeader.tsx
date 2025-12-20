"use client";

import React from "react";
import { Button } from "react-bootstrap";
import { FiUser, FiEdit2, FiLogOut } from "react-icons/fi";
import styles from "./ProfileHeader.module.scss";

interface ProfileHeaderProps {
  name: string;
  phone: string;
  onEditProfile: () => void;
  onLogout: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  phone,
  onEditProfile,
  onLogout,
}) => {
  return (
    <div className="rounded-3 p-3 p-md-4 mb-3 mb-md-4">
      <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-3 gap-md-4">
        {/* Avatar and User Info */}
        <div className="d-flex align-items-center gap-3 flex-1">
          <div className={styles.avatar}>
            <FiUser size={40} />
          </div>
          <div className="flex-1">
            <h2 className={`${styles.userName} mb-1`}>{name}</h2>
            {phone && <p className={`${styles.userPhone} mb-0`}>{phone}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex align-items-center gap-2 gap-md-3 flex-shrink-0 justify-content-end">
          <Button
            variant="outline-dark"
            className={`${styles.editButton} flex-fill flex-md-grow-0`}
            onClick={onEditProfile}
          >
            <FiEdit2 className="me-2" size={16} />
            <span>Edit Profile</span>
          </Button>
          <Button
            variant="dark"
            className={`${styles.logoutButton} flex-fill flex-md-grow-0`}
            onClick={onLogout}
          >
            <FiLogOut className="me-2" size={16} />
            <span>Log Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
