import React, { useState } from 'react';
import { signIn } from 'aws-amplify/auth';
import './LoginPage.css';

export default function LoginPage({ onSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn({ username: email, password });
      onSignIn();
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Intellectual Collaboration</h1>
        <form onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}