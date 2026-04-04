import React, { useState, useEffect } from 'react';

const SYSTEM_EVENTS = [
  { id: 's1', title: 'Committee Check-In', date: '2025-02-03', time: '2:00 PM', scope: 'Committee', location: 'Zoom' },
  { id: 's2', title: 'Dissertation Webinar – Spring Series', date: '2025-02-05', time: '6:00 PM', scope: 'System', location: 'LopeStream' },
  { id: 's3', title: 'EDD Community Meeting', date: '2025-02-10', time: '10:00 AM', scope: 'Group', location: 'Teams' },
  { id: 's4', title: 'IRB Submission Deadline', date: '2025-02-15', time: 'All Day', scope: 'Deadline', location: '' },
  { id: 's5', title: 'Chapter 2 Feedback Due', date: '2025-02-17', time: 'All Day', scope: 'Deadline', location: '' },
  { id: 's6', title: 'Research Methods Study Group', date: '2025-02-18', time: '4:00 PM', scope: 'Group', location: 'Zoom' },
  { id: 's7', title: 'AI Skills Lab Workshop', date: '2025-02-20', time: '1:00 PM', scope: 'System', location: 'Teams' },
  { id: 's8', title: 'Dissertation Defense Prep', date: '2025-03-01', time: '11:00 AM', scope: 'Committee', location: 'Zoom' },
];

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function scopeStyle(scope) {
  switch (scope) {
    case 'Committee': return { background: '#e8d5f5', color: '#552B9A' };
    case 'System':    return { background: '#cce5ff', color: '#004085' };
    case 'Group':     return { background: '#d4edda', color: '#155724' };
    case 'Deadline':  return { background: '#f8d7da', color: '#721c24' };
    case 'Personal':  return { background: '#fff3cd', color: '#856404' };
    default:          return {};
  }
}

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }

const EMPTY_FORM = { title: '', date: '', time: '', location: '', notes: '' };

export default function CalendarPage({ user }) {
  const storageKey = `ic_personal_events_${user?.userId ?? 'guest'}`;

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear]   = useState(today.getFullYear());
  const [filter, setFilter]             = useState('All');
  const [selectedDate, setSelectedDate] = useState(null);
  const [personalEvents, setPersonalEvents] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) ?? []; }
    catch { return []; }
  });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(personalEvents));
  }, [personalEvents, storageKey]);

  const shiftMonth = (dir) => {
    if (dir === -1 && currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else if (dir === 1 && currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + dir);
  };

  const allEvents = [...SYSTEM_EVENTS, ...personalEvents.map(e => ({ ...e, scope: 'Personal' }))];

  const filteredEvents = allEvents.filter(e => {
    if (filter !== 'All' && e.scope !== filter) return false;
    const d = new Date(e.date + 'T00:00:00');
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const eventsOnDay = (day) => filteredEvents.filter(e => new Date(e.date + 'T00:00:00').getDate() === day);

  const selectedEvents = selectedDate ? eventsOnDay(selectedDate) : filteredEvents;

  const openAddModal = () => {
    const pad = n => String(n).padStart(2, '0');
    const defaultDate = selectedDate
      ? `${currentYear}-${pad(currentMonth + 1)}-${pad(selectedDate)}`
      : '';
    setForm({ ...EMPTY_FORM, date: defaultDate });
    setEditingId(null);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (ev) => {
    setForm({ title: ev.title, date: ev.date, time: ev.time, location: ev.location ?? '', notes: ev.notes ?? '' });
    setEditingId(ev.id);
    setFormError('');
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) { setFormError('Title is required.'); return; }
    if (!form.date)         { setFormError('Date is required.'); return; }
    if (editingId) {
      setPersonalEvents(prev => prev.map(e => e.id === editingId ? { ...e, ...form } : e));
    } else {
      setPersonalEvents(prev => [...prev, { ...form, id: `p_${Date.now()}` }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setPersonalEvents(prev => prev.filter(e => e.id !== id));
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay    = getFirstDayOfMonth(currentYear, currentMonth);

  return (
    <div>
      <div className="page-header">
        <h1>Calendar</h1>
        <p>System, group, committee, and personal events in one view</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {['All', 'System', 'Group', 'Committee', 'Deadline', 'Personal'].map(f => (
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
            <button onClick={() => shiftMonth(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#552B9A' }}>▶</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '0.35rem' }}>
            {dayNames.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '0.72rem', color: '#888', fontWeight: 600, padding: '0.3rem 0' }}>{d}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} style={{ minHeight: 60 }} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dayEvs = eventsOnDay(day);
              const isSelected = selectedDate === day;
              const isToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === day;
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
            {selectedDate
              ? `${monthNames[currentMonth]} ${selectedDate}`
              : 'Events This Month'}
          </h2>

          {selectedEvents.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#888' }}>No events for this selection.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {selectedEvents.map(ev => {
                const isPersonal = ev.scope === 'Personal';
                return (
                  <div key={ev.id} style={{ display: 'flex', gap: '0.7rem', padding: '0.65rem', background: '#f7f3fa', borderRadius: '7px', position: 'relative' }}>
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
                      <span style={{ display: 'inline-block', marginTop: '0.25rem', fontSize: '0.68rem', fontWeight: 600, ...scopeStyle(ev.scope), padding: '0.12rem 0.4rem', borderRadius: '10px' }}>{ev.scope}</span>
                    </div>
                    {isPersonal && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flexShrink: 0 }}>
                        <button onClick={() => openEditModal(ev)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#552B9A', fontSize: '0.75rem', padding: '0.15rem 0.3rem' }}>✏️</button>
                        <button onClick={() => handleDelete(ev.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c53030', fontSize: '0.75rem', padding: '0.15rem 0.3rem' }}>🗑️</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <button className="btn-purple" style={{ marginTop: '1rem' }} onClick={openAddModal}>
            + Add Personal Event
          </button>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 500, padding: '1rem',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: '10px', padding: '1.75rem',
            width: '100%', maxWidth: '440px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
          }}>
            <h2 style={{ color: '#552B9A', marginBottom: '1.25rem', fontSize: '1.1rem' }}>
              {editingId ? 'Edit Personal Event' : 'Add Personal Event'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {[
                { label: 'Title *', key: 'title', type: 'text', placeholder: 'Event title' },
                { label: 'Date *', key: 'date', type: 'date' },
                { label: 'Time', key: 'time', type: 'text', placeholder: 'e.g. 2:00 PM or All Day' },
                { label: 'Location', key: 'location', type: 'text', placeholder: 'e.g. Zoom, Teams' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#333', marginBottom: '0.3rem' }}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>
              ))}

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#333', marginBottom: '0.3rem' }}>Notes</label>
                <textarea
                  placeholder="Optional notes..."
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '0.88rem', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            {formError && (
              <div style={{ marginTop: '0.75rem', color: '#c53030', fontSize: '0.82rem', background: '#fee', padding: '0.5rem 0.75rem', borderRadius: '5px', borderLeft: '3px solid #c53030' }}>
                {formError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
              <button onClick={handleSave} className="btn-purple">
                {editingId ? 'Save Changes' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
