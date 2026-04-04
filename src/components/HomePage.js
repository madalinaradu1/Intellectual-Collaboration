import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

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

const MISSION_TEXT = 
  'The Intellectual Collaboration platform is dedicated to fostering a supportive, ' +
  'connected community for doctoral students, faculty, and staff at Grand Canyon University. ' +
  'Our mission is to provide the tools, resources, and connections necessary for academic excellence ' +
  'and professional growth throughout your doctoral journey.';

function getScopeClass(scope) {
  const scopeMap = {
    'Committee': 'scope-committee',
    'System': 'scope-system',
    'Group': 'scope-group',
    'Deadline': 'scope-deadline',
  };
  return scopeMap[scope] || '';
}

function AnnouncementItem({ announcement }) {
  return (
    <li className="announcement-item">
      <span className={`ann-dot ann-${announcement.type}`} aria-hidden="true" />
      <div className="ann-content">
        <span className="ann-title">{announcement.title}</span>
        <span className="ann-date">{announcement.date}</span>
      </div>
    </li>
  );
}

function ActivityItem({ activity }) {
  return (
    <li className="activity-item">
      <span className="activity-avatar" aria-hidden="true">
        {activity.user.charAt(0)}
      </span>
      <div className="activity-text">
        <span className="activity-main">
          <strong>{activity.user}</strong> {activity.action}{' '}
          <em>{activity.target}</em>
        </span>
        <span className="activity-time">{activity.time}</span>
      </div>
    </li>
  );
}

function EventItem({ event }) {
  const [month, day] = event.date.split(' ');
  
  return (
    <li className="event-item">
      <div className="event-date-box">
        <span className="event-month">{month}</span>
        <span className="event-day">{day}</span>
      </div>
      <div className="event-details">
        <span className="event-title">{event.title}</span>
        <span className="event-meta">
          {event.time}
          <span className={`event-scope ${getScopeClass(event.scope)}`}>
            {event.scope}
          </span>
        </span>
      </div>
    </li>
  );
}

export default function HomePage({ user }) {
  const name = user?.attributes?.name?.split('@')[0];
  const userDisplayName = name ? `, ${name}` : '';

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-text">
          <h1>Welcome back{userDisplayName}</h1>
          <p>{MISSION_TEXT}</p>
        </div>
      </section>

      <div className="home-grid">
        <aside className="home-col home-col-left">
          <div className="ic-card">
            <h2>📢 Announcements</h2>
            <ul className="announcement-list">
              {announcements.map((announcement) => (
                <AnnouncementItem 
                  key={announcement.id} 
                  announcement={announcement} 
                />
              ))}
            </ul>
          </div>

          <div className="ic-card">
            <h2>⚡ Quick Links</h2>
            <div className="quick-links-grid" role="list">
              {quickLinks.map((link) => (
                <Link 
                  key={link.label} 
                  to={link.path} 
                  className="quick-link-item"
                  role="listitem"
                >
                  <span className="ql-icon" aria-hidden="true">{link.icon}</span>
                  <span className="ql-label">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <main className="home-col home-col-center">
          <div className="ic-card">
            <h2>🕐 Recent Activity</h2>
            <ul className="activity-list">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </ul>
            <Link 
              to="/forums" 
              className="btn-outline" 
              style={{ marginTop: '0.75rem', display: 'inline-block' }}
            >
              View All Activity
            </Link>
          </div>
        </main>

        <aside className="home-col home-col-right">
          <div className="ic-card">
            <h2>📅 Upcoming Events</h2>
            <ul className="event-list">
              {calendarEvents.map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
            </ul>
            <Link 
              to="/calendar" 
              className="btn-outline" 
              style={{ marginTop: '0.75rem', display: 'inline-block' }}
            >
              Full Calendar
            </Link>
          </div>

          <div className="ic-card">
            <h2>🎉 Good News</h2>
            <p className="good-news-text">
              Congratulations to the EDD Class of 2024 on achieving a 94% dissertation completion rate —
              the highest in department history!
            </p>
            <Link 
              to="/media" 
              className="btn-purple" 
              style={{ marginTop: '0.75rem', display: 'inline-block' }}
            >
              Watch Alumni Stories
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}