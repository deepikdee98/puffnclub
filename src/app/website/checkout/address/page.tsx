"use client";

import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { FiEdit2, FiTrash2, FiX, FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { addressService, BackendAddress } from "../../services/addressService";
import AddressFormModal, {
  AddressFormData,
  Address,
} from "../../components/AddressFormModal";

export default function AddressPage() {
  const router = useRouter();
  const { customer, updateCustomer } = useAuth();

  const { cart } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load addresses from customer context
  useEffect(() => {
    if (customer?.addresses) {
      const mappedAddresses = mapBackendAddressesToUI(customer.addresses);
      setAddresses(mappedAddresses);
    }
  }, [customer]);

  // Map backend addresses to UI format
  const mapBackendAddressesToUI = (
    backendAddresses: BackendAddress[]
  ): Address[] => {
    const fullName =
      customer?.fullName ||
      `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim();
    const [firstName, ...lastNameParts] = fullName.split(" ");
    const lastName = lastNameParts.join(" ");
    const phone = customer?.phone || "";

    return backendAddresses.map((addr) => {
      // Parse street to extract house number and locality
      const streetParts = addr.street.split(",");
      const houseNo = streetParts[0]?.trim() || "";
      const locality = streetParts.slice(1).join(",").trim() || addr.street;

      return {
        id: addr._id || "",
        firstName: firstName || "",
        lastName: lastName || "",
        phoneNumber: phone,
        alternatePhone: "",
        pincode: addr.zipCode || "",
        townCity: addr.city || "",
        houseNo: houseNo,
        locality: locality,
        state: addr.state || "",
        isDefault: addr.isDefault || false,
      };
    });
  };

  // Map UI address to backend format
  const mapUIAddressToBackend = (address: AddressFormData): BackendAddress => {
    return {
      street: `${address.houseNo}, ${address.locality}`,
      city: address.townCity,
      state: address.state || address.townCity,
      zipCode: address.pincode,
      country: "India",
      isDefault: address.isDefault,
    };
  };

  const hasAddresses = addresses.length > 0;

  // Calculate cart totals
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

    const discount = mrp - subtotal;
    // Calculate shipping: free for orders > 500, otherwise 60
    const delivery = subtotal > 500 ? 0 : 60;
    const total = subtotal + delivery;

    return { mrp, discount, delivery, total };
  };

  const totals = calculateTotals();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleDeleteClick = (address: Address) => {
    setAddressToDelete(address);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!addressToDelete || !addressToDelete.id) return;

    setIsLoading(true);
    try {
      const response = await addressService.remove(addressToDelete.id);

      if (response.customer) {
        updateCustomer(response.customer);
        const updatedAddresses = mapBackendAddressesToUI(
          response.customer.addresses || []
        );
        setAddresses(updatedAddresses);
      }

      setShowDeleteModal(false);
      setAddressToDelete(null);

      toast.success("Address deleted successfully");
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddress = async (addressData: AddressFormData) => {
    setIsLoading(true);

    try {
      const backendAddress = mapUIAddressToBackend(addressData);

      let response;
      if (editingAddress && editingAddress.id) {
        // Update existing address
        response = await addressService.update(
          editingAddress.id,
          backendAddress
        );
      } else {
        // Add new address
        response = await addressService.add(backendAddress);
      }

      if (response.customer) {
        updateCustomer(response.customer);
        const updatedAddresses = mapBackendAddressesToUI(
          response.customer.addresses || []
        );
        setAddresses(updatedAddresses);
      }

      toast.success(
        editingAddress
          ? "Address updated successfully"
          : "Address added successfully",
        {
          position: "bottom-right",
          autoClose: 3000,
        }
      );

      setShowAddressModal(false);
      setEditingAddress(null);
    } catch (error: any) {
      console.error("Error saving address:", error);
      toast.error(
        error.message || "Failed to save address. Please try again.",
        {
          position: "bottom-right",
          autoClose: 3000,
        }
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    // Navigate to checkout with selected address
    router.push("/website/checkout");
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Container className="py-4">
        <h5 className="mb-4">Items you added into the cart</h5>

        <Row>
          {/* Left Column - Address List */}
          <Col lg={7}>
            {/* Header Card */}
            <Card className="border-0 shadow-sm rounded mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Delivery Address</h6>
                </div>
              </Card.Body>
            </Card>

            {/* Empty State or Address List */}
            <Card className="border-0 shadow-sm rounded mb-4">
              <Card.Body>
                {!hasAddresses ? (
                  // Empty State
                  <div className="text-center py-4">
                    <p className="text-muted mb-4">
                      You haven&apos;t saved any address yet. Add your details to create a new delivery address.
                    </p>
                    <Button
                      variant="dark"
                      className="d-flex align-items-center gap-2 mx-auto"
                      onClick={handleAddAddress}
                    >
                      <FiPlus size={18} />
                      Add New Address
                    </Button>
                  </div>
                ) : (
                  // Address List
                  <>
                    {addresses.map((address, index) => (
                      <div key={address.id}>
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="fw-semibold mb-2">
                              {address.firstName} {address.lastName}, {address.phoneNumber}
                              {address.isDefault && (
                                <span className="badge bg-primary ms-2 small">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-muted small">
                              {address.houseNo}, {address.locality}, {address.townCity}
                              {address.state && `, ${address.state}`}, {address.pincode}
                            </div>
                          </div>
                          <div className="d-flex gap-2 ms-3">
                            <Button
                              variant="link"
                              className="p-1 text-dark"
                              onClick={() => handleEditAddress(address)}
                              title="Edit address"
                            >
                              <FiEdit2 size={18} />
                            </Button>
                            <Button
                              variant="link"
                              className="p-1 text-danger"
                              onClick={() => handleDeleteClick(address)}
                              title="Delete address"
                              disabled={addresses.length === 1}
                            >
                              <FiTrash2 size={18} />
                            </Button>
                          </div>
                        </div>
                        {index < addresses.length - 1 && <hr className="my-3" />}
                      </div>
                    ))}

                    {/* Always show Add New Address button when there are addresses */}
                    <div className="mt-4 pt-3 border-top">
                      <Button
                        variant="outline-dark"
                        className="d-flex align-items-center gap-2"
                        onClick={handleAddAddress}
                      >
                        <FiPlus size={18} />
                        Add New Address
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - Summary */}
          <Col lg={5}>
            <Card className="border-0 shadow-sm rounded sticky-top" style={{ top: "20px" }}>
              <Card.Body>
                <h6 className="mb-4">Summary</h6>

                {/* Product Preview */}
                {cartItems.length > 0 && (
                  <div className="d-flex align-items-center mb-4">
                    <img
                      src={cartItems[0].product.images?.[0] || "/default-image.png"}
                      alt={cartItems[0].product.name}
                      className="rounded me-3"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <div className="text-muted small">Regular tee</div>
                      <div className="fw-semibold small">
                        {cartItems[0].product.name}
                      </div>
                    </div>
                  </div>
                )}

                <hr />

                {/* Price Breakdown */}
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Total MRP</span>
                  <span className="small">{formatCurrency(totals.mrp)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Discount on MRP</span>
                  <span className="small">{formatCurrency(totals.discount)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted small">Delivery charges</span>
                  <span className="small">{formatCurrency(totals.delivery)}</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold">Total Price</span>
                  <span className="fw-bold fs-5">{formatCurrency(totals.total)}</span>
                </div>

                <Button
                  variant="dark"
                  className="w-100 py-2"
                  onClick={handleContinue}
                >
                  Continue
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Address Form Modal */}
        <AddressFormModal
          show={showAddressModal}
          onHide={() => {
            setShowAddressModal(false);
            setEditingAddress(null);
          }}
          onSave={handleSaveAddress}
          editingAddress={editingAddress}
          isLoading={isLoading}
          customerName={
            customer?.fullName ||
            `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim()
          }
          customerPhone={customer?.phone || ""}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
          contentClassName="shadow-none"
        >
          <Modal.Header className="border-0 pb-0">
            <Modal.Title className="w-100">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Delete this address?</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                  aria-label="Close"
                  style={{ fontSize: "0.75rem", boxShadow: "none !important" }}
                />
              </div>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p className="text-muted mb-3">This action cannot be undone.</p>

            {addressToDelete && (
              <div className="bg-light p-3 rounded mb-3">
                <strong>
                  {addressToDelete.firstName} {addressToDelete.lastName}
                </strong>
                <br />
                <span className="text-muted">
                  {addressToDelete.houseNo}, {addressToDelete.locality}, {addressToDelete.townCity}, {addressToDelete.pincode}
                </span>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer className="border-0">
            <Button
              variant="outline-secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Deleting...
                </>
              ) : (
                "Delete Address"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}
