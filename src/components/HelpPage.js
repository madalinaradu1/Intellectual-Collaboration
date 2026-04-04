import React, { useState } from 'react';

const sections = [
  {
    title: 'Getting Started',
    icon: '🚀',
    items: [
      { q: 'How do I log in for the first time?', a: 'Use your @gcu.edu email address. You will receive a verification code via email on first sign-in. After verifying, you can set your password.' },
      { q: 'How do I join a doctoral community?', a: 'Navigate to Groups → browse the directory → click Join Group. Public groups are open; restricted groups require approval from the group admin.' },
      { q: 'Where do I find my dissertation templates?', a: 'Go to Content → filter by "Template" or search "dissertation." Templates are versioned — always download the latest version.' },
    ],
  },
  {
    title: 'Dissertation & Review',
    icon: '📝',
    items: [
      { q: 'How do I submit a chapter for review?', a: 'Go to Review Portal → click "+ New Submission" → select the chapter stage → upload your file → submit. Your committee will be notified automatically.' },
      { q: 'What do the submission statuses mean?', a: 'Pending = awaiting committee action. In Review = a committee member is actively reviewing. Approved = the submission has been cleared.' },
      { q: 'How do I contact my committee?', a: 'Visit LDP → Committees tab to see your committee members and their contact cards. You can also use the Submissions email form for group communication.' },
    ],
  },
  {
    title: 'Forums & Communication',
    icon: '💬',
    items: [
      { q: 'How do I start a new thread?', a: 'Go to Forums → select a forum → click "+ New Thread." Give your thread a clear title and add context in the first post.' },
      { q: 'How do mentions work?', a: 'Type @ followed by a username in any post or reply to notify that person. They will receive an email and/or push notification depending on their preferences.' },
      { q: 'Can I get email notifications for forum activity?', a: 'Yes. Go to My Profile → Notification Preferences and enable Email Notifications. You can also opt into push notifications.' },
    ],
  },
  {
    title: 'Technical Support',
    icon: '🛠',
    items: [
      { q: 'Who do I contact if the platform is down?', a: 'Email ic-support@gcu.edu or contact Campus Technology IT. Response time is typically within 2 business hours during weekdays.' },
      { q: 'My file upload failed — what should I do?', a: 'Supported formats are PDF, DOCX, and XLSX. Max file size is 50 MB. If the upload still fails, try refreshing the page and uploading again.' },
    ],
  },
];

export default function HelpPage() {
  const [openSection, setOpenSection] = useState(0);
  const [openItem, setOpenItem] = useState(null);

  return (
    <div>
      <div className="page-header">
        <h1>Help & Training</h1>
        <p>Guides, policies, support contacts, and training resources</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.85rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'IT Support', detail: 'ic-support@gcu.edu', icon: '📧' },
          { label: 'Campus Technology', detail: '(480) 555-0192', icon: '📞' },
          { label: 'Help Desk Hours', detail: 'Mon–Fri 8AM–6PM MST', icon: '🕐' },
        ].map((c) => (
          <div key={c.label} className="ic-card" style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{c.icon}</div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#222' }}>{c.label}</div>
            <div style={{ fontSize: '0.78rem', color: '#552B9A' }}>{c.detail}</div>
          </div>
        ))}
      </div>

      {/* FAQ accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {sections.map((section, sIdx) => (
          <div key={section.title} className="ic-card" style={{ overflow: 'hidden' }}>
            <button
              onClick={() => { setOpenSection(openSection === sIdx ? -1 : sIdx); setOpenItem(null); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.6rem 0', textAlign: 'left' }}
            >
              <span style={{ fontSize: '1.2rem' }}>{section.icon}</span>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#222', flex: 1 }}>{section.title}</span>
              <span style={{ fontSize: '0.85rem', color: '#552B9A', transform: openSection === sIdx ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
            </button>

            {openSection === sIdx && (
              <div style={{ borderTop: '1px solid #eee', paddingTop: '0.6rem' }}>
                {section.items.map((item, iIdx) => {
                  const key = `${sIdx}-${iIdx}`;
                  const isOpen = openItem === key;
                  return (
                    <div key={key} style={{ borderBottom: iIdx < section.items.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                      <button
                        onClick={() => setOpenItem(isOpen ? null : key)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: '0.55rem 0', textAlign: 'left' }}
                      >
                        <span style={{ fontSize: '0.85rem', color: '#333', fontWeight: 500 }}>{item.q}</span>
                        <span style={{ fontSize: '0.7rem', color: '#888', marginLeft: '0.5rem', flexShrink: 0 }}>{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && (
                        <p style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.6, paddingBottom: '0.55rem', paddingLeft: '0' }}>{item.a}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}