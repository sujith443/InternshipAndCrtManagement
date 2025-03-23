import React, { StrictMode } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider } from './contexts/AuthContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';

// Pages
import Dashboard from './components/common/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Internships from './pages/Internships';
import Students from './pages/Students';
import CRTSessions from './pages/CRTSessions';
import NotFound from './pages/NotFound';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.css';

function App() {
  // Using React.memo to prevent unnecessary re-renders
  const MemoizedNavbar = React.memo(Navbar);
  const MemoizedSidebar = React.memo(Sidebar);
  const MemoizedFooter = React.memo(Footer);

  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="app-container">
            <MemoizedNavbar />
            <div className="content-wrapper">
              <MemoizedSidebar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/internships/*" element={<Internships />} />
                  <Route path="/dashboard/*" element={<Dashboard />} />
                  <Route path="/students/*" element={<Students />} />
                  <Route path="/crt-sessions/*" element={<CRTSessions />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
            <MemoizedFooter />
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;