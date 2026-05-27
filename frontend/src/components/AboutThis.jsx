import React from 'react';
import { Cpu, Server, ShieldCheck, Database, Layers, Bot, Sliders, Info, Zap, AlertTriangle } from 'lucide-react';

export default function AboutThis() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div className="header-actions" style={{ marginBottom: '0px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '6px' }}>About This SIEM Console</h1>
          <p className="text-secondary" style={{ fontSize: '14px' }}>Deep-dive overview of the distributed pipeline architecture, security grids, and visual control engines.</p>
        </div>
      </div>

      {/* Hero Glass Card */}
      <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(16,185,129,0.02))', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck className="text-info" size={24} />
          <span>The Mini Splunk Architecture Blueprint</span>
        </h2>
        <p className="text-secondary" style={{ fontSize: '14.5px', lineHeight: '1.6' }}>
          This application is a clinical-grade, high-performance **SIEM (Security Information and Event Management) distributed monitoring dashboard**. Built on the modern **MERN Stack**, it demonstrates advanced full-stack competencies, failover infrastructure, and state-of-the-art UI/UX patterns engineered specifically for university evaluations.
        </p>
      </div>

      {/* Grid of Core Pillars */}
      <div className="dashboard-grid" style={{ marginBottom: '0px', gap: '24px' }}>
        
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)' }}>
            <Server size={20} />
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>Distributed Ingestion</h3>
          <p className="text-secondary" style={{ fontSize: '12.5px', lineHeight: '1.5' }}>
            High-throughput REST API endpoint `/api/logs` registers structural JSON server logs in real-time from independent external processes.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)' }}>
            <Database size={20} />
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>Hybrid DB Failover</h3>
          <p className="text-secondary" style={{ fontSize: '12.5px', lineHeight: '1.5' }}>
            Validates MongoDB connections and seamlessly switches to an In-Memory Sandbox Catalog if databases are offline, avoiding application crashes.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-red)' }}>
            <Zap size={20} />
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>Threat Alert Matching</h3>
          <p className="text-secondary" style={{ fontSize: '12.5px', lineHeight: '1.5' }}>
            Evaluates incoming microservice telemetry stream levels in real-time to index active system failures and spawn operations alerts.
          </p>
        </div>

      </div>

      {/* Detailed Technical Walkthrough Split Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* Column 1: System Mechanics & Flow */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers className="text-info" size={20} />
            <span>Processing Pipeline Mechanics</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                1
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9' }}>Telemetry Log Generator</h4>
                <p className="text-secondary" style={{ fontSize: '12px', marginTop: '4px', lineHeight: '1.5' }}>
                  A concurrent background telemetry generator script streams server performance variables, latency indexes, origin service flags, and text payloads directly into the endpoint.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                2
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9' }}>Real-time Alerting Rules</h4>
                <p className="text-secondary" style={{ fontSize: '12px', marginTop: '4px', lineHeight: '1.5' }}>
                  As logs arrive, the alerts processor screens them. When a critical `ERROR` log aligns with an established alert rule filter, a system incident is registered and stored instantly.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                3
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9' }}>Global In-App Notifications</h4>
                <p className="text-secondary" style={{ fontSize: '12px', marginTop: '4px', lineHeight: '1.5' }}>
                  A global poller running on the React client coordinates with backend endpoints, triggering glowing red sliding warning toast notifications immediately on alert rules validation.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                4
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9' }}>Operations Triage</h4>
                <p className="text-secondary" style={{ fontSize: '12px', marginTop: '4px', lineHeight: '1.5' }}>
                  Operators access the Incident command grid, reviewing parsed data fields, and execute Acknowledge or Resolve status variables to resolve active alerts.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Column 2: Advanced Security Protocols */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck className="text-debug" size={20} />
            <span>SIEM Security Shields</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'inline-block' }}></span>
                <span>Role-Based Access Control (RBAC)</span>
              </h4>
              <p className="text-secondary" style={{ fontSize: '11.5px', marginTop: '6px', lineHeight: '1.4' }}>
                Enforces privilege division between user groups. Registered standard Operators hold read-only parameters and incident triage access, while only Admin accounts hold authorization to create or wipe alert configurations.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'inline-block' }}></span>
                <span>JWT Authentication Handshake</span>
              </h4>
              <p className="text-secondary" style={{ fontSize: '11.5px', marginTop: '6px', lineHeight: '1.4' }}>
                Secures data endpoints using modern token validation middleware (`authMiddleware.js`), guarding telemetry indices, alert registries, and cleanups from unauthorized API requests.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'inline-block' }}></span>
                <span>Brute-Force Rate Limiting Guard</span>
              </h4>
              <p className="text-secondary" style={{ fontSize: '11.5px', marginTop: '6px', lineHeight: '1.4' }}>
                Protects `/api/auth/login` and `/api/auth/register` endpoints using dynamic in-memory limit buffers (max 5 requests per minute per IP), neutralizing automated dictionary and brute-force cracking attempts.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'inline-block' }}></span>
                <span>BCrypt credential Salting</span>
              </h4>
              <p className="text-secondary" style={{ fontSize: '11.5px', marginTop: '6px', lineHeight: '1.4' }}>
                Ensures operator credential safety by encrypting credentials using 10 cryptographic salts prior to writing data records to the catalog.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Immersive Frontend Enhancements details card */}
      <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu className="text-info animate-pulse" size={20} />
          <span>Breathtaking Visual & Interactive Highlights</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={16} className="text-info" />
              <span>SIEM Network Node Visualizer</span>
            </h4>
            <p className="text-secondary" style={{ fontSize: '12px', marginTop: '8px', lineHeight: '1.5' }}>
              Pulsing blue circles signify microservice activity. Critical errors trigger a red alert, flashing dynamically to represent network topology states. Symmetrically aligned with absolute percentage lines.
            </p>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={16} className="text-info" />
              <span>Offline AI Chatbot Assistant</span>
            </h4>
            <p className="text-secondary" style={{ fontSize: '12px', marginTop: '8px', lineHeight: '1.5' }}>
              A floating AI Chatbot handles page navigation and queries active database statistics using an offline natural language matching engine.
            </p>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} className="text-info" />
              <span>Regex Highlighter Search</span>
            </h4>
            <p className="text-secondary" style={{ fontSize: '12px', marginTop: '8px', lineHeight: '1.5' }}>
              Supports raw Regular Expressions in Log Explorer, instantly highlighting all substring matches inside log records on the fly.
            </p>
          </div>

        </div>
      </div>

      {/* persistence details bar */}
      <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid var(--accent-blue)', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Info className="text-info" size={24} />
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>Global Persisting Customizer & Data Retentions</h4>
          <p className="text-secondary" style={{ fontSize: '12px', lineHeight: '1.4', marginTop: '2px' }}>
            Features a dynamic color chip settings selector that switches console theme accent glows (Blue, Amber, Green, Purple) globally. Combined with log retention pruning policies to purge old performance records cleanly.
          </p>
        </div>
      </div>

    </div>
  );
}
