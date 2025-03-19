import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../contexts/DataContext';
import { AuthContext } from '../../contexts/AuthContext';

const InternshipCreate = () => {
  const { addInternship } = useContext(DataContext);
  const { isAuthenticated, isAdmin, isFaculty } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    startDate: '',
    endDate: '',
    maxStudents: 10,
    guide: '',
    skills: []
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };
  
  // Handle adding a skill
  const handleAddSkill = () => {
    if (skillInput.trim() !== '') {
      // Check if skill already exists
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({
          ...formData,
          skills: [...formData.skills, skillInput.trim()]
        });
      }
      setSkillInput('');
    }
  };
  
  // Handle removing a skill
  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };
  
  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.guide.trim()) newErrors.guide = 'Guide name is required';
    
    // Validate dates
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (start > end) {
        newErrors.endDate = 'End date cannot be before start date';
      }
    }
    
    // Validate max students
    if (formData.maxStudents <= 0) {
      newErrors.maxStudents = 'Maximum students must be greater than 0';
    }
    
    // Validate skills
    if (formData.skills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Check if user has permission
    if (!isAuthenticated || (!isAdmin && !isFaculty)) {
      setAlert({
        show: true,
        variant: 'danger',
        message: 'You do not have permission to create internships'
      });
      return;
    }
    
    if (validateForm()) {
      try {
        // Add the internship
        const newInternship = addInternship(formData);
        
        // Show success message
        setAlert({
          show: true,
          variant: 'success',
          message: 'Internship created successfully!'
        });
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          duration: '',
          startDate: '',
          endDate: '',
          maxStudents: 10,
          guide: '',
          skills: []
        });
        setFormSubmitted(false);
        
        // Navigate to the new internship details page after a brief delay
        setTimeout(() => {
          navigate(`/internships/${newInternship.id}`);
        }, 1500);
      } catch (error) {
        console.error('Error creating internship:', error);
        setAlert({
          show: true,
          variant: 'danger',
          message: 'An error occurred while creating the internship. Please try again.'
        });
      }
    } else {
      // Scroll to the top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">Create New Internship</h3>
            </Card.Header>
            <Card.Body className="p-4">
              {alert.show && (
                <Alert 
                  variant={alert.variant} 
                  onClose={() => setAlert({ ...alert, show: false })} 
                  dismissible
                >
                  {alert.message}
                </Alert>
              )}
              
              {(!isAuthenticated || (!isAdmin && !isFaculty)) ? (
                <Alert variant="warning">
                  You must be logged in as an administrator or faculty member to create internships.
                </Alert>
              ) : (
                <Form onSubmit={handleSubmit}>
                  {/* Title */}
                  <Form.Group className="mb-3">
                    <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      isInvalid={formSubmitted && !!errors.title}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  {/* Description */}
                  <Form.Group className="mb-3">
                    <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      isInvalid={formSubmitted && !!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Row>
                    {/* Duration */}
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Duration <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="duration"
                          placeholder="e.g. 3 months"
                          value={formData.duration}
                          onChange={handleChange}
                          isInvalid={formSubmitted && !!errors.duration}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.duration}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    {/* Start Date */}
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Start Date <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          isInvalid={formSubmitted && !!errors.startDate}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.startDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    {/* End Date */}
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>End Date <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          isInvalid={formSubmitted && !!errors.endDate}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.endDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    {/* Max Students */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Maximum Students</Form.Label>
                        <Form.Control
                          type="number"
                          name="maxStudents"
                          value={formData.maxStudents}
                          onChange={handleChange}
                          min={1}
                          isInvalid={formSubmitted && !!errors.maxStudents}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.maxStudents}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    {/* Guide */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Guide/Mentor <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="guide"
                          value={formData.guide}
                          onChange={handleChange}
                          isInvalid={formSubmitted && !!errors.guide}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.guide}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  {/* Skills */}
                  <Form.Group className="mb-4">
                    <Form.Label>Required Skills <span className="text-danger">*</span></Form.Label>
                    <div className="d-flex mb-2">
                      <Form.Control
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add a skill (e.g. JavaScript, Python)"
                        isInvalid={formSubmitted && !!errors.skills}
                      />
                      <Button 
                        variant="outline-primary" 
                        className="ms-2" 
                        onClick={handleAddSkill}
                        type="button"
                      >
                        Add
                      </Button>
                    </div>
                    
                    {formSubmitted && errors.skills && (
                      <div className="text-danger mb-2">
                        {errors.skills}
                      </div>
                    )}
                    
                    <div className="d-flex flex-wrap">
                      {formData.skills.map((skill, index) => (
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
                  
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Button 
                      variant="secondary" 
                      onClick={() => navigate('/internships')}
                      className="me-md-2"
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      Create Internship
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InternshipCreate;