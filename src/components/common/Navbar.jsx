import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { AuthContext } from '../../contexts/AuthContext';

const AppNavbar = () => {
  const { currentUser, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar 
      bg="primary" 
      variant="dark" 
      expand="lg" 
      fixed="top" 
      className="navbar-custom" 
      expanded={expanded}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="/assets/images/svit-logo.png"
            width="40"
            height="40"
            className="d-inline-block align-top me-2"
            alt="SVIT Logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/40?text=SVIT';
            }}
          />
          <span className="fw-bold">SVIT Internship & CRT Portal</span>
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="responsive-navbar-nav" 
          onClick={() => setExpanded(expanded ? false : true)} 
        />
        
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/internships" onClick={() => setExpanded(false)}>
              Internships
            </Nav.Link>
            <Nav.Link as={Link} to="/students" onClick={() => setExpanded(false)}>
              Students
            </Nav.Link>
            <Nav.Link as={Link} to="/crt-sessions" onClick={() => setExpanded(false)}>
              CRT Sessions
            </Nav.Link>
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light" id="dropdown-user">
                  Welcome, {currentUser.name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile" onClick={() => setExpanded(false)}>
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => { handleLogout(); setExpanded(false); }}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button 
                variant="outline-light" 
                as={Link} 
                to="/login"
                onClick={() => setExpanded(false)}
              >
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;