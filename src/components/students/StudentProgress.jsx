import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Badge, Alert, Modal } from 'react-bootstrap';
import { DataContext } from '../../contexts/DataContext';
import { AuthContext } from '../../contexts/AuthContext';

const StudentProgress = () => {
  const { students, internships, addStudentProgress, updateStudent } = useContext(DataContext);
  const { isAuthenticated, isAdmin, isFaculty, currentUser } = useContext(AuthContext);
  
  // State for filtering and selection
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedInternshipId, setSelectedInternshipId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for adding new progress entry
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProgressEntry, setNewProgressEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    task: '',
    status: 'In Progress',
    remarks: ''
  });
  
  // Effect to initialize student selection if user is a student
  useEffect(() => {
    if (isAuthenticated && currentUser && currentUser.role === 'student') {
      const studentId = currentUser.studentId;
      if (studentId) {
        setSelectedStudentId(studentId);
        
        const student = students.find(s => s.id === studentId);
        if (student && student.internshipId) {
          setSelectedInternshipId(student.internshipId);
        }
      }
    }
  }, [isAuthenticated, currentUser, students]);
  
  // Effect to filter students based on search term and selections
  useEffect(() => {
    let result = [...students];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        student => 
          student.name.toLowerCase().includes(term) || 
          student.registerNumber.toLowerCase().includes(term) || 
          student.branch.toLowerCase().includes(term)
      );
    }
    
    // Filter by selected internship if applicable
    if (selectedInternshipId) {
      result = result.filter(student => student.internshipId === selectedInternshipId);
    }
    
    setFilteredStudents(result);
  }, [students, searchTerm, selectedInternshipId]);
  
  // Get the selected student object
  const selectedStudent = students.find(student => student.id === selectedStudentId);
  
  // Get the student's internship details
  const studentInternship = selectedStudent && selectedStudent.internshipId 
    ? internships.find(i => i.id === selectedStudent.internshipId) 
    : null;
  
  // Handle student selection
  const handleStudentSelect = (studentId) => {
    setSelectedStudentId(studentId);
    
    // If student has an internship, auto-select it
    const student = students.find(s => s.id === studentId);
    if (student && student.internshipId) {
      setSelectedInternshipId(student.internshipId);
    } else {
      setSelectedInternshipId(null);
    }
  };
  
  // Handle adding new progress entry
  const handleAddProgress = () => {
    if (!selectedStudentId) return;
    
    // Validate the form
    if (!newProgressEntry.task.trim() || !newProgressEntry.status.trim()) {
      return;
    }
    
    // Add progress to the student
    addStudentProgress(selectedStudentId, {
      ...newProgressEntry,
      date: newProgressEntry.date || new Date().toISOString().split('T')[0]
    });
    
    // Close modal and reset form
    setShowAddModal(false);
    setNewProgressEntry({
      date: new Date().toISOString().split('T')[0],
      task: '',
      status: 'In Progress',
      remarks: ''
    });
  };
  
  // Function to get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <Badge bg="success">{status}</Badge>;
      case 'In Progress':
        return <Badge bg="primary">{status}</Badge>;
      case 'On Hold':
        return <Badge bg="warning">{status}</Badge>;
      case 'Delayed':
        return <Badge bg="danger">{status}</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };
  
  return (
    <Container className="py-4">
      <h2 className="mb-4">Student Progress Tracker</h2>
      
      <Row>
        {/* Left column - Student selection */}
        <Col lg={4} xl={3} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Students</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="p-3">
                <Form.Control
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-3"
                />
                
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Internship</Form.Label>
                  <Form.Select
                    value={selectedInternshipId || ''}
                    onChange={(e) => setSelectedInternshipId(e.target.value ? Number(e.target.value) : null)}
                  >
                    <option value="">All Internships</option>
                    {internships.map(internship => (
                      <option key={internship.id} value={internship.id}>
                        {internship.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              
              <div className="student-list" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {filteredStudents.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {filteredStudents.map(student => (
                      <button
                        key={student.id}
                        className={`list-group-item list-group-item-action ${selectedStudentId === student.id ? 'active' : ''}`}
                        onClick={() => handleStudentSelect(student.id)}
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <h6 className="mb-1">{student.name}</h6>
                          <small>{student.registerNumber}</small>
                        </div>
                        <small className="d-block">{student.branch}, Year {student.year}</small>
                        {student.internshipId && (
                          <small className="text-truncate d-block mt-1">
                            {internships.find(i => i.id === student.internshipId)?.title || 'Unknown Internship'}
                          </small>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">No students found</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Right column - Progress details */}
        <Col lg={8} xl={9}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Progress Details</h5>
              {selectedStudentId && (isAdmin || isFaculty || (currentUser?.role === 'student' && currentUser?.studentId === selectedStudentId)) && (
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => setShowAddModal(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Progress Entry
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {selectedStudent ? (
                <>
                  <div className="mb-4">
                    <h4>{selectedStudent.name}</h4>
                    <div className="text-muted">
                      {selectedStudent.registerNumber} | {selectedStudent.branch}, Year {selectedStudent.year}
                    </div>
                    
                    {studentInternship ? (
                      <div className="mt-3">
                        <h5>Current Internship:</h5>
                        <div className="card bg-light p-3 border-0">
                          <h6>{studentInternship.title}</h6>
                          <div className="text-muted mb-2">
                            <i className="bi bi-calendar me-2"></i>
                            {studentInternship.startDate} to {studentInternship.endDate}
                          </div>
                          <div className="text-muted mb-2">
                            <i className="bi bi-person me-2"></i>
                            Guide: {studentInternship.guide}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Alert variant="warning" className="mt-3">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        This student is not assigned to any internship yet.
                      </Alert>
                    )}
                  </div>
                  
                  <h5 className="mb-3">Progress Timeline</h5>
                  
                  {selectedStudent.progress && selectedStudent.progress.length > 0 ? (
                    <Table responsive striped hover>
                      <thead>
                        <tr>
                          <th style={{ width: '15%' }}>Date</th>
                          <th style={{ width: '30%' }}>Task</th>
                          <th style={{ width: '15%' }}>Status</th>
                          <th style={{ width: '40%' }}>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...selectedStudent.progress]
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((entry, index) => (
                            <tr key={index}>
                              <td>{new Date(entry.date).toLocaleDateString()}</td>
                              <td>{entry.task}</td>
                              <td>{getStatusBadge(entry.status)}</td>
                              <td>{entry.remarks}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </Table>
                  ) : (
                    <div className="text-center py-4">
                      <i className="bi bi-journal text-muted display-4"></i>
                      <p className="mt-3 text-muted">No progress entries recorded yet.</p>
                      {(isAdmin || isFaculty || (currentUser?.role === 'student' && currentUser?.studentId === selectedStudentId)) && (
                        <Button 
                          variant="outline-primary" 
                          onClick={() => setShowAddModal(true)}
                        >
                          Add First Progress Entry
                        </Button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-person-circle text-muted display-4"></i>
                  <p className="mt-3 text-muted">Select a student to view their progress</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Add Progress Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Progress Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newProgressEntry.date}
                onChange={(e) => setNewProgressEntry({ ...newProgressEntry, date: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Task</Form.Label>
              <Form.Control
                type="text"
                placeholder="What was worked on?"
                value={newProgressEntry.task}
                onChange={(e) => setNewProgressEntry({ ...newProgressEntry, task: e.target.value })}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newProgressEntry.status}
                onChange={(e) => setNewProgressEntry({ ...newProgressEntry, status: e.target.value })}
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
                <option value="Delayed">Delayed</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Additional comments or feedback..."
                value={newProgressEntry.remarks}
                onChange={(e) => setNewProgressEntry({ ...newProgressEntry, remarks: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddProgress}>
            Add Entry
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StudentProgress;