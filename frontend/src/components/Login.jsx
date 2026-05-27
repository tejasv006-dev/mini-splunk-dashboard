import React, { useState } from 'react';
import { loginUser, registerUser } from '../api/authApi';
import { Activity, ShieldAlert, Lock, User, Mail, ShieldCheck } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isLoginTab) {
        // Login flow
        if (!username || !password) {
          setError('Please provide your username or email, and password.');
          setLoading(false);
          return;
        }
        
        const data = await loginUser({
          usernameOrEmail: username,
          password
        });
        
        onLoginSuccess(data);
      } else {
        // Register flow
        if (!username || !email || !password) {
          setError('Please fill in all fields.');
          setLoading(false);
          return;
        }
        
        await registerUser({
          username,
          email,
          password,
          role: 'user' // Default role
        });
        
        // Success: Reset back to login screen so they know they are registered
        setSuccessMessage('Account established successfully! Please authorize session below.');
        setIsLoginTab(true);
        setPassword('');
        setEmail('');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-panel auth-card animate-fade-in">
        <div className="auth-header">
          <div className="auth-brand">
            <Activity color="#3b82f6" size={28} style={{ filter: 'drop-shadow(0 0 10px rgba(59,130,246,0.5))' }} />
            <span>Mini Splunk</span>
          </div>
          <p className="auth-subtitle">SIEM Log Ingestion & Analytics Control Panel</p>
        </div>

        <div className="auth-tabs">
          <button 
            type="button" 
            className={`auth-tab ${isLoginTab ? 'active' : ''}`}
            onClick={() => { setIsLoginTab(true); setError(''); setSuccessMessage(''); }}
          >
            Sign In
          </button>
          <button 
            type="button" 
            className={`auth-tab ${!isLoginTab ? 'active' : ''}`}
            onClick={() => { setIsLoginTab(false); setError(''); setSuccessMessage(''); }}
          >
            Register
          </button>
        </div>

        {successMessage && (
          <div className="animate-fade-in" style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
            color: 'var(--accent-green)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <ShieldCheck size={16} style={{ display: 'inline', flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="auth-error animate-fade-in">
            <ShieldAlert size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <User size={12} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Username {isLoginTab && 'or Email'}
            </label>
            <input 
              type="text" 
              className="form-input" 
              placeholder={isLoginTab ? "Enter username or email" : "Choose a username"} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {!isLoginTab && (
            <div className="form-group animate-fade-in">
              <label className="form-label">
                <Mail size={12} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Email Address
              </label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="Enter email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <Lock size={12} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Security Password
            </label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'Processing Authorization...' : isLoginTab ? 'Authorize & Log In' : 'Establish Security Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
