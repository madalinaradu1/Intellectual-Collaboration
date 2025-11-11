import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import LDPPage from './LDPPage';
import StudentDashboard from './StudentDashboard';
import MediaResources from './MediaResources';
import './Dashboard.css';

interface DashboardProps {
  signOut: () => void;
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ signOut, user }) => {
  const location = useLocation();

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
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/my-dashboard" element={<StudentDashboard />} />
          <Route path="/ldp" element={<LDPPage />} />
          <Route path="/media" element={<MediaResources />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;