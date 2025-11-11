import React, { useState } from 'react';
import './LDPPage.css';

const LDPPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const committeeRoles = [
    {
      id: 'chair',
      title: 'Committee Chair',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@gcu.edu',
      phone: '(602) 555-0123',
      access: 'Full Access',
      responsibilities: ['Overall supervision', 'Final approval', 'Defense coordination']
    },
    {
      id: 'methodologist',
      title: 'Methodologist',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@gcu.edu',
      phone: '(602) 555-0124',
      access: 'Research Methods',
      responsibilities: ['Methodology review', 'Statistical analysis', 'Data validation']
    },
    {
      id: 'content',
      title: 'Content Expert',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@gcu.edu',
      phone: '(602) 555-0125',
      access: 'Subject Matter',
      responsibilities: ['Content expertise', 'Literature review', 'Domain knowledge']
    },
    {
      id: 'consultant',
      title: 'Research Consultant',
      name: 'Dr. James Wilson',
      email: 'james.wilson@gcu.edu',
      phone: '(602) 555-0126',
      access: 'Advisory',
      responsibilities: ['Research guidance', 'Quality assurance', 'Best practices']
    }
  ];

  return (
    <div className="ldp-page">
      <div className="ldp-container">
        {/* Left Sidebar */}
        <div className="ldp-sidebar">
          <h3>Navigation</h3>
          <ul className="ldp-menu">
            <li><a href="#important-links">📌 Important Links</a></li>
            <li><a href="#announcements">📢 Announcements</a></li>
            <li><a href="#resources">📚 Resources</a></li>
            <li><a href="#student-info">👤 Student Information</a></li>
            <li><a href="#committees">👥 Committees</a></li>
            <li><a href="#templates">📄 Dissertation Templates</a></li>
            <li><a href="#calendar">📅 Calendar</a></li>
          </ul>

          <div className="filters-section">
            <h4>Filters</h4>
            <div className="filter-group">
              <label>
                <input type="checkbox" /> Students
              </label>
              <label>
                <input type="checkbox" /> Committee Members
              </label>
              <label>
                <input type="checkbox" /> Faculty
              </label>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="ldp-main">
          <div className="ldp-header">
            <h1>Leadership Development Program</h1>
            <p>Dissertation Committee Management & Collaboration</p>
          </div>

          {/* Committee Roles Grid */}
          <div className="committee-grid">
            {committeeRoles.map((role) => (
              <div 
                key={role.id} 
                className={`committee-card ${selectedRole === role.id ? 'selected' : ''}`}
                onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}
              >
                <div className="role-header">
                  <h3>{role.title}</h3>
                  <span className="access-level">{role.access}</span>
                </div>
                <div className="member-info">
                  <h4>{role.name}</h4>
                  <p>📧 {role.email}</p>
                  <p>📞 {role.phone}</p>
                </div>
                {selectedRole === role.id && (
                  <div className="role-details">
                    <h5>Responsibilities:</h5>
                    <ul>
                      {role.responsibilities.map((resp, index) => (
                        <li key={index}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Document Management */}
          <div className="document-section">
            <h2>📁 Document Management</h2>
            <div className="document-grid">
              <div className="document-folder">
                <div className="folder-icon">📄</div>
                <h4>Proposal</h4>
                <div className="folder-actions">
                  <button>📤 Upload</button>
                  <button>👁️ View</button>
                  <button>📋 History</button>
                </div>
              </div>
              <div className="document-folder">
                <div className="folder-icon">✅</div>
                <h4>IRB Approval</h4>
                <div className="folder-actions">
                  <button>📤 Upload</button>
                  <button>👁️ View</button>
                  <button>📋 History</button>
                </div>
              </div>
              <div className="document-folder">
                <div className="folder-icon">🎓</div>
                <h4>Defense Documents</h4>
                <div className="folder-actions">
                  <button>📤 Upload</button>
                  <button>👁️ View</button>
                  <button>📋 History</button>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="progress-section">
            <h2>📊 Dissertation Progress</h2>
            <div className="progress-tracker">
              <div className="progress-step completed">
                <div className="step-circle">✓</div>
                <span>Proposal Submitted</span>
              </div>
              <div className="progress-line completed"></div>
              <div className="progress-step in-review">
                <div className="step-circle">📝</div>
                <span>In Review</span>
              </div>
              <div className="progress-line"></div>
              <div className="progress-step pending">
                <div className="step-circle">⏳</div>
                <span>Approved</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-section">
            <button className="action-btn primary">📧 Send Notification</button>
            <button className="action-btn secondary">📝 Add Document</button>
            <button className="action-btn secondary">✏️ Edit Page</button>
            <button className="action-btn secondary">🔗 Share Page</button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="ldp-right-panel">
          <div className="calendar-widget">
            <h3>📅 Calendar</h3>
            <div className="mini-calendar">
              <div className="calendar-header">November 2025</div>
              <div className="calendar-grid">
                <div className="calendar-day">1</div>
                <div className="calendar-day">2</div>
                <div className="calendar-day">3</div>
                <div className="calendar-day">4</div>
                <div className="calendar-day">5</div>
                <div className="calendar-day">6</div>
                <div className="calendar-day">7</div>
                <div className="calendar-day">8</div>
                <div className="calendar-day">9</div>
                <div className="calendar-day">10</div>
                <div className="calendar-day today">11</div>
                <div className="calendar-day">12</div>
                <div className="calendar-day">13</div>
                <div className="calendar-day">14</div>
                <div className="calendar-day event">15</div>
                <div className="calendar-day">16</div>
                <div className="calendar-day">17</div>
                <div className="calendar-day">18</div>
                <div className="calendar-day">19</div>
                <div className="calendar-day event">20</div>
                <div className="calendar-day">21</div>
                <div className="calendar-day">22</div>
                <div className="calendar-day">23</div>
                <div className="calendar-day">24</div>
                <div className="calendar-day">25</div>
                <div className="calendar-day">26</div>
                <div className="calendar-day">27</div>
                <div className="calendar-day">28</div>
                <div className="calendar-day">29</div>
                <div className="calendar-day">30</div>
              </div>
            </div>
          </div>

          <div className="deadlines-widget">
            <h3>⏰ Upcoming Deadlines</h3>
            <div className="deadline-item urgent">
              <div className="deadline-date">Nov 15</div>
              <div className="deadline-text">Committee Meeting</div>
            </div>
            <div className="deadline-item">
              <div className="deadline-date">Nov 25</div>
              <div className="deadline-text">Progress Report</div>
            </div>
            <div className="deadline-item">
              <div className="deadline-date">Dec 1</div>
              <div className="deadline-text">IRB Renewal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LDPPage;