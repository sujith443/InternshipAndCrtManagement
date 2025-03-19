import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Alert, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DataContext } from '../../contexts/DataContext';
import { AuthContext } from '../../contexts/AuthContext';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const studentId = parseInt(id);
  
  const { 
    students, 
    internships, 
    updateStudent,
    deleteStudent, 
    assignStudentToInternship 
  } = useContext(DataContext);
  
  const { isAuthenticated, isAdmin, isFaculty, currentUser } = useContext(AuthContext);
  
  const [student, setStudent] = useState(null);
  const [studentInternship, setStudentInternship] = useState(null);
  
  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    registerNumber: '',
    branch: '',
    year: 1,
    email: '',
    phone: ''
  });
  
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // State for internship assignment modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedInternshipId, setSelectedInternshipId] = useState('');
  
  // Effect to load student data
  useEffect(() => {
    const selectedStudent = students.find(s => s.id === studentId);
    
    if (!selectedStudent) {
      navigate('/students');
      return;
    }
    
    setStudent(selectedStudent);
    setEditForm({
      name: selectedStudent.name,
      registerNumber: selectedStudent.registerNumber,
      branch: selectedStudent.branch,
      year: selectedStudent.year,
      email: selectedStudent.email,
      phone: selectedStudent.phone
    });
    
    // Get student's internship if assigned
    if (selectedStudent.internshipId) {
      setStudentInternship(
        internships.find(i => i.id === selectedStudent.internshipId)
      );
    } else {
      setStudentInternship(null);
    }
  }, [students, internships, studentId, navigate]);
  
  // Handle edit form submission
  const handleUpdateStudent = () => {
    const updatedStudent = {
      ...student,
      ...editForm
    };
    
    updateStudent(updatedStudent);
    setStudent(updatedStudent);
    setShowEditModal(false);
  };
  
  // Handle student deletion
  const handleDeleteStudent = () => {
    deleteStudent(studentId);
    navigate('/students');
  };
  
  // Handle internship assignment
  const handleAssignInternship = () => {
    if (selectedInternshipId) {
      assignStudentToInternship(
        studentId, 
        selectedInternshipId === 'unassign' ? null : parseInt(selectedInternshipId)
      );
      
      setShowAssignModal(false);
      
      // Update local state
      if (selectedInternshipId === 'unassign') {
        setStudentInternship(null);
      } else {
        const internship = internships.find(i => i.id === parseInt(selectedInternshipId));
        setStudentInternship(internship);
      }
      
      // Reset selected internship
      setSelectedInternshipId('');
    }
  };
  
  // Get list of available internships (not full)
  const availableInternships = internships.filter(internship => {
    if (internship.status !== 'Active') return false;
    
    // Count assigned students
    const assignedCount = students.filter(s => s.internshipId === internship.id).length;
    
    // Include current internship or ones with spots available
    return (
      internship.id === student?.internshipId || 
      assignedCount < internship.maxStudents
    );
  });
  
  if (!student) {
    return (
      <Container className="py-4">
        <Alert variant="info">Loading student details...</Alert>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <Row>
        <Col lg={8}>
          {/* Student Details Card */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">{student.name}</h4>
              <Badge bg="info" className="p-2">Year {student.year}</Badge>
            </Card.Header>
            <Card.Body>
              <Row className="mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                  <h6><i className="bi bi-person-badge me-2"></i>Register Number</h6>
                  <p>{student.registerNumber}</p>
                </Col>
                <Col md={6}>
                  <h6><i className="bi bi-building me-2"></i>Branch</h6>
                  <p>{student.branch}</p>
                </Col>
              </Row>
              
              <Row className="mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                  <h6><i className="bi bi-envelope me-2"></i>Email</h6>
                  <p>
                    <a href={`mailto:${student.email}`} className="text-decoration-none">
                      {student.email}
                    </a>
                  </p>
                </Col>
                <Col md={6}>
                  <h6><i className="bi bi-telephone me-2"></i>Phone</h6>
                  <p>
                    <a href={`tel:${student.phone}`} className="text-decoration-none">
                      {student.phone}
                    </a>
                  </p>
                </Col>
              </Row>
              
              <h6><i className="bi bi-briefcase me-2"></i>Internship Status</h6>
              {studentInternship ? (
                <div className="bg-light p-3 rounded mb-4">
                  <h5>
                    <Link to={`/internships/${studentInternship.id}`} className="text-decoration-none">
                      {studentInternship.title}
                    </Link>
                  </h5>
                  <p className="mb-2">
                    <strong>Guide:</strong> {studentInternship.guide}
                  </p>
                  <p className="mb-2">
                    <strong>Period:</strong> {studentInternship.startDate} to {studentInternship.endDate}
                  </p>
                  <p className="mb-0">
                    <strong>Status:</strong>{' '}
                    <Badge 
                      bg={
                        studentInternship.status === 'Active' ? 'success' : 
                        studentInternship.status === 'Completed' ? 'secondary' : 
                        'warning'
                      }
                    >
                      {studentInternship.status}
                    </Badge>
                  </p>
                </div>
              ) : (
                <p className="text-muted mb-4">Not assigned to any internship.</p>
              )}
              
              {/* Action buttons */}
              {(isAdmin || isFaculty) && (
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    onClick={() => setShowEditModal(true)}
                  >
                    <i className="bi bi-pencil me-2"></i>
                    Edit Student
                  </Button>
                  <Button 
                    variant="outline-success" 
                    onClick={() => setShowAssignModal(true)}
                  >
                    <i className="bi bi-briefcase me-2"></i>
                    {studentInternship ? 'Change Internship' : 'Assign Internship'}
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Delete
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
          
          {/* Progress Card */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Internship Progress</h5>
              <Button 
                as={Link} 
                to={`/students/progress?student=${student.id}`}
                variant="outline-primary" 
                size="sm"
              >
                View Full Progress
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              {student.progress && student.progress.length > 0 ? (
                <Table hover responsive className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '15%' }}>Date</th>
                      <th style={{ width: '30%' }}>Task</th>
                      <th style={{ width: '15%' }}>Status</th>
                      <th style={{ width: '40%' }}>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...student.progress]
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .slice(0, 5) // Show only the most recent 5 entries
                      .map((entry, index) => (
                        <tr key={index}>
                          <td>{new Date(entry.date).toLocaleDateString()}</td>
                          <td>{entry.task}</td>
                          <td>
                            <Badge 
                              bg={
                                entry.status === 'Completed' ? 'success' : 
                                entry.status === 'In Progress' ? 'primary' : 
                                entry.status === 'On Hold' ? 'warning' : 
                                'danger'
                              }
                            >
                              {entry.status}
                            </Badge>
                          </td>
                          <td>{entry.remarks}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No progress entries recorded yet.</p>
                  <Button 
                    as={Link}
                    to={`/students/progress?student=${student.id}`}
                    variant="outline-primary"
                  >
                    Add Progress Entry
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          {/* Quick Info Card */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Student Info</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3 text-center">
                <div className="rounded-circle bg-primary text-white mx-auto mb-3" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="fs-1">{student.name.charAt(0)}</span>
                </div>
                <h5>{student.name}</h5>
                <p className="text-muted mb-0">{student.registerNumber}</p>
              </div>
              
              <hr />
              
              <div className="mb-3">
                <h6 className="text-muted mb-1">Branch</h6>
                <p className="mb-0">{student.branch}</p>
              </div>
              
              <div className="mb-3">
                <h6 className="text-muted mb-1">Year</h6>
                <p className="mb-0">Year {student.year}</p>
              </div>
              
              <div className="mb-3">
                <h6 className="text-muted mb-1">Internship Status</h6>
                <p className="mb-0">
                  {studentInternship ? (
                    <Badge bg="success" className="p-2">Assigned</Badge>
                  ) : (
                    <Badge bg="secondary" className="p-2">Not Assigned</Badge>
                  )}
                </p>
              </div>
              
              <div>
                <h6 className="text-muted mb-1">Internship Progress</h6>
                <p className="mb-0">
                  {student.progress.length} entries
                </p>
              </div>
            </Card.Body>
          </Card>
          
          {/* Quick Actions Card */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button 
                  as={Link} 
                  to="/students" 
                  variant="outline-secondary"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Students
                </Button>
                
                <Button 
                  as={Link}
                  to={`/students/progress?student=${student.id}`}
                  variant="outline-primary"
                >
                  <i className="bi bi-journal-text me-2"></i>
                  View Progress
                </Button>
                
                {(isAdmin || isFaculty) && (
                  <>
                    <Button 
                      variant="outline-success" 
                      onClick={() => setShowAssignModal(true)}
                    >
                      <i className="bi bi-briefcase me-2"></i>
                      {studentInternship ? 'Change Internship' : 'Assign Internship'}
                    </Button>
                    
                    <Button 
                      variant="outline-primary" 
                      onClick={() => setShowEditModal(true)}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Edit Student
                    </Button>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Edit Student Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Register Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.registerNumber}
                    onChange={(e) => setEditForm({ ...editForm, registerNumber: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Branch</Form.Label>
                  <Form.Select
                    value={editForm.branch}
                    onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Year</Form.Label>
                  <Form.Select
                    value={editForm.year}
                    onChange={(e) => setEditForm({ ...editForm, year: parseInt(e.target.value) })}
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateStudent}>
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
          <p>Are you sure you want to delete {student.name}?</p>
          <Alert variant="warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            This action cannot be undone. All progress data will be permanently deleted.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteStudent}>
            Delete Student
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Assign Internship Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {studentInternship ? 'Change Internship Assignment' : 'Assign to Internship'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Select Internship</Form.Label>
              <Form.Select
                value={selectedInternshipId}
                onChange={(e) => setSelectedInternshipId(e.target.value)}
              >
                <option value="">-- Select an internship --</option>
                {studentInternship && (
                  <option value="unassign">Remove from current internship</option>
                )}
                {availableInternships.map(internship => {
                  const assignedCount = students.filter(s => s.internshipId === internship.id).length;
                  
                  // Skip current internship in the list as it's redundant
                  if (internship.id === student.internshipId) return null;
                  
                  return (
                    <option key={internship.id} value={internship.id}>
                      {internship.title} ({assignedCount}/{internship.maxStudents})
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
            
            {studentInternship && (
              <Alert variant="info" className="mt-3">
                <i className="bi bi-info-circle me-2"></i>
                Currently assigned to: <strong>{studentInternship.title}</strong>
              </Alert>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAssignInternship}
            disabled={!selectedInternshipId}
          >
            {selectedInternshipId === 'unassign' ? 'Remove Assignment' : 'Assign'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StudentDetails;