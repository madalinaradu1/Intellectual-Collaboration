import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      setUser({ ...currentUser, attributes });
    } catch (error) {
      setUser(null);
    }
    setLoading(false);
  };

  const signOut = async () => {
    try {
      await amplifySignOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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
            <Route path="/ldp" element={<LDPPage />} />
            <Route path="/review" element={<ReviewPortalPage user={user} />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/forums" element={<ForumsPage />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/admin" element={<AdminPage />} />
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