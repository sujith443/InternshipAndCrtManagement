import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DataContext } from '../contexts/DataContext';
import { AuthContext } from '../contexts/AuthContext';

const Home = () => {
  const { internships, students, crtSessions } = useContext(DataContext);
  const { isAuthenticated, currentUser, isStudent, isAdmin, isFaculty } = useContext(AuthContext);
  const [activeInternships, setActiveInternships] = useState([]);
  const [upcomingCRTSessions, setUpcomingCRTSessions] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  
  useEffect(() => {
    // Filter active internships
    setActiveInternships(internships.filter(i => i.status === 'Active').slice(0, 3));
    
    // Filter upcoming CRT sessions (today or future)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    setUpcomingCRTSessions(
      crtSessions
        .filter(session => {
          const sessionDate = new Date(session.date);
          sessionDate.setHours(0, 0, 0, 0);
          return sessionDate >= today;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3)
    );
    
    // Get student count
    setStudentCount(students.length);
  }, [internships, crtSessions, students]);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={7}>
              <h1 className="display-4 fw-bold">SVIT Internship & CRT Portal</h1>
              <p className="lead">
                Empowering BTech students with real-world experience and placement preparation
              </p>
              {!isAuthenticated && (
                <Button as={Link} to="/login" variant="light" size="lg" className="mt-3">
                  Log In to Get Started
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      {/* Welcome Message for Logged In Users */}
      {isAuthenticated && (
        <Container className="mt-4">
          <Alert variant="success">
            <h4>Welcome back, {currentUser.name}!</h4>
            <p>
              {isAdmin && "You have administrator access to manage all aspects of the portal."}
              {isFaculty && "You can manage internships, track student progress, and organize CRT sessions."}
              {isStudent && "You can view available internships, track your progress, and register for CRT sessions."}
            </p>
          </Alert>
        </Container>
      )}

      {/* Dashboard Stats */}
      <Container className="py-5">
        <Row className="mb-4">
          <Col md={4} className="mb-3 mb-md-0">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="display-4 text-primary mb-3">
                  <i className="bi bi-briefcase"></i>
                </div>
                <h3 className="counter">{internships.length}</h3>
                <p className="text-muted">Active Internships</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="display-4 text-success mb-3">
                  <i className="bi bi-people"></i>
                </div>
                <h3 className="counter">{studentCount}</h3>
                <p className="text-muted">Enrolled Students</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="display-4 text-info mb-3">
                  <i className="bi bi-calendar-event"></i>
                </div>
                <h3 className="counter">{crtSessions.length}</h3>
                <p className="text-muted">CRT Sessions</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Featured Internships */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="section-title mb-4">Featured Internships</h2>
          <Row>
            {activeInternships.length > 0 ? (
              activeInternships.map(internship => (
                <Col md={4} key={internship.id} className="mb-4">
                  <Card className="h-100 border-0 shadow-sm hover-card">
                    <Card.Body>
                      <h4 className="card-title">{internship.title}</h4>
                      <p className="text-muted">
                        <i className="bi bi-calendar me-2"></i>
                        {internship.duration} ({internship.startDate} to {internship.endDate})
                      </p>
                      <p className="card-text">{internship.description.substring(0, 100)}...</p>
                      <div className="d-flex flex-wrap mb-3">
                        {internship.skills.map((skill, index) => (
                          <span key={index} className="badge bg-primary me-1 mb-1">{skill}</span>
                        ))}
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-white border-0">
                      <Button 
                        as={Link} 
                        to={`/internships/${internship.id}`} 
                        variant="outline-primary" 
                        className="w-100"
                      >
                        View Details
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <Alert variant="info">No active internships available at the moment.</Alert>
              </Col>
            )}
          </Row>
          <div className="text-center mt-4">
            <Button as={Link} to="/internships" variant="primary">
              View All Internships
            </Button>
          </div>
        </Container>
      </div>

      {/* Upcoming CRT Sessions */}
      <Container className="py-5">
        <h2 className="section-title mb-4">Upcoming CRT Sessions</h2>
        <Row>
          {upcomingCRTSessions.length > 0 ? (
            upcomingCRTSessions.map(session => (
              <Col md={4} key={session.id} className="mb-4">
                <Card className="h-100 border-0 shadow-sm hover-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="card-title mb-0">{session.title}</h4>
                      <span className="badge bg-info">{new Date(session.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-muted">
                      <i className="bi bi-clock me-2"></i>{session.time}
                    </p>
                    <p className="text-muted">
                      <i className="bi bi-geo-alt me-2"></i>{session.venue}
                    </p>
                    <p className="card-text">{session.description.substring(0, 100)}...</p>
                  </Card.Body>
                  <Card.Footer className="bg-white border-0">
                    <Button 
                      as={Link} 
                      to={`/crt-sessions/${session.id}`} 
                      variant="outline-info" 
                      className="w-100"
                    >
                      View Details
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <Alert variant="info">No upcoming CRT sessions at the moment.</Alert>
            </Col>
          )}
        </Row>
        <div className="text-center mt-4">
          <Button as={Link} to="/crt-sessions" variant="info">
            View All CRT Sessions
          </Button>
        </div>
      </Container>

      {/* Call to Action */}
      <div className="bg-primary text-white py-5">
        <Container className="text-center">
          <h2 className="mb-4">Ready to Enhance Your Career Prospects?</h2>
          <p className="lead mb-4">
            Join our internship program and CRT sessions to gain valuable industry experience and placement preparation.
          </p>
          {!isAuthenticated ? (
            <Button as={Link} to="/login" variant="light" size="lg">
              Get Started
            </Button>
          ) : (
            <Button as={Link} to={isStudent ? "/internships" : "/dashboard"} variant="light" size="lg">
              {isStudent ? "Browse Opportunities" : "Go to Dashboard"}
            </Button>
          )}
        </Container>
      </div>
    </div>
  );
};

export default Home;