import React, { useState, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { personalEventsByOwner, listGlobalEvents } from '../graphql/queries';
import DissertationFoldersTab from './DissertationFoldersTab';
import { useNavigate } from 'react-router-dom';
import { FiLink, FiClipboard } from 'react-icons/fi';
import './LDPPage.css';

const client = generateClient();

const SYSTEM_EVENTS = [
  { id: 's1', title: 'Committee Check-In',                  date: '2025-02-03', time: '2:00 PM',  scope: 'Committee' },
  { id: 's2', title: 'Dissertation Webinar – Spring Series', date: '2025-02-05', time: '6:00 PM',  scope: 'System'    },
  { id: 's3', title: 'EDD Community Meeting',               date: '2025-02-10', time: '10:00 AM', scope: 'Group'     },
  { id: 's4', title: 'IRB Submission Deadline',             date: '2025-02-15', time: 'All Day',  scope: 'Deadline'  },
  { id: 's5', title: 'Chapter 2 Feedback Due',              date: '2025-02-17', time: 'All Day',  scope: 'Deadline'  },
  { id: 's6', title: 'Research Methods Study Group',        date: '2025-02-18', time: '4:00 PM',  scope: 'Group'     },
  { id: 's7', title: 'AI Skills Lab Workshop',              date: '2025-02-20', time: '1:00 PM',  scope: 'System'    },
  { id: 's8', title: 'Dissertation Defense Prep',           date: '2025-03-01', time: '11:00 AM', scope: 'Committee' },
];

const SCOPE_STYLE = {
  Committee: { background: '#e8d5f5', color: '#552B9A' },
  System:    { background: '#cce5ff', color: '#004085' },
  Group:     { background: '#d4edda', color: '#155724' },
  Deadline:  { background: '#f8d7da', color: '#721c24' },
  Personal:  { background: '#fff3cd', color: '#856404' },
  Global:    { background: '#fde8d8', color: '#7c3000' },
};

function daysFromNow(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + 'T00:00:00');
  return Math.round((d - today) / 86400000);
}

