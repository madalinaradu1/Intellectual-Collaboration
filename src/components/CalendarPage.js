import React, { useState } from 'react';

const events = [
  { id: 1, title: 'Committee Check-In', date: '2025-02-03', time: '2:00 PM', scope: 'Committee', location: 'Zoom' },
  { id: 2, title: 'Dissertation Webinar – Spring Series', date: '2025-02-05', time: '6:00 PM', scope: 'System', location: 'LopeStream' },
  { id: 3, title: 'EDD Community Meeting', date: '2025-02-10', time: '10:00 AM', scope: 'Group', location: 'Teams' },
  { id: 4, title: 'IRB Submission Deadline', date: '2025-02-15', time: 'All Day', scope: 'Deadline', location: '' },
  { id: 5, title: 'Chapter 2 Feedback Due', date: '2025-02-17', time: 'All Day', scope: 'Deadline', location: '' },
  { id: 6, title: 'Research Methods Study Group', date: '2025-02-18', time: '4:00 PM', scope: 'Group', location: 'Zoom' },
  { id: 7, title: 'AI Skills Lab Workshop', date: '2025-02-20', time: '1:00 PM', scope: 'System', location: 'Teams' },
  { id: 8, title: 'Dissertation Defense Prep', date: '2025-03-01', time: '11:00 AM', scope: 'Committee', location: 'Zoom' },
];

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function scopeStyle(scope) {
  switch (scope) {
    case 'Committee': return { background: '#e8d5f5', color: '#552B9A' };
    case 'System':    return { background: '#cce5ff', color: '#004085' };
    case 'Group':     return { background: '#d4edda', color: '#155724' };
    case 'Deadline':  return { background: '#f8d7da', color: '#721c24' };
    default:          return {};
  }
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(1); // Feb (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);
  const [filter, setFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const filteredEvents = events.filter((e) => {
    if (filter !== 'All' && e.scope !== filter) return false;
    const d = new Date(e.date);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const eventsOnDate = (day) => {
    return filteredEvents.filter((e) => {
      const d = new Date(e.date);
      return d.getDate() === day;
    });
  };

  const selectedEvents = selectedDate ? eventsOnDate(selectedDate) : filteredEvents;

  return (
    <div>
      <div className="page-header">
        <h1>Calendar</h1>
        <p>System, group, and committee events in one view</p>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {['All', 'System', 'Group', 'Committee', 'Deadline'].map((f) => (
          <button key={f} onClick={() => { setFilter(f); setSelectedDate(null); }} style={{
            background: filter === f ? '#552B9A' : '#fff',
            color: filter === f ? '#fff' : '#555',
            border: filter === f ? 'none' : '1px solid #ccc',
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Calendar grid */}
        <div className="ic-card">
          {/* Month nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#552B9A' }}>◀</button>
            <strong style={{ fontSize: '1rem', color: '#222' }}>{monthNames[currentMonth]} {currentYear}</strong>
            <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#552B9A' }}>▶</button>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '0.35rem' }}>
            {dayNames.map((d) => (
              <div key={d} style={{ textAlign: 'center', fontSize: '0.72rem', color: '#888', fontWeight: 600, padding: '0.3rem 0' }}>{d}</div>
            ))}
          </div>

          {/* Calendar cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {/* Empty cells for offset */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} style={{ minHeight: 60 }} />
            ))}
            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dayEvents = eventsOnDate(day);
              const isSelected = selectedDate === day;
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : day)}
                  style={{
                    minHeight: 60,
                    padding: '0.3rem 0.35rem',
                    background: isSelected ? '#f0e6f6' : '#fafafa',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid #552B9A' : '1px solid #eee',
                    transition: 'border-color 0.12s',
                  }}
                >
                  <div style={{ fontSize: '0.76rem', fontWeight: 600, color: '#333', marginBottom: '0.2rem' }}>{day}</div>
                  {dayEvents.slice(0, 2).map((ev) => (
                    <div key={ev.id} style={{ fontSize: '0.62rem', background: scopeStyle(ev.scope).background, color: scopeStyle(ev.scope).color, borderRadius: '3px', padding: '0.1rem 0.3rem', marginBottom: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && <div style={{ fontSize: '0.6rem', color: '#888' }}>+{dayEvents.length - 2} more</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Event list panel */}
        <div className="ic-card">
          <h2>{selectedDate ? `Events on Feb ${selectedDate}` : 'Events This Month'}</h2>
          {selectedEvents.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#888' }}>No events for this selection.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {selectedEvents.map((ev) => (
                <div key={ev.id} style={{ display: 'flex', gap: '0.7rem', padding: '0.65rem', background: '#f7f3fa', borderRadius: '7px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 38 }}>
                    <span style={{ fontSize: '0.62rem', color: '#552B9A', fontWeight: 700, textTransform: 'uppercase' }}>{new Date(ev.date).toLocaleString('default', { month: 'short' })}</span>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a1a' }}>{new Date(ev.date).getDate()}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#222' }}>{ev.title}</div>
                    <div style={{ fontSize: '0.76rem', color: '#666', marginTop: '0.15rem' }}>
                      {ev.time}{ev.location ? ` · ${ev.location}` : ''}
                    </div>
                    <span style={{ display: 'inline-block', marginTop: '0.25rem', fontSize: '0.68rem', fontWeight: 600, ...scopeStyle(ev.scope), padding: '0.12rem 0.4rem', borderRadius: '10px' }}>{ev.scope}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="btn-purple" style={{ marginTop: '1rem' }}>+ Add Event</button>
        </div>
      </div>
    </div>
  );
}