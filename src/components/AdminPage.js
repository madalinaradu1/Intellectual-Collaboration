import React, { useState } from 'react';

const users = [
  { id: 1, name: 'Sarah K.', email: 'sarah.k@gcu.edu', role: 'Member', group: 'EDD Community', status: 'Active' },
  { id: 2, name: 'Dr. Martinez', email: 'smartinez@gcu.edu', role: 'Admin', group: 'System', status: 'Active' },
  { id: 3, name: 'James L.', email: 'james.l@gcu.edu', role: 'Officer', group: 'DBA Community', status: 'Active' },
  { id: 4, name: 'Maria G.', email: 'maria.g@gcu.edu', role: 'Member', group: 'PHD Community', status: 'Active' },
  { id: 5, name: 'David R.', email: 'david.r@gcu.edu', role: 'Member', group: 'DNP Community', status: 'Inactive' },
  { id: 6, name: 'Emily T.', email: 'emily.t@gcu.edu', role: 'Group Admin', group: 'EDD Community', status: 'Active' },
];

const metrics = [
  { label: 'Total Users', value: '50,214', change: '+312 this week' },
  { label: 'Active Groups', value: '47', change: '+2 this month' },
  { label: 'Forum Posts (30d)', value: '1,843', change: '+18% vs last month' },
  { label: 'Content Items', value: '286', change: '+12 this week' },
];

const auditLogs = [
  { actor: 'Dr. Martinez', action: 'Approved submission', entity: 'Chapter 2 – Lit Review', time: 'Jan 30, 2025 – 2:15 PM' },
  { actor: 'Emily T.', action: 'Added member', entity: 'Sarah K. → EDD Community', time: 'Jan 29, 2025 – 10:42 AM' },
  { actor: 'System', action: 'Email notification sent', entity: 'IRB Deadline Reminder', time: 'Jan 28, 2025 – 8:00 AM' },
  { actor: 'James L.', action: 'Uploaded content', entity: 'Research Methods Guide v3', time: 'Jan 27, 2025 – 3:30 PM' },
  { actor: 'Dr. Chen', action: 'Role changed', entity: 'David R. → Inactive', time: 'Jan 25, 2025 – 11:05 AM' },
];

const ROLE_BADGE = {
  'Admin':       { background: '#552B9A', color: '#fff' },
  'Group Admin': { background: '#e8d5f5', color: '#552B9A' },
  'Officer':     { background: '#cce5ff', color: '#004085' },
  'Member':      { background: '#eee',   color: '#555' },
};

function roleBadge(role) {
  return ROLE_BADGE[role] ?? ROLE_BADGE['Member'];
}

export default function AdminPage() {
  const [tab, setTab] = useState('users');

  return (
    <div>
      <div className="page-header">
        <h1>Admin Panel</h1>
        <p>User management, content moderation, reports, and audit logs</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
        {[
          { key: 'users', label: 'Users' },
          { key: 'groups', label: 'Groups' },
          { key: 'reports', label: 'Reports' },
          { key: 'audit', label: 'Audit Logs' },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            background: tab === t.key ? '#552B9A' : 'transparent',
            color: tab === t.key ? '#fff' : '#555',
            border: 'none', padding: '0.5rem 1rem', borderRadius: '5px',
            cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* USERS tab */}
      {tab === 'users' && (
        <div className="ic-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>User Management</h2>
            <button className="btn-purple">+ Add User</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                {['Name', 'Email', 'Role', 'Group', 'Status'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.6rem', color: '#552B9A', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.6rem 0.6rem', color: '#222', fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: '0.6rem 0.6rem', color: '#666' }}>{u.email}</td>
                  <td style={{ padding: '0.6rem 0.6rem' }}>
                    <span style={{ ...roleBadge(u.role), padding: '0.18rem 0.5rem', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 600 }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '0.6rem 0.6rem', color: '#555' }}>{u.group}</td>
                  <td style={{ padding: '0.6rem 0.6rem' }}>
                    <span className={`badge ${u.status === 'Active' ? 'badge-active' : 'badge-pending'}`}>{u.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* GROUPS tab */}
      {tab === 'groups' && (
        <div className="ic-card">
          <h2>Group Management</h2>
          <p style={{ fontSize: '0.88rem', color: '#666' }}>Manage group settings, membership, and moderation from here. (Full implementation pending backend.)</p>
          <button className="btn-purple" style={{ marginTop: '0.75rem' }}>+ Create Group</button>
        </div>
      )}

      {/* REPORTS tab */}
      {tab === 'reports' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {metrics.map((m) => (
              <div key={m.label} className="ic-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.25rem' }}>{m.label}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#552B9A' }}>{m.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#28a745' }}>{m.change}</div>
              </div>
            ))}
          </div>
          <div className="ic-card">
            <h2>Engagement Overview</h2>
            <p style={{ fontSize: '0.88rem', color: '#666' }}>Detailed charts and dashboards will be powered by QuickSight once the backend reporting pipeline is live.</p>
          </div>
        </div>
      )}

      {/* AUDIT tab */}
      {tab === 'audit' && (
        <div className="ic-card">
          <h2>Audit Logs</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                {['Actor', 'Action', 'Entity', 'Time'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.6rem', color: '#552B9A', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.55rem 0.6rem', color: '#222', fontWeight: 500 }}>{log.actor}</td>
                  <td style={{ padding: '0.55rem 0.6rem', color: '#555' }}>{log.action}</td>
                  <td style={{ padding: '0.55rem 0.6rem', color: '#552B9A' }}>{log.entity}</td>
                  <td style={{ padding: '0.55rem 0.6rem', color: '#888', fontSize: '0.76rem' }}>{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}