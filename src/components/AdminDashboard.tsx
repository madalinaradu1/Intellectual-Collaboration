import React, { useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🛠️ Admin Dashboard</h1>
        <div className="admin-tabs">
          <button 
            className={selectedTab === 'overview' ? 'active' : ''} 
            onClick={() => setSelectedTab('overview')}
          >
            Overview
          </button>
          <button 
            className={selectedTab === 'users' ? 'active' : ''} 
            onClick={() => setSelectedTab('users')}
          >
            User Management
          </button>
          <button 
            className={selectedTab === 'committees' ? 'active' : ''} 
            onClick={() => setSelectedTab('committees')}
          >
            Committee Management
          </button>
          <button 
            className={selectedTab === 'reports' ? 'active' : ''} 
            onClick={() => setSelectedTab('reports')}
          >
            Reports
          </button>
        </div>
      </div>

      {selectedTab === 'overview' && (
        <div className="admin-content">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>👥 Total Users</h3>
              <div className="stat-number">247</div>
              <div className="stat-breakdown">
                <span>Students: 180</span>
                <span>Faculty: 45</span>
                <span>Committee: 22</span>
              </div>
            </div>
            <div className="stat-card">
              <h3>📋 Active Committees</h3>
              <div className="stat-number">45</div>
              <div className="stat-breakdown">
                <span>Proposal Stage: 15</span>
                <span>Research Phase: 20</span>
                <span>Defense Ready: 10</span>
              </div>
            </div>
            <div className="stat-card">
              <h3>📝 Pending Reviews</h3>
              <div className="stat-number">23</div>
              <div className="stat-breakdown">
                <span>Overdue: 3</span>
                <span>Due Today: 8</span>
                <span>Due This Week: 12</span>
              </div>
            </div>
          </div>

          <div className="recent-activity">
            <h2>Recent System Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-time">2 hours ago</span>
                <span>New committee member added: Dr. External Expert (external@university.edu)</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">4 hours ago</span>
                <span>Student Sarah Johnson submitted Chapter 3 for review</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">1 day ago</span>
                <span>Committee formed for Michael Chen (Chair: Dr. Smith)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'users' && (
        <div className="admin-content">
          <div className="user-management">
            <div className="user-controls">
              <button className="add-user-btn">➕ Add User</button>
              <input type="text" placeholder="Search users..." className="search-input" />
              <select className="role-filter">
                <option value="">All Roles</option>
                <option value="student">Students</option>
                <option value="faculty">Faculty</option>
                <option value="committee">Committee Members</option>
                <option value="admin">Administrators</option>
              </select>
            </div>

            <div className="user-table">
              <div className="table-header">
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              <div className="table-row">
                <span>Sarah Johnson</span>
                <span>sarah.johnson@my.gcu.edu</span>
                <span className="role student">Student</span>
                <span className="status active">Active</span>
                <div className="actions">
                  <button>✏️</button>
                  <button>👁️</button>
                  <button>🗑️</button>
                </div>
              </div>
              <div className="table-row">
                <span>Dr. Michael Smith</span>
                <span>michael.smith@gcu.edu</span>
                <span className="role faculty">Faculty</span>
                <span className="status active">Active</span>
                <div className="actions">
                  <button>✏️</button>
                  <button>👁️</button>
                  <button>🗑️</button>
                </div>
              </div>
              <div className="table-row">
                <span>Dr. External Expert</span>
                <span>expert@external-university.edu</span>
                <span className="role committee">Content Expert</span>
                <span className="status pending">Pending</span>
                <div className="actions">
                  <button>✏️</button>
                  <button>👁️</button>
                  <button>🗑️</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'committees' && (
        <div className="admin-content">
          <div className="committee-management">
            <h2>Committee Management</h2>
            <div className="committee-list">
              <div className="committee-item">
                <div className="committee-header">
                  <h3>Sarah Johnson's Committee</h3>
                  <span className="committee-status proposal">Proposal Stage</span>
                </div>
                <div className="committee-members">
                  <div className="member">
                    <span className="member-role chair">Chair:</span>
                    <span>Dr. Michael Smith (michael.smith@gcu.edu)</span>
                  </div>
                  <div className="member">
                    <span className="member-role methodologist">Methodologist:</span>
                    <span>Dr. Jane Wilson (jane.wilson@gcu.edu)</span>
                  </div>
                  <div className="member">
                    <span className="member-role content">Content Expert:</span>
                    <span>Dr. External Expert (expert@external-university.edu)</span>
                  </div>
                  <div className="member">
                    <span className="member-role consultant">Research Consultant:</span>
                    <span>Dr. Internal Consultant (consultant@gcu.edu)</span>
                  </div>
                </div>
                <div className="committee-actions">
                  <button>✏️ Edit Committee</button>
                  <button>📧 Send Notification</button>
                  <button>📊 View Progress</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'reports' && (
        <div className="admin-content">
          <div className="reports-section">
            <h2>System Reports</h2>
            <div className="report-grid">
              <div className="report-card">
                <h3>📊 User Activity Report</h3>
                <p>Login frequency, engagement metrics, and usage patterns</p>
                <button>Generate Report</button>
              </div>
              <div className="report-card">
                <h3>📈 Progress Analytics</h3>
                <p>Student progress tracking and completion rates</p>
                <button>Generate Report</button>
              </div>
              <div className="report-card">
                <h3>⏰ Review Timeline Report</h3>
                <p>Committee review times and bottleneck analysis</p>
                <button>Generate Report</button>
              </div>
              <div className="report-card">
                <h3>🎓 Graduation Forecast</h3>
                <p>Projected graduation dates and milestone tracking</p>
                <button>Generate Report</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;