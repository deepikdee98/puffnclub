"use client";

import { useState, useEffect } from "react";
import { Card, Form, Button, Badge, Modal } from "react-bootstrap";
import { FiMapPin, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import AddressForm from "./AddressForm";
import { useAuth } from "../../contexts/AuthContext";
import { addressService } from "../../services/addressService";

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressSelectionProps {
  addresses: Address[];
  selectedAddress: Address;
  onSelectAddress: (address: Address) => void;
  onAddressesChange?: (addresses: Address[]) => void;
}

export default function AddressSelection({
  addresses: initialAddresses,
  selectedAddress,
  onSelectAddress,
  onAddressesChange,
}: AddressSelectionProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);

  // Keep internal state in sync when parent provides updated addresses
  useEffect(() => {
    setAddresses(initialAddresses || []);
  }, [initialAddresses]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { customer, updateCustomer } = useAuth();

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (address: Address) => {
    setAddressToDelete(address);
    setShowDeleteModal(true);
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    setIsLoading(true);
    try {
      // Use backend address ID (stored in id)
      const resp = await addressService.remove(addressToDelete.id);
      updateCustomer(resp.customer);

      // Rebuild UI list from server response
      const fullName = (resp.customer as any).fullName || `${(resp.customer as any).firstName || ''} ${(resp.customer as any).lastName || ''}`.trim();
      const phone = (resp.customer as any).phone || "";
      const remaining: Address[] = (resp.customer.addresses || []).map((b: any) => ({
        id: b._id,
        name: fullName,
        phone: phone,
        address: b.street || "",
        city: b.city || "",
        state: b.state || "",
        pincode: b.zipCode || "",
        isDefault: !!b.isDefault,
      }));

      setAddresses(remaining);

      if (selectedAddress && remaining.length > 0 && selectedAddress.id === addressToDelete.id) {
        const next = remaining.find(a => a.isDefault) || remaining[0];
        onSelectAddress(next);
      }

      if (onAddressesChange) onAddressesChange(remaining);

      toast.success("Address deleted successfully");
      setShowDeleteModal(false);
      setAddressToDelete(null);
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete address");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddress = async (addressData: AddressFormData) => {
    setIsLoading(true);

    try {
      // Map UI payload to backend shape
      const payload = {
        type: "home" as const,
        street: addressData.address,
        city: addressData.city,
        state: addressData.state,
        zipCode: addressData.pincode,
        country: "India",
        isDefault: addressData.isDefault,
      };

      let resp;
      if (editingAddress) {
        // Update specific address by backend id
        resp = await addressService.update(editingAddress.id, payload);
      } else {
        // Add new address
        resp = await addressService.add(payload);
      }

      updateCustomer(resp.customer);

      // Rebuild UI addresses from backend to ensure consistency
      const fullName = (resp.customer as any).fullName || `${(resp.customer as any).firstName || ''} ${(resp.customer as any).lastName || ''}`.trim();
      const phone = (resp.customer as any).phone || "";
      const finalAddresses: Address[] = (resp.customer.addresses || []).map((b: any) => ({
        id: b._id,
        name: fullName,
        phone: phone,
        address: b.street || "",
        city: b.city || "",
        state: b.state || "",
        pincode: b.zipCode || "",
        isDefault: !!b.isDefault,
      }));

      setAddresses(finalAddresses);

      if (finalAddresses.length === 1 || addressData.isDefault) {
        const addressToSelect = finalAddresses.find((a) => a.isDefault) || finalAddresses[0];
        onSelectAddress(addressToSelect);
      }

      if (onAddressesChange) onAddressesChange(finalAddresses);

      toast.success(editingAddress ? "Address updated successfully" : "Address added successfully");
      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Address save error:", error);
      toast.error("Failed to save address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-light border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FiMapPin className="me-2" />
              Select Delivery Address
            </h5>
            <Button variant="outline-dark" size="sm" onClick={handleAddAddress}>
              <FiPlus className="me-2" />
              Add New
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {addresses.length === 0 ? (
            <div className="text-center py-4">
              <FiMapPin size={48} className="text-muted mb-3" />
              <h6 className="text-muted">No Addresses Found</h6>
              <p className="text-muted mb-3">
                Add your first delivery address to continue
              </p>
              <Button variant="dark" onClick={handleAddAddress}>
                <FiPlus className="me-2" />
                Add Address
              </Button>
            </div>
          ) : (
            <>
              {addresses.map((address) => (
                <div key={address.id} className="border rounded p-3 mb-3">
                  <div className="d-flex align-items-start">
                    <Form.Check
                      type="radio"
                      name="address"
                      id={`address-${address.id}`}
                      checked={selectedAddress.id === address.id}
                      onChange={() => onSelectAddress(address)}
                      className="me-3 mt-1"
                    />

                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <strong className="me-2">{address.name}</strong>
                        {address.isDefault && (
                          <Badge bg="primary" className="small">
                            Default
                          </Badge>
                        )}
                      </div>
                      <div className="text-muted mb-2">
                        {address.address}
                        <br />
                        {address.city}, {address.state} - {address.pincode}
                        <br />
                        Phone: +91 {address.phone}
                      </div>

                      {/* Show edit/delete buttons only when this address is selected */}
                      {selectedAddress.id === address.id && (
                        <div className="d-flex gap-2 mt-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEditAddress(address)}
                          >
                            <FiEdit className="me-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteAddress(address)}
                            disabled={addresses.length === 1}
                          >
                            <FiTrash2 className="me-1" />
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Address Form Modal */}
      <AddressForm
        show={showAddressForm}
        onHide={() => {
          setShowAddressForm(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        editingAddress={editingAddress}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this address?</p>
          {addressToDelete && (
            <div className="bg-light p-3 rounded">
              <strong>{addressToDelete.name}</strong>
              <br />
              <span className="text-muted">
                {addressToDelete.address}, {addressToDelete.city},{" "}
                {addressToDelete.state} - {addressToDelete.pincode}
              </span>
            </div>
          )}
          <p className="text-muted mt-2 mb-0">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteAddress}>
            Delete Address
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
