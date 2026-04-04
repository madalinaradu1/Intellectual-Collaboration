import React, { useState, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { personalEventsByOwner, listGlobalEvents } from '../graphql/queries';
import {
  createPersonalEvent, updatePersonalEvent, deletePersonalEvent,
  createGlobalEvent,   updateGlobalEvent,   deleteGlobalEvent,
} from '../graphql/mutations';

const client = generateClient();

// Hard-coded system events (pre-seeded, not stored in DB)
const SYSTEM_EVENTS = [
  { id: 's1', title: 'Committee Check-In',              date: '2025-02-03', time: '2:00 PM',  scope: 'Committee', location: 'Zoom' },
  { id: 's2', title: 'Dissertation Webinar – Spring Series', date: '2025-02-05', time: '6:00 PM',  scope: 'System',    location: 'LopeStream' },
  { id: 's3', title: 'EDD Community Meeting',           date: '2025-02-10', time: '10:00 AM', scope: 'Group',     location: 'Teams' },
  { id: 's4', title: 'IRB Submission Deadline',         date: '2025-02-15', time: 'All Day',  scope: 'Deadline',  location: '' },
  { id: 's5', title: 'Chapter 2 Feedback Due',          date: '2025-02-17', time: 'All Day',  scope: 'Deadline',  location: '' },
  { id: 's6', title: 'Research Methods Study Group',    date: '2025-02-18', time: '4:00 PM',  scope: 'Group',     location: 'Zoom' },
  { id: 's7', title: 'AI Skills Lab Workshop',          date: '2025-02-20', time: '1:00 PM',  scope: 'System',    location: 'Teams' },
  { id: 's8', title: 'Dissertation Defense Prep',       date: '2025-03-01', time: '11:00 AM', scope: 'Committee', location: 'Zoom' },
];

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const dayNames   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const SCOPE_STYLE = {
  Committee: { background: '#e8d5f5', color: '#552B9A' },
  System:    { background: '#cce5ff', color: '#004085' },
  Group:     { background: '#d4edda', color: '#155724' },
  Deadline:  { background: '#f8d7da', color: '#721c24' },
  Personal:  { background: '#fff3cd', color: '#856404' },
  Global:    { background: '#fde8d8', color: '#7c3000' },
};
const scopeStyle = (scope) => SCOPE_STYLE[scope] ?? {};

// Filter pill labels — Global is a real DB-backed scope visible to everyone
const FILTER_OPTIONS = ['All', 'Global', 'System', 'Group', 'Committee', 'Deadline', 'Personal'];

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }

const EMPTY_FORM = { title: '', date: '', time: '', location: '', notes: '' };

// Shared form fields config used by both personal and global event modals
const FORM_FIELDS = [
  { label: 'Title *',   key: 'title',    type: 'text', placeholder: 'Event title' },
  { label: 'Date *',    key: 'date',     type: 'date' },
  { label: 'Time',      key: 'time',     type: 'text', placeholder: 'e.g. 2:00 PM or All Day' },
  { label: 'Location',  key: 'location', type: 'text', placeholder: 'e.g. Zoom, Teams' },
];

const inputStyle = {
  width: '100%', padding: '0.6rem 0.75rem',
  border: '1.5px solid #ddd', borderRadius: '6px',
  fontSize: '0.88rem', boxSizing: 'border-box',
};
const labelStyle = {
  display: 'block', fontSize: '0.82rem',
  fontWeight: 600, color: '#333', marginBottom: '0.3rem',
};

