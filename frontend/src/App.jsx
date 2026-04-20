import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, Database, AlertCircle, Settings } from 'lucide-react';
import Dashboard from './components/Dashboard';
import LogExplorer from './components/LogExplorer';
import AlertRules from './components/AlertRules';
import AppSettings from './components/Settings';

function Sidebar() {
  const location = useLocation();
  const navs = [
    { name: 'Overview', path: '/', icon: <Activity size={20} /> },
    { name: 'Log Explorer', path: '/logs', icon: <Database size={20} /> },
    { name: 'Alert Rules', path: '/alerts', icon: <AlertCircle size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="sidebar">
      <div className="brand">
        <Activity color="#3b82f6" fill="#3b82f6" fillOpacity={0.2} /> Mini Splunk
      </div>
      <div className="nav-links">
        {navs.map(nav => (
          <Link 
            key={nav.path} 
            to={nav.path} 
            className={`nav-link ${location.pathname === nav.path ? 'active' : ''}`}
          >
            {nav.icon} {nav.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
           <Routes>
             <Route path="/" element={<Dashboard />} />
             <Route path="/logs" element={<LogExplorer />} />
             <Route path="/alerts" element={<AlertRules />} />
             <Route path="/settings" element={<AppSettings />} />
           </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
