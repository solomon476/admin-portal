import React, { useState } from 'react';
import { School } from 'lucide-react';
import { api } from '../lib/api';
import SomoBloomLogo from '../components/layout/SomoBloomLogo';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password: password.trim()
      });

      if (response.user && response.user.role !== 'admin') {
        throw new Error('Access denied: You must be an admin.');
      }

      localStorage.setItem('somobloom_token', response.token);
      localStorage.setItem('somobloom_user', JSON.stringify(response.user));
      onLogin();
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <SomoBloomLogo size={48} fontSize="20px" />
        </div>
        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to access the school control room.</p>
        {error && <div className="login-error">{error}</div>}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              className="input"
              type="email"
              placeholder="admin@school.ke"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4 }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 20, textAlign: 'center' }}>
          Admin access only. Other portals require separate login.
        </p>
      </div>
    </div>
  );
}
