import React, { useState } from 'react';

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

const dissertationFolders = [
  { name: 'Chapter 1 – Introduction', status: 'Approved', files: 3 },
  { name: 'Chapter 2 – Literature Review', status: 'In Review', files: 2 },
  { name: 'Chapter 3 – Methodology', status: 'Draft', files: 1 },
  { name: 'Chapter 4 – Results', status: 'Draft', files: 0 },
  { name: 'Chapter 5 – Discussion', status: 'Not Started', files: 0 },
];

const STATUS_CLASS = {
  'Approved': 'badge badge-approved',
  'In Review': 'badge badge-review',
};
function statusClass(s) { return STATUS_CLASS[s] ?? 'badge badge-pending'; }

export default function LDPPage() {
  const [tab, setTab] = useState('overview');

  return (
    <div>
      <div className="page-header">
        <h1>Leadership Development Program</h1>
        <p>Manage your dissertation journey, committee, and submissions</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
        {['overview', 'committees', 'folders', 'calendar'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: tab === t ? '#552B9A' : 'transparent',
              color: tab === t ? '#fff' : '#555',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'capitalize',
            }}
          >
            {t === 'folders' ? 'Dissertation Folders' : t}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Main content area */}
        <div>
          {tab === 'overview' && (
            <div className="ic-card">
              <h2>Program Overview</h2>
              <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: 1.6 }}>
                The Leadership Development Program supports doctoral students through every stage of
                their dissertation journey — from proposal through defense. Your committee, resources,
                and submission tools are all accessible here.
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                <button className="btn-purple">View My Submissions</button>
                <button className="btn-outline">Contact Committee</button>
              </div>

              {/* Program of Study widget — read only */}
              <div style={{ marginTop: '1.5rem', background: '#f7f3fa', borderRadius: '8px', padding: '1rem 1.25rem', border: '1px solid #e0d4eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#552B9A', fontSize: '0.9rem' }}>📋 Program of Study</strong>
                  <span style={{ fontSize: '0.72rem', color: '#888', background: '#eee', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>Read Only</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#555' }}>EDD – Doctor of Education in Organizational Leadership</p>
                <p style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.25rem' }}>Expected Completion: Spring 2026 &nbsp;|&nbsp; Milestone: Dissertation Phase</p>
              </div>
            </div>
          )}

          {tab === 'committees' && (
            <div className="ic-card">
              <h2>Your Committee</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {committeeMembers.map((m) => (
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
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem 0', color: '#552B9A' }}>Folder</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem 0', color: '#552B9A' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem 0', color: '#552B9A' }}>Files</th>
                  </tr>
                </thead>
                <tbody>
                  {dissertationFolders.map((f) => (
                    <tr key={f.name} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '0.6rem 0', color: '#333' }}>{f.name}</td>
                      <td style={{ padding: '0.6rem 0' }}><span className={statusClass(f.status)}>{f.status}</span></td>
                      <td style={{ padding: '0.6rem 0', color: '#888' }}>{f.files}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'calendar' && (
            <div className="ic-card">
              <h2>Committee Calendar</h2>
              <p style={{ fontSize: '0.88rem', color: '#666', marginTop: '0.25rem' }}>Upcoming deadlines and meetings for your dissertation committee.</p>
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                  { title: 'Chapter 2 Feedback Due', date: 'Feb 7, 2025', type: 'Deadline' },
                  { title: 'Committee Check-In', date: 'Feb 12, 2025', type: 'Meeting' },
                  { title: 'IRB Amendment Deadline', date: 'Feb 15, 2025', type: 'Deadline' },
                  { title: 'Dissertation Defense Prep', date: 'Mar 1, 2025', type: 'Meeting' },
                ].map((e, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f7f3fa', borderRadius: '7px', padding: '0.6rem 0.85rem' }}>
                    <span style={{ fontSize: '0.72rem', background: e.type === 'Deadline' ? '#f8d7da' : '#cce5ff', color: e.type === 'Deadline' ? '#721c24' : '#004085', padding: '0.2rem 0.5rem', borderRadius: '10px', fontWeight: 600, whiteSpace: 'nowrap' }}>{e.type}</span>
                    <span style={{ fontSize: '0.85rem', color: '#222', flex: 1 }}>{e.title}</span>
                    <span style={{ fontSize: '0.78rem', color: '#888' }}>{e.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right rail – Important Links */}
        <div className="ic-card" style={{ position: 'sticky', top: '1rem' }}>
          <h2>📎 Important Links</h2>
          <ul style={{ listStyle: 'none', margin: 0 }}>
            {importantLinks.map((link) => (
              <li key={link.label} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <a href={link.url} style={{ display: 'block', padding: '0.5rem 0', fontSize: '0.83rem', color: '#333', textDecoration: 'none', transition: 'color 0.12s' }}
                  onMouseEnter={(e) => (e.target.style.color = '#552B9A')}
                  onMouseLeave={(e) => (e.target.style.color = '#333')}
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