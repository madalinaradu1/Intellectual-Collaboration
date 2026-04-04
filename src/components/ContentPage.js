import React, { useState } from 'react';

const contentItems = [
  { id: 1, title: 'Dissertation & Thesis Template', type: 'Template', group: 'Dissertation Resources', tags: ['template', 'dissertation'], updated: 'Jan 20, 2025', version: 3 },
  { id: 2, title: 'Milestone Guide v.10', type: 'Guide', group: 'Dissertation Resources', tags: ['milestone', 'guide'], updated: 'Jan 10, 2025', version: 10 },
  { id: 3, title: 'Quant Companion Guide', type: 'Guide', group: 'Research Training', tags: ['quantitative', 'research'], updated: 'Dec 15, 2024', version: 2 },
  { id: 4, title: 'Qual Companion Guide', type: 'Guide', group: 'Research Training', tags: ['qualitative', 'research'], updated: 'Dec 10, 2024', version: 1 },
  { id: 5, title: 'Permission Letter Sample', type: 'Template', group: 'Dissertation Resources', tags: ['template', 'permission'], updated: 'Nov 28, 2024', version: 1 },
  { id: 6, title: 'IRB Submission Checklist', type: 'Checklist', group: 'Research Training', tags: ['irb', 'checklist'], updated: 'Jan 5, 2025', version: 4 },
];

export default function ContentPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const types = ['All', ...new Set(contentItems.map((c) => c.type))];

  const filtered = contentItems.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some((t) => t.includes(search.toLowerCase()));
    const matchesType = typeFilter === 'All' || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="page-header">
        <h1>Content & Documents</h1>
        <p>Browse articles, templates, and uploaded resources</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: '1 1 260px', maxWidth: 380, padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.87rem', outline: 'none' }}
          onFocus={(e) => (e.target.style.borderColor = '#552B9A')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {types.map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{
              background: typeFilter === t ? '#552B9A' : '#fff',
              color: typeFilter === t ? '#fff' : '#555',
              border: typeFilter === t ? 'none' : '1px solid #ccc',
              padding: '0.35rem 0.75rem',
              borderRadius: '16px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}>
              {t}
            </button>
          ))}
        </div>
        <button className="btn-purple" style={{ marginLeft: 'auto' }}>⬆ Upload</button>
      </div>

      {/* Content list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {filtered.map((item) => (
          <div key={item.id} className="ic-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'box-shadow 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 14px rgba(107,45,139,0.18)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)')}
          >
            <div style={{ width: 44, height: 44, borderRadius: '8px', background: '#f0e6f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>📄</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#222' }}>{item.title}</div>
              <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.2rem' }}>
                {item.group} &nbsp;|&nbsp; v{item.version} &nbsp;|&nbsp; Updated {item.updated}
              </div>
              <div style={{ marginTop: '0.3rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {item.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: '0.68rem', background: '#eee', color: '#666', padding: '0.15rem 0.45rem', borderRadius: '10px' }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.7rem', background: '#fff3cd', color: '#856404', padding: '0.15rem 0.5rem', borderRadius: '10px', fontWeight: 600 }}>{item.type}</span>
              <button className="btn-outline" style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}>⬇ Download</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888', padding: '2rem', fontSize: '0.88rem' }}>No content matches your search.</p>
        )}
      </div>
    </div>
  );
}