import React, { useState, useEffect } from 'react';
import { fetchLogs } from '../api/logApi';
import { Search, Filter, Server, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

export default function LogExplorer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchLogs({ 
        limit: 20, 
        page, 
        text: searchTerm, 
        level: levelFilter, 
        service: serviceFilter 
      });
      setLogs(data.logs || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, [page, searchTerm, levelFilter, serviceFilter]);

  // Regex and Live Match Substring Highlighter (Option 3)
  const highlightMessage = (message, search) => {
    if (!search) return message;
    
    try {
      // Treat search term as case-insensitive Regex
      const regex = new RegExp(`(${search})`, 'gi');
      const parts = message.split(regex);
      return (
        <span>
          {parts.map((part, index) => 
            regex.test(part) ? (
              <mark 
                key={index} 
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.22)', 
                  color: 'var(--accent-red)', 
                  borderRadius: '4px', 
                  padding: '2px 6px', 
                  border: '1px solid rgba(239,68,68,0.3)',
                  fontWeight: '700' 
                }}
              >
                {part}
              </mark>
            ) : part
          )}
        </span>
      );
    } catch (err) {
      // Incomplete/invalid regex fallback: simple index match
      const index = message.toLowerCase().indexOf(search.toLowerCase());
      if (index === -1) return message;
      
      const part1 = message.substring(0, index);
      const part2 = message.substring(index, index + search.length);
      const part3 = message.substring(index + search.length);
      return (
        <span>
          {part1}
          <mark 
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.22)', 
              color: 'var(--accent-red)', 
              borderRadius: '4px', 
              padding: '2px 6px', 
              border: '1px solid rgba(239,68,68,0.3)', 
              fontWeight: '700' 
            }}
          >
            {part2}
          </mark>
          {part3}
        </span>
      );
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="header-actions" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Log Explorer</h1>
          <p className="text-secondary">Deep dive into real-time application logs ({totalCount} total entries).</p>
        </div>
      </div>

      {/* Search and Filters grid */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: 11, color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search logs (supports standard text or Regular Expressions...)" 
            className="form-input" 
            style={{ paddingLeft: '40px', width: '100%' }}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>
        
        <select 
          className="form-input" 
          value={levelFilter} 
          onChange={(e) => { setLevelFilter(e.target.value); setPage(1); }}
          style={{ width: '150px', background: '#090b0e' }}
        >
          <option value="">All Levels</option>
          <option value="INFO">INFO</option>
          <option value="WARN">WARN</option>
          <option value="ERROR">ERROR</option>
          <option value="DEBUG">DEBUG</option>
        </select>

        <select 
          className="form-input" 
          value={serviceFilter} 
          onChange={(e) => { setServiceFilter(e.target.value); setPage(1); }}
          style={{ width: '200px', background: '#090b0e' }}
        >
          <option value="">All Services</option>
          <option value="auth-service">auth-service</option>
          <option value="payment-gateway">payment-gateway</option>
          <option value="user-dashboard">user-dashboard</option>
          <option value="billing-engine">billing-engine</option>
          <option value="image-processor">image-processor</option>
        </select>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
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
                 <tr key={log.id || log._id}>
                   <td className="timestamp">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                   </td>
                   <td><span className={`bg-${log.level.toLowerCase()}`}>{log.level}</span></td>
                   <td className="service-badge">
                     <Server size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                     {log.service}
                   </td>
                   <td>{highlightMessage(log.message, searchTerm)}</td>
                 </tr>
               ))}
               {logs.length === 0 && (
                 <tr>
                   <td colSpan="4" style={{ textAlign: 'center', opacity: 0.5, padding: '40px' }}>
                     {loading ? 'Searching...' : 'No logs found matching your criteria.'}
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>

         {/* Pagination */}
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', color: '#94a3b8' }}>
            <div style={{ fontSize: '13px' }}>Showing page {page} of {totalPages === 0 ? 1 : totalPages}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
               <button 
                 onClick={() => setPage(p => Math.max(1, p - 1))} 
                 disabled={page === 1}
                 className="action-btn"
                 style={{ width: 'auto', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '4px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
               >
                 <ChevronLeft size={16} /> Prev
               </button>
               <button 
                 onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                 disabled={page === totalPages || totalPages === 0}
                 className="action-btn"
                 style={{ width: 'auto', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '4px', cursor: (page === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer', opacity: (page === totalPages || totalPages === 0) ? 0.5 : 1 }}
               >
                 Next <ChevronRight size={16} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
