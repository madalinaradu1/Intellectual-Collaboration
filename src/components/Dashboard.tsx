import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import LDPPage from './LDPPage';
import StudentDashboard from './StudentDashboard';
import FacultyDashboard from './FacultyDashboard';
import CommitteeDashboard from './CommitteeDashboard';
import AdminDashboard from './AdminDashboard';
import MediaResources from './MediaResources';
import './Dashboard.css';

interface DashboardProps {
  signOut: () => void;
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ signOut, user }) => {
  const location = useLocation();
  const [userRole, setUserRole] = useState<'student' | 'faculty' | 'committee' | 'admin'>('student');

  // Role detection based on email domain and patterns
  useEffect(() => {
    const email = user?.username?.toLowerCase() || '';
    
    // Admin users (specific admin emails)
    if (email.includes('admin') || email.includes('administrator')) {
      setUserRole('admin');
    }
    // Faculty users (@gcu.edu)
    else if (email.endsWith('@gcu.edu')) {
      setUserRole('faculty');
    }
    // Students (@my.gcu.edu)
    else if (email.endsWith('@my.gcu.edu')) {
      setUserRole('student');
    }
    // Committee members (external emails or specific roles)
    else {
      setUserRole('committee');
    }
  }, [user]);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>IGLOO</h1>
            <span className="subtitle">Intellectual Collaboration Platform</span>
          </div>
          <nav className="main-nav">
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
              Home
            </Link>
            <Link to="/dashboard/my-dashboard" className={location.pathname === '/dashboard/my-dashboard' ? 'active' : ''}>
              My Dashboard
            </Link>
            <Link to="/dashboard/ldp" className={location.pathname === '/dashboard/ldp' ? 'active' : ''}>
              LDP
            </Link>
            <Link to="/dashboard/media" className={location.pathname === '/dashboard/media' ? 'active' : ''}>
              Media Resources
            </Link>
          </nav>
          <div className="user-section">
            <span>Welcome, {user.username}</span>
            <button onClick={signOut} className="sign-out-btn">Sign Out</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={
            userRole === 'admin' ? <AdminDashboard /> :
            userRole === 'faculty' ? <FacultyDashboard /> :
            userRole === 'committee' ? <CommitteeDashboard /> :
            <StudentDashboard />
          } />
          <Route path="/my-dashboard" element={
            userRole === 'admin' ? <AdminDashboard /> :
            userRole === 'faculty' ? <FacultyDashboard /> :
            userRole === 'committee' ? <CommitteeDashboard /> :
            <StudentDashboard />
          } />
          <Route path="/ldp" element={<LDPPage />} />
          <Route path="/media" element={<MediaResources />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;