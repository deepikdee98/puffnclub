"use client";

import React from "react";
import { Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import ProfileHeader from "./components/ProfileHeader";
import MenuList from "./components/MenuList";

const ProfilePage: React.FC = () => {
  const { customer, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // TEMPORARY: Bypass auth check for UI testing
  const BYPASS_AUTH_FOR_UI_TESTING = true;

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated && !BYPASS_AUTH_FOR_UI_TESTING) {
      router.push("/auth/login-new");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated && !BYPASS_AUTH_FOR_UI_TESTING) {
    return null;
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      router.push("/website");
    }
  };

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  // Mock data for UI testing
  const mockCustomer = {
    fullName: "Vittesh Pagallu",
    phone: "+91 9123456789",
  };

  const displayName = BYPASS_AUTH_FOR_UI_TESTING
    ? customer?.fullName || mockCustomer.fullName
    : customer?.fullName || "Guest User";

  const displayPhone = BYPASS_AUTH_FOR_UI_TESTING
    ? customer?.phone || mockCustomer.phone
    : customer?.phone || "";

  return (
    <div
      className="bg-white py-4 py-md-5"
      style={{ minHeight: "calc(100vh - 200px)" }}
    >
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-12 col-lg-10">
            <div className="bg-light p-3 p-md-4 rounded-3">
              {/* Profile Header - Avatar, Name, Phone, Edit & Logout Buttons */}
              <ProfileHeader
                name={displayName}
                phone={displayPhone}
                onEditProfile={handleEditProfile}
                onLogout={handleLogout}
              />

              {/* Menu List - Navigation Items */}
              <MenuList />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProfilePage;
