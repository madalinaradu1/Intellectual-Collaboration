import React, { useState, useCallback } from 'react';
import './ProfilePage.css';

/**
 * ProfilePage component for managing user profile and settings
 * Displays user information, notification preferences, and linked identities
 * @param {Object} user - Current authenticated user object
 */
export default function ProfilePage({ user }) {
  // Notification preferences state
  const [notifPrefs, setNotifPrefs] = useState({ 
    email: true, 
    push: false, 
    mentions: true 
  });
  
  // Loading state for async operations
  const [loading, setLoading] = useState(false);

  /**
   * Toggles notification preference
   * @param {string} key - Preference key to toggle
   */
  const toggleNotification = useCallback((key) => {
    setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    // TODO: Save to backend when API is ready
  }, []);

  /**
   * Handles profile edit action
   */
  const handleEditProfile = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Implement profile editing functionality
      console.log('Edit profile clicked');
    } catch (error) {
      console.error('Failed to edit profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handles linking Microsoft Teams
   */
  const handleLinkTeams = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Implement Teams linking functionality
      console.log('Link Teams clicked');
    } catch (error) {
      console.error('Failed to link Teams:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Extract user information with fallbacks
  const userName = user?.attributes?.name || 'User';
  const userEmail = user?.attributes?.email || 'Not provided';
  const userInitial = userName.charAt(0).toUpperCase();

  // Notification preferences configuration
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
        {/* Profile Information Card */}
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

        {/* Notification Preferences Card */}
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