// Only the Calendar tab makes live GraphQL calls. The rest use static mock data
// until the backend management APIs are implemented.

import React, { useState, useEffect, useCallback } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { generateClient } from 'aws-amplify/api';
import { listGlobalEvents } from '../graphql/queries';
import { createGlobalEvent, updateGlobalEvent, deleteGlobalEvent } from '../graphql/mutations';

const client = generateClient();

// ── Static mock data ──────────────────────────────────────────────────────────

const USERS = [
  { id: 1, name: 'Sarah K.',     email: 'sarah.k@gcu.edu',    role: 'Member',      group: 'EDD Community', status: 'Active'   },
  { id: 2, name: 'Dr. Martinez', email: 'smartinez@gcu.edu',  role: 'Admin',       group: 'System',        status: 'Active'   },
  { id: 3, name: 'James L.',     email: 'james.l@gcu.edu',    role: 'Officer',     group: 'DBA Community', status: 'Active'   },
  { id: 4, name: 'Maria G.',     email: 'maria.g@gcu.edu',    role: 'Member',      group: 'PHD Community', status: 'Active'   },
  { id: 5, name: 'David R.',     email: 'david.r@gcu.edu',    role: 'Member',      group: 'DNP Community', status: 'Inactive' },
  { id: 6, name: 'Emily T.',     email: 'emily.t@gcu.edu',    role: 'Group Admin', group: 'EDD Community', status: 'Active'   },
];

const METRICS = [
  { label: 'Total Users',       value: '50,214', change: '+312 this week'       },
  { label: 'Active Groups',     value: '47',     change: '+2 this month'        },
  { label: 'Forum Posts (30d)', value: '1,843',  change: '+18% vs last month'   },
  { label: 'Content Items',     value: '286',    change: '+12 this week'        },
];

const AUDIT_LOGS = [
  { actor: 'Dr. Martinez', action: 'Approved submission',     entity: 'Chapter 2 – Lit Review',     time: 'Jan 30, 2025 – 2:15 PM'  },
  { actor: 'Emily T.',     action: 'Added member',            entity: 'Sarah K. → EDD Community',   time: 'Jan 29, 2025 – 10:42 AM' },
  { actor: 'System',       action: 'Email notification sent', entity: 'IRB Deadline Reminder',       time: 'Jan 28, 2025 – 8:00 AM'  },
  { actor: 'James L.',     action: 'Uploaded content',        entity: 'Research Methods Guide v3',   time: 'Jan 27, 2025 – 3:30 PM'  },
  { actor: 'Dr. Chen',     action: 'Role changed',            entity: 'David R. → Inactive',         time: 'Jan 25, 2025 – 11:05 AM' },
];

// ── Style helpers ─────────────────────────────────────────────────────────────

const ROLE_BADGE = {
  'Admin':       { background: '#552B9A', color: '#fff'     },
  'Group Admin': { background: '#e8d5f5', color: '#552B9A'  },
  'Officer':     { background: '#cce5ff', color: '#004085'  },
  'Member':      { background: '#eee',   color: '#555'      },
};
const roleBadge = (role) => ROLE_BADGE[role] ?? ROLE_BADGE['Member'];

const TABS = [
  { key: 'users',    label: 'Users'      },
  { key: 'groups',   label: 'Groups'     },
  { key: 'calendar', label: 'Calendar'   },
  { key: 'reports',  label: 'Reports'    },
  { key: 'audit',    label: 'Audit Logs' },
];

const EMPTY_FORM = { title: '', date: '', time: '', location: '', notes: '' };

