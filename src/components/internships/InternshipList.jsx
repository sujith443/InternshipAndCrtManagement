import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DataContext } from '../../contexts/DataContext';
import { AuthContext } from '../../contexts/AuthContext';

const InternshipList = () => {
  const { internships, getStudentsForInternship } = useContext(DataContext);
  const { isAdmin, isFaculty } = useContext(AuthContext);
  
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('startDate');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Effect for filtering and sorting internships
  useEffect(() => {
    let result = [...internships];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        internship => 
          internship.title.toLowerCase().includes(term) || 
          internship.description.toLowerCase().includes(term) ||
          internship.guide.toLowerCase().includes(term) ||
          internship.skills.some(skill => skill.toLowerCase().includes(term))
      );
    }
    
    // Filter by status
    if (filterStatus !== 'All') {
      result = result.filter(internship => internship.status === filterStatus);
    }
    
    // Sort by selected field
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'startDate':
          comparison = new Date(a.startDate) - new Date(b.startDate);
          break;
        case 'endDate':
          comparison = new Date(a.endDate) - new Date(b.endDate);
          break;
        case 'guide':
          comparison = a.guide.localeCompare(b.guide);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredInternships(result);
  }, [internships, searchTerm, filterStatus, sortBy, sortOrder]);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Internship Opportunities</h2>
        {(isAdmin || isFaculty) && (
          <Button as={Link} to="/internships/create" variant="primary">
            <i className="bi bi-plus-circle me-2"></i> Create New Internship
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
                  placeholder="Search internships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3} className="mb-3 mb-md-0">
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Upcoming">Upcoming</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <InputGroup>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="startDate">Start Date</option>
                  <option value="endDate">End Date</option>
                  <option value="title">Title</option>
                  <option value="guide">Guide</option>
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
      
      {/* Internships Grid */}
      <Row>
        {filteredInternships.length > 0 ? (
          filteredInternships.map(internship => {
            const studentsCount = getStudentsForInternship(internship.id).length;
            
            return (
              <Col lg={4} md={6} className="mb-4" key={internship.id}>
                <Card className="h-100 border-0 shadow-sm hover-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-3">
                      <h4 className="card-title">{internship.title}</h4>
                      <Badge bg={
                        internship.status === 'Active' ? 'success' : 
                        internship.status === 'Completed' ? 'secondary' : 
                        'warning'
                      }>
                        {internship.status}
                      </Badge>
                    </div>
                    
                    <p className="card-text">{internship.description.substring(0, 120)}...</p>
                    
                    <div className="mb-3">
                      <strong><i className="bi bi-person me-2"></i>Guide:</strong> {internship.guide}
                    </div>
                    
                    <div className="mb-3">
                      <strong><i className="bi bi-calendar me-2"></i>Duration:</strong> {internship.duration}
                    </div>
                    
                    <div className="mb-3">
                      <strong><i className="bi bi-calendar-date me-2"></i>Period:</strong> {internship.startDate} to {internship.endDate}
                    </div>
                    
                    <div className="mb-3">
                      <strong><i className="bi bi-people me-2"></i>Students:</strong> {studentsCount}/{internship.maxStudents}
                    </div>
                    
                    <div className="d-flex flex-wrap mb-3">
                      {internship.skills.map((skill, index) => (
                        <span key={index} className="badge bg-light text-dark border me-1 mb-1">{skill}</span>
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
            );
          })
        ) : (
          <Col>
            <div className="text-center py-5">
              <i className="bi bi-search display-1 text-muted"></i>
              <h3 className="mt-3">No internships found</h3>
              <p className="text-muted">Try adjusting your search or filter criteria</p>
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default InternshipList;