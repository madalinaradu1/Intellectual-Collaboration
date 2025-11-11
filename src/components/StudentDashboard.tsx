import React from 'react';
import './StudentDashboard.css';

const StudentDashboard: React.FC = () => {
  return (
    <div className="student-dashboard">
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="left-column">
          <div className="sidebar">
            <h3>Quick Links</h3>
            <ul className="sidebar-menu">
              <li><a href="#announcements">📢 Announcements</a></li>
              <li><a href="#resources">📚 Resources</a></li>
              <li><a href="#student-info">👤 Student Information</a></li>
              <li><a href="#committees">👥 Committees</a></li>
              <li><a href="#templates">📄 Dissertation Templates</a></li>
              <li><a href="#calendar">📅 Calendar</a></li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-dashboard">
          <h2>Student Dashboard</h2>
          
          {/* Announcements Widget */}
          <div className="widget announcements-widget">
            <h3>📢 Recent Announcements</h3>
            <div className="announcement-item">
              <div className="announcement-date">Nov 12, 2025</div>
              <div className="announcement-text">Dissertation proposal deadline: December 15th</div>
            </div>
            <div className="announcement-item">
              <div className="announcement-date">Nov 10, 2025</div>
              <div className="announcement-text">Committee meeting scheduled for next week</div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="widget progress-widget">
            <h3>📊 Dissertation Progress</h3>
            <div className="progress-item">
              <span>Proposal Submission</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '75%'}}></div>
              </div>
              <span>75%</span>
            </div>
            <div className="progress-item">
              <span>IRB Approval</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '50%'}}></div>
              </div>
              <span>50%</span>
            </div>
            <div className="progress-item">
              <span>Data Collection</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '25%'}}></div>
              </div>
              <span>25%</span>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="widget activity-widget">
            <h3>📋 Recent Activity</h3>
            <div className="activity-item">
              <span className="activity-time">2 hours ago</span>
              <span className="activity-text">Uploaded dissertation chapter 3</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">1 day ago</span>
              <span className="activity-text">Committee feedback received</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">3 days ago</span>
              <span className="activity-text">IRB application submitted</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Program of Study Widget */}
          <div className="widget pos-widget">
            <h3>🎓 Program of Study</h3>
            <div className="pos-item completed">
              <span>Research Methods</span>
              <span className="status">✓</span>
            </div>
            <div className="pos-item completed">
              <span>Statistics</span>
              <span className="status">✓</span>
            </div>
            <div className="pos-item in-progress">
              <span>Dissertation</span>
              <span className="status">📝</span>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="widget calendar-widget">
            <h3>📅 Upcoming Events</h3>
            <div className="calendar-event">
              <div className="event-date">Nov 15</div>
              <div className="event-title">Committee Meeting</div>
            </div>
            <div className="calendar-event">
              <div className="event-date">Nov 20</div>
              <div className="event-title">IRB Review</div>
            </div>
            <div className="calendar-event">
              <div className="event-date">Dec 1</div>
              <div className="event-title">Progress Report Due</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;