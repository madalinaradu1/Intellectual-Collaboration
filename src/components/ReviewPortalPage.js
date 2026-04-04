import React from 'react';

const submissions = [
  { id: 1, title: 'Dissertation Proposal', stage: 'Approved', submitted: 'Dec 10, 2024', lastAction: 'Dr. Martinez approved – Dec 18' },
  { id: 2, title: 'Chapter 1 – Introduction', stage: 'Approved', submitted: 'Dec 20, 2024', lastAction: 'Dr. Chen approved – Jan 5' },
  { id: 3, title: 'Chapter 2 – Literature Review', stage: 'In Review', submitted: 'Jan 15, 2025', lastAction: 'Dr. Park reviewing – Jan 20' },
  { id: 4, title: 'Chapter 3 – Methodology', stage: 'Pending', submitted: 'Jan 28, 2025', lastAction: 'Awaiting committee – Jan 28' },
];

const activityLog = [
  { actor: 'Dr. Park', action: 'Opened Chapter 2 for review', time: 'Jan 20, 2025 – 3:14 PM' },
  { actor: 'Dr. Chen', action: 'Downloaded Chapter 1 final version', time: 'Jan 5, 2025 – 10:02 AM' },
  { actor: 'Dr. Martinez', action: 'Approved Dissertation Proposal', time: 'Dec 18, 2024 – 2:45 PM' },
  { actor: 'You', action: 'Uploaded Chapter 3 – Methodology', time: 'Jan 28, 2025 – 9:30 AM' },
];

/* Workflow tracker visual */
function WorkflowTracker({ stage }) {
  const stages = ['Pending', 'In Review', 'Approved'];
  const currentIdx = stages.indexOf(stage);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
      {stages.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i <= currentIdx ? '#552B9A' : '#e0e0e0',
              color: i <= currentIdx ? '#fff' : '#999',
              fontSize: '0.75rem', fontWeight: 700,
            }}>
              {i < currentIdx ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: '0.68rem', color: i === currentIdx ? '#552B9A' : '#888', marginTop: '0.25rem', fontWeight: i === currentIdx ? 600 : 400 }}>{s}</span>
          </div>
          {i < stages.length - 1 && (
            <div style={{ width: 40, height: 3, background: i < currentIdx ? '#552B9A' : '#e0e0e0', margin: '0 0.15rem', marginBottom: '1.2rem' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

const STAGE_BADGE = {
  'Approved': 'badge badge-approved',
  'In Review': 'badge badge-review',
};
function stageBadge(stage) { return STAGE_BADGE[stage] ?? 'badge badge-pending'; }

export default function ReviewPortalPage() {
  return (
    <div>
      <div className="page-header">
        <h1>Review Portal</h1>
        <p>Track your dissertation submissions and committee workflow</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Submissions list */}
        <div>
          <div className="ic-card">
            <h2>My Submissions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {submissions.map((sub) => (
                <div key={sub.id} style={{ background: '#f7f3fa', borderRadius: '8px', padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.88rem', color: '#222' }}>{sub.title}</strong>
                    <span className={stageBadge(sub.stage)}>{sub.stage}</span>
                  </div>
                  <WorkflowTracker stage={sub.stage} />
                  <div style={{ marginTop: '0.5rem', fontSize: '0.76rem', color: '#888' }}>
                    Submitted: {sub.submitted}&nbsp;&nbsp;|&nbsp;&nbsp;{sub.lastAction}
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-purple" style={{ marginTop: '1rem' }}>+ New Submission</button>
          </div>
        </div>

        {/* Activity log */}
        <div className="ic-card">
          <h2>Activity Log</h2>
          <p style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.75rem' }}>Who viewed, edited, or downloaded your files</p>
          <ul style={{ listStyle: 'none' }}>
            {activityLog.map((log, i) => (
              <li key={i} style={{ display: 'flex', gap: '0.6rem', padding: '0.55rem 0', borderBottom: i < activityLog.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#552B9A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
                  {log.actor.charAt(0)}
                </div>
                <div>
                  <span style={{ fontSize: '0.82rem', color: '#333' }}><strong>{log.actor}</strong> {log.action}</span>
                  <div style={{ fontSize: '0.72rem', color: '#999' }}>{log.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}