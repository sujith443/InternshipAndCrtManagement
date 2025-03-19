import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import components
import StudentList from '../components/students/StudentList';
import StudentDetails from '../components/students/StudentDetails';
import StudentProgress from '../components/students/StudentProgress';
import NotFound from '../pages/NotFound';

const Students = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentList />} />
      <Route path="/progress" element={<StudentProgress />} />
      <Route path="/:id" element={<StudentDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Students;