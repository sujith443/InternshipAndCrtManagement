import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DataContext } from '../../contexts/DataContext';
import { AuthContext } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { internships, students, crtSessions } = useContext(DataContext);
  const { currentUser, isAdmin, isFaculty, isStudent } = useContext(AuthContext);
  
  const [stats, setStats] = useState({
    activeInternships: 0,
    totalStudents: 0,
    upcomingCRTSessions: 0,
    pendingTasks: 0
  });
  
  const [recentInternships, setRecentInternships] = useState([]);
  const [upcomingCRTSessions, setUpcomingCRTSessions] = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);
  
  useEffect(() => {
    // Calculate dashboard statistics
    const activeInternships = internships.filter(i => i.status === 'Active').length;
    const totalStudents = students.length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcoming = crtSessions.filter(session => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate >= today;
    }).length;
    
    // Calculate "pending tasks" - different for each role
    let pendingTasks = 0;
    
    if (isAdmin || isFaculty) {
      // For admin/faculty: Students without internships
      pendingTasks = students.filter(student => !student.internshipId).length;
    } else if (isStudent && currentUser?.studentId) {
      // For students: Count of unregistered upcoming CRT sessions
      const studentId = currentUser.studentId;
      pendingTasks = crtSessions.filter(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate >= today && !session.registeredStudents.includes(studentId);
      }).length;
    }
    
    setStats({
      activeInternships,
      totalStudents,
      upcomingCRTSessions: upcoming,
      pendingTasks
    });
    
    // Get recent internships
    setRecentInternships(
      [...internships]
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        .slice(0, 3)
    );
    
    // Get upcoming CRT sessions
    setUpcomingCRTSessions(
      crtSessions
        .filter(session => {
          const sessionDate = new Date(session.date);
          sessionDate.setHours(0, 0, 0, 0);
          return sessionDate >= today;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3)
    );
    
    // Get student progress data
    if (isStudent && currentUser?.studentId) {
      const student = students.find(s => s.id === currentUser.studentId);
      if (student) {
        setStudentProgress(
          [...student.progress]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
        );
      }
    } else if (isAdmin || isFaculty) {
      // Get latest progress updates from all students
      const allProgress = [];
      
      students.forEach(student => {
        student.progress.forEach(progress => {
          allProgress.push({
            studentId: student.id,
            studentName: student.name,
            ...progress
          });
        });
      });
      
      setStudentProgress(
        allProgress
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
      );
    }
  }, [internships, students, crtSessions, currentUser, isAdmin, isFaculty, isStudent]);
  
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Dashboard</h2>
        <div>
          {isAdmin && (
            <Button as={Link} to="/internships/create" variant="primary" className="me-2">
              <i className="bi bi-plus-circle me-2"></i> New Internship
            </Button>
          )}
          {(isAdmin || isFaculty) && (
            <Button as={Link} to="/crt-sessions/create" variant="info">
              <i className="bi bi-plus-circle me-2"></i> New CRT Session
            </Button>
          )}
        </div>
      </div>
      
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3 mb-md-0">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-primary text-white p-3 me-3">
                <i className="bi bi-briefcase fs-4"></i>
              </div>
              <div>
                <h3 className="mb-0">{stats.activeInternships}</h3>
                <p className="text-muted mb-0">Active Internships</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3 mb-md-0">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-success text-white p-3 me-3">
                <i className="bi bi-people fs-4"></i>
              </div>
              <div>
                <h3 className="mb-0">{stats.totalStudents}</h3>
                <p className="text-muted mb-0">Total Students</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3 mb-md-0">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-info text-white p-3 me-3">
                <i className="bi bi-calendar-event fs-4"></i>
              </div>
              <div>
                <h3 className="mb-0">{stats.upcomingCRTSessions}</h3>
                <p className="text-muted mb-0">Upcoming Sessions</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-warning text-white p-3 me-3">
                <i className="bi bi-check-square fs-4"></i>
              </div>
              <div>
                <h3 className="mb-0">{stats.pendingTasks}</h3>
                <p className="text-muted mb-0">
                  {isStudent 
                    ? 'Sessions to Register' 
                    : 'Unassigned Students'}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Main Dashboard Content */}
      <Row>
        {/* Left Column */}
        <Col lg={8}>
          {/* Recent Internships */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Internships</h5>
              <Button 
                as={Link} 
                to="/internships" 
                variant="outline-primary" 
                size="sm"
              >
                View All
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              {recentInternships.length > 0 ? (
                <Table hover responsive className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>Start Date</th>
                      <th>Guide</th>
                      <th>Students</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInternships.map(internship => {
                      const enrolledStudents = students.filter(
                        student => student.internshipId === internship.id
                      ).length;
                      
                      return (
                        <tr key={internship.id}>
                          <td>
                            <Link to={`/internships/${internship.id}`} className="text-decoration-none">
                              {internship.title}
                            </Link>
                          </td>
                          <td>{internship.startDate}</td>
                          <td>{internship.guide}</td>
                          <td>
                            {enrolledStudents}/{internship.maxStudents}
                          </td>
                          <td>
                            <span className={`badge bg-${
                              internship.status === 'Active' ? 'success' : 
                              internship.status === 'Completed' ? 'secondary' : 
                              'warning'
                            }`}>
                              {internship.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No internships found</p>
                </div>
              )}
            </Card.Body>
          </Card>
          
          {/* Student Progress */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Progress Updates</h5>
              <Button 
                as={Link} 
                to="/students/progress" 
                variant="outline-primary" 
                size="sm"
              >
                View All
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              {studentProgress.length > 0 ? (
                <Table hover responsive className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      {(isAdmin || isFaculty) && <th>Student</th>}
                      <th>Task</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentProgress.map((progress, index) => (
                      <tr key={index}>
                        <td>{new Date(progress.date).toLocaleDateString()}</td>
                        {(isAdmin || isFaculty) && (
                          <td>
                            <Link 
                              to={`/students/${progress.studentId}`} 
                              className="text-decoration-none"
                            >
                              {progress.studentName}
                            </Link>
                          </td>
                        )}
                        <td>{progress.task}</td>
                        <td>
                          <span className={`badge bg-${
                            progress.status === 'Completed' ? 'success' : 
                            progress.status === 'In Progress' ? 'primary' : 
                            progress.status === 'On Hold' ? 'warning' : 
                            'danger'
                          }`}>
                            {progress.status}
                          </span>
                        </td>
                        <td>{progress.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No progress updates found</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        {/* Right Column */}
        <Col lg={4}>
          {/* Upcoming CRT Sessions */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Upcoming CRT Sessions</h5>
              <Button 
                as={Link} 
                to="/crt-sessions" 
                variant="outline-primary" 
                size="sm"
              >
                View All
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              {upcomingCRTSessions.length > 0 ? (
                <div className="list-group list-group-flush">
                  {upcomingCRTSessions.map(session => {
                    const isRegistered = currentUser?.role === 'student' && 
                      session.registeredStudents.includes(currentUser.studentId);
                    
                    return (
                      <Link 
                        key={session.id}
                        to={`/crt-sessions/${session.id}`}
                        className="list-group-item list-group-item-action"
                      >
                        <div className="d-flex w-100 justify-content-between mb-1">
                          <h6 className="mb-0">{session.title}</h6>
                          {isRegistered && (
                            <span className="badge bg-success">Registered</span>
                          )}
                        </div>
                        <p className="text-muted small mb-1">
                          <i className="bi bi-calendar me-2"></i>
                          {new Date(session.date).toLocaleDateString()}
                        </p>
                        <p className="text-muted small mb-1">
                          <i className="bi bi-clock me-2"></i>
                          {session.time}
                        </p>
                        <p className="text-muted small mb-0">
                          <i className="bi bi-geo-alt me-2"></i>
                          {session.venue}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No upcoming sessions found</p>
                </div>
              )}
            </Card.Body>
          </Card>
          
          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                {isStudent ? (
                  <>
                    <Button as={Link} to="/internships" variant="outline-primary">
                      <i className="bi bi-briefcase me-2"></i>
                      Browse Internships
                    </Button>
                    <Button as={Link} to="/crt-sessions" variant="outline-info">
                      <i className="bi bi-calendar-event me-2"></i>
                      View CRT Sessions
                    </Button>
                    <Button as={Link} to="/students/progress" variant="outline-success">
                      <i className="bi bi-graph-up me-2"></i>
                      Update My Progress
                    </Button>
                  </>
                ) : (
                  <>
                    {isAdmin && (
                      <Button as={Link} to="/internships/create" variant="outline-primary">
                        <i className="bi bi-plus-circle me-2"></i>
                        Create Internship
                      </Button>
                    )}
                    {(isAdmin || isFaculty) && (
                      <>
                        <Button as={Link} to="/crt-sessions/create" variant="outline-info">
                          <i className="bi bi-plus-circle me-2"></i>
                          Create CRT Session
                        </Button>
                        <Button as={Link} to="/internships/topics-assignment" variant="outline-success">
                          <i className="bi bi-people me-2"></i>
                          Assign Students
                        </Button>
                        <Button as={Link} to="/students/progress" variant="outline-secondary">
                          <i className="bi bi-graph-up me-2"></i>
                          Track Progress
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;