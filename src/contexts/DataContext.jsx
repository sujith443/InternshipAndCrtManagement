import React, { createContext, useState, useEffect, useCallback } from 'react';

// Initial data
const initialStudents = [
  {
    id: 1,
    name: 'Arun Kumar',
    registerNumber: 'SVIT2023001',
    branch: 'Computer Science',
    year: 3,
    email: 'arun.kumar@svit.edu.in',
    phone: '9876543210',
    internshipId: 1,
    progress: [
      { date: '2023-09-01', task: 'Requirements Analysis', status: 'Completed', remarks: 'Good work' },
      { date: '2023-09-15', task: 'UI Design', status: 'In Progress', remarks: 'Needs improvement' }
    ]
  },
  {
    id: 2,
    name: 'Priya Sharma',
    registerNumber: 'SVIT2023002',
    branch: 'Information Technology',
    year: 3,
    email: 'priya.sharma@svit.edu.in',
    phone: '9876543211',
    internshipId: 2,
    progress: [
      { date: '2023-09-01', task: 'Database Design', status: 'Completed', remarks: 'Excellent work' }
    ]
  },
  {
    id: 3,
    name: 'Rahul Verma',
    registerNumber: 'SVIT2023003',
    branch: 'Electronics',
    year: 4,
    email: 'rahul.verma@svit.edu.in',
    phone: '9876543212',
    internshipId: 1,
    progress: []
  },
  {
    id: 4,
    name: 'Sneha Patel',
    registerNumber: 'SVIT2023004',
    branch: 'Computer Science',
    year: 3,
    email: 'sneha.patel@svit.edu.in',
    phone: '9876543213',
    internshipId: 3,
    progress: []
  },
  {
    id: 5,
    name: 'Karthik Raja',
    registerNumber: 'SVIT2023005',
    branch: 'Mechanical',
    year: 4,
    email: 'karthik.raja@svit.edu.in',
    phone: '9876543214',
    internshipId: null,
    progress: []
  }
];

const initialInternships = [
  {
    id: 1,
    title: 'Web Application Development',
    description: 'Develop a full-stack web application using modern technologies.',
    duration: '3 months',
    startDate: '2023-09-01',
    endDate: '2023-12-01',
    maxStudents: 10,
    guide: 'Dr. Srinivas Reddy',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    status: 'Active'
  },
  {
    id: 2,
    title: 'Machine Learning Project',
    description: 'Implement machine learning algorithms for data analysis and prediction.',
    duration: '4 months',
    startDate: '2023-08-15',
    endDate: '2023-12-15',
    maxStudents: 8,
    guide: 'Dr. Anitha Krishnan',
    skills: ['Python', 'TensorFlow', 'Data Analysis'],
    status: 'Active'
  },
  {
    id: 3,
    title: 'Mobile App Development',
    description: 'Create a cross-platform mobile application using React Native.',
    duration: '3 months',
    startDate: '2023-09-15',
    endDate: '2023-12-15',
    maxStudents: 6,
    guide: 'Prof. Ramesh Kumar',
    skills: ['React Native', 'JavaScript', 'Firebase'],
    status: 'Active'
  }
];

const initialCRTSessions = [
  {
    id: 1,
    title: 'Resume Building Workshop',
    description: 'Learn how to craft an impressive resume for placement.',
    date: '2023-09-10',
    time: '10:00 AM - 12:00 PM',
    venue: 'Seminar Hall 1',
    speaker: 'Ms. Kavita Sharma',
    eligibility: 'All final year students',
    registeredStudents: [1, 2, 5]
  },
  {
    id: 2,
    title: 'Technical Interview Preparation',
    description: 'Practice common technical interview questions and algorithms.',
    date: '2023-09-17',
    time: '2:00 PM - 5:00 PM',
    venue: 'Computer Lab 3',
    speaker: 'Mr. Venkat Rao',
    eligibility: 'CS and IT final year students',
    registeredStudents: [1, 3, 4]
  },
  {
    id: 3,
    title: 'Group Discussion Skills',
    description: 'Enhance your group discussion skills for campus interviews.',
    date: '2023-09-24',
    time: '11:00 AM - 1:00 PM',
    venue: 'Seminar Hall 2',
    speaker: 'Dr. Rajesh Khanna',
    eligibility: 'All pre-final and final year students',
    registeredStudents: [2, 3]
  }
];

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Load data from localStorage on initial render or use initial data
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : initialStudents;
  });

  const [internships, setInternships] = useState(() => {
    const savedInternships = localStorage.getItem('internships');
    return savedInternships ? JSON.parse(savedInternships) : initialInternships;
  });

  const [crtSessions, setCRTSessions] = useState(() => {
    const savedCRTSessions = localStorage.getItem('crtSessions');
    return savedCRTSessions ? JSON.parse(savedCRTSessions) : initialCRTSessions;
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('internships', JSON.stringify(internships));
  }, [internships]);

  useEffect(() => {
    localStorage.setItem('crtSessions', JSON.stringify(crtSessions));
  }, [crtSessions]);

  // Student related functions
  const addStudent = (student) => {
    const newStudent = {
      ...student,
      id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
      progress: []
    };
    setStudents([...students, newStudent]);
    return newStudent;
  };

  const updateStudent = (updatedStudent) => {
    setStudents(students.map(student => 
      student.id === updatedStudent.id ? updatedStudent : student
    ));
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const addStudentProgress = (studentId, progressEntry) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          progress: [...student.progress, progressEntry]
        };
      }
      return student;
    }));
  };

  // Internship related functions
  const addInternship = (internship) => {
    const newInternship = {
      ...internship,
      id: internships.length > 0 ? Math.max(...internships.map(i => i.id)) + 1 : 1,
      status: 'Active'
    };
    setInternships([...internships, newInternship]);
    return newInternship;
  };

  const updateInternship = (updatedInternship) => {
    setInternships(internships.map(internship => 
      internship.id === updatedInternship.id ? updatedInternship : internship
    ));
  };

  const deleteInternship = (id) => {
    // First, unassign all students from this internship
    setStudents(students.map(student => {
      if (student.internshipId === id) {
        return { ...student, internshipId: null };
      }
      return student;
    }));
    
    // Then delete the internship
    setInternships(internships.filter(internship => internship.id !== id));
  };

  const assignStudentToInternship = (studentId, internshipId) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return { ...student, internshipId };
      }
      return student;
    }));
  };

  // CRT Session related functions
  const addCRTSession = (session) => {
    const newSession = {
      ...session,
      id: crtSessions.length > 0 ? Math.max(...crtSessions.map(s => s.id)) + 1 : 1,
      registeredStudents: []
    };
    setCRTSessions([...crtSessions, newSession]);
    return newSession;
  };

  const updateCRTSession = (updatedSession) => {
    setCRTSessions(crtSessions.map(session => 
      session.id === updatedSession.id ? updatedSession : session
    ));
  };

  const deleteCRTSession = (id) => {
    setCRTSessions(crtSessions.filter(session => session.id !== id));
  };

  const registerStudentForCRTSession = (studentId, sessionId) => {
    setCRTSessions(crtSessions.map(session => {
      if (session.id === sessionId) {
        const registeredStudents = [...session.registeredStudents];
        if (!registeredStudents.includes(studentId)) {
          registeredStudents.push(studentId);
        }
        return { ...session, registeredStudents };
      }
      return session;
    }));
  };

  const unregisterStudentFromCRTSession = (studentId, sessionId) => {
    setCRTSessions(crtSessions.map(session => {
      if (session.id === sessionId) {
        return { 
          ...session, 
          registeredStudents: session.registeredStudents.filter(id => id !== studentId) 
        };
      }
      return session;
    }));
  };

  // Utility functions
  const getStudentsForInternship = useCallback((internshipId) => {
    return students.filter(student => student.internshipId === internshipId);
  }, [students]);

  const getStudentsForCRTSession = useCallback((sessionId) => {
    const session = crtSessions.find(s => s.id === sessionId);
    if (!session) return [];
    return students.filter(student => session.registeredStudents.includes(student.id));
  }, [crtSessions, students]);

  return (
    <DataContext.Provider
      value={{
        students,
        internships,
        crtSessions,
        addStudent,
        updateStudent,
        deleteStudent,
        addStudentProgress,
        addInternship,
        updateInternship,
        deleteInternship,
        assignStudentToInternship,
        addCRTSession,
        updateCRTSession,
        deleteCRTSession,
        registerStudentForCRTSession,
        unregisterStudentFromCRTSession,
        getStudentsForInternship,
        getStudentsForCRTSession
      }}
    >
      {children}
    </DataContext.Provider>
  );
};