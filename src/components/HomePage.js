import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

/* ── Mock data (replace with GraphQL queries when backend is ready) ── */
const announcements = [
  { id: 1, title: 'Spring 2025 Dissertation Webinars Now Scheduled', date: 'Jan 28, 2025', type: 'event' },
  { id: 2, title: 'New AI Skills Lab Resources Available', date: 'Jan 22, 2025', type: 'resource' },
  { id: 3, title: 'IRB Submission Deadline – Feb 15', date: 'Jan 20, 2025', type: 'deadline' },
  { id: 4, title: 'Milestone Guide v.10 Released', date: 'Jan 15, 2025', type: 'update' },
];

const quickLinks = [
  { label: 'AI Skills Lab', path: '/content', icon: '🤖' },
  { label: 'GCU Library', path: '/content', icon: '📚' },
  { label: 'Commencement', path: '/content', icon: '🎓' },
  { label: 'MPM Portal', path: '/content', icon: '📝' },
  { label: 'Forums', path: '/forums', icon: '💬' },
  { label: 'Calendar', path: '/calendar', icon: '📅' },
];

const recentActivity = [
  { id: 1, user: 'Dr. Martinez', action: 'commented on', target: 'Dissertation Chapter 3 Review', time: '2 hours ago' },
  { id: 2, user: 'You', action: 'uploaded', target: 'Proposal Draft v2.pdf', time: '5 hours ago' },
  { id: 3, user: 'Dr. Chen', action: 'approved', target: 'IRB Amendment Request', time: '1 day ago' },
  { id: 4, user: 'Sarah K.', action: 'started a thread in', target: 'EDD Community Forum', time: '1 day ago' },
  { id: 5, user: 'Dr. Patel', action: 'scheduled', target: 'Committee Meeting – Feb 3', time: '2 days ago' },
];

const calendarEvents = [
  { id: 1, title: 'Committee Meeting', date: 'Feb 3', time: '2:00 PM', scope: 'Committee' },
  { id: 2, title: 'Dissertation Webinar', date: 'Feb 5', time: '6:00 PM', scope: 'System' },
  { id: 3, title: 'IRB Submission Deadline', date: 'Feb 15', time: 'All Day', scope: 'Deadline' },
  { id: 4, title: 'EDD Community Meeting', date: 'Feb 18', time: '10:00 AM', scope: 'Group' },
];

/* ── Mission statement ── */
const missionText =
  'The Intellectual Collaboration platform is dedicated to fostering a supportive, ' +
  'connected community for doctoral students, faculty, and staff at Grand Canyon University. ' +
  'Our mission is to provide the tools, resources, and connections necessary for academic excellence ' +
  'and professional growth throughout your doctoral journey.';

/* ── Scope badge colors ── */
function scopeClass(scope) {
  switch (scope) {
    case 'Committee': return 'scope-committee';
    case 'System':    return 'scope-system';
    case 'Group':     return 'scope-group';
    case 'Deadline':  return 'scope-deadline';
    default:          return '';
  }
}

export default function HomePage({ user }) {
  return (
    <div className="home-page">

      {/* Hero / welcome banner */}
      <div className="home-hero">
        <div className="hero-text">
          <h1>Welcome back{user?.attributes?.name ? `, ${user.attributes.name.split('@')[0]}` : ''}</h1>
          <p>{missionText}</p>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="home-grid">

        {/* LEFT – Announcements + Quick Links */}
        <div className="home-col home-col-left">

          <div className="ic-card">
            <h2>📢 Announcements</h2>
            <ul className="announcement-list">
              {announcements.map((a) => (
                <li key={a.id} className="announcement-item">
                  <span className={`ann-dot ann-${a.type}`} />
                  <div className="ann-content">
                    <span className="ann-title">{a.title}</span>
                    <span className="ann-date">{a.date}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="ic-card">
            <h2>⚡ Quick Links</h2>
            <div className="quick-links-grid">
              {quickLinks.map((ql) => (
                <Link key={ql.label} to={ql.path} className="quick-link-item">
                  <span className="ql-icon">{ql.icon}</span>
                  <span className="ql-label">{ql.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER – Recent Activity */}
        <div className="home-col home-col-center">
          <div className="ic-card">
            <h2>🕐 Recent Activity</h2>
            <ul className="activity-list">
              {recentActivity.map((item) => (
                <li key={item.id} className="activity-item">
                  <span className="activity-avatar">{item.user.charAt(0)}</span>
                  <div className="activity-text">
                    <span className="activity-main">
                      <strong>{item.user}</strong> {item.action}{' '}
                      <em>{item.target}</em>
                    </span>
                    <span className="activity-time">{item.time}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/forums" className="btn-outline" style={{ marginTop: '0.75rem', display: 'inline-block' }}>
              View All Activity
            </Link>
          </div>
        </div>

        {/* RIGHT – Calendar + Good News */}
        <div className="home-col home-col-right">
          <div className="ic-card">
            <h2>📅 Upcoming Events</h2>
            <ul className="event-list">
              {calendarEvents.map((ev) => (
                <li key={ev.id} className="event-item">
                  <div className="event-date-box">
                    <span className="event-month">{ev.date.split(' ')[0]}</span>
                    <span className="event-day">{ev.date.split(' ')[1]}</span>
                  </div>
                  <div className="event-details">
                    <span className="event-title">{ev.title}</span>
                    <span className="event-meta">
                      {ev.time}
                      <span className={`event-scope ${scopeClass(ev.scope)}`}>{ev.scope}</span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/calendar" className="btn-outline" style={{ marginTop: '0.75rem', display: 'inline-block' }}>
              Full Calendar
            </Link>
          </div>

          <div className="ic-card">
            <h2>🎉 Good News</h2>
            <p className="good-news-text">
              Congratulations to the EDD Class of 2024 on achieving a 94% dissertation completion rate —
              the highest in department history!
            </p>
            <Link to="/media" className="btn-purple" style={{ marginTop: '0.75rem', display: 'inline-block' }}>
              Watch Alumni Stories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}