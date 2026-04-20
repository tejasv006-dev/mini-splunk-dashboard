import React, { useState } from 'react';
import { AlertTriangle, Plus, Trash2, CheckCircle } from 'lucide-react';

export default function AlertRules() {
  const [rules, setRules] = useState([
    { id: 1, name: 'High Error Rate', condition: 'ERROR > 10 in 5 mins', service: 'Any', active: true },
    { id: 2, name: 'Billing Gateway Offline', condition: 'ERROR > 1 in 1 min', service: 'billing-engine', active: false },
  ]);

  return (
    <div className="animate-fade-in">
      <div className="header-actions" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Alert Rules Configuration</h1>
          <p className="text-secondary">Define when Mini Splunk should page you.</p>
        </div>
        <button className="search-input" style={{ width: 'auto', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: '#3b82f6', color: '#fff', border: 'none' }}>
          <Plus size={16} /> Create Rule
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
         <div className="table-container">
           <table>
             <thead>
               <tr>
                 <th>Status</th>
                 <th>Rule Name</th>
                 <th>Condition</th>
                 <th>Target Service</th>
                 <th>Actions</th>
               </tr>
             </thead>
             <tbody>
               {rules.map(rule => (
                 <tr key={rule.id}>
                   <td>
                     {rule.active ? 
                        <CheckCircle size={20} className="text-debug" /> : 
                        <AlertTriangle size={20} className="text-secondary" />
                     }
                   </td>
                   <td style={{ fontWeight: '500', color: '#f8fafc' }}>{rule.name}</td>
                   <td><span className="bg-error" style={{ opacity: 0.8 }}>{rule.condition}</span></td>
                   <td className="service-badge">{rule.service}</td>
                   <td>
                     <button className="search-input" onClick={() => setRules(rules.filter(r => r.id !== rule.id))} style={{ width: 'auto', padding: '6px', background: 'transparent', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>
                       <Trash2 size={16} className="text-error" />
                     </button>
                   </td>
                 </tr>
               ))}
               {rules.length === 0 && (
                 <tr>
                    <td colSpan="5" style={{ textAlign: 'center', opacity: 0.5, padding: '40px' }}>No active alert rules. Create one to get started!</td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
}
