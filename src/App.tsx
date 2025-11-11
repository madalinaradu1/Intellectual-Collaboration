import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Dashboard from './components/Dashboard';
import './App.css';

interface AppProps {
  signOut?: () => void;
  user?: any;
}

function App({ signOut, user }: AppProps) {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard/*" element={<Dashboard signOut={signOut!} user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default withAuthenticator(App, {
  socialProviders: [],
  signUpAttributes: ['email'],
  loginMechanisms: ['email'],
  formFields: {
    signUp: {
      email: {
        order: 1,
        placeholder: 'Enter your GCU email address',
        label: 'Email Address *'
      },
      password: {
        order: 2,
        placeholder: 'Enter your password',
        label: 'Password *'
      },
      confirm_password: {
        order: 3,
        placeholder: 'Confirm your password',
        label: 'Confirm Password *'
      }
    },
    signIn: {
      username: {
        placeholder: 'Enter your email address',
        label: 'Email Address'
      }
    }
  },
  components: {
    Header() {
      return (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <h1 style={{ color: '#522398', margin: 0, fontSize: '2.5rem' }}>Intellectual Collaboration Platform</h1>
        </div>
      );
    }
  }
});
