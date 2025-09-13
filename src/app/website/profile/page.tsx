"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import {
  Container,
  Button,
  ButtonGroup,
  Tab,
  Nav,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { FiUser, FiHome } from "react-icons/fi";
import AddressSelection from "../cart/components/AddressSelection";
import UserInfo from "./components/UserInfo";
import { useAuth } from "../contexts/AuthContext";
import { addressService } from "../services/addressService";

type Customer = {
  fullName: string;
  phone: string;
  email?: string;
  addresses?: {
    type: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
    _id: string;
    id: string;
  }[];
};

const ProfilePage: React.FC = () => {
  const { customer } = useAuth();
  // Using cart AddressSelection - keep state for selection
  type UIAddress = {
    id: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
    fullname?: string;
  };
  const [selectedAddress, setSelectedAddress] = useState<UIAddress | null>(null);
  const [apiAddresses, setApiAddresses] = useState<UIAddress[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState<boolean>(false);

  // Controlled form fields for account details
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");

  useEffect(() => {
    if (customer) {
      setFormName(customer.fullName || "");
      setFormEmail(customer.email || "");
      setFormPhone(customer.phone || "");
    }
  }, [customer]);

  // Fetch addresses from API and map to UIAddress
  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoadingAddresses(true);
      try {
        const resp = await addressService.list();
        const backendAddresses = resp.addresses || [];
        const fullName = customer?.fullName || "";
        const phone = customer?.phone || "";
        const ui = backendAddresses.map((a: any) => ({
          id: a._id || a.id || '',
          name: fullName,
          phone: phone,
          address: a.street || '',
          city: a.city || '',
          state: a.state || '',
          pincode: a.zipCode || '',
          isDefault: !!a.isDefault,
        }));
        setApiAddresses(ui);
        const preferred = ui.find(a => a.isDefault) || ui[0] || null;
        setSelectedAddress(preferred);
      } catch (e) {
        console.error('Failed to load addresses', e);
      } finally {
        setIsLoadingAddresses(false);
      }
    };
    fetchAddresses();
    // Re-run when customer changes (e.g., after login/address update elsewhere)
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [customer]);

  const userOrders = [{ id: "order1" }, { id: "order2" }];
  const userWishlist = [{ id: "wish1" }, { id: "wish2" }, { id: "wish3" }];
  const userCart = [{ id: "cart1" }];

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault();
    // TODO: call update API with {name: formName, email: formEmail, phone: formPhone}
    alert(
      `Update requested\nName: ${formName}\nEmail: ${formEmail}\nPhone: ${formPhone}`
    );
  };

  return (
    <Container className="py-4" style={{ maxWidth: 600 }}>
      {/* Navigation Buttons */}
      <ButtonGroup className="mb-4 w-100" aria-label="Profile navigation">
        <Link href="/website/orders" passHref legacyBehavior>
          <Button variant="outline-dark" className="flex-fill text-center">
            Orders{" "}
            {/* <span className="badge bg-secondary ms-2">{userOrders.length}</span> */}
          </Button>
        </Link>
        <Link href="/website/wishlist" passHref legacyBehavior>
          <Button variant="outline-dark" className="flex-fill text-center">
            Wishlist{" "}
            {/* <span className="badge bg-secondary ms-2">
              {userWishlist.length}
            </span> */}
          </Button>
        </Link>
        <Link href="/website/cart" passHref legacyBehavior>
          <Button variant="outline-dark" className="flex-fill text-center">
            Cart{" "}
            {/* <span className="badge bg-secondary ms-2">{userCart.length}</span> */}
          </Button>
        </Link>
      </ButtonGroup>

      {/* User Info */}
      <UserInfo
        name={customer?.fullName || ""}
        // email={customer?.email || ""}
        // phone={customer?.phone || ""}
      />

      {/* Manage Account Tabs */}
      <div className="mt-5">
        <h4 className="mb-3">Manage Account</h4>

        <Tab.Container defaultActiveKey="details">
          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link
                eventKey="details"
                className="d-flex align-items-center gap-2 text-dark"
              >
                <FiUser className="text-dark" /> Account Details
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="addresses"
                className="d-flex align-items-center gap-2 text-dark"
              >
                <FiHome className="text-dark" /> Addresses
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="details">
              <Form onSubmit={handleUpdate}>
                <Form.Group as={Row} className="mb-3" controlId="formName">
                  <Form.Label column sm={3}>
                    Name
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formEmail">
                  <Form.Label column sm={3}>
                    Email
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      required
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formPhone">
                  <Form.Label column sm={3}>
                    Phone
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      required
                    />
                  </Col>
                </Form.Group>

                <Button type="submit" variant="primary">
                  Update
                </Button>
              </Form>
            </Tab.Pane>

            <Tab.Pane eventKey="addresses">
              <AddressSelection
                addresses={(apiAddresses as any) || []}
                selectedAddress={(selectedAddress as any) || (apiAddresses as any)[0]}
                onSelectAddress={setSelectedAddress as any}
              />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </Container>
  );
};

export default ProfilePage;
