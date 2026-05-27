import React, { useEffect, useState } from 'react';
import { fetchLogs, fetchStats } from '../api/logApi';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Server, AlertTriangle, Info, Cpu, Layers, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Dashboard({ accentTheme = 'blue' }) {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  const loadData = async () => {
    try {
      const logsData = await fetchLogs({ limit: 12 });
      setLogs(logsData.logs || []);

      const statsData = await fetchStats();
      setStats(statsData);
      
      const data = statsData?.trafficByService?.map((t, idx) => ({
        name: t._id.replace('-service', '').replace('-gateway', '').replace('-engine', ''),
        volume: t.count,
        latency: Math.floor(Math.random() * 80) + 40
      })) || [];
      setChartData(data);
    } catch (err) {
      console.error("Error loading data from API. Is backend running?", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000); 
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="text-secondary animate-fade-in" style={{ fontSize: '15px', fontWeight: '500' }}>
        Securing terminal socket and parsing index statistics...
      </div>
    );
  }

  const getThemeHex = () => {
    if (accentTheme === 'amber') return '#f59e0b';
    if (accentTheme === 'green') return '#10b981';
    if (accentTheme === 'purple') return '#a855f7';
    return '#3b82f6';
  };
  const activeColorHex = getThemeHex();

  // Filter error logs for the dynamic Threat Ticker (Option 5)
  const errorLogs = logs.filter(log => log.level === 'ERROR');

  // Monitored services node list for the Live Topology Map (Option 1)
  const servicesList = [
    { id: 'user-dashboard', label: 'Dashboard UI', x: '15%', y: '50%' },
    { id: 'auth-service', label: 'Auth Service', x: '50%', y: '22%' },
    { id: 'image-processor', label: 'Img Process', x: '50%', y: '78%' },
    { id: 'payment-gateway', label: 'Pay Gateway', x: '85%', y: '22%' },
    { id: 'billing-engine', label: 'Bill Engine', x: '85%', y: '78%' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div className="header-actions" style={{ marginBottom: '0px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '6px' }}>SIEM Control Center</h1>
          <p className="text-secondary" style={{ fontSize: '14px' }}>Clean telemetry indexing, threat analysis, and pipeline logs.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', padding: '8px 16px', borderRadius: '12px', color: 'var(--accent-blue)', fontSize: '13px', fontWeight: '600' }}>
          <ShieldCheck size={16} /> Connection Secure
        </div>
      </div>

      {/* Floating Threat Alert Ticker (Option 5) */}
      {errorLogs.length > 0 && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          padding: '10px 20px',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          overflow: 'hidden',
          boxShadow: '0 0 15px rgba(239,68,68,0.03)',
          marginTop: '-16px',
          position: 'relative'
        }}>
          {/* Static Heading Badge */}
          <span 
            className="animate-pulse"
            style={{ 
              fontSize: '11px', 
              fontWeight: '800', 
              background: 'var(--accent-red)', 
              color: '#fff', 
              padding: '4px 10px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              flexShrink: 0,
              boxShadow: '0 0 8px rgba(239,68,68,0.3)',
              zIndex: 2,
              position: 'relative'
            }}
          >
            <AlertTriangle size={13} /> THREAT TICKER
          </span>

          {/* Inner Clipping Container for the scrolling marquee */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              gap: '50px',
              whiteSpace: 'nowrap',
              fontSize: '13px',
              fontWeight: '600',
              color: '#f87171',
              animation: 'marquee 30s linear infinite'
            }}>
              {errorLogs.map((log, idx) => (
                <span key={idx}>
                  ⚠️ [{log.service.toUpperCase()}] at {new Date(log.timestamp).toLocaleTimeString()}: "{log.message}"
                </span>
              ))}
              {/* Duplicate logs array to enable seamless marquee repeat loops */}
              {errorLogs.map((log, idx) => (
                <span key={`dup-${idx}`}>
                  ⚠️ [{log.service.toUpperCase()}] at {new Date(log.timestamp).toLocaleTimeString()}: "{log.message}"
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid of Clean Minimal Stat Widgets */}
      <div className="dashboard-grid" style={{ marginBottom: '0px' }}>
        <div className="glass-panel stat-card blue">
          <div className="stat-header">
            <span>Aggregated Events</span>
            <Server size={18} className="text-info" />
          </div>
          <div className="stat-value">{stats?.totalLogs?.toLocaleString() || 0}</div>
        </div>

        <div className="glass-panel stat-card red">
          <div className="stat-header">
            <span>Unacknowledged Alerts</span>
            <AlertTriangle size={18} className="text-error animate-pulse" />
          </div>
          <div className="stat-value text-error">
            {stats?.levelDistribution?.find(l => l._id === 'ERROR')?.count || 0}
          </div>
        </div>

        <div className="glass-panel stat-card green">
          <div className="stat-header">
            <span>Monitored Processes</span>
            <Info size={18} className="text-debug" />
          </div>
          <div className="stat-value">{stats?.trafficByService?.length || 0}</div>
        </div>
      </div>

      {/* Main Split Interface: Left Chart, Right Architecture Guide */}
      <div className="charts-grid" style={{ marginBottom: '0px', gap: '24px' }}>
        
        {/* Left Card: Elegant Minimal Area Chart */}
        <div className="glass-panel chart-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>Telemetry Index Activity</h3>
            <p className="text-secondary" style={{ fontSize: '12px', marginTop: '2px' }}>Event processing distribution per microservice module.</p>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeColorHex} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={activeColorHex} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f1115', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                />
                <Area type="monotone" dataKey="volume" stroke={activeColorHex} strokeWidth={2.5} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Card: Interactive Live SIEM Node Visualizer (Option 1) */}
        <div className="glass-panel chart-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu className="text-info animate-pulse" size={18} />
              <span>SIEM Network Node Visualizer</span>
            </h3>
            <p className="text-secondary" style={{ fontSize: '12px', marginTop: '2px' }}>Real-time microservice topology nodes. Flashes red on critical errors.</p>
          </div>
          
          {/* Active Topology Node Grid */}
          <div style={{
            position: 'relative',
            flex: 1,
            background: 'rgba(0,0,0,0.18)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.02)',
            overflow: 'hidden'
          }}>
            {/* SVG Connectors Background */}
            <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 1, pointerEvents: 'none' }}>
              <line x1="15%" y1="50%" x2="50%" y2="22%" stroke="var(--border-color-glow)" strokeWidth="1.5" />
              <line x1="15%" y1="50%" x2="50%" y2="78%" stroke="var(--border-color-glow)" strokeWidth="1.5" />
              <line x1="50%" y1="22%" x2="85%" y2="22%" stroke="var(--border-color-glow)" strokeWidth="1.5" />
              <line x1="50%" y1="78%" x2="85%" y2="78%" stroke="var(--border-color-glow)" strokeWidth="1.5" />
              <line x1="85%" y1="22%" x2="85%" y2="78%" stroke="var(--border-color-glow)" strokeWidth="1.5" />
              <line x1="50%" y1="22%" x2="50%" y2="78%" stroke="var(--border-color-glow)" strokeWidth="1.5" />
            </svg>

            {servicesList.map(srv => {
               // Verify if this service currently has critical error states in logs list
               const serviceLogs = logs.filter(l => l.service === srv.id);
               const hasError = serviceLogs.some(l => l.level === 'ERROR');
               const hasLogs = serviceLogs.length > 0;
               
               let nodeColor = 'rgba(148, 163, 184, 0.4)';
               let shadow = 'none';
               let border = '1px solid rgba(255,255,255,0.03)';
               let classVal = '';

               if (hasError) {
                 nodeColor = 'var(--accent-red)';
                 shadow = '0 0 15px rgba(239, 68, 68, 0.45)';
                 border = '1px solid rgba(239,68,68,0.3)';
                 classVal = 'animate-pulse';
               } else if (hasLogs) {
                 nodeColor = 'var(--accent-blue)';
                 shadow = '0 0 15px var(--accent-blue-glow)';
                 border = '1px solid var(--accent-blue)';
               }

               return (
                 <div
                   key={srv.id}
                   className={classVal}
                   style={{
                     position: 'absolute',
                     left: srv.x,
                     top: srv.y,
                     transform: 'translate(-50%, -50%)',
                     background: 'rgba(11,14,20,0.92)',
                     border: border,
                     boxShadow: shadow,
                     borderRadius: '10px',
                     padding: '8px 12px',
                     display: 'flex',
                     flexDirection: 'row',
                     alignItems: 'center',
                     gap: '8px',
                     zIndex: 2,
                     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                   }}
                 >
                   <span style={{ 
                     width: '8px', 
                     height: '8px', 
                     borderRadius: '50%', 
                     background: nodeColor, 
                     display: 'inline-block', 
                     filter: `drop-shadow(0 0 3px ${nodeColor})`,
                     animation: hasError ? 'pulse-red 1s infinite' : 'none'
                   }}></span>
                   <span style={{ fontSize: '10px', fontWeight: '700', color: hasLogs ? '#fff' : 'var(--text-secondary)', fontFamily: 'monospace' }}>
                     {srv.label}
                   </span>
                 </div>
               );
            })}
          </div>
        </div>

      </div>

      {/* Breathtaking Guide: How the Processing Pipeline Works */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu className="text-info" size={20} />
          <span>How the MERN Processing Pipeline Works</span>
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '1px solid rgba(255,255,255,0.03)', paddingRight: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 1: Telemetry Ingest</span>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9' }}>Data Streaming</h4>
            <p className="text-secondary" style={{ fontSize: '12px', lineHeight: '1.6' }}>
              The background generator streams structured JSON logs to `/api/logs` representing system logins, database pools, and billing actions.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '1px solid rgba(255,255,255,0.03)', paddingRight: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 2: Alert Matching</span>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9' }}>Real-time Detection</h4>
            <p className="text-secondary" style={{ fontSize: '12px', lineHeight: '1.6' }}>
              The alerting processor analyzes incoming telemetry. Critical `ERROR` levels matching defined service filters dynamically trigger incidents.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '1px solid rgba(255,255,255,0.03)', paddingRight: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 3: Hybrid Database</span>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9' }}>Seamless Failover</h4>
            <p className="text-secondary" style={{ fontSize: '12px', lineHeight: '1.6' }}>
              Logs are stored in Mongoose models. If MongoDB is offline, a hybrid failover layer mounts a fully functional memory-db simulation.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 4: Operations Control</span>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9' }}>Incident Response</h4>
            <p className="text-secondary" style={{ fontSize: '12px', lineHeight: '1.6' }}>
              Operators verify indexing queries in **Log Explorer**, define parameters in **Incident Center**, and acknowledge or resolve critical alerts.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
