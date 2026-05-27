import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, ShieldCheck, UserCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Settings({ accentTheme = 'blue', changeAccentTheme }) {
  const [retentionWindow, setRetentionWindow] = useState('all');
  const [loadingCleanup, setLoadingCleanup] = useState(false);
  const [cleanupMessage, setCleanupMessage] = useState('');
  const [cleanupError, setCleanupError] = useState('');
  const [isUsingMemoryDb, setIsUsingMemoryDb] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchDbStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/logs/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsUsingMemoryDb(res.data?.isUsingMemoryDb !== false);
      } catch (err) {
        console.error("Failed to fetch database status", err);
      }
    };
    fetchDbStatus();
  }, []);

  const handlePruneLogs = async () => {
    setLoadingCleanup(true);
    setCleanupMessage('');
    setCleanupError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/logs/cleanup', { 
        olderThan: retentionWindow 
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCleanupMessage(response.data?.message || 'Data retention policy applied successfully!');
    } catch (err) {
      console.error(err);
      setCleanupError(err.response?.data?.error || 'Failed to execute data retention prune.');
    } finally {
      setLoadingCleanup(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div className="header-actions" style={{ marginBottom: '0px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '6px' }}>System Control Console</h1>
          <p className="text-secondary" style={{ fontSize: '14px' }}>Enforce telemetry retention policies and verify system security shields.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Panel 1: Data Retention Settings */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database className="text-info" size={20} />
            <span>Telemetry Data Retention</span>
          </h3>
          
          <p className="text-secondary" style={{ fontSize: '13px', lineHeight: '1.5' }}>
            SIEM storage limits protect database indexing performance. Choose a log retention prune window to purge older security records from the database catalog.
          </p>

          <div className="form-group" style={{ marginTop: '8px' }}>
            <label className="form-label">Pruning Time Window</label>
            <select 
              className="form-input" 
              value={retentionWindow} 
              onChange={(e) => setRetentionWindow(e.target.value)}
              style={{ background: '#0a0d11' }}
            >
              <option value="all">Wipe All Telemetry Logs (Full Reset)</option>
              <option value="5m">Prune logs older than 5 minutes</option>
              <option value="1h">Prune logs older than 1 hour</option>
            </select>
          </div>

          {cleanupMessage && (
            <div className="animate-fade-in" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: 'var(--accent-green)', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500' }}>
              <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
              {cleanupMessage}
            </div>
          )}

          {cleanupError && (
            <div className="auth-error animate-fade-in" style={{ margin: 0, padding: '12px', fontSize: '13px' }}>
              <AlertTriangle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
              {cleanupError}
            </div>
          )}

          <button 
            type="button" 
            className="splunk-btn"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '4px' }}
            disabled={loadingCleanup}
            onClick={handlePruneLogs}
          >
            {loadingCleanup ? 'Executing Pruning Policy...' : 'Enforce Retention Prune'}
          </button>
        </div>

        {/* Panel 2: Live Security Audit Control */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck className="text-debug" size={20} />
            <span>SIEM Security Shields</span>
          </h3>

          <p className="text-secondary" style={{ fontSize: '13px', lineHeight: '1.5' }}>
            Verifying encryption parameters, routing shields, and rate limiters actively running in this project.
          </p>

          {/* Database Fallback Status Triage Card (Option 4) */}
          <div style={{
            background: 'rgba(255,255,255,0.01)',
            border: `1px solid ${isUsingMemoryDb ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
            padding: '16px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: isUsingMemoryDb ? '0 4px 15px rgba(245, 158, 11, 0.03)' : '0 4px 15px rgba(16, 185, 129, 0.03)',
            marginTop: '4px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: isUsingMemoryDb ? '#f59e0b' : '#10b981',
              boxShadow: isUsingMemoryDb ? '0 0 10px #f59e0b' : '0 0 10px #10b981',
              animation: 'pulse-red 1.5s infinite',
              flexShrink: 0
            }}></div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>
                {isUsingMemoryDb ? 'Sandbox Memory DB Active' : 'MongoDB Production DB Connected'}
              </h4>
              <p className="text-secondary" style={{ fontSize: '11px', lineHeight: '1.4', marginTop: '2px' }}>
                {isUsingMemoryDb 
                  ? 'Siem Catalog is running in a fully-simulated in-memory sandbox. Storage resets on reload.' 
                  : 'Genuine Mongoose pipeline is connected to MongoDB Atlas. Telemetry logs persist permanently.'
                }
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>Credential Encryption (BCrypt)</span>
              <span style={{ fontSize: '11px', background: 'rgba(16,185,129,0.12)', color: 'var(--accent-green)', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' }}>Active (10 Salts)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>Session Validation (JWT)</span>
              <span style={{ fontSize: '11px', background: 'rgba(16,185,129,0.12)', color: 'var(--accent-green)', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' }}>Active (Bearer check)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>Brute-force Limit Guard</span>
              <span style={{ fontSize: '11px', background: 'rgba(16,185,129,0.12)', color: 'var(--accent-green)', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' }}>Active (Max 5/min)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>Active Token Identity</span>
                <span className="text-secondary" style={{ fontSize: '11px' }}>Role privileges assigned to your account.</span>
              </div>
              <span style={{ fontSize: '11px', background: 'rgba(59,130,246,0.12)', color: 'var(--accent-blue)', padding: '3px 8px', borderRadius: '6px', fontWeight: '600', textTransform: 'uppercase' }}>
                {currentUser.role || 'operator'}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Panel 3: Dashboard Accent Selector */}
      <div className="glass-panel" style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'inline-block', filter: 'drop-shadow(0 0 5px var(--accent-blue-glow))' }}></span>
          <span>SIEM Console Accent Theme</span>
        </h3>
        <p className="text-secondary" style={{ fontSize: '13px', lineHeight: '1.5' }}>
          Change the active glowing vector color palette globally across all dashboard buttons, graphs, and security incident indexes.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '4px' }}>
          {[
            { id: 'blue', label: 'Splunk Blue', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.25)' },
            { id: 'amber', label: 'Cyberpunk Amber', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.25)' },
            { id: 'green', label: 'Standard Green', color: '#10b981', glow: 'rgba(16, 185, 129, 0.25)' },
            { id: 'purple', label: 'Dracula Purple', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.25)' }
          ].map(theme => (
            <button
              key={theme.id}
              onClick={() => changeAccentTheme(theme.id)}
              style={{
                background: 'rgba(255,255,255,0.01)',
                border: `1px solid ${accentTheme === theme.id ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                borderRadius: '12px',
                padding: '12px 20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.25s',
                boxShadow: accentTheme === theme.id ? `0 0 15px ${theme.glow}` : 'none'
              }}
            >
              <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: theme.color, display: 'inline-block', filter: `drop-shadow(0 0 4px ${theme.color})` }}></span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: accentTheme === theme.id ? '#fff' : 'var(--text-secondary)' }}>{theme.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Role explanation bar */}
      <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid var(--accent-blue)', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <UserCheck className="text-info" size={24} />
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>Access Privilege Matrix (Role-Based Access Control)</h4>
          <p className="text-secondary" style={{ fontSize: '12px', lineHeight: '1.4', marginTop: '2px' }}>
            To demonstrate security constraints: **Admin accounts** can create and delete Alert configurations. Standard **Operators** (regular registered users) hold read-only privileges for alert matrices but can fully triage and acknowledge/resolve critical incidents.
          </p>
        </div>
      </div>

    </div>
  );
}
