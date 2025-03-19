import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { isAuthenticated, isAdmin, isFaculty, isStudent } = useContext(AuthContext);
  const location = useLocation();
  
  // If not authenticated, don't show sidebar
  if (!isAuthenticated) return null;
  
  // Check active route
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="sidebar bg-light">
      <div className="d-flex flex-column p-3 h-100">
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item mb-2">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active bg-primary' : 'text-dark'}`}
            >
              <i className="bi bi-speedometer2 me-2"></i>
              Dashboard
            </Link>
          </li>
          
          {/* Internship Management */}
          <li className="sidebar-heading mt-3 mb-1 text-muted small text-uppercase">
            Internship Management
          </li>
          <li className="nav-item mb-1">
            <Link 
              to="/internships" 
              className={`nav-link ${isActive('/internships') && !isActive('/internships/create') ? 'active bg-primary' : 'text-dark'}`}
            >
              <i className="bi bi-briefcase me-2"></i>
              View Internships
            </Link>
          </li>
          {(isAdmin || isFaculty) && (
            <li className="nav-item mb-1">
              <Link 
                to="/internships/create" 
                className={`nav-link ${isActive('/internships/create') ? 'active bg-primary' : 'text-dark'}`}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Create Internship
              </Link>
            </li>
          )}
          {(isAdmin || isFaculty) && (
            <li className="nav-item mb-1">
              <Link 
                to="/internships/topics-assignment" 
                className={`nav-link ${isActive('/internships/topics-assignment') ? 'active bg-primary' : 'text-dark'}`}
              >
                <i className="bi bi-people me-2"></i>
                Assign Students
              </Link>
            </li>
          )}
          
          {/* Student Progress */}
          <li className="sidebar-heading mt-3 mb-1 text-muted small text-uppercase">
            Student Progress
          </li>
          <li className="nav-item mb-1">
            <Link 
              to="/students" 
              className={`nav-link ${isActive('/students') && !isActive('/students/progress') ? 'active bg-primary' : 'text-dark'}`}
            >
              <i className="bi bi-people me-2"></i>
              Students List
            </Link>
          </li>
          <li className="nav-item mb-1">
            <Link 
              to="/students/progress" 
              className={`nav-link ${isActive('/students/progress') ? 'active bg-primary' : 'text-dark'}`}
            >
              <i className="bi bi-graph-up me-2"></i>
              Track Progress
            </Link>
          </li>
          
          {/* CRT Sessions */}
          <li className="sidebar-heading mt-3 mb-1 text-muted small text-uppercase">
            CRT Sessions
          </li>
          <li className="nav-item mb-1">
            <Link 
              to="/crt-sessions" 
              className={`nav-link ${isActive('/crt-sessions') && !isActive('/crt-sessions/create') ? 'active bg-primary' : 'text-dark'}`}
            >
              <i className="bi bi-calendar-event me-2"></i>
              View Sessions
            </Link>
          </li>
          {(isAdmin || isFaculty) && (
            <li className="nav-item mb-1">
              <Link 
                to="/crt-sessions/create" 
                className={`nav-link ${isActive('/crt-sessions/create') ? 'active bg-primary' : 'text-dark'}`}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Create Session
              </Link>
            </li>
          )}
          {isStudent && (
            <li className="nav-item mb-1">
              <Link 
                to="/crt-sessions/my-registrations" 
                className={`nav-link ${isActive('/crt-sessions/my-registrations') ? 'active bg-primary' : 'text-dark'}`}
              >
                <i className="bi bi-bookmark-check me-2"></i>
                My Registrations
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;