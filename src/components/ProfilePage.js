// Edit profile and Teams linking are stubbed pending backend implementation.
import React, { useState } from 'react';
import './ProfilePage.css';

export default function ProfilePage({ user }) {
  const [notifPrefs, setNotifPrefs] = useState({ 
    email: true, 
    push: false, 
    mentions: true 
  });
  const [loading, setLoading] = useState(false);

  const toggleNotification = (key) => {
    setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    // TODO: Save to backend
  };

  const handleEditProfile = async () => {
    setLoading(true);
    try {
      // TODO: Implement profile editing
    } finally {
      setLoading(false);
    }
  };

  const handleLinkTeams = async () => {
    setLoading(true);
    try {
      // TODO: Implement Teams linking
    } finally {
      setLoading(false);
    }
  };

  const userName = user?.attributes?.name || 'User';
  const userEmail = user?.attributes?.email || 'Not provided';
  const userInitial = userName.charAt(0).toUpperCase();

  const notificationOptions = [
    { 
      key: 'email', 
      label: 'Email Notifications', 
      desc: 'Receive updates via email' 
    },
    { 
      key: 'push', 
      label: 'Push Notifications', 
      desc: 'Browser push notifications (opt-in)' 
    },
    { 
      key: 'mentions', 
      label: 'Mentions & Replies', 
      desc: 'Notified when someone replies or @mentions you' 
    },
  ];

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account, notifications, and linked identities</p>
      </div>

      <div className="profile-grid">
        <div className="ic-card profile-info-card">
          <h2>Profile Information</h2>
          
          <div className="profile-header">
            <div className="profile-avatar" aria-hidden="true">
              {userInitial}
            </div>
            <div className="profile-details">
              <div className="profile-name">{userName}</div>
              <div className="profile-role">Doctoral Student</div>
            </div>
          </div>

          <div className="profile-fields">
            <div className="profile-field">
              <span className="field-label">Email</span>
              <span className="field-value">{userEmail}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Program</span>
              <span className="field-value">EDD – Organizational Leadership</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Committee Chair</span>
              <span className="field-value field-value-link">Dr. Sarah Martinez</span>
            </div>
          </div>
          
          <button 
            className="btn-outline" 
            onClick={handleEditProfile}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Edit Profile'}
          </button>
        </div>

        <div className="ic-card notifications-card">
          <h2>Notification Preferences</h2>
          
          <div className="notification-options">
            {notificationOptions.map((option) => (
              <div key={option.key} className="notification-option">
                <div className="option-info">
                  <div className="option-label">{option.label}</div>
                  <div className="option-desc">{option.desc}</div>
                </div>
                
                <button
                  className={`toggle-switch ${notifPrefs[option.key] ? 'active' : ''}`}
                  onClick={() => toggleNotification(option.key)}
                  aria-pressed={notifPrefs[option.key]}
                  aria-label={`Toggle ${option.label}`}
                >
                  <span className="toggle-slider" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>

          {/* Linked Identities Section */}
          <div className="linked-identities">
            <h3>Linked Identities</h3>
            
            <div className="identity-item">
              <span className="identity-name">GCU SSO</span>
              <span className="identity-status connected">Connected</span>
            </div>
            
            <div className="identity-item">
              <span className="identity-name">Microsoft Teams</span>
              <span className="identity-status not-linked">Not linked</span>
              <button 
                className="btn-outline btn-small" 
                onClick={handleLinkTeams}
                disabled={loading}
              >
                {loading ? 'Linking...' : 'Link'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}