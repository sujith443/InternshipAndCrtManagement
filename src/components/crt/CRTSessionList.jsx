import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DataContext } from '../../contexts/DataContext';
import { AuthContext } from '../../contexts/AuthContext';

const CRTSessionList = () => {
  const { crtSessions, students, registerStudentForCRTSession, unregisterStudentFromCRTSession } = useContext(DataContext);
  const { isAuthenticated, isAdmin, isFaculty, currentUser } = useContext(AuthContext);
  
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Get current student ID if user is a student
  const currentStudentId = currentUser?.role === 'student' ? currentUser.studentId : null;
  
  // Effect for filtering and sorting sessions
  useEffect(() => {
    let result = [...crtSessions];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        session => 
          session.title.toLowerCase().includes(term) || 
          session.description.toLowerCase().includes(term) ||
          session.speaker.toLowerCase().includes(term) ||
          session.venue.toLowerCase().includes(term)
      );
    }
    
    // Filter by type
    if (filterType === 'registered' && currentStudentId) {
      result = result.filter(session => session.registeredStudents.includes(currentStudentId));
    } else if (filterType === 'upcoming') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      result = result.filter(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate >= today;
      });
    } else if (filterType === 'past') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      result = result.filter(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate < today;
      });
    }
    
    // Sort by selected field
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'speaker':
          comparison = a.speaker.localeCompare(b.speaker);
          break;
        case 'venue':
          comparison = a.venue.localeCompare(b.venue);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredSessions(result);
  }, [crtSessions, searchTerm, filterType, sortBy, sortOrder, currentStudentId]);
  
  // Handle student registration for a session
  const handleRegisterForSession = (sessionId) => {
    if (!currentStudentId) return;
    registerStudentForCRTSession(currentStudentId, sessionId);
  };
  
  // Handle student unregistration from a session
  const handleUnregisterFromSession = (sessionId) => {
    if (!currentStudentId) return;
    unregisterStudentFromCRTSession(currentStudentId, sessionId);
  };
  
  // Function to check if a session is upcoming
  const isUpcomingSession = (sessionDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dateToCheck = new Date(sessionDate);
    dateToCheck.setHours(0, 0, 0, 0);
    
    return dateToCheck >= today;
  };
  
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">CRT Sessions</h2>
        {(isAdmin || isFaculty) && (
          <Button as={Link} to="/crt-sessions/create" variant="primary">
            <i className="bi bi-plus-circle me-2"></i> Create New Session
          </Button>
        )}
      </div>
      
      {/* Filter and Search Controls */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={5} className="mb-3 mb-md-0">
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3} className="mb-3 mb-md-0">
              <Form.Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Sessions</option>
                <option value="upcoming">Upcoming Sessions</option>
                <option value="past">Past Sessions</option>
                {currentStudentId && (
                  <option value="registered">My Registered Sessions</option>
                )}
              </Form.Select>
            </Col>
            <Col md={4}>
              <InputGroup>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="title">Title</option>
                  <option value="speaker">Speaker</option>
                  <option value="venue">Venue</option>
                </Form.Select>
                <Button 
                  variant="outline-secondary"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  <i className={`bi bi-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* CRT Sessions Grid */}
      <Row>
        {filteredSessions.length > 0 ? (
          filteredSessions.map(session => {
            const isUpcoming = isUpcomingSession(session.date);
            const isRegistered = currentStudentId && session.registeredStudents.includes(currentStudentId);
            const registeredCount = session.registeredStudents.length;
            
            return (
              <Col lg={4} md={6} className="mb-4" key={session.id}>
                <Card className="h-100 border-0 shadow-sm hover-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-3">
                      <h4 className="card-title">{session.title}</h4>
                      <Badge bg={isUpcoming ? 'success' : 'secondary'}>
                        {isUpcoming ? 'Upcoming' : 'Past'}
                      </Badge>
                    </div>
                    
                    <p className="card-text">{session.description.substring(0, 120)}...</p>
                    
                    <div className="mb-3">
                      <strong><i className="bi bi-calendar me-2"></i>Date:</strong> {new Date(session.date).toLocaleDateString()}
                    </div>
                    
                    <div className="mb-3">
                      <strong><i className="bi bi-clock me-2"></i>Time:</strong> {session.time}
                    </div>
                    
                    <div className="mb-3">
                      <strong><i className="bi bi-geo-alt me-2"></i>Venue:</strong> {session.venue}
                    </div>
                    
                    <div className="mb-3">
                      <strong><i className="bi bi-person me-2"></i>Speaker:</strong> {session.speaker}
                    </div>
                    
                    <div className="mb-3">
                      <strong><i className="bi bi-people me-2"></i>Registrations:</strong> {registeredCount}
                    </div>
                    
                    {isRegistered && (
                      <div className="mb-3">
                        <Badge bg="info" className="p-2">
                          <i className="bi bi-check-circle me-2"></i>You are registered
                        </Badge>
                      </div>
                    )}
                  </Card.Body>
                  <Card.Footer className="bg-white border-0">
                    <div className="d-grid gap-2">
                      <Button 
                        as={Link} 
                        to={`/crt-sessions/${session.id}`} 
                        variant="outline-primary" 
                      >
                        View Details
                      </Button>
                      
                      {isAuthenticated && currentUser?.role === 'student' && isUpcoming && (
                        isRegistered ? (
                          <Button 
                            variant="outline-danger" 
                            onClick={() => handleUnregisterFromSession(session.id)}
                          >
                            <i className="bi bi-x-circle me-2"></i>
                            Cancel Registration
                          </Button>
                        ) : (
                          <Button 
                            variant="outline-success" 
                            onClick={() => handleRegisterForSession(session.id)}
                          >
                            <i className="bi bi-check-circle me-2"></i>
                            Register Now
                          </Button>
                        )
                      )}
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            );
          })
        ) : (
          <Col>
            <div className="text-center py-5">
              <i className="bi bi-calendar-x display-1 text-muted"></i>
              <h3 className="mt-3">No sessions found</h3>
              <p className="text-muted">Try adjusting your search or filter criteria</p>
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default CRTSessionList;