const inputStyle = {
  width: '100%', padding: '0.5rem 0.75rem',
  border: '1px solid #ccc', borderRadius: '6px',
  fontSize: '0.87rem', boxSizing: 'border-box', marginBottom: '0.6rem',
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminPage({ user }) {
  const [tab, setTab] = useState('users');

  // Global events (Calendar tab).
  const [globalEvents,  setGlobalEvents]  = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [showModal,     setShowModal]     = useState(false);
  const [form,          setForm]          = useState(EMPTY_FORM);
  const [formError,     setFormError]     = useState('');
  const [editingId,     setEditingId]     = useState(null);
  const [saving,        setSaving]        = useState(false);

  const displayName = user?.attributes?.name || user?.name || user?.username || 'admin';

  // Fetch global events sorted by date ascending.
  const fetchGlobalEvents = useCallback(async () => {
    setLoadingEvents(true);
    try {
      const result = await client.graphql({ query: listGlobalEvents });
      const sorted = [...result.data.listGlobalEvents.items].sort((a, b) =>
        a.date.localeCompare(b.date)
      );
      setGlobalEvents(sorted);
    } catch (err) {
      console.error('Error fetching global events:', err);
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  // Only load events when the Calendar tab is first opened.
  useEffect(() => {
    if (tab === 'calendar') fetchGlobalEvents();
  }, [tab, fetchGlobalEvents]);

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (ev) => {
    setForm({
      title:    ev.title,
      date:     ev.date,
      time:     ev.time     ?? '',
      location: ev.location ?? '',
      notes:    ev.notes    ?? '',
    });
    setEditingId(ev.id);
    setFormError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setFormError('Title is required.'); return; }
    if (!form.date)         { setFormError('Date is required.');  return; }
    setSaving(true);
    try {
      if (editingId) {
        await client.graphql({
          query: updateGlobalEvent,
          variables: { input: { id: editingId, ...form } },
        });
      } else {
        await client.graphql({
          query: createGlobalEvent,
          variables: { input: { ...form, createdBy: displayName } },
        });
      }
      setShowModal(false);
      fetchGlobalEvents();
    } catch (err) {
      console.error('Error saving global event:', err);
      setFormError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await client.graphql({ query: deleteGlobalEvent, variables: { input: { id } } });
      setGlobalEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Error deleting global event:', err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Admin Panel</h1>
        <p>User management, content moderation, reports, and audit logs</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              background: tab === t.key ? '#552B9A' : 'transparent',
              color:      tab === t.key ? '#fff'    : '#555',
              border: 'none', padding: '0.5rem 1rem', borderRadius: '5px',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Users tab ── */}
      {tab === 'users' && (
        <div className="ic-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>User Management</h2>
            <button className="btn-purple">+ Add User</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                {['Name', 'Email', 'Role', 'Group', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.6rem', color: '#552B9A', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {USERS.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.6rem', color: '#222', fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: '0.6rem', color: '#666' }}>{u.email}</td>
                  <td style={{ padding: '0.6rem' }}>
                    <span style={{ ...roleBadge(u.role), padding: '0.18rem 0.5rem', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 600 }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '0.6rem', color: '#555' }}>{u.group}</td>
                  <td style={{ padding: '0.6rem' }}>
                    <span className={`badge ${u.status === 'Active' ? 'badge-active' : 'badge-pending'}`}>
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Groups tab ── */}
      {tab === 'groups' && (
        <div className="ic-card">
          <h2>Group Management</h2>
          <p style={{ fontSize: '0.88rem', color: '#666' }}>
            Manage group settings, membership, and moderation from here. (Full implementation pending backend.)
          </p>
          <button className="btn-purple" style={{ marginTop: '0.75rem' }}>+ Create Group</button>
        </div>
      )}

      {/* ── Calendar tab — global event management ── */}
      {tab === 'calendar' && (
        <div className="ic-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>Global Events</h2>
            <button className="btn-purple" onClick={openAddModal}>+ Add Global Event</button>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
            Global events are visible to all users on the Calendar page.
          </p>

          {loadingEvents ? (
            <p style={{ fontSize: '0.85rem', color: '#888' }}>Loading...</p>
          ) : globalEvents.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#888' }}>No global events yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  {['Title', 'Date', 'Time', 'Location', 'Created By', ''].map((h, i) => (
                    <th key={i} style={{ textAlign: 'left', padding: '0.5rem 0.6rem', color: '#552B9A', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {globalEvents.map(ev => (
                  <tr key={ev.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.6rem', color: '#222', fontWeight: 500 }}>{ev.title}</td>
                    <td style={{ padding: '0.6rem', color: '#555' }}>{ev.date}</td>
                    <td style={{ padding: '0.6rem', color: '#555' }}>{ev.time || '—'}</td>
                    <td style={{ padding: '0.6rem', color: '#555' }}>{ev.location || '—'}</td>
                    <td style={{ padding: '0.6rem', color: '#888', fontSize: '0.78rem' }}>{ev.createdBy}</td>
                    <td style={{ padding: '0.6rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => openEditModal(ev)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#552B9A' }} title="Edit"><FiEdit2 size={15} /></button>
                        <button onClick={() => handleDelete(ev.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545' }} title="Delete"><FiTrash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Reports tab ── */}
      {tab === 'reports' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {METRICS.map(m => (
              <div key={m.label} className="ic-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.25rem' }}>{m.label}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#552B9A' }}>{m.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#28a745' }}>{m.change}</div>
              </div>
            ))}
          </div>
          <div className="ic-card">
            <h2>Engagement Overview</h2>
            <p style={{ fontSize: '0.88rem', color: '#666' }}>
              Detailed charts and dashboards will be powered by QuickSight once the backend reporting pipeline is live.
            </p>
          </div>
        </div>
      )}

      {/* ── Audit Logs tab ── */}
      {tab === 'audit' && (
        <div className="ic-card">
          <h2>Audit Logs</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                {['Actor', 'Action', 'Entity', 'Time'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.6rem', color: '#552B9A', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AUDIT_LOGS.map((log, i) => (
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

      {/* ── Add / Edit global event modal ── */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: '1rem' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: '10px', padding: '1.75rem', width: '100%', maxWidth: '440px', boxShadow: '0 8px 30px rgba(0,0,0,0.18)' }}
          >
            <h2 style={{ color: '#552B9A', marginBottom: '1.25rem', fontSize: '1.1rem' }}>
              {editingId ? 'Edit Global Event' : 'Add Global Event'}
            </h2>

            {[
              { label: 'Title *',  key: 'title',    type: 'text', placeholder: 'Event title'            },
              { label: 'Date *',   key: 'date',     type: 'date'                                        },
              { label: 'Time',     key: 'time',     type: 'text', placeholder: 'e.g. 2:00 PM or All Day' },
              { label: 'Location', key: 'location', type: 'text', placeholder: 'e.g. Zoom, Teams'       },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#333', marginBottom: '0.25rem' }}>{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            ))}

            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#333', marginBottom: '0.25rem' }}>Notes</label>
            <textarea
              placeholder="Optional notes..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />

            {formError && (
              <div style={{ color: '#c53030', fontSize: '0.82rem', background: '#fee', padding: '0.5rem 0.75rem', borderRadius: '5px', borderLeft: '3px solid #c53030', marginBottom: '0.75rem' }}>
                {formError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} className="btn-outline" disabled={saving}>Cancel</button>
              <button onClick={handleSave} className="btn-purple" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
