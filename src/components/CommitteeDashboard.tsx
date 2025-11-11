import React from 'react';
import './CommitteeDashboard.css';

const CommitteeDashboard: React.FC = () => {
  return (
    <div className="committee-dashboard">
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="left-column">
          <div className="sidebar">
            <h3>Committee Tools</h3>
            <ul className="sidebar-menu">
              <li><a href="#my-students">👥 My Students</a></li>
              <li><a href="#review-queue">📝 Review Queue</a></li>
              <li><a href="#meetings">📅 Meetings</a></li>
              <li><a href="#resources">📚 Resources</a></li>
              <li><a href="#guidelines">📋 Guidelines</a></li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-dashboard">
          <h2>Committee Member Dashboard</h2>
          
          {/* My Role */}
          <div className="widget role-widget">
            <h3>👤 My Committee Role</h3>
            <div className="role-info">
              <div className="role-badge content-expert">Content Expert</div>
              <p>You are serving as a Content Expert for dissertation committees. Your expertise in the subject matter helps ensure academic rigor and relevance.</p>
            </div>
          </div>

          {/* Assigned Students */}
          <div className="widget students-widget">
            <h3>👥 Assigned Students</h3>
            <div className="student-list">
              <div className="student-card">
                <div className="student-header">
                  <h4>Sarah Johnson</h4>
                  <span className="dissertation-stage proposal">Proposal Stage</span>
                </div>
                <p className="dissertation-title">Educational Technology Impact on Student Engagement</p>
                <div className="committee-info">
                  <span><strong>Chair:</strong> Dr. Michael Smith</span>
                  <span><strong>Methodologist:</strong> Dr. Jane Wilson</span>
                </div>
                <div className="student-actions">
                  <button className="review-btn">📝 Review Documents</button>
                  <button className="message-btn">💬 Send Message</button>
                </div>
              </div>

              <div className="student-card">
                <div className="student-header">
                  <h4>Michael Chen</h4>
                  <span className="dissertation-stage research">Research Phase</span>
                </div>
                <p className="dissertation-title">Leadership Strategies in Healthcare Organizations</p>
                <div className="committee-info">
                  <span><strong>Chair:</strong> Dr. Emily Rodriguez</span>
                  <span><strong>Methodologist:</strong> Dr. Robert Brown</span>
                </div>
                <div className="student-actions">
                  <button className="review-btn">📝 Review Documents</button>
                  <button className="message-btn">💬 Send Message</button>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="widget reviews-widget">
            <h3>📝 Pending Reviews</h3>
            <div className="review-list">
              <div className="review-item urgent">
                <div className="review-header">
                  <h4>Chapter 2: Literature Review</h4>
                  <span className="due-date">Due: Nov 15, 2025</span>
                </div>
                <p><strong>Student:</strong> Sarah Johnson</p>
                <p><strong>Submitted:</strong> Nov 10, 2025</p>
                <div className="review-actions">
                  <button className="review-now-btn">📖 Review Now</button>
                  <button className="download-btn">📥 Download</button>
                </div>
              </div>

              <div className="review-item">
                <div className="review-header">
                  <h4>Research Methodology Draft</h4>
                  <span className="due-date">Due: Nov 20, 2025</span>
                </div>
                <p><strong>Student:</strong> Michael Chen</p>
                <p><strong>Submitted:</strong> Nov 12, 2025</p>
                <div className="review-actions">
                  <button className="review-now-btn">📖 Review Now</button>
                  <button className="download-btn">📥 Download</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Quick Stats */}
          <div className="widget stats-widget">
            <h3>📊 My Statistics</h3>
            <div className="stat-item">
              <span className="stat-number">2</span>
              <span className="stat-label">Active Students</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">2</span>
              <span className="stat-label">Pending Reviews</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">1</span>
              <span className="stat-label">Upcoming Meetings</span>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="widget calendar-widget">
            <h3>📅 Upcoming Events</h3>
            <div className="calendar-event">
              <div className="event-date">Nov 18</div>
              <div className="event-info">
                <div className="event-title">Committee Meeting</div>
                <div className="event-student">Sarah Johnson</div>
              </div>
            </div>
            <div className="calendar-event">
              <div className="event-date">Nov 25</div>
              <div className="event-info">
                <div className="event-title">Progress Review</div>
                <div className="event-student">Michael Chen</div>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="widget guidelines-widget">
            <h3>📋 Committee Guidelines</h3>
            <ul className="guidelines-list">
              <li>Review documents within 5 business days</li>
              <li>Provide constructive, specific feedback</li>
              <li>Attend scheduled committee meetings</li>
              <li>Maintain confidentiality of student work</li>
              <li>Contact chair for any concerns</li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="widget support-widget">
            <h3>🆘 Need Help?</h3>
            <p>Contact the dissertation office for technical support or committee questions.</p>
            <button className="support-btn">📧 Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeDashboard;