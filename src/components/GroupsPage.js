// Data is static until a Groups API is implemented.
import React, { useState } from 'react';
import { FiUsers, FiActivity } from 'react-icons/fi';

const groups = [
  { id: 1, name: 'EDD Community', members: 142, description: 'Doctor of Education in Organizational Leadership', visibility: 'Public', activity: 'High' },
  { id: 2, name: 'DBA Community', members: 89, description: 'Doctor of Business Administration', visibility: 'Public', activity: 'High' },
  { id: 3, name: 'DHA Community', members: 56, description: 'Doctor of Health Administration', visibility: 'Public', activity: 'Medium' },
  { id: 4, name: 'PHD Community', members: 203, description: 'Doctor of Philosophy – Cross-Disciplinary', visibility: 'Public', activity: 'High' },
  { id: 5, name: 'DNP Community', members: 71, description: 'Doctor of Nursing Practice', visibility: 'Public', activity: 'Medium' },
  { id: 6, name: 'Dissertation Writing Circle', members: 34, description: 'Peer support group for active dissertation writers', visibility: 'Public', activity: 'Low' },
  { id: 7, name: 'Research Methods Study Group', members: 28, description: 'Collaborative study for mixed-methods research', visibility: 'Members Only', activity: 'Medium' },
];

export default function GroupsPage() {
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.description.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedGroup) {
    const g = selectedGroup;
    return (
      <div>
        <div className="page-header">
          <button className="btn-outline" onClick={() => setSelectedGroup(null)} style={{ marginBottom: '0.75rem', fontSize: '0.8rem' }}>← Back to Groups</button>
          <h1>{g.name}</h1>
          <p>{g.description} &nbsp;|&nbsp; {g.members} members</p>
        </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
          {['About', 'Members', 'Resources', 'Files', 'Calendar'].map((tab) => (
            <button key={tab} style={{ background: tab === 'About' ? '#552B9A' : 'transparent', color: tab === 'About' ? '#fff' : '#555', border: 'none', padding: '0.45rem 0.9rem', borderRadius: '5px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>
              {tab}
            </button>
          ))}
        </div>

        <div className="ic-card">
          <h2>About {g.name}</h2>
          <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: 1.6 }}>
            {g.description}. This community brings together doctoral students to share resources,
            collaborate on research, and support one another through the dissertation process.
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.6rem' }}>
            <button className="btn-purple">Join Group</button>
            <button className="btn-outline">View Forums</button>
          </div>
        </div>

        <div className="ic-card" style={{ marginTop: '1rem' }}>
          <h2>Recent Members</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.6rem' }}>
            {['Sarah K.', 'James L.', 'Maria G.', 'David R.', 'Emily T.', 'Chris M.'].map((name) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f7f3fa', borderRadius: '7px', padding: '0.5rem 0.65rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#552B9A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                  {name.charAt(0)}
                </div>
                <span style={{ fontSize: '0.8rem', color: '#333' }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Groups</h1>
        <p>Discover and join doctoral communities</p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.25rem' }}>
        <input
          type="text"
          placeholder="Search groups..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: 420, padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.88rem', outline: 'none' }}
          onFocus={(e) => (e.target.style.borderColor = '#552B9A')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />
      </div>

      {/* Group cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {filtered.map((g) => (
          <div key={g.id} className="ic-card" style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
            onClick={() => setSelectedGroup(g)}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 14px rgba(107,45,139,0.18)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h2 style={{ borderBottom: 'none', marginBottom: '0.25rem', paddingBottom: 0 }}>{g.name}</h2>
              <span style={{ fontSize: '0.7rem', background: g.visibility === 'Public' ? '#d4edda' : '#fff3cd', color: g.visibility === 'Public' ? '#155724' : '#856404', padding: '0.15rem 0.45rem', borderRadius: '10px', fontWeight: 600 }}>
                {g.visibility}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#555', marginBottom: '0.6rem' }}>{g.description}</p>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.76rem', color: '#888' }}>
              <span><FiUsers size={13} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />{g.members} members</span>
              <span><FiActivity size={13} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />{g.activity} activity</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}