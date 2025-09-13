"use client";

import { Badge, Button, Row, Col } from "react-bootstrap";
import { FiTrash2, FiMinus, FiPlus, FiTruck } from "react-icons/fi";
import { CartItem as ICartItem } from "../../services/cartService";

interface CartItemProps {
  item: ICartItem; // item contains product details
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  formatCurrency: (amount: number) => string;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemoveItem,
  formatCurrency,
}: CartItemProps) {
  const product = item.product;

  return (
    <div className="p-4 border-bottom">
      <Row className="align-items-center">
        <Col md={2}>
          <img
            src={product.images?.[0] || "https://via.placeholder.com/200x200"}
            alt={product.name}
            className="img-fluid rounded"
            style={{ aspectRatio: "1", objectFit: "cover" }}
          />
        </Col>
        <Col md={6}>
          <h6 className="mb-1">{product.name}</h6>
          {product.brand && <p className="text-muted mb-1">{product.brand}</p>}
          <div className="d-flex gap-2 mb-2">
            {item.size && (
              <Badge bg="light" text="dark">
                Size: {item.size}
              </Badge>
            )}
            {item.color && (
              <Badge bg="light" text="dark">
                Color: {item.color}
              </Badge>
            )}
          </div>
          <div className="d-flex align-items-center">
            <span className="fw-bold me-2">Rs. {item.price}</span>
            {product.compareAtPrice && (
              <small className="text-muted text-decoration-line-through">
                {product.compareAtPrice}
              </small>
            )}
          </div>
          {product.deliveryInfo?.deliveryTime && (
            <small className="text-success">
              <FiTruck className="me-1" />
              Delivery in {product.deliveryInfo.deliveryTime}
            </small>
          )}
        </Col>
        <Col md={2}>
          <div className="d-flex align-items-center justify-content-center">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <FiMinus size={12} />
            </Button>
            <span className="mx-3 fw-bold">{item.quantity}</span>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
            >
              <FiPlus size={12} />
            </Button>
          </div>
        </Col>
        <Col md={2} className="text-end">
          <div className="fw-bold mb-2">Rs. {item.price * item.quantity}</div>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onRemoveItem(item._id)}
          >
            <FiTrash2 size={14} />
          </Button>
        </Col>
      </Row>
    </div>
  );
}
