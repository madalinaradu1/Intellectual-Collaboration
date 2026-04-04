import React, { useState } from 'react';

const mediaItems = [
  { id: 1, title: 'Dissertation Defense – Spring 2024', provider: 'Vimeo', description: 'Full recording of the spring 2024 dissertation defense ceremony featuring remarks from Dean Harris.', tags: ['defense', 'ceremony'], date: 'May 2024' },
  { id: 2, title: 'Mixed Methods Research Design Workshop', provider: 'YouTube', description: 'A comprehensive walkthrough of sequential explanatory and exploratory designs with real examples from doctoral dissertations.', tags: ['research', 'workshop'], date: 'Nov 2024' },
  { id: 3, title: 'Alumni Story – Dr. Angela Reyes', provider: 'Vimeo', description: 'Dr. Reyes shares her doctoral journey, challenges she overcame, and advice for current students.', tags: ['alumni', 'story'], date: 'Oct 2024' },
  { id: 4, title: 'IRB Process Overview', provider: 'YouTube', description: 'Step-by-step guide to submitting an IRB application at GCU, including common pitfalls to avoid.', tags: ['irb', 'guide'], date: 'Sep 2024' },
  { id: 5, title: 'Writing Circle Webinar – Chapter 2 Strategies', provider: 'Vimeo', description: 'Tips and frameworks for writing a strong literature review from Dr. Park and the writing circle cohort.', tags: ['writing', 'webinar'], date: 'Jan 2025' },
  { id: 6, title: 'Alumni Story – Dr. Marcus Bell', provider: 'YouTube', description: 'How Dr. Bell balanced a full-time career with his doctoral program and defended in under three years.', tags: ['alumni', 'story'], date: 'Dec 2024' },
];

export default function MediaPage() {
  const [providerFilter, setProviderFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = mediaItems.filter((m) => {
    const matchesProvider = providerFilter === 'All' || m.provider === providerFilter;
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.tags.some((t) => t.includes(search.toLowerCase()));
    return matchesProvider && matchesSearch;
  });

  return (
    <div>
      <div className="page-header">
        <h1>Media Library</h1>
        <p>Webinars, alumni stories, and recorded sessions</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search videos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: '1 1 260px', maxWidth: 360, padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.87rem', outline: 'none' }}
          onFocus={(e) => (e.target.style.borderColor = '#552B9A')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {['All', 'YouTube', 'Vimeo'].map((p) => (
            <button key={p} onClick={() => setProviderFilter(p)} style={{
              background: providerFilter === p ? '#552B9A' : '#fff',
              color: providerFilter === p ? '#fff' : '#555',
              border: providerFilter === p ? 'none' : '1px solid #ccc',
              padding: '0.35rem 0.75rem',
              borderRadius: '16px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Video grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {filtered.map((item) => (
          <div key={item.id} className="ic-card" style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 14px rgba(107,45,139,0.18)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)')}
          >
            {/* Placeholder thumbnail */}
            <div style={{ width: '100%', height: 160, background: 'linear-gradient(135deg, #552B9A, #3d1f73)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: '1.4rem' }}>▶</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#222' }}>{item.title}</span>
              <span style={{ fontSize: '0.68rem', background: item.provider === 'YouTube' ? '#fee2e2' : '#e0e7ff', color: item.provider === 'YouTube' ? '#991b1b' : '#3730a3', padding: '0.15rem 0.45rem', borderRadius: '10px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {item.provider}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: 1.5, marginBottom: '0.4rem' }}>{item.description}</p>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {item.tags.map((tag) => (
                <span key={tag} style={{ fontSize: '0.67rem', background: '#eee', color: '#666', padding: '0.12rem 0.4rem', borderRadius: '10px' }}>{tag}</span>
              ))}
              <span style={{ fontSize: '0.67rem', color: '#999', marginLeft: 'auto' }}>{item.date}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888', padding: '2rem', fontSize: '0.88rem', gridColumn: '1 / -1' }}>No videos match your search.</p>
        )}
      </div>
    </div>
  );
}