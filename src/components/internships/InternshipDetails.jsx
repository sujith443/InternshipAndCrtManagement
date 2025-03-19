import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Alert, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DataContext } from '../../contexts/DataContext';
import { AuthContext } from '../../contexts/AuthContext';

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const internshipId = parseInt(id);
  
  const { 
    internships, 
    students, 
    getStudentsForInternship, 
    updateInternship, 
    deleteInternship,
    assignStudentToInternship
  } = useContext(DataContext);
  
  const { isAuthenticated, isAdmin, isFaculty, currentUser } = useContext(AuthContext);
  
  const [internship, setInternship] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  
  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    duration: '',
    startDate: '',
    endDate: '',
    maxStudents: 10,
    guide: '',
    skills: [],
    status: 'Active'
  });
  
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // State for student assignment modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  
  // Effect to load internship data
  useEffect(() => {
    const selectedInternship = internships.find(i => i.id === internshipId);
    
    if (!selectedInternship) {
      navigate('/internships');
      return;
    }
    
    setInternship(selectedInternship);
    setEditForm({
      title: selectedInternship.title,
      description: selectedInternship.description,
      duration: selectedInternship.duration,
      startDate: selectedInternship.startDate,
      endDate: selectedInternship.endDate,
      maxStudents: selectedInternship.maxStudents,
      guide: selectedInternship.guide,
      skills: [...selectedInternship.skills],
      status: selectedInternship.status
    });
    
    // Get enrolled students
    setEnrolledStudents(getStudentsForInternship(internshipId));
    
    // Get available students (not enrolled in any internship)
    setAvailableStudents(
      students.filter(student => !student.internshipId)
    );
  }, [internships, students, internshipId, navigate, getStudentsForInternship]);
  
  // Handle skill input in edit form
  const [skillInput, setSkillInput] = useState('');
  
  const handleAddSkill = () => {
    if (skillInput.trim() !== '' && !editForm.skills.includes(skillInput.trim())) {
      setEditForm({
        ...editForm,
        skills: [...editForm.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };
  
  const handleRemoveSkill = (skillToRemove) => {
    setEditForm({
      ...editForm,
      skills: editForm.skills.filter(skill => skill !== skillToRemove)
    });
  };
  
  // Handle edit form submission
  const handleUpdateInternship = () => {
    const updatedInternship = {
      ...internship,
      ...editForm
    };
    
    updateInternship(updatedInternship);
    setInternship(updatedInternship);
    setShowEditModal(false);
  };
  
  // Handle internship deletion
  const handleDeleteInternship = () => {
    deleteInternship(internshipId);
    navigate('/internships');
  };
  
  // Handle student assignment
  const handleAssignStudent = () => {
    if (selectedStudentId) {
      assignStudentToInternship(parseInt(selectedStudentId), internshipId);
      setShowAssignModal(false);
      
      // Update the enrolled students list
      const newStudent = students.find(s => s.id === parseInt(selectedStudentId));
      setEnrolledStudents([...enrolledStudents, newStudent]);
      
      // Remove from available students
      setAvailableStudents(availableStudents.filter(s => s.id !== parseInt(selectedStudentId)));
      
      // Reset selected student
      setSelectedStudentId('');
    }
  };
  
  if (!internship) {
    return (
      <Container className="py-4">
        <Alert variant="info">Loading internship details...</Alert>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <Row>
        <Col lg={8}>
          {/* Internship Details Card */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">{internship.title}</h4>
              <Badge 
                bg={
                  internship.status === 'Active' ? 'success' : 
                  internship.status === 'Completed' ? 'secondary' : 
                  'warning'
                }
              >
                {internship.status}
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row className="mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                  <h6><i className="bi bi-calendar me-2"></i>Duration</h6>
                  <p>{internship.duration}</p>
                </Col>
                <Col md={6}>
                  <h6><i className="bi bi-calendar-date me-2"></i>Period</h6>
                  <p>{internship.startDate} to {internship.endDate}</p>
                </Col>
              </Row>
              
              <Row className="mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                  <h6><i className="bi bi-person me-2"></i>Guide/Mentor</h6>
                  <p>{internship.guide}</p>
                </Col>
                <Col md={6}>
                  <h6><i className="bi bi-people me-2"></i>Students</h6>
                  <p>{enrolledStudents.length}/{internship.maxStudents}</p>
                </Col>
              </Row>
              
              <h6>Description</h6>
              <p>{internship.description}</p>
              
              <h6>Required Skills</h6>
              <div className="d-flex flex-wrap mb-4">
                {internship.skills.map((skill, index) => (
                  <span key={index} className="badge bg-light text-dark border m-1 p-2">
                    {skill}
                  </span>
                ))}
              </div>
              
              {/* Action buttons */}
              {(isAdmin || isFaculty) && (
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    onClick={() => setShowEditModal(true)}
                  >
                    <i className="bi bi-pencil me-2"></i>
                    Edit Internship
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
          
          {/* Enrolled Students Card */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Enrolled Students</h5>
              {(isAdmin || isFaculty) && internship.status === 'Active' && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowAssignModal(true)}
                  disabled={enrolledStudents.length >= internship.maxStudents || availableStudents.length === 0}
                >
                  <i className="bi bi-person-plus me-2"></i>
                  Assign Student
                </Button>
              )}
            </Card.Header>
            <Card.Body className="p-0">
              {enrolledStudents.length > 0 ? (
                <Table hover responsive className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Register Number</th>
                      <th>Branch</th>
                      <th>Year</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrolledStudents.map((student, index) => (
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
                        <td>
                          <Link 
                            to={`/students/progress?student=${student.id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            View Progress
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No students enrolled yet.</p>
                  {(isAdmin || isFaculty) && internship.status === 'Active' && (
                    <Button 
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setShowAssignModal(true)}
                      disabled={availableStudents.length === 0}
                    >
                      Assign Students
                    </Button>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          {/* Info Card */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Internship Info</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6 className="text-muted mb-1">Status</h6>
                <div>
                  <Badge 
                    bg={
                      internship.status === 'Active' ? 'success' : 
                      internship.status === 'Completed' ? 'secondary' : 
                      'warning'
                    }
                    className="p-2"
                  >
                    {internship.status}
                  </Badge>
                </div>
              </div>
              
              <div className="mb-3">
                <h6 className="text-muted mb-1">Start Date</h6>
                <p className="mb-0">{internship.startDate}</p>
              </div>
              
              <div className="mb-3">
                <h6 className="text-muted mb-1">End Date</h6>
                <p className="mb-0">{internship.endDate}</p>
              </div>
              
              <div className="mb-3">
                <h6 className="text-muted mb-1">Duration</h6>
                <p className="mb-0">{internship.duration}</p>
              </div>
              
              <div className="mb-3">
                <h6 className="text-muted mb-1">Guide/Mentor</h6>
                <p className="mb-0">{internship.guide}</p>
              </div>
              
              <div className="mb-3">
                <h6 className="text-muted mb-1">Maximum Students</h6>
                <p className="mb-0">{internship.maxStudents}</p>
              </div>
              
              <div>
                <h6 className="text-muted mb-1">Current Enrollment</h6>
                <p className="mb-0">
                  {enrolledStudents.length} students
                  {internship.status === 'Active' && ` (${internship.maxStudents - enrolledStudents.length} spots left)`}
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
                  to="/internships" 
                  variant="outline-secondary"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Internships
                </Button>
                
                {(isAdmin || isFaculty) && (
                  <>
                    <Button 
                      variant="outline-primary" 
                      onClick={() => setShowEditModal(true)}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Edit Internship
                    </Button>
                    
                    {internship.status === 'Active' && (
                      <Button
                        variant="outline-success"
                        onClick={() => setShowAssignModal(true)}
                        disabled={enrolledStudents.length >= internship.maxStudents || availableStudents.length === 0}
                      >
                        <i className="bi bi-person-plus me-2"></i>
                        Assign Student
                      </Button>
                    )}
                  </>
                )}
                
                {currentUser?.role === 'student' && 
                 !currentUser?.studentId && 
                 internship.status === 'Active' && 
                 enrolledStudents.length < internship.maxStudents && (
                  <Button variant="outline-success">
                    <i className="bi bi-check-circle me-2"></i>
                    Apply for Internship
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Edit Internship Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Internship</Modal.Title>
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
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.duration}
                    onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={editForm.startDate}
                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Guide/Mentor</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.guide}
                    onChange={(e) => setEditForm({ ...editForm, guide: e.target.value })}
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Maximum Students</Form.Label>
                  <Form.Control
                    type="number"
                    min={enrolledStudents.length}
                    value={editForm.maxStudents}
                    onChange={(e) => setEditForm({ ...editForm, maxStudents: parseInt(e.target.value) })}
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Upcoming">Upcoming</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Required Skills</Form.Label>
              <div className="d-flex mb-2">
                <Form.Control
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill"
                />
                <Button 
                  variant="outline-primary" 
                  className="ms-2" 
                  onClick={handleAddSkill}
                >
                  Add
                </Button>
              </div>
              
              <div className="d-flex flex-wrap">
                {editForm.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="badge bg-light text-dark border m-1 p-2"
                  >
                    {skill}
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 ms-2 text-danger"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      <i className="bi bi-x"></i>
                    </Button>
                  </span>
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateInternship}>
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
          <p>Are you sure you want to delete the internship "{internship.title}"?</p>
          <Alert variant="warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            This action cannot be undone. All students assigned to this internship will be unassigned.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteInternship}>
            Delete Internship
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Assign Student Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Student to Internship</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {availableStudents.length > 0 ? (
            <Form>
              <Form.Group>
                <Form.Label>Select Student</Form.Label>
                <Form.Select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  <option value="">-- Select a student --</option>
                  {availableStudents.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.registerNumber}) - {student.branch}, Year {student.year}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          ) : (
            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              There are no available students to assign to this internship.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAssignStudent}
            disabled={!selectedStudentId || availableStudents.length === 0}
          >
            Assign Student
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default InternshipDetails;