import React from 'react';
import './FacultyDashboard.css';

const FacultyDashboard: React.FC = () => {
  return (
    <div className="faculty-dashboard">
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="left-column">
          <div className="sidebar">
            <h3>Faculty Tools</h3>
            <ul className="sidebar-menu">
              <li><a href="#my-students">👥 My Students</a></li>
              <li><a href="#committee-assignments">📋 Committee Assignments</a></li>
              <li><a href="#review-queue">📝 Review Queue</a></li>
              <li><a href="#resources">📚 Faculty Resources</a></li>
              <li><a href="#reports">📊 Reports</a></li>
              <li><a href="#calendar">📅 Calendar</a></li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-dashboard">
          <h2>Faculty Dashboard</h2>
          
          {/* Students Overview */}
          <div className="widget students-widget">
            <h3>👥 My Students</h3>
            <div className="student-list">
              <div className="student-item">
                <div className="student-info">
                  <h4>Sarah Johnson</h4>
                  <p>Dissertation: Educational Technology Impact</p>
                  <span className="status proposal">Proposal Review</span>
                </div>
                <div className="student-actions">
                  <button>📝 Review</button>
                  <button>💬 Message</button>
                </div>
              </div>
              <div className="student-item">
                <div className="student-info">
                  <h4>Michael Chen</h4>
                  <p>Dissertation: Leadership in Healthcare</p>
                  <span className="status defense">Defense Prep</span>
                </div>
                <div className="student-actions">
                  <button>📝 Review</button>
                  <button>💬 Message</button>
                </div>
              </div>
              <div className="student-item">
                <div className="student-info">
                  <h4>Emily Rodriguez</h4>
                  <p>Dissertation: Social Media Psychology</p>
                  <span className="status data">Data Collection</span>
                </div>
                <div className="student-actions">
                  <button>📝 Review</button>
                  <button>💬 Message</button>
                </div>
              </div>
            </div>
          </div>

          {/* Review Queue */}
          <div className="widget review-widget">
            <h3>📝 Pending Reviews</h3>
            <div className="review-item urgent">
              <div className="review-info">
                <h4>Chapter 3 - Methodology</h4>
                <p>Student: Sarah Johnson</p>
                <span className="due-date">Due: Nov 15, 2025</span>
              </div>
              <button className="review-btn">Review Now</button>
            </div>
            <div className="review-item">
              <div className="review-info">
                <h4>Proposal Draft</h4>
                <p>Student: David Wilson</p>
                <span className="due-date">Due: Nov 20, 2025</span>
              </div>
              <button className="review-btn">Review Now</button>
            </div>
            <div className="review-item">
              <div className="review-info">
                <h4>IRB Application</h4>
                <p>Student: Lisa Park</p>
                <span className="due-date">Due: Nov 25, 2025</span>
              </div>
              <button className="review-btn">Review Now</button>
            </div>
          </div>

          {/* Committee Assignments */}
          <div className="widget committee-widget">
            <h3>📋 Committee Roles</h3>
            <div className="committee-grid">
              <div className="committee-card chair">
                <h4>Committee Chair</h4>
                <span className="count">3 Students</span>
                <ul>
                  <li>Sarah Johnson</li>
                  <li>Michael Chen</li>
                  <li>Emily Rodriguez</li>
                </ul>
              </div>
              <div className="committee-card methodologist">
                <h4>Methodologist</h4>
                <span className="count">2 Students</span>
                <ul>
                  <li>David Wilson</li>
                  <li>Lisa Park</li>
                </ul>
              </div>
              <div className="committee-card content">
                <h4>Content Expert</h4>
                <span className="count">1 Student</span>
                <ul>
                  <li>James Brown</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Quick Stats */}
          <div className="widget stats-widget">
            <h3>📊 Quick Stats</h3>
            <div className="stat-item">
              <span className="stat-number">6</span>
              <span className="stat-label">Active Students</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">3</span>
              <span className="stat-label">Pending Reviews</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">2</span>
              <span className="stat-label">Upcoming Defenses</span>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="widget calendar-widget">
            <h3>📅 Upcoming Events</h3>
            <div className="calendar-event">
              <div className="event-date">Nov 15</div>
              <div className="event-title">Sarah's Committee Meeting</div>
            </div>
            <div className="calendar-event">
              <div className="event-date">Nov 18</div>
              <div className="event-title">Michael's Defense</div>
            </div>
            <div className="calendar-event">
              <div className="event-date">Nov 22</div>
              <div className="event-title">Faculty Meeting</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="widget activity-widget">
            <h3>📋 Recent Activity</h3>
            <div className="activity-item">
              <span className="activity-time">1 hour ago</span>
              <span className="activity-text">Reviewed Sarah's Chapter 2</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">3 hours ago</span>
              <span className="activity-text">Approved Michael's methodology</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">1 day ago</span>
              <span className="activity-text">Committee meeting scheduled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;