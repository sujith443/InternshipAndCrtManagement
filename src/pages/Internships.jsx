import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import components
import InternshipList from '../components/internships/InternshipList';
import InternshipCreate from '../components/internships/InternshipCreate';
import InternshipDetails from '../components/internships/InternshipDetails';
import InternshipTopicAssignment from '../components/internships/InternshipTopicAssignment';
import NotFound from '../pages/NotFound';

const Internships = () => {
  return (
    <Routes>
      <Route path="/" element={<InternshipList />} />
      <Route path="/create" element={<InternshipCreate />} />
      <Route path="/topics-assignment" element={<InternshipTopicAssignment />} />
      <Route path="/:id" element={<InternshipDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Internships;