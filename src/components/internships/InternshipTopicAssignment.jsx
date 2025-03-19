import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Alert, Badge } from 'react-bootstrap';
import { DataContext } from '../../contexts/DataContext';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const InternshipTopicAssignment = () => {
  const { internships, students, assignStudentToInternship } = useContext(DataContext);
  const { isAuthenticated, isAdmin, isFaculty } = useContext(AuthContext);
  
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInternshipId, setSelectedInternshipId] = useState('');
  const [studentFilter, setStudentFilter] = useState('unassigned'); // 'all', 'unassigned', 'assigned'
  const [branchFilter, setBranchFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Get active internships for selection
  useEffect(() => {
    setFilteredInternships(
      internships.filter(internship => internship.status === 'Active')
    );
  }, [internships]);
  
  // Filter students based on criteria
  useEffect(() => {
    let result = [...students];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        student => 
          student.name.toLowerCase().includes(term) || 
          student.registerNumber.toLowerCase().includes(term)
      );
    }
    
    // Filter by assignment status
    if (studentFilter === 'unassigned') {
      result = result.filter(student => !student.internshipId);
    } else if (studentFilter === 'assigned') {
      result = result.filter(student => !!student.internshipId);
    }
    
    // Filter by branch
    if (branchFilter) {
      result = result.filter(student => student.branch === branchFilter);
    }
    
    // Filter by year
    if (yearFilter) {
      result = result.filter(student => student.year === parseInt(yearFilter));
    }
    
    setFilteredStudents(result);
  }, [students, searchTerm, studentFilter, branchFilter, yearFilter]);
  
  // Get unique branches for filter
  const branches = [...new Set(students.map(student => student.branch))];
  
  // Get unique years for filter
  const years = [...new Set(students.map(student => student.year))].sort();
  
  // Handle assignment of student to internship
  const handleAssignStudent = (studentId) => {
    if (!selectedInternshipId) {
      setErrorMessage('Please select an internship first');
      setSuccessMessage('');
      return;
    }
    
    const internshipId = parseInt(selectedInternshipId);
    const internship = internships.find(i => i.id === internshipId);
    
    if (!internship) {
      setErrorMessage('Invalid internship selected');
      setSuccessMessage('');
      return;
    }
    
    // Check if internship has reached max students
    const assignedStudentsCount = students.filter(s => s.internshipId === internshipId).length;
    if (assignedStudentsCount >= internship.maxStudents) {
      setErrorMessage(`This internship has reached its maximum capacity of ${internship.maxStudents} students`);
      setSuccessMessage('');
      return;
    }
    
    // Assign student to internship
    assignStudentToInternship(studentId, internshipId);
    
    // Show success message
    const student = students.find(s => s.id === studentId);
    setSuccessMessage(`Successfully assigned ${student.name} to internship: ${internship.title}`);
    setErrorMessage('');
    
    // Update student filter if needed
    if (studentFilter === 'unassigned') {
      // Refresh filtered students after assignment
      setFilteredStudents(
        filteredStudents.filter(student => student.id !== studentId)
      );
    }
  };
  
  // Handle unassignment of student from internship
  const handleUnassignStudent = (studentId) => {
    assignStudentToInternship(studentId, null);
    
    // Show success message
    const student = students.find(s => s.id === studentId);
    setSuccessMessage(`Successfully unassigned ${student.name} from internship`);
    setErrorMessage('');
    
    // Update student filter if needed
    if (studentFilter === 'assigned') {
      // Refresh filtered students after unassignment
      setFilteredStudents(
        filteredStudents.filter(student => student.id !== studentId)
      );
    }
  };
  
  return (
    <Container className="py-4">
      <h2 className="mb-4">Internship Topic Assignment</h2>
      
      {/* Permission check */}
      {!isAuthenticated || (!isAdmin && !isFaculty) ? (
        <Alert variant="warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          You do not have permission to assign students to internships.
        </Alert>
      ) : (
        <>
          {/* Success/Error messages */}
          {successMessage && (
            <Alert 
              variant="success" 
              dismissible
              onClose={() => setSuccessMessage('')}
            >
              <i className="bi bi-check-circle me-2"></i>
              {successMessage}
            </Alert>
          )}
          
          {errorMessage && (
            <Alert 
              variant="danger" 
              dismissible
              onClose={() => setErrorMessage('')}
            >
              <i className="bi bi-exclamation-circle me-2"></i>
              {errorMessage}
            </Alert>
          )}
          
          <Row>
            {/* Left Column - Internship Selection */}
            <Col lg={4} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Select Internship</h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-4">
                    <Form.Label>Active Internships</Form.Label>
                    <Form.Select
                      value={selectedInternshipId}
                      onChange={(e) => setSelectedInternshipId(e.target.value)}
                    >
                      <option value="">-- Select an Internship --</option>
                      {filteredInternships.map(internship => {
                        const assignedCount = students.filter(s => s.internshipId === internship.id).length;
                        const isFull = assignedCount >= internship.maxStudents;
                        
                        return (
                          <option 
                            key={internship.id} 
                            value={internship.id}
                            disabled={isFull}
                          >
                            {internship.title} ({assignedCount}/{internship.maxStudents})
                            {isFull ? ' - FULL' : ''}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>
                  
                  {/* Internship Details */}
                  {selectedInternshipId && (
                    <div className="mt-3">
                      {(() => {
                        const internship = internships.find(
                          i => i.id === parseInt(selectedInternshipId)
                        );
                        
                        if (!internship) return null;
                        
                        const assignedCount = students.filter(s => s.internshipId === internship.id).length;
                        
                        return (
                          <Card className="bg-light border-0">
                            <Card.Body>
                              <h6 className="mb-3">{internship.title}</h6>
                              <p className="small mb-2">
                                <strong>Duration:</strong> {internship.duration}
                              </p>
                              <p className="small mb-2">
                                <strong>Guide:</strong> {internship.guide}
                              </p>
                              <p className="small mb-2">
                                <strong>Period:</strong> {internship.startDate} to {internship.endDate}
                              </p>
                              <p className="small mb-3">
                                <strong>Students:</strong> {assignedCount}/{internship.maxStudents} 
                                {assignedCount >= internship.maxStudents ? ' (Full)' : ''}
                              </p>
                              <div className="d-flex flex-wrap">
                                {internship.skills.map((skill, index) => (
                                  <Badge 
                                    key={index} 
                                    bg="primary" 
                                    className="me-1 mb-1"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                              <div className="mt-3">
                                <Button 
                                  as={Link} 
                                  to={`/internships/${internship.id}`} 
                                  variant="outline-primary" 
                                  size="sm"
                                  className="w-100"
                                >
                                  View Internship Details
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        );
                      })()}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            
            {/* Right Column - Student List */}
            <Col lg={8}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Students</h5>
                </Card.Header>
                <Card.Body>
                  {/* Filters */}
                  <Row className="mb-4">
                    <Col md={4} className="mb-3 mb-md-0">
                      <Form.Control
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </Col>
                    <Col md={8}>
                      <Row>
                        <Col md={4} className="mb-3 mb-md-0">
                          <Form.Select
                            value={studentFilter}
                            onChange={(e) => setStudentFilter(e.target.value)}
                          >
                            <option value="all">All Students</option>
                            <option value="unassigned">Unassigned</option>
                            <option value="assigned">Assigned</option>
                          </Form.Select>
                        </Col>
                        <Col md={4} className="mb-3 mb-md-0">
                          <Form.Select
                            value={branchFilter}
                            onChange={(e) => setBranchFilter(e.target.value)}
                          >
                            <option value="">All Branches</option>
                            {branches.map((branch, index) => (
                              <option key={index} value={branch}>
                                {branch}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                        <Col md={4}>
                          <Form.Select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                          >
                            <option value="">All Years</option>
                            {years.map((year, index) => (
                              <option key={index} value={year}>
                                Year {year}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  
                  {/* Students Table */}
                  <div className="table-responsive">
                    <Table hover striped className="align-middle">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Register No.</th>
                          <th>Branch</th>
                          <th>Year</th>
                          <th>Current Internship</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map(student => {
                            const currentInternship = student.internshipId 
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
                                  {currentInternship ? (
                                    <Link to={`/internships/${currentInternship.id}`} className="text-decoration-none">
                                      {currentInternship.title}
                                    </Link>
                                  ) : (
                                    <span className="text-muted">Not assigned</span>
                                  )}
                                </td>
                                <td>
                                  {currentInternship ? (
                                    <Button 
                                      variant="outline-danger" 
                                      size="sm"
                                      onClick={() => handleUnassignStudent(student.id)}
                                    >
                                      <i className="bi bi-x-circle me-1"></i>
                                      Unassign
                                    </Button>
                                  ) : (
                                    <Button 
                                      variant="outline-success" 
                                      size="sm"
                                      onClick={() => handleAssignStudent(student.id)}
                                      disabled={!selectedInternshipId}
                                    >
                                      <i className="bi bi-plus-circle me-1"></i>
                                      Assign
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center py-4">
                              <i className="bi bi-search display-4 text-muted"></i>
                              <p className="mt-3 mb-0">No students found with the current filters</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-white">
                  <small className="text-muted">
                    Showing {filteredStudents.length} of {students.length} students
                  </small>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default InternshipTopicAssignment;