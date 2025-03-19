import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Alert, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DataContext } from '../../contexts/DataContext';
import { AuthContext } from '../../contexts/AuthContext';

const CRTSessionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const sessionId = parseInt(id);
  
  const { 
    crtSessions, 
    students, 
    getStudentsForCRTSession, 
    updateCRTSession,
    deleteCRTSession,
    registerStudentForCRTSession,
    unregisterStudentFromCRTSession
  } = useContext(DataContext);
  
  const { isAuthenticated, isAdmin, isFaculty, isStudent, currentUser } = useContext(AuthContext);
  
  const [session, setSession] = useState(null);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  
  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    speaker: '',
    eligibility: ''
  });
  
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Effect to load session data
  useEffect(() => {
    const selectedSession = crtSessions.find(s => s.id === sessionId);
    
    if (!selectedSession) {
      navigate('/crt-sessions');
      return;
    }
    
    setSession(selectedSession);
    setEditForm({
      title: selectedSession.title,
      description: selectedSession.description,
      date: selectedSession.date,
      time: selectedSession.time,
      venue: selectedSession.venue,
      speaker: selectedSession.speaker,
      eligibility: selectedSession.eligibility
    });
    
    // Get registered students
    setRegisteredStudents(getStudentsForCRTSession(sessionId));
  }, [crtSessions, students, sessionId, navigate, getStudentsForCRTSession]);
  
  // Handle edit form submission
  const handleUpdateSession = () => {
    const updatedSession = {
      ...session,
      ...editForm
    };
    
    updateCRTSession(updatedSession);
    setSession(updatedSession);
    setShowEditModal(false);
  };
  
  // Handle session deletion
  const handleDeleteSession = () => {
    deleteCRTSession(sessionId);
    navigate('/crt-sessions');
  };
  
  // Check if the current student is registered
  const isCurrentStudentRegistered = () => {
    if (!isAuthenticated || !isStudent || !currentUser?.studentId) return false;
    
    return session?.registeredStudents.includes(currentUser.studentId);
  };
  
  // Handle student registration for the session
  const handleRegisterForSession = () => {
    if (!isAuthenticated || !isStudent || !currentUser?.studentId) return;
    
    registerStudentForCRTSession(currentUser.studentId, sessionId);
    
    // Update the UI
    setSession(prevSession => ({
      ...prevSession,
      registeredStudents: [...prevSession.registeredStudents, currentUser.studentId]
    }));
    
    // Add student to registered students list
    const currentStudentData = students.find(s => s.id === currentUser.studentId);
    setRegisteredStudents(prev => [...prev, currentStudentData]);
  };
  
  // Handle student unregistration from the session
  const handleUnregisterFromSession = () => {
    if (!isAuthenticated || !isStudent || !currentUser?.studentId) return;
    
    unregisterStudentFromCRTSession(currentUser.studentId, sessionId);
    
    // Update the UI
    setSession(prevSession => ({
      ...prevSession,
      registeredStudents: prevSession.registeredStudents.filter(id => id !== currentUser.studentId)
    }));
    
    // Remove student from registered students list
    setRegisteredStudents(prev => prev.filter(s => s.id !== currentUser.studentId));
  };
  
  // Check if the session date is in the future
  const isUpcomingSession = () => {
    if (!session) return false;
    
    const sessionDate = new Date(session.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return sessionDate >= today;
  };
  
  if (!session) {
    return (
      <Container className="py-4">
        <Alert variant="info">Loading session details...</Alert>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <Row>
        <Col lg={8}>
          {/* Session Details Card */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">{session.title}</h4>
              <Badge 
                bg={isUpcomingSession() ? 'success' : 'secondary'}
                className="p-2"
              >
                {isUpcomingSession() ? 'Upcoming' : 'Completed'}
              </Badge>
            </Card.Header>
            <Card.Body>
              <p className="lead mb-4">{session.description}</p>
              
              <Row className="mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                  <h6><i className="bi bi-calendar me-2"></i>Date</h6>
                  <p>{new Date(session.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </Col>
                <Col md={6}>
                  <h6><i className="bi bi-clock me-2"></i>Time</h6>
                  <p>{session.time}</p>
                </Col>
              </Row>
              
              <Row className="mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                  <h6><i className="bi bi-geo-alt me-2"></i>Venue</h6>
                  <p>{session.venue}</p>
                </Col>
                <Col md={6}>
                  <h6><i className="bi bi-person me-2"></i>Speaker</h6>
                  <p>{session.speaker}</p>
                </Col>
              </Row>
              
              <h6><i className="bi bi-people me-2"></i>Eligibility</h6>
              <p className="mb-4">{session.eligibility}</p>
              
              {/* Action buttons */}
              <div className="d-flex gap-2">
                {isAuthenticated && isStudent && isUpcomingSession() && (
                  isCurrentStudentRegistered() ? (
                    <Button 
                      variant="outline-danger" 
                      onClick={handleUnregisterFromSession}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancel Registration
                    </Button>
                  ) : (
                    <Button 
                      variant="outline-success" 
                      onClick={handleRegisterForSession}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Register Now
                    </Button>
                  )
                )}
                
                {(isAdmin || isFaculty) && (
                  <>
                    <Button 
                      variant="outline-primary" 
                      onClick={() => setShowEditModal(true)}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Edit Session
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
          
          {/* Registered Students Card */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Registered Students ({registeredStudents.length})</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {registeredStudents.length > 0 ? (
                <Table hover responsive className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Register Number</th>
                      <th>Branch</th>
                      <th>Year</th>
                      {(isAdmin || isFaculty) && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {registeredStudents.map((student, index) => (
                      <tr key={student.id}>
                        <td>{index + 1}</td>
                        <td>
                          <Link to={`/students/${student.id}`} className="text-decoration-none">
                            {student.name}
                          </Link>
                        </td>
                        <td>{student.registerNumber}</td>
                        <td>{student.branch}</td>
                        <td>{student.year}</td>
                        {(isAdmin || isFaculty) && (
                          <td>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => {
                                unregisterStudentFromCRTSession(student.id, sessionId);
                                setRegisteredStudents(prev => prev.filter(s => s.id !== student.id));
                              }}
                            >
                              <i className="bi bi-person-x"></i>
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No students registered yet.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          {/* Session Info Card */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Session Info</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6 className="text-muted mb-1">Status</h6>
                <div>
                  <Badge 
                    bg={isUpcomingSession() ? 'success' : 'secondary'}
                    className="p-2"
                  >
                    {isUpcomingSession() ? 'Upcoming' : 'Completed'}
                  </Badge>
                </div>
              </div>
              
              <div className="mb-3">
                <h6 className="text-muted mb-1">Date</h6>
                <p className="mb-0">{new Date(session.date).toLocaleDateString()}</p>
              </div>
              
              <div className="mb-3">
                <h6 className="text-muted mb-1">Time</h6>
                <p className="mb-0">{session.time}</p>
              </div>
              
              <div className="mb-3">
                <h6 className="text-muted mb-1">Venue</h6>
                <p className="mb-0">{session.venue}</p>
              </div>
              
              <div className="mb-3">
                <h6 className="text-muted mb-1">Speaker</h6>
                <p className="mb-0">{session.speaker}</p>
              </div>
              
              <div>
                <h6 className="text-muted mb-1">Registrations</h6>
                <p className="mb-0">{registeredStudents.length} students</p>
              </div>
            </Card.Body>
          </Card>
          
          {/* Registration Status Card (for students) */}
          {isAuthenticated && isStudent && (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Your Registration</h5>
              </Card.Header>
              <Card.Body className="text-center">
                {isCurrentStudentRegistered() ? (
                  <>
                    <div className="mb-3">
                      <span className="display-1 text-success">
                        <i className="bi bi-check-circle"></i>
                      </span>
                    </div>
                    <h5 className="mb-3">You are registered!</h5>
                    <p className="text-muted">
                      You have successfully registered for this CRT session.
                    </p>
                    {isUpcomingSession() && (
                      <Button 
                        variant="outline-danger" 
                        onClick={handleUnregisterFromSession}
                        className="mt-2"
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Cancel Registration
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <span className="display-1 text-secondary">
                        <i className="bi bi-dash-circle"></i>
                      </span>
                    </div>
                    <h5 className="mb-3">Not Registered</h5>
                    <p className="text-muted">
                      You have not registered for this CRT session yet.
                    </p>
                    {isUpcomingSession() && (
                      <Button 
                        variant="outline-success" 
                        onClick={handleRegisterForSession}
                        className="mt-2"
                      >
                        <i className="bi bi-check-circle me-2"></i>
                        Register Now
                      </Button>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          )}
          
          {/* Quick Actions Card */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button 
                  as={Link} 
                  to="/crt-sessions" 
                  variant="outline-secondary"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to CRT Sessions
                </Button>
                
                {isAuthenticated && isStudent && isUpcomingSession() && (
                  isCurrentStudentRegistered() ? (
                    <Button 
                      variant="outline-danger" 
                      onClick={handleUnregisterFromSession}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancel Registration
                    </Button>
                  ) : (
                    <Button 
                      variant="outline-success" 
                      onClick={handleRegisterForSession}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Register Now
                    </Button>
                  )
                )}
                
                {(isAdmin || isFaculty) && (
                  <>
                    <Button 
                      variant="outline-primary" 
                      onClick={() => setShowEditModal(true)}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Edit Session
                    </Button>
                    
                    <Button 
                      as={Link}
                      to={`/crt-sessions/create`}
                      variant="outline-info"
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Create New Session
                    </Button>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Edit Session Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit CRT Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.time}
                    onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Venue</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.venue}
                    onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Speaker</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.speaker}
                    onChange={(e) => setEditForm({ ...editForm, speaker: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Eligibility</Form.Label>
              <Form.Control
                type="text"
                value={editForm.eligibility}
                onChange={(e) => setEditForm({ ...editForm, eligibility: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateSession}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the CRT session "{session.title}"?</p>
          <Alert variant="warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            This action cannot be undone. All registration data will be permanently deleted.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteSession}>
            Delete Session
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CRTSessionDetails;