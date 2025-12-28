"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FiShoppingBag } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { LoadingSpinner } from "@/app/components";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import CartItem from "./components/CartItem";
import OrderSummary from "./components/OrderSummary";
import CouponSection from "./components/CouponSection";

export default function CartPage() {
  const router = useRouter();
  const { cart, isLoading, updateCartItem, removeFromCart, refreshCart, addToCart } =
    useCart();
  const { addToWishlist } = useWishlist();

  const [appliedCoupons, setAppliedCoupons] = useState<any[]>([]);

  useEffect(() => {
    refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const updateSize = async (itemId: string, newSize: string) => {
    try {
      const cartItem = cartItems.find((item: any) => item._id === itemId);
      if (!cartItem || cartItem.size === newSize) return;

      const addToCartData = {
        productId: cartItem.product._id,
        quantity: cartItem.quantity,
        color: cartItem.color,
        size: newSize,
        price: cartItem.price
      };

      await removeFromCart(itemId);
      await addToCart(addToCartData);
    } catch (error) {
      console.error("Error updating cart item size:", error);
      alert("Could not update size. Please try again.");
      await refreshCart();
    }
  };

  const moveToWishlist = async (itemId: string) => {
    try {
      // Get item details
      const item = cartItems.find((item: any) => item._id === itemId);
      if (!item) {
        toast.error("Item not found in cart");
        return;
      }

      const productId = item.product._id || item.product;

      // Add to wishlist first
      await addToWishlist({
        productId,
        size: item.size,
        color: item.color,
      });

      // Then remove from cart
      await removeFromCart(itemId);

      toast.success(`Product moved to wishlist from your bag`);
    } catch (error: any) {
      console.error("Error moving item to wishlist:", error);
      toast.error(error.message || "Failed to move item to wishlist. Please try again.");
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      // Get item details for toast message
      const item = cartItems.find((item: any) => item._id === itemId);
      const productName = item?.product?.name || "Product";

      await removeFromCart(itemId);

      toast.success(`Product deleted from your bag`);
    } catch (error) {
      console.error("Error removing cart item:", error);
      toast.error("Failed to remove item. Please try again.");
    }
  };

  const handleApplyCoupons = (coupons: any[]) => {
    setAppliedCoupons(coupons);
  };

  const cartItems = cart?.items || [];

  const calculateTotals = () => {
    const mrp = cartItems.reduce((sum: number, item: any) => {
      const originalPrice = item.product.compareAtPrice || item.price;
      return sum + originalPrice * item.quantity;
    }, 0);

    const subtotal = cartItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const savings = mrp - subtotal;

    const couponDiscount = appliedCoupons.reduce((total, coupon) => {
      if (subtotal < coupon.minAmount) return total;

      if (coupon.type === "percentage") {
        const discount = (subtotal * coupon.value) / 100;
        return total + (coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount);
      } else {
        return total + coupon.value;
      }
    }, 0);

    const delivery = subtotal > 500 ? 0 : 60;
    const total = subtotal - couponDiscount + delivery;

    return {
      subtotal,
      savings,
      couponDiscount,
      shipping: delivery,
      delivery,
      tax: 0,
      total,
      mrp
    };
  };

  const totals = calculateTotals();

  const handleProceedToBuy = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    // Navigate to address page (Step 2)
    router.push("/website/checkout/address");
  };

  return (
    <Container className="py-4">
      <h5 className="mb-4">Items you added into the cart</h5>
      <Row>
        {/* Left Column - Cart Items */}
        <Col lg={7}>
          {isLoading ? (
            <div className="text-center py-5">
              <LoadingSpinner />
              <p className="mt-3 text-muted">Loading your cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-5">
              <FiShoppingBag size={60} className="text-muted mb-3" />
              <h5 className="text-muted">Your bag is empty</h5>
              <p className="text-muted mb-4">Add some items to get started</p>
              <Button variant="dark" onClick={() => router.push("/website/products")}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            cartItems.map((item: any) => (
              <CartItem
                key={item._id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onUpdateSize={updateSize}
                onRemoveItem={removeItem}
                onMoveToWishlist={moveToWishlist}
              />
            ))
          )}
        </Col>

        {/* Right Column - Coupon & Summary */}
        <Col lg={5}>
          {cartItems.length > 0 && (
            <>
              <CouponSection
                appliedCoupons={appliedCoupons}
                onApplyCoupons={handleApplyCoupons}
                formatCurrency={formatCurrency}
                cartSubtotal={totals.subtotal}
              />
              <OrderSummary
                totals={totals}
                itemCount={cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)}
                appliedCoupon={
                  appliedCoupons.length > 0
                    ? {
                        code: appliedCoupons.map((c) => c.code).join(", "),
                        discount: totals.couponDiscount,
                      }
                    : null
                }
                onContinue={handleProceedToBuy}
                formatCurrency={formatCurrency}
              />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
