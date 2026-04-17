import React, { useEffect, useState } from 'react';
import { fetchLogs, fetchStats } from '../api/logApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Server, AlertTriangle, Info, Search } from 'lucide-react';

const COLORS = {
  INFO: '#3b82f6',
  ERROR: '#ef4444',
  WARN: '#f59e0b',
  DEBUG: '#10b981'
};

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const logsData = await fetchLogs({ limit: 12 });
      const statsData = await fetchStats();
      setLogs(logsData.logs || []);
      setStats(statsData);
    } catch (err) {
      console.error("Error loading data from API. Is backend running?", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll the backend every 3 seconds for that real-time feel
    const interval = setInterval(loadData, 3000); 
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) return <div className="text-secondary animate-fade-in">Establishing connection to indexing engine...</div>;

  const pieData = stats?.levelDistribution?.map(l => ({ name: l._id, value: l.count })) || [];
  const barData = stats?.trafficByService?.map(t => ({ name: t._id, logs: t.count })) || [];

  return (
    <div className="animate-fade-in">
      <div className="header-actions">
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>System Overview</h1>
          <p className="text-secondary">Real-time telemetry and error tracking insights.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: 11, color: '#94a3b8' }} />
          <input type="text" placeholder="Search indexing queries..." className="search-input" style={{ paddingLeft: '40px' }} />
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <div className="stat-header">
            Total Event Logs
            <Server size={20} className="text-info" />
          </div>
          <div className="stat-value">{stats?.totalLogs?.toLocaleString() || 0}</div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-header">
            Critical Exceptions
            <AlertTriangle size={20} className="text-error" />
          </div>
          <div className="stat-value text-error">
            {stats?.levelDistribution?.find(l => l._id === 'ERROR')?.count || 0}
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-header">
            Active Services Monitored
            <Info size={20} className="text-debug" />
          </div>
          <div className="stat-value">{stats?.trafficByService?.length || 0}</div>
        </div>
      </div>

      <div className="charts-grid">
         <div className="glass-panel chart-card">
            <h3 style={{ marginBottom: '24px', fontSize: '16px' }}>Log Volume by Service</h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                  contentStyle={{ backgroundColor: '#1a1d24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} 
                />
                <Bar dataKey="logs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
         </div>
         <div className="glass-panel chart-card">
            <h3 style={{ marginBottom: '24px', fontSize: '16px' }}>Severity Distribution</h3>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#94a3b8'} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1d24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} itemStyle={{color: '#fff'}} />
              </PieChart>
            </ResponsiveContainer>
         </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
         <h3 style={{ fontSize: '16px' }}>Recent Log Stream</h3>
         <div className="table-container">
           <table>
             <thead>
               <tr>
                 <th>Timestamp</th>
                 <th>Level</th>
                 <th>Service Process</th>
                 <th>Log Event Message</th>
               </tr>
             </thead>
             <tbody>
               {logs.map(log => (
                 <tr key={log._id}>
                   <td className="timestamp">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                   </td>
                   <td><span className={`bg-${log.level.toLowerCase()}`}>{log.level}</span></td>
                   <td className="service-badge">{log.service}</td>
                   <td>{log.message}</td>
                 </tr>
               ))}
               {logs.length === 0 && (
                 <tr>
                   <td colSpan="4" style={{ textAlign: 'center', opacity: 0.5 }}>Waiting for logs... Run the dummy generator.</td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
}
