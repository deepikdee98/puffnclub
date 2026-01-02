'use client';

import { usePathname } from 'next/navigation';
import { Container } from "react-bootstrap";
import Header from './website-components/NewHeader';
import Breadcrumbs from './website-components/Breadcrumbs';
import Footer from './website-components/NewFooter';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/website.scss";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <>
      {/* Show website layout for all routes except admin */}
      {!isAdminRoute ? (
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="website-layout">
                <Header />
                <main className="main-content">
                  <Container>
                    <div className="d-block d-lg-none">
                      <Breadcrumbs />
                    </div>
                  </Container>
                  {children}
                </main>
                <Footer />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      ) : (
        // Admin routes use their own layouts
        children
      )}
    </>
  );
}