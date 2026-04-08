import React, { useState, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { personalEventsByOwner, listGlobalEvents } from '../graphql/queries';
import {
  createPersonalEvent, updatePersonalEvent, deletePersonalEvent,
  createGlobalEvent,   updateGlobalEvent,   deleteGlobalEvent,
} from '../graphql/mutations';
import './CalendarPage.css';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const client = generateClient();

const SYSTEM_EVENTS = [
  { id: 's1', title: 'Committee Check-In',               date: '2025-02-03', time: '2:00 PM',  scope: 'Committee', location: 'Zoom' },
  { id: 's2', title: 'Dissertation Webinar – Spring Series', date: '2025-02-05', time: '6:00 PM',  scope: 'System',    location: 'LopeStream' },
  { id: 's3', title: 'EDD Community Meeting',            date: '2025-02-10', time: '10:00 AM', scope: 'Group',     location: 'Teams' },
  { id: 's4', title: 'IRB Submission Deadline',          date: '2025-02-15', time: 'All Day',  scope: 'Deadline',  location: '' },
  { id: 's5', title: 'Chapter 2 Feedback Due',           date: '2025-02-17', time: 'All Day',  scope: 'Deadline',  location: '' },
  { id: 's6', title: 'Research Methods Study Group',     date: '2025-02-18', time: '4:00 PM',  scope: 'Group',     location: 'Zoom' },
  { id: 's7', title: 'AI Skills Lab Workshop',           date: '2025-02-20', time: '1:00 PM',  scope: 'System',    location: 'Teams' },
  { id: 's8', title: 'Dissertation Defense Prep',        date: '2025-03-01', time: '11:00 AM', scope: 'Committee', location: 'Zoom' },
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

const FILTER_OPTIONS = ['All', 'Global', 'System', 'Group', 'Committee', 'Deadline', 'Personal'];

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }

const EMPTY_FORM = { title: '', date: '', time: '', location: '', notes: '' };

const FORM_FIELDS = [
  { label: 'Title *',  key: 'title',    type: 'text', placeholder: 'Event title' },
  { label: 'Date *',   key: 'date',     type: 'date' },
  { label: 'Time',     key: 'time',     type: 'text', placeholder: 'e.g. 2:00 PM or All Day' },
  { label: 'Location', key: 'location', type: 'text', placeholder: 'e.g. Zoom, Teams' },
];

export default function CalendarPage({ user }) {
  const owner       = user?.username ?? user?.userId ?? 'guest';
  const displayName = user?.attributes?.name || user?.name || owner;
  const isAdmin = user?.isAdmin || user?.attributes?.['custom:role'] === 'admin';

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());
  const [filter,       setFilter]       = useState('All');
  const [selectedDate, setSelectedDate] = useState(null);

  const [personalEvents, setPersonalEvents] = useState([]);
  const [globalEvents,   setGlobalEvents]   = useState([]);
  const [loadingEvents,  setLoadingEvents]  = useState(true);

  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [personalForm,      setPersonalForm]      = useState(EMPTY_FORM);
  const [personalFormError, setPersonalFormError] = useState('');
  const [editingPersonalId, setEditingPersonalId] = useState(null);
  const [savingPersonal,    setSavingPersonal]    = useState(false);

  const [showGlobalModal, setShowGlobalModal] = useState(false);
  const [globalForm,      setGlobalForm]      = useState(EMPTY_FORM);
  const [globalFormError, setGlobalFormError] = useState('');
  const [editingGlobalId, setEditingGlobalId] = useState(null);
  const [savingGlobal,    setSavingGlobal]    = useState(false);

  const fetchPersonalEvents = useCallback(async () => {
    try {
      const result = await client.graphql({ query: personalEventsByOwner, variables: { owner } });
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

  const padDate = (n) => String(n).padStart(2, '0');
  const defaultDate = () => selectedDate
    ? `${currentYear}-${padDate(currentMonth + 1)}-${padDate(selectedDate)}`
    : '';

  const openAddPersonalModal = () => {
    setPersonalForm({ ...EMPTY_FORM, date: defaultDate() });
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

  const openAddGlobalModal = () => {
    setGlobalForm({ ...EMPTY_FORM, date: defaultDate() });
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
        await client.graphql({ query: createGlobalEvent, variables: { input: { ...globalForm, createdBy: displayName } } });
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

      <div className="cal-filter-bar">
        {FILTER_OPTIONS.map(f => (
          <button
            key={f}
            className={`cal-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => { setFilter(f); setSelectedDate(null); }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="cal-layout">

        {/* Calendar grid */}
        <div className="ic-card cal-grid-card">
          <div className="cal-nav">
            <button className="cal-nav-btn" onClick={() => shiftMonth(-1)} aria-label="Previous month">◀</button>
            <span className="cal-month-label">{monthNames[currentMonth]} {currentYear}</span>
            <button className="cal-nav-btn" onClick={() => shiftMonth(1)}  aria-label="Next month">▶</button>
          </div>

          <div className="cal-day-headers">
            {dayNames.map(d => <div key={d} className="cal-day-header">{d}</div>)}
          </div>

          <div className="cal-day-grid">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e${i}`} className="cal-day-empty" />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day        = i + 1;
              const dayEvs     = eventsOnDay(day);
              const isSelected = selectedDate === day;
              const isToday    = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === day;
              return (
                <div
                  key={day}
                  className={`cal-day-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => setSelectedDate(isSelected ? null : day)}
                  role="button"
                  aria-label={`${monthNames[currentMonth]} ${day}${dayEvs.length ? `, ${dayEvs.length} event${dayEvs.length > 1 ? 's' : ''}` : ''}`}
                  aria-pressed={isSelected}
                >
                  <div className={`cal-day-num ${isToday ? 'is-today' : ''}`}>{day}</div>
                  {dayEvs.slice(0, 2).map(ev => (
                    <div key={ev.id} className="cal-event-chip" style={scopeStyle(ev.scope)}>
                      {ev.title}
                    </div>
                  ))}
                  {dayEvs.length > 2 && (
                    <div className="cal-overflow">+{dayEvs.length - 2} more</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Event list panel */}
        <div className="ic-card cal-event-panel">
          <h2>
            {selectedDate ? `${monthNames[currentMonth]} ${selectedDate}` : 'Events This Month'}
          </h2>

          {loadingEvents ? (
            <p style={{ fontSize: '0.85rem', color: '#888' }}>Loading events...</p>
          ) : selectedEvents.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#888' }}>No events for this selection.</p>
          ) : (
            <div className="cal-event-list">
              {selectedEvents.map(ev => {
                const evDate     = new Date(ev.date + 'T00:00:00');
                const isPersonal = ev.scope === 'Personal';
                const isGlobal   = ev.scope === 'Global';
                return (
                  <div key={ev.id} className="cal-event-item">
                    <div className="cal-event-date-col">
                      <span className="cal-event-date-month">
                        {evDate.toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="cal-event-date-day">{evDate.getDate()}</span>
                    </div>
                    <div className="cal-event-body">
                      <div className="cal-event-title">{ev.title}</div>
                      <div className="cal-event-meta">
                        {ev.time}{ev.location ? ` · ${ev.location}` : ''}
                      </div>
                      {ev.notes && <div className="cal-event-notes">{ev.notes}</div>}
                      <span className="cal-scope-badge" style={scopeStyle(ev.scope)}>{ev.scope}</span>
                    </div>
                    {isPersonal && (
                      <div className="cal-event-actions">
                        <button className="cal-action-btn" onClick={() => openEditPersonalModal(ev)} aria-label="Edit event"><FiEdit2 size={14} /></button>
                        <button className="cal-action-btn" onClick={() => handleDeletePersonal(ev.id)} aria-label="Delete event"><FiTrash2 size={14} /></button>
                      </div>
                    )}
                    {isGlobal && isAdmin && (
                      <div className="cal-event-actions">
                        <button className="cal-action-btn" onClick={() => openEditGlobalModal(ev)} aria-label="Edit event"><FiEdit2 size={14} /></button>
                        <button className="cal-action-btn" onClick={() => handleDeleteGlobal(ev.id)} aria-label="Delete event"><FiTrash2 size={14} /></button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="cal-add-btns">
            <button className="btn-purple" onClick={openAddPersonalModal}>+ Add Personal Event</button>
            {isAdmin && (
              <button className="btn-outline" onClick={openAddGlobalModal}>+ Add Global Event</button>
            )}
          </div>
        </div>
      </div>

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

function EventModal({ show, title, form, setForm, formError, saving, onSave, onClose }) {
  if (!show) return null;
  return (
    <div className="cal-modal-overlay" onClick={onClose}>
      <div className="cal-modal" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>

        <div className="cal-modal-fields">
          {FORM_FIELDS.map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="cal-modal-label">{label}</label>
              <input
                className="cal-modal-input"
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
          <div>
            <label className="cal-modal-label">Notes</label>
            <textarea
              className="cal-modal-textarea"
              placeholder="Optional notes..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
            />
          </div>
        </div>

        {formError && <div className="cal-modal-error">{formError}</div>}

        <div className="cal-modal-actions">
          <button className="btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn-purple" onClick={onSave} disabled={saving}>
            {saving ? 'Saving...' : title.startsWith('Edit') ? 'Save Changes' : 'Add Event'}
          </button>
        </div>
      </div>
    </div>
  );
}
