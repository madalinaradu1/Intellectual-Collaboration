import React, { useState } from 'react';

const forums = [
  { id: 1, groupName: 'EDD Community', title: 'General Discussion', threads: 24, lastPost: '2 hours ago' },
  { id: 2, groupName: 'EDD Community', title: 'Dissertation Tips & Tricks', threads: 18, lastPost: '5 hours ago' },
  { id: 3, groupName: 'DBA Community', title: 'Research Methods', threads: 31, lastPost: '1 day ago' },
  { id: 4, groupName: 'PHD Community', title: 'Writing & Publishing', threads: 42, lastPost: '3 hours ago' },
  { id: 5, groupName: 'DNP Community', title: 'Clinical Practicum', threads: 11, lastPost: '2 days ago' },
];

const threads = [
  { id: 1, title: 'Best approach for mixed-methods research design?', author: 'Sarah K.', posts: 8, lastPost: '2 hours ago', pinned: true },
  { id: 2, title: 'How to structure Chapter 2 – Literature Review', author: 'James L.', posts: 12, lastPost: '4 hours ago', pinned: true },
  { id: 3, title: 'APA 7th Edition formatting tips', author: 'Maria G.', posts: 5, lastPost: '1 day ago', pinned: false },
  { id: 4, title: 'Balancing work and dissertation – anyone else struggling?', author: 'Emily T.', posts: 19, lastPost: '6 hours ago', pinned: false },
  { id: 5, title: 'IRB submission timeline – what to expect', author: 'David R.', posts: 7, lastPost: '2 days ago', pinned: false },
];

const posts = [
  { id: 1, author: 'Sarah K.', avatar: 'SK', body: 'I\'ve been going back and forth on this. My advisor suggested a sequential explanatory design, but I\'m wondering if an exploratory sequential might fit better given my research questions. Has anyone navigated this decision?', time: 'Jan 29, 2025 – 10:15 AM' },
  { id: 2, author: 'Dr. Martinez', avatar: 'SM', body: 'Great question, Sarah. The key differentiator is whether you want your qualitative findings to inform your quantitative instrument design. If so, exploratory sequential is the way to go. Happy to discuss in office hours.', time: 'Jan 29, 2025 – 11:02 AM' },
  { id: 3, author: 'James L.', avatar: 'JL', body: 'I went with sequential explanatory for my dissertation and it worked well. The important thing is being able to defend your choice in Chapter 3. Make sure your research questions clearly align with your design.', time: 'Jan 29, 2025 – 2:30 PM' },
  { id: 4, author: 'Chris M.', avatar: 'CM', body: 'One thing that helped me was creating a design matrix mapping each research question to the method and data source. Made the justification much easier to write.', time: 'Jan 30, 2025 – 9:45 AM' },
];

export default function ForumsPage() {
  const [view, setView] = useState('forums'); // forums | threads | posts
  const [selectedForum, setSelectedForum] = useState(null);
  const [selectedThread, setSelectedThread] = useState(null);
  const [newPost, setNewPost] = useState('');

  // Navigation helpers
  const goToForum = (forum) => { setSelectedForum(forum); setView('threads'); setSelectedThread(null); };
  const goToThread = (thread) => { setSelectedThread(thread); setView('posts'); };
  const goBack = () => {
    if (view === 'posts') { setView('threads'); setSelectedThread(null); }
    else { setView('forums'); setSelectedForum(null); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Forums & Messaging</h1>
        <p>Discuss, collaborate, and connect with your communities</p>
      </div>

      {/* Breadcrumb */}
      {view !== 'forums' && (
        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button className="btn-outline" onClick={goBack} style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>← Back</button>
          <span>{selectedForum?.groupName} &rsaquo; {selectedForum?.title}{view === 'posts' ? ` › ${selectedThread?.title}` : ''}</span>
        </div>
      )}

      {/* FORUMS LIST */}
      {view === 'forums' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#666' }}>{forums.length} forums</span>
            <button className="btn-purple">+ Create Forum</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {forums.map((f) => (
              <div key={f.id} className="ic-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'box-shadow 0.15s' }}
                onClick={() => goToForum(f)}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 14px rgba(107,45,139,0.18)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)')}
              >
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#552B9A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>💬</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#222', fontSize: '0.9rem' }}>{f.title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#888' }}>{f.groupName} &nbsp;|&nbsp; {f.threads} threads &nbsp;|&nbsp; Last post: {f.lastPost}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* THREADS LIST */}
      {view === 'threads' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', color: '#552B9A', margin: 0 }}>{selectedForum?.title}</h2>
            <button className="btn-purple">+ New Thread</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {threads.map((t) => (
              <div key={t.id} className="ic-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.85rem', transition: 'box-shadow 0.15s' }}
                onClick={() => goToThread(t)}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 14px rgba(107,45,139,0.18)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)')}
              >
                {t.pinned && <span style={{ fontSize: '0.68rem', background: '#fff3cd', color: '#856404', padding: '0.2rem 0.5rem', borderRadius: '10px', fontWeight: 600, whiteSpace: 'nowrap' }}>📌 Pinned</span>}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#222', fontSize: '0.88rem' }}>{t.title}</div>
                  <div style={{ fontSize: '0.76rem', color: '#888' }}>by {t.author} &nbsp;|&nbsp; {t.posts} posts &nbsp;|&nbsp; {t.lastPost}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POSTS VIEW */}
      {view === 'posts' && (
        <div>
          <h2 style={{ fontSize: '1.05rem', color: '#222', marginBottom: '1rem' }}>{selectedThread?.title}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {posts.map((p) => (
              <div key={p.id} className="ic-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#552B9A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>
                    {p.avatar}
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#222' }}>{p.author}</span>
                    <span style={{ fontSize: '0.72rem', color: '#999', marginLeft: '0.5rem' }}>{p.time}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.87rem', color: '#444', lineHeight: 1.6, paddingLeft: '2.6rem' }}>{p.body}</p>
              </div>
            ))}
          </div>

          {/* New post box */}
          <div className="ic-card" style={{ marginTop: '1rem' }}>
            <textarea
              placeholder="Write a reply..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.87rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
              onFocus={(e) => (e.target.style.borderColor = '#552B9A')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
            />
            <button className="btn-purple" style={{ marginTop: '0.6rem' }} onClick={() => setNewPost('')}>Post Reply</button>
          </div>
        </div>
      )}
    </div>
  );
}