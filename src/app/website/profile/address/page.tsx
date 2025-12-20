"use client";

import { useState, useEffect } from "react";
import { BsArrowLeft, BsPlusLg, BsPencil, BsTrash } from "react-icons/bs";
import Link from "next/link";
import { Container, Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "./address.scss";
import AddressFormModal, {
  AddressFormData,
  Address,
} from "../../components/AddressFormModal";
import { useAuth } from "../../contexts/AuthContext";
import { addressService, BackendAddress } from "../../services/addressService";

export default function AddressPage() {
  const { customer, updateCustomer } = useAuth();
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
        response = await addressService.update(
          editingAddress.id,
          backendAddress
        );
      } else {
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
          position: "top-right",
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
          position: "top-right",
          autoClose: 3000,
        }
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const hasAddress = addresses.length > 0;

  return (
    <>
      <Container>
        <div className="address-wrapper py-4">
          {/* Page Header */}
          <div className="page-header">
            <div className="header-content">
              <Link
                href="/website/profile"
                className="back-button text-decoration-none text-dark"
              >
                <BsArrowLeft size={20} />
              </Link>
              <div className="header-text">
                <h5>Manage Saved Address</h5>
                <p className="subtitle">
                  Quickly access and update your saved addresses.
                </p>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {!hasAddress && (
            <div className="empty-state">
              <p className="empty-message">
                You haven&apos;t saved any address. Add your details to create a
                new delivery address.
              </p>
              <button
                className="add-address-btn d-flex align-items-center gap-2 mx-auto"
                onClick={handleAddAddress}
              >
                <BsPlusLg size={14} />
                Add Address
              </button>
            </div>
          )}

          {/* Address List */}
          {hasAddress && (
            <>
              {addresses.map((address) => (
                <div key={address.id} className="address-card">
                  <div className="address-content">
                    <div className="address-info">
                      <div className="address-header">
                        <p className="name-phone">
                          {address.firstName} {address.lastName},{" "}
                          {address.phoneNumber}
                        </p>
                        {address.isDefault && (
                          <span className="default-badge">Default</span>
                        )}
                      </div>
                      <p className="address-details">
                        {address.houseNo}, {address.locality},{" "}
                        {address.townCity}
                        {address.state && `, ${address.state}`},{" "}
                        {address.pincode}
                      </p>
                    </div>
                    <div className="address-actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditAddress(address)}
                      >
                        <BsPencil size={14} />
                        Edit
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteClick(address)}
                        disabled={addresses.length === 1}
                        title={
                          addresses.length === 1
                            ? "Cannot delete the only address"
                            : "Delete address"
                        }
                      >
                        <BsTrash size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                className="add-new-address-btn"
                onClick={handleAddAddress}
              >
                <BsPlusLg size={14} />
                Add new address
              </button>
            </>
          )}
        </div>
      </Container>

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
                {addressToDelete.houseNo}, {addressToDelete.locality},{" "}
                {addressToDelete.townCity}, {addressToDelete.pincode}
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
    </>
  );
}
