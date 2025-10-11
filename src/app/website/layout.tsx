"use client";

import { Container } from "react-bootstrap";
import Header from "./components/NewHeader";
// import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/website.scss";
import Footer from "./components/NewFooter";

interface WebsiteLayoutProps {
  children: React.ReactNode;
}

export default function WebsiteLayout({ children }: WebsiteLayoutProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="website-layout">
            <Header />
            <main className="main-content">{children}</main>
            <Footer />
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
