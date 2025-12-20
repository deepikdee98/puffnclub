"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import PageHeader from "./components/shared/PageHeader";
import OrderCard from "./components/OrderCard";
import EmptyOrdersState from "./components/EmptyOrdersState";
import { orderService } from "../services/orderService";
import type { Order, OrderAction } from "./types/orders.types";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getOrders();
      setOrders((response.orders || []) as unknown as Order[]);
    } catch (err: any) {
      console.error("Error loading orders:", err);
      setError("Failed to load orders. Please try again.");
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = (orderId: string, action: OrderAction) => {
    switch (action) {
      case "track":
        router.push(`/website/orders/${orderId}/track`);
        break;
      case "exchange":
        // This will open exchange/return modal on track page
        router.push(`/website/orders/${orderId}/track?action=exchange`);
        break;
      case "cancel":
        // This will open cancel modal on track page
        router.push(`/website/orders/${orderId}/track?action=cancel`);
        break;
      case "review":
        // This will open review modal on track page
        router.push(`/website/orders/${orderId}/track?action=review`);
        break;
      default:
        router.push(`/website/orders/${orderId}/track`);
    }
  };

  return (
    <>
      <Container className="py-4">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="dark" />
            <p className="mt-3 text-muted">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <p className="text-danger mb-3">{error}</p>
            <button onClick={loadOrders} className="btn btn-dark">
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <EmptyOrdersState />
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onAction={handleOrderAction}
              />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
