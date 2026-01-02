import React from "react";
import { Card } from "react-bootstrap";
import { FiUser } from "react-icons/fi";

type UserInfoProps = {
  name: string;
};

const UserInfo: React.FC<UserInfoProps> = ({ name }) => {
  return (
    <Card className="mb-4 shadow border-dark" style={{ maxWidth: 400 }}>
      <Card.Body className="d-flex align-items-center gap-3">
        <FiUser size={36} className="text-dark" />
        <div>
          <h5 className="mb-0 text-dark">{name || "User"}</h5>
          <small className="text-muted">Welcome back!</small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserInfo;
