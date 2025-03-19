import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// Sample users
const sampleUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'svit2023',  // In a real app, we would never store plain text passwords
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: 2,
    username: 'faculty',
    password: 'faculty2023',
    role: 'faculty',
    name: 'Faculty Member'
  },
  {
    id: 3,
    username: 'student',
    password: 'student2023',
    role: 'student',
    name: 'Student User',
    studentId: 1  // Reference to the student in the students array
  }
];

export const AuthProvider = ({ children }) => {
  const [users] = useState(sampleUsers);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [currentUser, isAuthenticated]);

  const login = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      const { password, ...userWithoutPassword } = user;  // Remove password before storing
      setCurrentUser(userWithoutPassword);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const isFaculty = () => {
    return currentUser?.role === 'faculty';
  };

  const isStudent = () => {
    return currentUser?.role === 'student';
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        isAuthenticated, 
        login, 
        logout, 
        isAdmin, 
        isFaculty, 
        isStudent 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};