export default function CalendarPage({ user }) {
  const owner   = user?.username ?? user?.userId ?? 'guest';
  const isAdmin = user?.isAdmin || user?.attributes?.['custom:role'] === 'admin';

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());
  const [filter,        setFilter]       = useState('All');
  const [selectedDate,  setSelectedDate] = useState(null);

  const [personalEvents, setPersonalEvents] = useState([]);
  const [globalEvents,   setGlobalEvents]   = useState([]);
  const [loadingEvents,  setLoadingEvents]  = useState(true);

  // Personal event modal state
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [personalForm,      setPersonalForm]      = useState(EMPTY_FORM);
  const [personalFormError, setPersonalFormError] = useState('');
  const [editingPersonalId, setEditingPersonalId] = useState(null);
  const [savingPersonal,    setSavingPersonal]    = useState(false);

  // Global event modal state (admin only)
  const [showGlobalModal, setShowGlobalModal] = useState(false);
  const [globalForm,      setGlobalForm]      = useState(EMPTY_FORM);
  const [globalFormError, setGlobalFormError] = useState('');
  const [editingGlobalId, setEditingGlobalId] = useState(null);
  const [savingGlobal,    setSavingGlobal]    = useState(false);

  const fetchPersonalEvents = useCallback(async () => {
    try {
      const result = await client.graphql({
        query: personalEventsByOwner,
        variables: { owner },
      });
      setPersonalEvents(result.data.personalEventsByOwner.items);
    } catch (err) {
      console.error('Error fetching personal events:', err);
    }
  }, [owner]);

  const fetchGlobalEvents = useCallback(async () => {
    try {
      const result = await client.graphql({ query: listGlobalEvents });
      setGlobalEvents(result.data.listGlobalEvents.items);
    } catch (err) {
      console.error('Error fetching global events:', err);
    }
  }, []);

  // Fetch both event types in parallel on mount
  useEffect(() => {
    const load = async () => {
      setLoadingEvents(true);
      await Promise.all([fetchPersonalEvents(), fetchGlobalEvents()]);
      setLoadingEvents(false);
    };
    load();
  }, [fetchPersonalEvents, fetchGlobalEvents]);

  const shiftMonth = (dir) => {
    if (dir === -1 && currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else if (dir === 1 && currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + dir);
  };

  const allEvents = [
    ...SYSTEM_EVENTS,
    ...globalEvents.map(e   => ({ ...e, scope: 'Global' })),
    ...personalEvents.map(e => ({ ...e, scope: 'Personal' })),
  ];

  const filteredEvents = allEvents.filter(e => {
    if (filter !== 'All' && e.scope !== filter) return false;
    const d = new Date(e.date + 'T00:00:00');
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const eventsOnDay    = (day) => filteredEvents.filter(e => new Date(e.date + 'T00:00:00').getDate() === day);
  const selectedEvents = selectedDate ? eventsOnDay(selectedDate) : filteredEvents;

  // --- Personal event handlers ---

  const openAddPersonalModal = () => {
    const pad = n => String(n).padStart(2, '0');
    const defaultDate = selectedDate
      ? `${currentYear}-${pad(currentMonth + 1)}-${pad(selectedDate)}`
      : '';
    setPersonalForm({ ...EMPTY_FORM, date: defaultDate });
    setEditingPersonalId(null);
    setPersonalFormError('');
    setShowPersonalModal(true);
  };

  const openEditPersonalModal = (ev) => {
    setPersonalForm({ title: ev.title, date: ev.date, time: ev.time ?? '', location: ev.location ?? '', notes: ev.notes ?? '' });
    setEditingPersonalId(ev.id);
    setPersonalFormError('');
    setShowPersonalModal(true);
  };

  const handleSavePersonal = async () => {
    if (!personalForm.title.trim()) { setPersonalFormError('Title is required.'); return; }
    if (!personalForm.date)         { setPersonalFormError('Date is required.'); return; }
    setSavingPersonal(true);
    try {
      if (editingPersonalId) {
        await client.graphql({ query: updatePersonalEvent, variables: { input: { id: editingPersonalId, ...personalForm } } });
      } else {
        await client.graphql({ query: createPersonalEvent, variables: { input: { ...personalForm, owner } } });
      }
      setShowPersonalModal(false);
      fetchPersonalEvents();
    } catch (err) {
      console.error('Error saving personal event:', err);
      setPersonalFormError('Failed to save. Please try again.');
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleDeletePersonal = async (id) => {
    try {
      await client.graphql({ query: deletePersonalEvent, variables: { input: { id } } });
      setPersonalEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Error deleting personal event:', err);
    }
  };

  // --- Global event handlers (admin only) ---

  const openAddGlobalModal = () => {
    const pad = n => String(n).padStart(2, '0');
    const defaultDate = selectedDate
      ? `${currentYear}-${pad(currentMonth + 1)}-${pad(selectedDate)}`
      : '';
    setGlobalForm({ ...EMPTY_FORM, date: defaultDate });
    setEditingGlobalId(null);
    setGlobalFormError('');
    setShowGlobalModal(true);
  };

  const openEditGlobalModal = (ev) => {
    setGlobalForm({ title: ev.title, date: ev.date, time: ev.time ?? '', location: ev.location ?? '', notes: ev.notes ?? '' });
    setEditingGlobalId(ev.id);
    setGlobalFormError('');
    setShowGlobalModal(true);
  };

  const handleSaveGlobal = async () => {
    if (!globalForm.title.trim()) { setGlobalFormError('Title is required.'); return; }
    if (!globalForm.date)         { setGlobalFormError('Date is required.'); return; }
    setSavingGlobal(true);
    try {
      if (editingGlobalId) {
        await client.graphql({ query: updateGlobalEvent, variables: { input: { id: editingGlobalId, ...globalForm } } });
      } else {
        await client.graphql({ query: createGlobalEvent, variables: { input: { ...globalForm, createdBy: owner } } });
      }
      setShowGlobalModal(false);
      fetchGlobalEvents();
    } catch (err) {
      console.error('Error saving global event:', err);
      setGlobalFormError('Failed to save. Please try again.');
    } finally {
      setSavingGlobal(false);
    }
  };

  const handleDeleteGlobal = async (id) => {
    try {
      await client.graphql({ query: deleteGlobalEvent, variables: { input: { id } } });
      setGlobalEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Error deleting global event:', err);
    }
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay    = getFirstDayOfMonth(currentYear, currentMonth);

  return (
    <div>
      <div className="page-header">
        <h1>Calendar</h1>
        <p>System, group, committee, personal, and global events in one view</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {FILTER_OPTIONS.map(f => (
          <button key={f} onClick={() => { setFilter(f); setSelectedDate(null); }} style={{
            background: filter === f ? '#552B9A' : '#fff',
            color: filter === f ? '#fff' : '#555',
            border: filter === f ? 'none' : '1px solid #ccc',
            padding: '0.35rem 0.85rem', borderRadius: '20px',
            fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
          }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* Calendar grid */}
        <div className="ic-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <button onClick={() => shiftMonth(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#552B9A' }}>◀</button>
            <strong style={{ fontSize: '1rem', color: '#222' }}>{monthNames[currentMonth]} {currentYear}</strong>
            <button onClick={() => shiftMonth(1)}  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#552B9A' }}>▶</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '0.35rem' }}>
            {dayNames.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '0.72rem', color: '#888', fontWeight: 600, padding: '0.3rem 0' }}>{d}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} style={{ minHeight: 60 }} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day      = i + 1;
              const dayEvs   = eventsOnDay(day);
              const isSelected = selectedDate === day;
              const isToday  = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === day;
              return (
                <div key={day} onClick={() => setSelectedDate(isSelected ? null : day)} style={{
                  minHeight: 60, padding: '0.3rem 0.35rem',
                  background: isSelected ? '#f0e6f6' : '#fafafa',
                  borderRadius: '6px', cursor: 'pointer',
                  border: isSelected ? '2px solid #552B9A' : isToday ? '2px solid #b39ddb' : '1px solid #eee',
                  transition: 'border-color 0.12s',
                }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: isToday ? '#552B9A' : '#333', marginBottom: '0.2rem' }}>{day}</div>
                  {dayEvs.slice(0, 2).map(ev => (
                    <div key={ev.id} style={{ fontSize: '0.62rem', ...scopeStyle(ev.scope), borderRadius: '3px', padding: '0.1rem 0.3rem', marginBottom: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ev.title}
                    </div>
                  ))}
                  {dayEvs.length > 2 && <div style={{ fontSize: '0.6rem', color: '#888' }}>+{dayEvs.length - 2} more</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Event list panel */}
        <div className="ic-card">
          <h2>
            {selectedDate ? `${monthNames[currentMonth]} ${selectedDate}` : 'Events This Month'}
          </h2>

          {loadingEvents ? (
            <p style={{ fontSize: '0.85rem', color: '#888' }}>Loading events...</p>
          ) : selectedEvents.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#888' }}>No events for this selection.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {selectedEvents.map(ev => {
                const isPersonal = ev.scope === 'Personal';
                const isGlobal   = ev.scope === 'Global';
                return (
                  <div key={ev.id} style={{ display: 'flex', gap: '0.7rem', padding: '0.65rem', background: '#f7f3fa', borderRadius: '7px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 38 }}>
                      <span style={{ fontSize: '0.62rem', color: '#552B9A', fontWeight: 700, textTransform: 'uppercase' }}>
                        {new Date(ev.date + 'T00:00:00').toLocaleString('default', { month: 'short' })}
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a1a' }}>
                        {new Date(ev.date + 'T00:00:00').getDate()}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#222' }}>{ev.title}</div>
                      <div style={{ fontSize: '0.76rem', color: '#666', marginTop: '0.15rem' }}>
                        {ev.time}{ev.location ? ` · ${ev.location}` : ''}
                      </div>
                      {ev.notes && <div style={{ fontSize: '0.74rem', color: '#888', marginTop: '0.2rem', fontStyle: 'italic' }}>{ev.notes}</div>}
                      <span style={{ display: 'inline-block', marginTop: '0.25rem', fontSize: '0.68rem', fontWeight: 600, ...scopeStyle(ev.scope), padding: '0.12rem 0.4rem', borderRadius: '10px' }}>
                        {ev.scope}
                      </span>
                    </div>
                    {/* Personal events: editable by the owning user */}
                    {isPersonal && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flexShrink: 0 }}>
                        <button onClick={() => openEditPersonalModal(ev)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#552B9A', fontSize: '0.75rem', padding: '0.15rem 0.3rem' }}>✏️</button>
                        <button onClick={() => handleDeletePersonal(ev.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c53030', fontSize: '0.75rem', padding: '0.15rem 0.3rem' }}>🗑️</button>
                      </div>
                    )}
                    {/* Global events: editable only by admins */}
                    {isGlobal && isAdmin && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flexShrink: 0 }}>
                        <button onClick={() => openEditGlobalModal(ev)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#552B9A', fontSize: '0.75rem', padding: '0.15rem 0.3rem' }}>✏️</button>
                        <button onClick={() => handleDeleteGlobal(ev.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c53030', fontSize: '0.75rem', padding: '0.15rem 0.3rem' }}>🗑️</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-purple" onClick={openAddPersonalModal}>+ Add Personal Event</button>
            {isAdmin && (
              <button className="btn-outline" onClick={openAddGlobalModal}>+ Add Global Event</button>
            )}
          </div>
        </div>
      </div>

      {/* Personal event modal */}
      <EventModal
        show={showPersonalModal}
        title={editingPersonalId ? 'Edit Personal Event' : 'Add Personal Event'}
        form={personalForm}
        setForm={setPersonalForm}
        formError={personalFormError}
        saving={savingPersonal}
        onSave={handleSavePersonal}
        onClose={() => setShowPersonalModal(false)}
      />

      {/* Global event modal (admin only) */}
      <EventModal
        show={showGlobalModal}
        title={editingGlobalId ? 'Edit Global Event' : 'Add Global Event'}
        form={globalForm}
        setForm={setGlobalForm}
        formError={globalFormError}
        saving={savingGlobal}
        onSave={handleSaveGlobal}
        onClose={() => setShowGlobalModal(false)}
      />
    </div>
  );
}

// Shared modal used by both personal and global event forms
function EventModal({ show, title, form, setForm, formError, saving, onSave, onClose }) {
  if (!show) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 500, padding: '1rem',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: '10px', padding: '1.75rem',
        width: '100%', maxWidth: '440px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
      }}>
        <h2 style={{ color: '#552B9A', marginBottom: '1.25rem', fontSize: '1.1rem' }}>{title}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {FORM_FIELDS.map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                style={inputStyle}
              />
            </div>
          ))}
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              placeholder="Optional notes..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {formError && (
          <div style={{ marginTop: '0.75rem', color: '#c53030', fontSize: '0.82rem', background: '#fee', padding: '0.5rem 0.75rem', borderRadius: '5px', borderLeft: '3px solid #c53030' }}>
            {formError}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-outline" disabled={saving}>Cancel</button>
          <button onClick={onSave}  className="btn-purple" disabled={saving}>
            {saving ? 'Saving...' : title.startsWith('Edit') ? 'Save Changes' : 'Add Event'}
          </button>
        </div>
      </div>
    </div>
  );
}
