import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container className="py-5 text-center">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="mb-4">
            <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
          </div>
          <h1 className="display-4 mb-3">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="lead mb-4">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Button as={Link} to="/" variant="primary" size="lg">
            <i className="bi bi-house-door me-2"></i> Go Back Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;