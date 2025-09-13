import React from 'react';
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions
}) => {
  return (
    <div className="page-header bg-white border-bottom mb-4">
      <Container fluid>
        {breadcrumbs && (
          <Row>
            <Col>
              <Breadcrumb className="mb-0 py-2">
                {breadcrumbs.map((item, index) => (
                  <Breadcrumb.Item
                    key={index}
                    href={item.href}
                    active={item.active}
                  >
                    {item.label}
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
            </Col>
          </Row>
        )}
        <Row className="align-items-center py-3">
          <Col>
            <h1 className="h3 mb-0">{title}</h1>
            {subtitle && (
              <p className="text-muted mb-0 mt-1">{subtitle}</p>
            )}
          </Col>
          {actions && (
            <Col xs="auto">
              {actions}
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default PageHeader;