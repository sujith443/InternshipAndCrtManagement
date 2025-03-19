import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider } from './contexts/AuthContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';

// Pages
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
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <div className="content-wrapper">
              <Sidebar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/internships/*" element={<Internships />} />
                  <Route path="/students/*" element={<Students />} />
                  <Route path="/crt-sessions/*" element={<CRTSessions />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;