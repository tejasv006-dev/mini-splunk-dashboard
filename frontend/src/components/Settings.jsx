import React from 'react';
import { Settings as SettingsIcon, Database, Shield, Bell } from 'lucide-react';

export default function Settings() {
  return (
    <div className="animate-fade-in">
      <div className="header-actions" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Preferences</h1>
          <p className="text-secondary">Customize your dashboard experience.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '16px', borderLeft: '3px solid #3b82f6', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '500' }}><SettingsIcon size={20} className="text-info" /> General UI</div>
          </div>
          <div className="glass-panel" style={{ padding: '16px', opacity: 0.6, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Database size={20} /> Data Retention</div>
          </div>
          <div className="glass-panel" style={{ padding: '16px', opacity: 0.6, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Bell size={20} /> Notifications</div>
          </div>
          <div className="glass-panel" style={{ padding: '16px', opacity: 0.6, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Shield size={20} /> Security</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '32px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>General Configuration</h3>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>Dashboard Refresh Rate</label>
            <select className="search-input" style={{ width: '100%', maxWidth: '300px' }} defaultValue="3 Seconds">
              <option>1 Second</option>
              <option>3 Seconds</option>
              <option>10 Seconds</option>
              <option>Manual Only</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>Theme Mode</label>
            <select className="search-input" style={{ width: '100%', maxWidth: '300px' }} defaultValue="Dark Mode (Default)">
              <option>Dark Mode (Default)</option>
              <option>Light Mode</option>
              <option>System Default</option>
            </select>
          </div>

          <div>
             <button className="search-input" style={{ width: 'auto', padding: '10px 24px', background: '#3b82f6', color: '#fff', cursor: 'pointer', border: 'none' }} onClick={() => alert('Settings saved locally!')}>
                Save Changes
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
