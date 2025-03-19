import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../contexts/DataContext';
import { AuthContext } from '../../contexts/AuthContext';

const CRTSessionCreate = () => {
  const { addCRTSession } = useContext(DataContext);
  const { isAuthenticated, isAdmin, isFaculty } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    speaker: '',
    eligibility: 'All students'
  });
  
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
  
  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time.trim()) newErrors.time = 'Time is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
    if (!formData.speaker.trim()) newErrors.speaker = 'Speaker name is required';
    if (!formData.eligibility.trim()) newErrors.eligibility = 'Eligibility criteria is required';
    
    // Validate date is not in the past
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
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
        message: 'You do not have permission to create CRT sessions'
      });
      return;
    }
    
    if (validateForm()) {
      try {
        // Add the CRT session
        const newSession = addCRTSession(formData);
        
        // Show success message
        setAlert({
          show: true,
          variant: 'success',
          message: 'CRT session created successfully!'
        });
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '',
          venue: '',
          speaker: '',
          eligibility: 'All students'
        });
        setFormSubmitted(false);
        
        // Navigate to the new CRT session details page after a brief delay
        setTimeout(() => {
          navigate(`/crt-sessions/${newSession.id}`);
        }, 1500);
      } catch (error) {
        console.error('Error creating CRT session:', error);
        setAlert({
          show: true,
          variant: 'danger',
          message: 'An error occurred while creating the CRT session. Please try again.'
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
            <Card.Header className="bg-info text-white">
              <h3 className="mb-0">Create New CRT Session</h3>
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
                  You must be logged in as an administrator or faculty member to create CRT sessions.
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
                      placeholder="e.g. Resume Building Workshop"
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
                      placeholder="Provide details about the session"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Row>
                    {/* Date */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Date <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          isInvalid={formSubmitted && !!errors.date}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.date}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    {/* Time */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Time <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          isInvalid={formSubmitted && !!errors.time}
                          placeholder="e.g. 10:00 AM - 12:00 PM"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.time}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    {/* Venue */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Venue <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="venue"
                          value={formData.venue}
                          onChange={handleChange}
                          isInvalid={formSubmitted && !!errors.venue}
                          placeholder="e.g. Seminar Hall 1"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.venue}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    {/* Speaker */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Speaker <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="speaker"
                          value={formData.speaker}
                          onChange={handleChange}
                          isInvalid={formSubmitted && !!errors.speaker}
                          placeholder="e.g. Dr. Srinivas Reddy"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.speaker}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  {/* Eligibility */}
                  <Form.Group className="mb-4">
                    <Form.Label>Eligibility Criteria <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="eligibility"
                      value={formData.eligibility}
                      onChange={handleChange}
                      isInvalid={formSubmitted && !!errors.eligibility}
                      placeholder="e.g. All final year students"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.eligibility}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Specify which students can register for this session (e.g., "All students", "CS and IT final year students")
                    </Form.Text>
                  </Form.Group>
                  
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Button 
                      variant="secondary" 
                      onClick={() => navigate('/crt-sessions')}
                      className="me-md-2"
                    >
                      Cancel
                    </Button>
                    <Button variant="info" type="submit">
                      Create CRT Session
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

export default CRTSessionCreate;