import { ReactNode } from "react";
import { Card } from "react-bootstrap";

interface FormCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function FormCard({ title, icon, children, className = "" }: FormCardProps) {
  return (
    <Card className={`mb-4 border-0 shadow-sm ${className}`}>
      <Card.Header className="bg-light border-0">
        <h5 className="mb-0">
          {icon && <span className="me-2">{icon}</span>}
          {title}
        </h5>
      </Card.Header>
      <Card.Body>
        {children}
      </Card.Body>
    </Card>
  );
}