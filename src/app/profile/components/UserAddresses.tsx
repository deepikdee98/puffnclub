"use client";

import React from "react";
import { Card, ListGroup, Button, ButtonGroup } from "react-bootstrap";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export type Address = {
  name: string;
  type?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault?: boolean;
};

type UserAddressesProps = {
  addresses: Address[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
};

const UserAddresses: React.FC<UserAddressesProps> = ({
  addresses,
  onEdit,
  onRemove,
}) => {
  // Separate default and other addresses
  const defaultAddresses = addresses.filter((addr) => addr.isDefault);
  const otherAddresses = addresses.filter((addr) => !addr.isDefault);

  const renderAddressList = (addrList: Address[], isDefaultGroup: boolean) => (
    <>
      <Card.Header>
        <h5
          className="mb-0"
          style={{ color: isDefaultGroup ? "#198754" : "#000" }}
        >
          {isDefaultGroup ? "Default Address" : "Other Addresses"}
        </h5>
      </Card.Header>
      <ListGroup variant="flush">
        {addrList.length > 0 ? (
          addrList.map((addr, idx) => (
            <ListGroup.Item
              key={`${isDefaultGroup ? "default" : "other"}-${idx}`}
              className="d-flex justify-content-between align-items-start"
            >
              <div>
                <div>
                  <strong>{addr.name}</strong> ({addr.type || "Home"})
                </div>
                <div>{addr.addressLine1}</div>
                {addr.addressLine2 && <div>{addr.addressLine2}</div>}
                <div>
                  {addr.city}, {addr.state} - {addr.zip}
                </div>
                {addr.phone && <div>Phone: {addr.phone}</div>}
              </div>
              <ButtonGroup vertical>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="mb-1"
                  onClick={() => onEdit(addresses.indexOf(addr))}
                  title="Edit Address"
                >
                  <FiEdit /> Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onRemove(addresses.indexOf(addr))}
                  title="Remove Address"
                >
                  <FiTrash2 /> Remove
                </Button>
              </ButtonGroup>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>No addresses in this section.</ListGroup.Item>
        )}
      </ListGroup>
    </>
  );

  return (
    <>
      <Card className="mb-4 shadow-sm">
        {renderAddressList(defaultAddresses, true)}
      </Card>
      <Card className="mb-4 shadow-sm">
        {renderAddressList(otherAddresses, false)}
      </Card>
    </>
  );
};

export default UserAddresses;
