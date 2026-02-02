import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
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
import './App.css';

Amplify.configure(awsExports);

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
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
      )}
    </Authenticator>
  );
}

export default App;