import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { getCurrentUser, signOut as amplifySignOut, fetchUserAttributes } from 'aws-amplify/auth';
import awsExports from './aws-exports';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import LDPPage from './components/LDPPage';
import ReviewPortalPage from './components/ReviewPortalPage';
import GroupsPage from './components/GroupsPage';
import ContentPage from './components/ContentPage';
import ForumsPage from './components/ForumsPage';
import MediaPage from './components/MediaPage';
import CalendarPage from './components/CalendarPage';
import AdminPage from './components/AdminPage';
import HelpPage from './components/HelpPage';
import LoginPage from './components/LoginPage';
import './App.css';

Amplify.configure(awsExports);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuthState = useCallback(async () => {
    try {
      setError(null);
      const [currentUser, attributes] = await Promise.all([getCurrentUser(), fetchUserAttributes()]);
      setUser({ ...currentUser, attributes });
    } catch (err) {
      setUser(null);
      if (err.name !== 'UserUnAuthenticatedException') {
        console.warn('Auth check failed:', err);
        setError('Authentication check failed. Please try refreshing the page.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await amplifySignOut();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Sign out failed. Please try again.');
    }
  }, []);

  useEffect(() => { checkAuthState(); }, [checkAuthState]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Intellectual Collaboration...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn-purple">
          Refresh Page
        </button>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onSignIn={checkAuthState} />;
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} signOut={signOut} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/ldp" element={<LDPPage user={user} />} />
            <Route path="/review" element={<ReviewPortalPage user={user} />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/forums" element={<ForumsPage user={user} />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/calendar" element={<CalendarPage user={user} />} />
            <Route path="/admin" element={<AdminPage user={user} />} />
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route path="/help" element={<HelpPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;