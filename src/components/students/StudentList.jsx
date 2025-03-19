import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Badge, Modal, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DataContext } from '../../contexts/DataContext';
import { AuthContext } from '../../contexts/AuthContext';

const StudentList = () => {
  const { students, internships, addStudent, deleteStudent } = useContext(DataContext);
  const { isAuthenticated, isAdmin, isFaculty } = useContext(AuthContext);
  
  // State for filtering and sorting
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [internshipFilter, setInternshipFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // State for add student modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    registerNumber: '',
    branch: 'Computer Science',
    year: 3,
    email: '',
    phone: ''
  });
  
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  
  // Effect for filtering and sorting students
  useEffect(() => {
    let result = [...students];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        student => 
          student.name.toLowerCase().includes(term) || 
          student.registerNumber.toLowerCase().includes(term) ||
          student.email.toLowerCase().includes(term)
      );
    }
    
    // Filter by branch
    if (branchFilter) {
      result = result.filter(student => student.branch === branchFilter);
    }
    
    // Filter by year
    if (yearFilter) {
      result = result.filter(student => student.year === parseInt(yearFilter));
    }
    
    // Filter by internship
    if (internshipFilter === 'assigned') {
      result = result.filter(student => student.internshipId !== null);
    } else if (internshipFilter === 'unassigned') {
      result = result.filter(student => student.internshipId === null);
    } else if (internshipFilter && internshipFilter !== 'all') {
      result = result.filter(student => student.internshipId === parseInt(internshipFilter));
    }
    
    // Sort by selected field
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'registerNumber':
          comparison = a.registerNumber.localeCompare(b.registerNumber);
          break;
        case 'branch':
          comparison = a.branch.localeCompare(b.branch);
          break;
        case 'year':
          comparison = a.year - b.year;
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredStudents(result);
  }, [students, searchTerm, branchFilter, yearFilter, internshipFilter, sortBy, sortOrder]);
  
  // Get unique branches for filter
  const branches = [...new Set(students.map(student => student.branch))];
  
  // Get unique years for filter
  const years = [...new Set(students.map(student => student.year))].sort();
  
  // Handle adding a new student
  const handleAddStudent = () => {
    if (
      !newStudent.name.trim() || 
      !newStudent.registerNumber.trim() || 
      !newStudent.email.trim() || 
      !newStudent.phone.trim()
    ) {
      return; // Form validation would handle this
    }
    
    addStudent(newStudent);
    setShowAddModal(false);
    setNewStudent({
      name: '',
      registerNumber: '',
      branch: 'Computer Science',
      year: 3,
      email: '',
      phone: ''
    });
  };
  
  // Handle student deletion
  const handleDeleteStudent = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      setShowDeleteModal(false);
      setStudentToDelete(null);
    }
  };
  
  // Function to confirm deletion
  const confirmDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };
  
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Student Directory</h2>
        {(isAdmin || isFaculty) && (
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <i className="bi bi-plus-circle me-2"></i> Add New Student
          </Button>
        )}
      </div>
      
      {/* Filter and Search Controls */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col lg={4} md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            
            <Col lg={2} md={6}>
              <Form.Select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
              >
                <option value="">All Branches</option>
                {branches.map((branch, index) => (
                  <option key={index} value={branch}>{branch}</option>
                ))}
              </Form.Select>
            </Col>
            
            <Col lg={2} md={6}>
              <Form.Select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="">All Years</option>
                {years.map((year, index) => (
                  <option key={index} value={year}>Year {year}</option>
                ))}
              </Form.Select>
            </Col>
            
            <Col lg={2} md={6}>
              <Form.Select
                value={internshipFilter}
                onChange={(e) => setInternshipFilter(e.target.value)}
              >
                <option value="all">All Internships</option>
                <option value="assigned">Assigned Students</option>
                <option value="unassigned">Unassigned Students</option>
                <option disabled>──────────</option>
                {internships.map(internship => (
                  <option key={internship.id} value={internship.id}>{internship.title}</option>
                ))}
              </Form.Select>
            </Col>
            
            <Col lg={2} md={6}>
              <InputGroup>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="registerNumber">Register No.</option>
                  <option value="branch">Branch</option>
                  <option value="year">Year</option>
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
      
      {/* Students Table */}
      <Card className="border-0 shadow-sm">
        <div className="table-responsive">
          <Table hover striped className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Register Number</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Email</th>
                <th>Internship</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => {
                  const studentInternship = student.internshipId 
                    ? internships.find(i => i.id === student.internshipId) 
                    : null;
                  
                  return (
                    <tr key={student.id}>
                      <td>
                        <Link to={`/students/${student.id}`} className="text-decoration-none">
                          {student.name}
                        </Link>
                      </td>
                      <td>{student.registerNumber}</td>
                      <td>{student.branch}</td>
                      <td>{student.year}</td>
                      <td>
                        <a href={`mailto:${student.email}`} className="text-decoration-none">
                          {student.email}
                        </a>
                      </td>
                      <td>
                        {studentInternship ? (
                          <Link to={`/internships/${studentInternship.id}`} className="text-decoration-none">
                            <Badge bg="primary" className="p-2">
                              {studentInternship.title}
                            </Badge>
                          </Link>
                        ) : (
                          <Badge bg="secondary" className="p-2">Not Assigned</Badge>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            as={Link}
                            to={`/students/progress?student=${student.id}`}
                            variant="outline-primary"
                            size="sm"
                            title="View Progress"
                          >
                            <i className="bi bi-journal-text"></i>
                          </Button>
                          {(isAdmin || isFaculty) && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => confirmDelete(student)}
                              title="Delete Student"
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="py-5">
                      <i className="bi bi-search display-1 text-muted"></i>
                      <h4 className="mt-3">No students found</h4>
                      <p>Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <Card.Footer className="bg-white">
          <small className="text-muted">
            Showing {filteredStudents.length} of {students.length} students
          </small>
        </Card.Footer>
      </Card>
      
      {/* Add Student Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Register Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={newStudent.registerNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, registerNumber: e.target.value })}
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
                    value={newStudent.branch}
                    onChange={(e) => setNewStudent({ ...newStudent, branch: e.target.value })}
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
                    value={newStudent.year}
                    onChange={(e) => setNewStudent({ ...newStudent, year: parseInt(e.target.value) })}
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
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddStudent}>
            Add Student
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {studentToDelete && (
            <>
              <p>Are you sure you want to delete the student "{studentToDelete.name}"?</p>
              <Alert variant="warning">
                <i className="bi bi-exclamation-triangle me-2"></i>
                This action cannot be undone. All progress data will be permanently deleted.
              </Alert>
            </>
          )}
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
    </Container>
  );
};

export default StudentList;