import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white mt-auto">
      <Container className="py-4">
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="mb-3">SVIT Internship & CRT Portal</h5>
            <p className="mb-3">
              Empowering BTech students with real-world experience and 
              placement preparation to excel in their careers.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white" aria-label="Facebook">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="#" className="text-white" aria-label="Twitter">
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a href="#" className="text-white" aria-label="Instagram">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="#" className="text-white" aria-label="LinkedIn">
                <i className="bi bi-linkedin fs-5"></i>
              </a>
            </div>
          </Col>
          
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white text-decoration-none">
                  <i className="bi bi-chevron-right me-1"></i> Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/internships" className="text-white text-decoration-none">
                  <i className="bi bi-chevron-right me-1"></i> Internships
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/students" className="text-white text-decoration-none">
                  <i className="bi bi-chevron-right me-1"></i> Students
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/crt-sessions" className="text-white text-decoration-none">
                  <i className="bi bi-chevron-right me-1"></i> CRT Sessions
                </Link>
              </li>
            </ul>
          </Col>
          
          <Col md={4}>
            <h5 className="mb-3">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2"></i> SVIT Campus, South India
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone me-2"></i> +91 1234567890
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope me-2"></i> info@svit.edu.in
              </li>
              <li className="mb-2">
                <i className="bi bi-clock me-2"></i> Mon - Fri: 9:00 AM - 5:00 PM
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-4" />
        
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <div>
              &copy; {currentYear} SVIT Internship & CRT Portal. All Rights Reserved.
            </div>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <div>
              Designed for BTech Students
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;