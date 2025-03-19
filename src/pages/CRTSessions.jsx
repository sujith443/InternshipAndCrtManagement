import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import components
import CRTSessionList from '../components/crt/CRTSessionList';
import CRTSessionCreate from '../components/crt/CRTSessionCreate';
import CRTSessionDetails from '../components/crt/CRTSessionDetails';
import NotFound from '../pages/NotFound';

const CRTSessions = () => {
  return (
    <Routes>
      <Route path="/" element={<CRTSessionList />} />
      <Route path="/create" element={<CRTSessionCreate />} />
      <Route path="/my-registrations" element={<CRTSessionList />} /> {/* Filtered view of sessions */}
      <Route path="/:id" element={<CRTSessionDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default CRTSessions;