/**
 * Utility functions for data management and manipulation
 */

// Filter students based on various criteria
export const filterStudents = (students, filters = {}) => {
    const { searchTerm, branch, year, internshipId } = filters;
    
    let result = [...students];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        student => 
          student.name.toLowerCase().includes(term) || 
          student.registerNumber.toLowerCase().includes(term) ||
          student.email?.toLowerCase().includes(term)
      );
    }
    
    // Filter by branch
    if (branch) {
      result = result.filter(student => student.branch === branch);
    }
    
    // Filter by year
    if (year) {
      result = result.filter(student => student.year === parseInt(year));
    }
    
    // Filter by internship
    if (internshipId === 'assigned') {
      result = result.filter(student => student.internshipId !== null);
    } else if (internshipId === 'unassigned') {
      result = result.filter(student => student.internshipId === null);
    } else if (internshipId) {
      result = result.filter(student => student.internshipId === parseInt(internshipId));
    }
    
    return result;
  };
  
  // Filter internships based on various criteria
  export const filterInternships = (internships, filters = {}) => {
    const { searchTerm, status } = filters;
    
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
    if (status && status !== 'All') {
      result = result.filter(internship => internship.status === status);
    }
    
    return result;
  };
  
  // Filter CRT sessions based on various criteria
  export const filterCRTSessions = (sessions, filters = {}) => {
    const { searchTerm, type, studentId } = filters;
    
    let result = [...sessions];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        session => 
          session.title.toLowerCase().includes(term) || 
          session.description.toLowerCase().includes(term) ||
          session.speaker.toLowerCase().includes(term) ||
          session.venue.toLowerCase().includes(term)
      );
    }
    
    // Filter by type
    if (type === 'registered' && studentId) {
      result = result.filter(session => session.registeredStudents.includes(studentId));
    } else if (type === 'upcoming') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      result = result.filter(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate >= today;
      });
    } else if (type === 'past') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      result = result.filter(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate < today;
      });
    }
    
    return result;
  };
  
  // Sort data by a given field and order
  export const sortData = (data, sortConfig = { field: 'id', order: 'asc' }) => {
    const { field, order } = sortConfig;
    
    return [...data].sort((a, b) => {
      let comparison = 0;
      
      // Handle different data types
      if (typeof a[field] === 'string') {
        comparison = a[field].localeCompare(b[field]);
      } else if (field.includes('date') || field.includes('Date')) {
        comparison = new Date(a[field]) - new Date(b[field]);
      } else {
        comparison = a[field] - b[field];
      }
      
      return order === 'asc' ? comparison : -comparison;
    });
  };
  
  // Get unique values for a field from a data array
  export const getUniqueValues = (data, field) => {
    return [...new Set(data.map(item => item[field]))];
  };
  
  // Check if a session is upcoming
  export const isUpcomingSession = (sessionDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dateToCheck = new Date(sessionDate);
    dateToCheck.setHours(0, 0, 0, 0);
    
    return dateToCheck >= today;
  };
  
  // Generate a unique ID for new items
  export const generateId = (items) => {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  };