'use client';

import { usePathname } from 'next/navigation';
import Header from './website/components/Header';
import Footer from './website/components/Footer';
import { AuthProvider } from './website/contexts/AuthContext';
import { CartProvider } from './website/contexts/CartContext';
import { WishlistProvider } from './website/contexts/WishlistContext';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isWebsiteRoute = pathname?.startsWith('/website');

  return (
    <>
      {/* Show website layout only for root routes (not /admin or /website) */}
      {!isAdminRoute && !isWebsiteRoute ? (
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="website-layout">
                <Header />
                <main className="main-content">
                  {children}
                </main>
                <Footer />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      ) : (
        // Admin and website routes use their own layouts
        children
      )}
    </>
  );
}