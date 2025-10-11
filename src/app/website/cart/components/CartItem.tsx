import { useState } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { FiX, FiHeart, FiTrash2 } from "react-icons/fi";
import { CartItem as ICartItem } from "../../services/cartService";

interface CartItemProps {
  item: ICartItem;
  onRemoveItem: (itemId: string) => void;
  onMoveToWishlist: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onUpdateSize: (itemId: string, newSize: string) => void;
}

// TypeScript interfaces
interface SizeStock {
  size: string;
  stock: number;
  available: boolean;
}

interface ProductVariant {
  color: string;
  sizeStocks?: SizeStock[];
  sizes?: string[];
  stock?: number;
  totalStock?: number;
}

export default function CartItem({
  item,
  onRemoveItem,
  onMoveToWishlist,
  onUpdateQuantity,
  onUpdateSize,
}: CartItemProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState(item.size);
  const [selectedQuantity, setSelectedQuantity] = useState(item.quantity);

  // Find the matching variant
  const product = item.product;
  const variant: ProductVariant | undefined =
    product.variants?.find((v: ProductVariant) => v.color === item.color) ||
    product.variants?.[0];
    
  // Handle both old and new format data
  let sizeStocks: SizeStock[] = [];
  
  if (variant?.sizeStocks && variant.sizeStocks.length > 0) {
    // New format: use sizeStocks directly
    sizeStocks = variant.sizeStocks;
  } else if (variant?.sizes && variant.sizes.length > 0) {
    // Old format: convert sizes array to sizeStocks format
    const stockPerSize = Math.floor((variant.stock || 0) / variant.sizes.length);
    sizeStocks = variant.sizes.map((size: string): SizeStock => ({
      size,
      stock: stockPerSize,
      available: stockPerSize > 0,
    }));
  } else {
    // Fallback: create basic size options
    const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];
    sizeStocks = allSizes.map((size): SizeStock => ({
      size,
      stock: size === item.size ? (variant?.stock || 1) : 0,
      available: size === item.size && (variant?.stock || 0) > 0,
    }));
  }
  
  const currentSizeObj = sizeStocks.find((s) => s.size === item.size);
  
  // Validation: Check if current size/quantity is valid
  const isCurrentSizeAvailable = currentSizeObj?.available && (currentSizeObj?.stock || 0) > 0;
  const maxQty = Math.max(1, currentSizeObj?.stock || 1);
  
  // If current quantity exceeds available stock, limit it
  const validQuantity = Math.min(item.quantity, maxQty);
  const qtyOptions = Array.from({ length: maxQty }, (_, i) => i + 1);

  // Show warning if current selection is invalid
  const showStockWarning = !isCurrentSizeAvailable || item.quantity > maxQty;

  // Handle size modal submit
  const handleSizeSubmit = () => {
    if (selectedSize && selectedSize !== item.size) {
      onUpdateSize(item._id, selectedSize);
    }
    setShowSizeModal(false);
  };

  // Handle quantity modal submit
  const handleQuantitySubmit = () => {
    if (selectedQuantity !== item.quantity) {
      onUpdateQuantity(item._id, selectedQuantity);
    }
    setShowQuantityModal(false);
  };

  // Generate quantity options (1-10)
  const quantityOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <>
      <Card className="border-0 shadow-sm rounded mb-3 position-relative">
        <Button
          variant=""
          className="position-absolute top-0 end-0 p-2 border-0"
          onClick={() => setShowDeleteModal(true)}
          style={{ zIndex: 1 }}
          aria-label="Remove item"
        >
          <FiX size={20} />
        </Button>
        <Card.Body className="d-flex align-items-center">
          <div className="me-3" style={{ minWidth: 80 }}>
            <img
              src={product.images?.[0] || "https://via.placeholder.com/200x200"}
              alt={product.name}
              className="img-fluid rounded"
              style={{
                width: 70,
                height: 70,
                objectFit: "cover",
                background: "#eee",
              }}
            />
          </div>
          <div className="flex-grow-1">
            <div className="text-muted small mb-1">
              {product.category || product.type || "Regular tee"}
            </div>
            <div className="fw-semibold mb-1">{product.name}</div>
            
            {/* Stock Warning */}
            {showStockWarning && (
              <div className="alert alert-warning py-1 px-2 mb-2 small">
                {!isCurrentSizeAvailable 
                  ? `Size ${item.size} is currently out of stock`
                  : `Only ${maxQty} items available for size ${item.size}`
                }
              </div>
            )}
            
            <div className="d-flex gap-3 align-items-center mb-1">
              {/* Size button */}
              <div className="d-flex flex-column">
                <small className="text-muted mb-1">Size</small>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedSize(item.size);
                    setShowSizeModal(true);
                  }}
                  style={{ minWidth: 80 }}
                >
                  {item.size}
                </Button>
              </div>
              
              {/* Quantity button */}
              <div className="d-flex flex-column">
                <small className="text-muted mb-1">Qty</small>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedQuantity(validQuantity);
                    setShowQuantityModal(true);
                  }}
                  style={{ minWidth: 80 }}
                  disabled={!isCurrentSizeAvailable}
                >
                  {validQuantity}
                </Button>
              </div>
            </div>
            
            <div className="d-flex justify-content-between align-items-center">
              <div className="fw-bold fs-6">₹ {item.price}</div>
              <div className="small text-muted">
                Total: ₹ {item.price * validQuantity}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Modal
        centered
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      >
        <Modal.Body className="text-start">
          <h6 className="mb-2">Did you change your mind?</h6>
          <div className="text-muted mb-3" style={{ fontSize: 15 }}>
            Remove the product or move to the wishlist
          </div>
          <div className="d-flex flex-column flex-md-row gap-2 justify-content-start">
            <Button
              variant="dark"
              className="px-4"
              onClick={() => {
                setShowDeleteModal(false);
                onRemoveItem(item._id);
              }}
            >
              <FiTrash2 className="me-2" />
              Delete
            </Button>
            <Button
              variant="outline-secondary"
              className="px-4"
              onClick={() => {
                setShowDeleteModal(false);
                onMoveToWishlist(item._id);
              }}
            >
              <FiHeart className="me-2" />
              Move to wishlist
            </Button>
          </div>
        </Modal.Body>
        <Button
          variant=""
          className="position-absolute top-0 end-0 p-2 border-0"
          style={{ right: 15, zIndex: 2 }}
          onClick={() => setShowDeleteModal(false)}
        >
          <FiX size={20} />
        </Button>
      </Modal>

      {/* Size Selection Modal */}
      <Modal
        centered
        show={showSizeModal}
        onHide={() => setShowSizeModal(false)}
        size="sm"
      >
        <Modal.Header className="border-0 pb-2">
          <div className="d-flex align-items-center w-100">
            <img
              src={product.images?.[0] || "https://via.placeholder.com/200x200"}
              alt={product.name}
              className="rounded me-3"
              style={{
                width: 50,
                height: 50,
                objectFit: "cover",
              }}
            />
            <div>
              <div className="fw-semibold">{product.name}</div>
              <div className="text-muted small">₹ {item.price}</div>
            </div>
          </div>
          <Button
            variant=""
            className="position-absolute top-0 end-0 p-2 border-0"
            onClick={() => setShowSizeModal(false)}
          >
            <FiX size={20} />
          </Button>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <h6 className="mb-3">Select Size</h6>
          <div className="d-flex flex-wrap gap-2 mb-4">
            {sizeStocks.map((sizeOption: SizeStock) => (
              <Button
                key={sizeOption.size}
                variant={selectedSize === sizeOption.size ? "dark" : "outline-secondary"}
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 45,
                  height: 45,
                  fontSize: "14px",
                  fontWeight: "600"
                }}
                disabled={!sizeOption.available || sizeOption.stock === 0}
                onClick={() => setSelectedSize(sizeOption.size)}
              >
                {sizeOption.size}
              </Button>
            ))}
          </div>
          <Button
            variant="dark"
            className="w-100"
            onClick={handleSizeSubmit}
            disabled={!selectedSize}
          >
            Done
          </Button>
        </Modal.Body>
      </Modal>

      {/* Quantity Selection Modal */}
      <Modal
        centered
        show={showQuantityModal}
        onHide={() => setShowQuantityModal(false)}
        size="sm"
      >
        <Modal.Header className="border-0 pb-2">
          <div className="d-flex align-items-center w-100">
            <img
              src={product.images?.[0] || "https://via.placeholder.com/200x200"}
              alt={product.name}
              className="rounded me-3"
              style={{
                width: 50,
                height: 50,
                objectFit: "cover",
              }}
            />
            <div>
              <div className="fw-semibold">{product.name}</div>
              <div className="text-muted small">₹ {item.price}</div>
            </div>
          </div>
          <Button
            variant=""
            className="position-absolute top-0 end-0 p-2 border-0"
            onClick={() => setShowQuantityModal(false)}
          >
            <FiX size={20} />
          </Button>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <h6 className="mb-3">Select Quantity</h6>
          <div className="d-flex flex-wrap gap-2 mb-4">
            {quantityOptions.map((qty: number) => (
              <Button
                key={qty}
                variant={selectedQuantity === qty ? "dark" : "outline-secondary"}
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 45,
                  height: 45,
                  fontSize: "14px",
                  fontWeight: "600"
                }}
                disabled={qty > maxQty}
                onClick={() => setSelectedQuantity(qty)}
              >
                {qty}
              </Button>
            ))}
          </div>
          <Button
            variant="dark"
            className="w-100"
            onClick={handleQuantitySubmit}
            disabled={!selectedQuantity}
          >
            Done
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
