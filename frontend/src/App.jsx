import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, Database, AlertCircle, Settings as SettingsIcon, LogOut, ShieldAlert, Info } from 'lucide-react';
import Dashboard from './components/Dashboard';
import LogExplorer from './components/LogExplorer';
import AlertRules from './components/AlertRules';
import AppSettings from './components/Settings';
import AboutThis from './components/AboutThis';
import Login from './components/Login';
import { logoutUser } from './api/authApi';
import { fetchIncidents } from './api/alertApi';
import ChatAssistant from './components/ChatAssistant';

function Sidebar({ user, onLogout }) {
  const location = useLocation();
  const navs = [
    { name: 'Overview', path: '/', icon: <Activity size={20} /> },
    { name: 'Log Explorer', path: '/logs', icon: <Database size={20} /> },
    { name: 'Incident Center', path: '/alerts', icon: <AlertCircle size={20} /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon size={20} /> },
    { name: 'About this', path: '/about', icon: <Info size={20} /> },
  ];

  return (
    <div className="sidebar animate-fade-in">
      <div className="sidebar-top">
        <div className="brand">
          <Activity color="var(--accent-blue)" fill="var(--accent-blue)" fillOpacity={0.2} style={{ filter: 'drop-shadow(0 0 8px var(--accent-blue-glow))' }} />
          <span>Mini Splunk</span>
        </div>
        <div className="nav-links">
          {navs.map(nav => (
            <Link 
              key={nav.path} 
              to={nav.path} 
              className={`nav-link ${location.pathname === nav.path ? 'active' : ''}`}
            >
              {nav.icon} <span>{nav.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="user-badge">
          <div className="user-avatar">
            {user?.username?.substring(0, 2).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.username}</span>
            <span className="user-role">{user?.role || 'operator'}</span>
          </div>
        </div>
        <button 
          onClick={onLogout} 
          className="logout-btn"
          title="Revoke access token"
        >
          <LogOut size={16} />
          <span>Term Session</span>
        </button>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [accentTheme, setAccentTheme] = useState('blue');
  
  const alertedIncidentsRef = useRef(new Set());
  const initialLoadRef = useRef(true);

  // Apply visual theme variables to DOM root dynamically
  const applyThemeAccent = (theme) => {
    const root = document.documentElement;
    let color = '#3b82f6';
    let glow = 'rgba(59, 130, 246, 0.45)';
    let border = 'rgba(59, 130, 246, 0.2)';

    if (theme === 'amber') {
      color = '#f59e0b';
      glow = 'rgba(245, 158, 11, 0.45)';
      border = 'rgba(245, 158, 11, 0.2)';
    } else if (theme === 'green') {
      color = '#10b981';
      glow = 'rgba(16, 185, 129, 0.45)';
      border = 'rgba(16, 185, 129, 0.2)';
    } else if (theme === 'purple') {
      color = '#a855f7';
      glow = 'rgba(168, 85, 247, 0.45)';
      border = 'rgba(168, 85, 247, 0.2)';
    }

    root.style.setProperty('--accent-blue', color);
    root.style.setProperty('--accent-blue-glow', glow);
    root.style.setProperty('--border-color-glow', border);
    
    setAccentTheme(theme);
    localStorage.setItem('themeAccent', theme);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const savedTheme = localStorage.getItem('themeAccent') || 'blue';
    
    applyThemeAccent(savedTheme);

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setCheckingAuth(false);
  }, []);

  // Global Incident Poller for in-app Toast Alerts
  useEffect(() => {
    if (!user) return;

    const pollIncidentsForAlerts = async () => {
      try {
        const incidents = await fetchIncidents();
        
        if (initialLoadRef.current) {
          incidents.forEach(inc => alertedIncidentsRef.current.add(inc._id || inc.id));
          initialLoadRef.current = false;
          return;
        }

        incidents.forEach(incident => {
          const incId = incident._id || incident.id;
          if (incident.status === 'ACTIVE' && !alertedIncidentsRef.current.has(incId)) {
            alertedIncidentsRef.current.add(incId);
            triggerToast(`🚨 INCIDENT TRIGGERED: "${incident.ruleName}" on service [${incident.service}]!`);
          }
        });
      } catch (err) {
        console.error("Global alert poller error:", err);
      }
    };

    pollIncidentsForAlerts();
    const interval = setInterval(pollIncidentsForAlerts, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const triggerToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    initialLoadRef.current = true;
    alertedIncidentsRef.current.clear();
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  if (checkingAuth) {
    return (
      <div className="auth-wrapper" style={{ color: 'white', fontSize: '18px', fontWeight: '500' }}>
        Initialing Security Token Handshake...
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Router>
      <div className="app-container">
        
        {/* Floating Toast Notification Container */}
        <div style={{ position: 'fixed', top: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 1000, pointerEvents: 'none' }}>
          {toasts.map(toast => (
            <div 
              key={toast.id} 
              className="glass-panel animate-fade-in" 
              style={{ 
                padding: '16px 22px', 
                borderLeft: '4px solid var(--accent-red)', 
                minWidth: '340px', 
                maxWidth: '420px',
                display: 'flex', 
                alignItems: 'center', 
                gap: '14px', 
                boxShadow: '0 16px 48px rgba(0,0,0,0.65), 0 0 15px rgba(239,68,68,0.05)', 
                background: 'rgba(15,18,24,0.95)',
                pointerEvents: 'auto',
                borderRadius: '12px'
              }}
            >
              <ShieldAlert className="text-error animate-pulse" size={20} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff', lineHeight: '1.4' }}>{toast.message}</span>
            </div>
          ))}
        </div>

        <Sidebar user={user} onLogout={handleLogout} />
        <main className="main-content">
           <Routes>
             <Route path="/" element={<Dashboard accentTheme={accentTheme} />} />
             <Route path="/logs" element={<LogExplorer />} />
             <Route path="/alerts" element={<AlertRules />} />
             <Route path="/settings" element={<AppSettings accentTheme={accentTheme} changeAccentTheme={applyThemeAccent} />} />
             <Route path="/about" element={<AboutThis />} />
           </Routes>
        </main>
        <ChatAssistant />
      </div>
    </Router>
  );
}

export default App;
