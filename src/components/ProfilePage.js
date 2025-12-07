import React from 'react';
import './ProfilePage.css';

const ProfilePage = ({ user }) => {
  return (
    <div className="profile-page">
      <div className="profile-content">
        <h1>Profile</h1>
        <div className="profile-info">
          <p><b>Username:</b> {user.username}</p>
          <p><b>Email:</b> {user.attributes?.email || 'Not provided'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;