function dayLabel(n) {
  if (n === 0) return 'Today';
  if (n === 1) return 'Tomorrow';
  if (n <= 7)  return `In ${n} days`;
  return new Date(Date.now() + n * 86400000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const committeeMembers = [
  { name: 'Dr. Sarah Martinez', role: 'Chair', email: 'smartinez@gcu.edu', avatar: 'SM' },
  { name: 'Dr. James Chen', role: 'Methodologist', email: 'jchen@gcu.edu', avatar: 'JC' },
  { name: 'Dr. Lisa Park', role: 'Content Expert', email: 'lpark@gcu.edu', avatar: 'LP' },
  { name: 'Dr. Robert Patel', role: 'Research Consultant', email: 'rpatel@gcu.edu', avatar: 'RP' },
];

const importantLinks = [
  { label: 'IRB Research Center', url: '#' },
  { label: 'Milestone Guide v.10', url: '#' },
  { label: 'Peer Review Portal', url: '#' },
  { label: 'AI Skills Lab', url: '#' },
  { label: 'GCU Library', url: '#' },
  { label: 'Quant Companion Guide', url: '#' },
  { label: 'Qual Companion Guide', url: '#' },
];

const TABS = ['overview', 'committees', 'folders', 'calendar'];
const TAB_LABELS = { folders: 'Dissertation Folders' };

export default function LDPPage({ user }) {
  const [tab, setTab] = useState('overview');

  return (
    <div>
      <div className="page-header">
        <h1>Leadership Development Program</h1>
        <p>Manage your dissertation journey, committee, and submissions</p>
      </div>

      <div className="ldp-tabs">
        {TABS.map(t => (
          <button
            key={t}
            className={`ldp-tab-btn${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >
            {TAB_LABELS[t] || t}
          </button>
        ))}
      </div>

      <div className="ldp-layout">
        {/* Main content */}
        <div>
          {tab === 'overview' && (
            <div className="ic-card">
              <h2>Program Overview</h2>
              <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: 1.6 }}>
                The Leadership Development Program supports doctoral students through every stage of
                their dissertation journey — from proposal through defense. Your committee, resources,
                and submission tools are all accessible here.
              </p>
              <div className="ldp-overview-actions">
                <button className="btn-purple">View My Submissions</button>
                <button className="btn-outline">Contact Committee</button>
              </div>

              <div style={{ marginTop: '1.5rem', background: '#f7f3fa', borderRadius: '8px', padding: '1rem 1.25rem', border: '1px solid #e0d4eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <strong style={{ color: '#552B9A', fontSize: '0.9rem' }}><FiClipboard size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />Program of Study</strong>
                  <span style={{ fontSize: '0.72rem', color: '#888', background: '#eee', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>Read Only</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#555' }}>EDD – Doctor of Education in Organizational Leadership</p>
                <p style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.25rem' }}>Expected Completion: Spring 2026 · Milestone: Dissertation Phase</p>
              </div>
            </div>
          )}

          {tab === 'committees' && (
            <div className="ic-card">
              <h2>Your Committee</h2>
              <div className="ldp-committee-grid">
                {committeeMembers.map(m => (
                  <div key={m.name} style={{ background: '#f7f3fa', borderRadius: '8px', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#552B9A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0 }}>
                        {m.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#222' }}>{m.name}</div>
                        <div style={{ fontSize: '0.76rem', color: '#552B9A', fontWeight: 500 }}>{m.role}</div>
                      </div>
                    </div>
                    <a href={`mailto:${m.email}`} style={{ fontSize: '0.76rem', color: '#552B9A', textDecoration: 'none' }}>{m.email}</a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'folders' && (
            <div className="ic-card">
              <h2>Dissertation Folders</h2>
              <DissertationFoldersTab user={user} />
            </div>
          )}

          {tab === 'calendar' && (
            <UpcomingEvents user={user} />
          )}
        </div>

        {/* Important Links */}
        <div className="ic-card ldp-links-card">
          <h2><FiLink size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />Important Links</h2>
          <ul style={{ listStyle: 'none', margin: 0 }}>
            {importantLinks.map(link => (
              <li key={link.label} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <a href={link.url} style={{ display: 'block', padding: '0.5rem 0', fontSize: '0.83rem', color: '#333', textDecoration: 'none', transition: 'color 0.12s' }}
                  onMouseEnter={e => (e.target.style.color = '#552B9A')}
                  onMouseLeave={e => (e.target.style.color = '#333')}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function UpcomingEvents({ user }) {
  const navigate = useNavigate();
  const owner = user?.username ?? user?.userId ?? 'guest';
  const [personalEvents, setPersonalEvents] = useState([]);
  const [globalEvents,   setGlobalEvents]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [personal, global] = await Promise.all([
        client.graphql({ query: personalEventsByOwner, variables: { owner } }),
        client.graphql({ query: listGlobalEvents }),
      ]);
      setPersonalEvents(personal.data.personalEventsByOwner.items);
      setGlobalEvents(global.data.listGlobalEvents.items);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, [owner]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const upcoming = [
    ...SYSTEM_EVENTS.map(e => ({ ...e, scope: e.scope })),
    ...globalEvents.map(e  => ({ ...e, scope: 'Global' })),
    ...personalEvents.map(e => ({ ...e, scope: 'Personal' })),
  ]
    .map(e => ({ ...e, daysAway: daysFromNow(e.date) }))
    .filter(e => e.daysAway >= 0)
    .sort((a, b) => a.daysAway - b.daysAway)
    .slice(0, 10);

  return (
    <div className="ic-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Upcoming Events</h2>
        <button className="btn-outline" onClick={() => navigate('/calendar')}
          style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}>
          Open Full Calendar
        </button>
      </div>

      {loading ? (
        <p style={{ fontSize: '0.85rem', color: '#888' }}>Loading events…</p>
      ) : upcoming.length === 0 ? (
        <p style={{ fontSize: '0.85rem', color: '#888' }}>No upcoming events.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {upcoming.map(ev => {
            const badge = SCOPE_STYLE[ev.scope] ?? {};
            const isToday    = ev.daysAway === 0;
            const isTomorrow = ev.daysAway === 1;
            const isSoon     = ev.daysAway <= 3;
            return (
              <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.85rem', background: isToday ? '#fdf9ff' : '#fafafa', borderRadius: '7px', border: `1px solid ${isToday ? '#d4c5f0' : '#f0f0f0'}`, flexWrap: 'wrap' }}>
                <div style={{ minWidth: 72, textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: isToday ? '#552B9A' : isTomorrow ? '#856404' : isSoon ? '#721c24' : '#aaa', letterSpacing: '0.3px' }}>
                    {dayLabel(ev.daysAway)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#bbb' }}>
                    {new Date(ev.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</div>
                  {ev.time && <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.1rem' }}>{ev.time}{ev.location ? ` · ${ev.location}` : ''}</div>}
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.55rem', borderRadius: '10px', flexShrink: 0, ...badge }}>
                  {ev.scope}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
