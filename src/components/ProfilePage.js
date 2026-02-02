import React, { useState } from 'react';
import './ProfilePage.css';

export default function ProfilePage({ user }) {
  const [notifPrefs, setNotifPrefs] = useState({ email: true, push: false, mentions: true });

  const toggle = (key) => setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account, notifications, and linked identities</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Profile card */}
        <div className="ic-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#552B9A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0 }}>
              {(user?.username || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222' }}>{user?.username || 'User'}</div>
              <div style={{ fontSize: '0.82rem', color: '#888' }}>Doctoral Student</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: '0.82rem', color: '#888' }}>Email</span>
              <span style={{ fontSize: '0.82rem', color: '#333' }}>{user?.attributes?.email || 'Not provided'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: '0.82rem', color: '#888' }}>Program</span>
              <span style={{ fontSize: '0.82rem', color: '#333' }}>EDD – Organizational Leadership</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: '0.82rem', color: '#888' }}>Committee Chair</span>
              <span style={{ fontSize: '0.82rem', color: '#552B9A' }}>Dr. Sarah Martinez</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span style={{ fontSize: '0.82rem', color: '#888' }}>Member Since</span>
              <span style={{ fontSize: '0.82rem', color: '#333' }}>Sep 2023</span>
            </div>
          </div>
          <button className="btn-outline" style={{ marginTop: '1rem' }}>Edit Profile</button>
        </div>

        {/* Notifications */}
        <div className="ic-card">
          <h2>Notification Preferences</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
              { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications (opt-in)' },
              { key: 'mentions', label: 'Mentions & Replies', desc: 'Notified when someone replies or @mentions you' },
            ].map((pref) => (
              <div key={pref.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid #f0f0f0' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#222' }}>{pref.label}</div>
                  <div style={{ fontSize: '0.76rem', color: '#888' }}>{pref.desc}</div>
                </div>
                <div
                  onClick={() => toggle(pref.key)}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: notifPrefs[pref.key] ? '#552B9A' : '#ccc',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#fff',
                    position: 'absolute',
                    top: 2,
                    left: notifPrefs[pref.key] ? 22 : 2,
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem' }}>Linked Identities</h2>
            <div style={{ fontSize: '0.85rem', color: '#555', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
              GCU SSO &nbsp;— <span style={{ color: '#28a745', fontWeight: 600 }}>Connected</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#555', padding: '0.5rem 0' }}>
              Microsoft Teams &nbsp;— <span style={{ color: '#888' }}>Not linked</span>
              <button className="btn-outline" style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', marginLeft: '0.5rem' }}>Link</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}