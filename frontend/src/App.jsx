<<<<<<< HEAD
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, Database, AlertCircle, Settings } from 'lucide-react';
import Dashboard from './components/Dashboard';
=======
import { useState, useEffect } from 'react';
import AlignmentControl from './components/AlignmentControl';
import Heatmap from './components/Heatmap';
import ClinicalSidebar from './components/ClinicalSidebar';
import SequencePreview from './components/SequencePreview';
import { Activity } from 'lucide-react';
import './App.css';
>>>>>>> 11458ff744d512d168d282e09747eec9688275df

function Sidebar() {
  const location = useLocation();
  const navs = [
    { name: 'Overview', path: '/', icon: <Activity size={20} /> },
    { name: 'Log Explorer', path: '/logs', icon: <Database size={20} /> },
    { name: 'Alert Rules', path: '/alerts', icon: <AlertCircle size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
<<<<<<< HEAD
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
=======
    <div className="app-container" style={{ padding: '2rem', maxWidth: '1440px', margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--accent-glow)', padding: '0.75rem', borderRadius: '12px' }}>
          <Activity color="var(--accent-primary)" size={32} />
        </div>
        <div>
          <h1 className="title-glow" style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0 }}>Smith-Waterman Alignment</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Rare Disease Diagnostic Engine</p>
        </div>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <AlignmentControl params={params} setParams={setParams} />
          <ClinicalSidebar patientSeq={params.patientSeq} refSeq={params.refSeq} alignmentData={alignmentData} />
        </div>
        
        <div className="glass-panel" style={{ padding: '2rem', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Dynamic Programming Matrix</span>
            {alignmentData && <span style={{ fontSize: '0.9rem', color: 'var(--accent-primary)' }}>Optimal Score: {alignmentData.score}</span>}
          </h2>
          
          <SequencePreview alignmentData={alignmentData} />

          {alignmentData ? (
             <Heatmap data={alignmentData} />
          ) : (
            <div style={{ margin: 'auto', color: 'var(--text-muted)' }}>Calculating Alignment...</div>
          )}
        </div>
      </main>
>>>>>>> 11458ff744d512d168d282e09747eec9688275df
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
             <Route path="/logs" element={<div className="animate-fade-in"><h1 style={{fontSize: '28px', marginBottom: '8px'}}>Log Explorer</h1><p className="text-secondary">Coming soon in phase 2.</p></div>} />
           </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
