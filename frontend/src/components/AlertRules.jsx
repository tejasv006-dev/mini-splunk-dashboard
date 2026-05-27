import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Trash2, CheckCircle, ShieldAlert, Play, Eye, X } from 'lucide-react';
import { fetchRules, createRule, deleteRule, fetchIncidents, updateIncidentStatus } from '../api/alertApi';

export default function AlertRules() {
  const [rules, setRules] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loadingRules, setLoadingRules] = useState(true);
  const [loadingIncidents, setLoadingIncidents] = useState(true);
  
  // Role checking for UI security constraints (RBAC)
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin = currentUser.role === 'admin';
  
  // Rule Creation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleCondition, setNewRuleCondition] = useState('ERROR > 1 in 1 min');
  const [newRuleService, setNewRuleService] = useState('Any');
  const [formError, setFormError] = useState('');

  const loadAlertsData = async () => {
    try {
      const rulesData = await fetchRules();
      setRules(rulesData || []);
      setLoadingRules(false);

      const incidentsData = await fetchIncidents();
      setIncidents(incidentsData || []);
      setLoadingIncidents(false);
    } catch (err) {
      console.error('Error fetching alerts/incidents:', err);
    }
  };

  useEffect(() => {
    loadAlertsData();
    // Poll for real-time telemetry updates every 3 seconds
    const interval = setInterval(loadAlertsData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRule = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!newRuleName || !newRuleCondition || !newRuleService) {
      setFormError('Please fill in all fields.');
      return;
    }

    try {
      await createRule({
        name: newRuleName,
        condition: newRuleCondition,
        service: newRuleService
      });
      
      // Reset & Reload
      setNewRuleName('');
      setNewRuleCondition('ERROR > 1 in 1 min');
      setNewRuleService('Any');
      setIsModalOpen(false);
      loadAlertsData();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to create rule.');
    }
  };

  const handleDeleteRule = async (ruleId) => {
    try {
      await deleteRule(ruleId);
      loadAlertsData();
    } catch (err) {
      console.error('Failed to delete rule:', err);
    }
  };

  const handleUpdateStatus = async (incidentId, status) => {
    try {
      await updateIncidentStatus(incidentId, status);
      loadAlertsData();
    } catch (err) {
      console.error('Failed to update incident:', err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="header-actions" style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Security Command Center</h1>
          <p className="text-secondary">Track active incidents and define custom Splunk indexing alert rules.</p>
        </div>
        {isAdmin ? (
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="splunk-btn"
          >
            <Plus size={16} /> <span>Create Rule</span>
          </button>
        ) : (
          <button 
            className="splunk-btn"
            disabled
            style={{ opacity: 0.5, cursor: 'not-allowed', background: '#334155', boxShadow: 'none' }}
            title="Administrator privileges required to edit rules"
          >
            <Plus size={16} /> <span>Create Rule (Admins Only)</span>
          </button>
        )}
      </div>

      <div className="alerts-grid">
        {/* Triggered Incidents console */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert className="text-error animate-pulse" size={20} />
            <span>Active Triggered Incidents</span>
          </h3>

          {loadingIncidents ? (
            <div className="text-secondary">Securing incident logs...</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Alert Rule</th>
                    <th>Status</th>
                    <th>Service</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map(incident => (
                    <tr key={incident._id || incident.id}>
                      <td className="timestamp">
                        {new Date(incident.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: '#fff' }}>{incident.ruleName}</div>
                        <div style={{ fontSize: '12px', opacity: 0.5, marginTop: '2px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {incident.message}
                        </div>
                      </td>
                      <td>
                        {incident.status === 'ACTIVE' && (
                          <span className="incident-badge-active">ACTIVE</span>
                        )}
                        {incident.status === 'ACKNOWLEDGED' && (
                          <span className="incident-badge-acknowledged">ACKED</span>
                        )}
                        {incident.status === 'RESOLVED' && (
                          <span className="incident-badge-resolved">RESOLVED</span>
                        )}
                      </td>
                      <td><span className="service-badge">{incident.service}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {incident.status === 'ACTIVE' && (
                            <button 
                              className="action-btn ack"
                              onClick={() => handleUpdateStatus(incident._id || incident.id, 'ACKNOWLEDGED')}
                              title="Acknowledge incident"
                            >
                              Ack
                            </button>
                          )}
                          {incident.status !== 'RESOLVED' && (
                            <button 
                              className="action-btn res"
                              onClick={() => handleUpdateStatus(incident._id || incident.id, 'RESOLVED')}
                              title="Resolve incident"
                            >
                              Resolve
                            </button>
                          )}
                          {incident.status === 'RESOLVED' && (
                            <CheckCircle size={18} className="text-debug" style={{ margin: 'auto' }} />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {incidents.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', opacity: 0.5, padding: '40px' }}>
                        No triggered incidents. Systems are fully secure. 🛡️
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Alert rules listing */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle className="text-warn" size={20} />
            <span>Alert Rule Matrix</span>
          </h3>

          {loadingRules ? (
            <div className="text-secondary">Loading indexing filters...</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Rule Config</th>
                    <th>Target</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map(rule => (
                    <tr key={rule._id || rule.id}>
                      <td>
                        <div style={{ fontWeight: '600', color: '#fff', fontSize: '14px' }}>{rule.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--accent-red)', marginTop: '2px' }}>{rule.condition}</div>
                      </td>
                      <td><span className="service-badge" style={{ fontSize: '11px' }}>{rule.service}</span></td>
                      <td>
                        {isAdmin ? (
                          <button 
                            className="action-btn del"
                            onClick={() => handleDeleteRule(rule._id || rule.id)}
                            title="Wipe rule mapping"
                          >
                            <Trash2 size={14} />
                          </button>
                        ) : (
                          <button 
                            className="action-btn del"
                            disabled
                            style={{ opacity: 0.35, cursor: 'not-allowed' }}
                            title="Admin privileges required to delete rules"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {rules.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>
                        No alert configs defined.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Rule Creation */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Define Log Index Alert</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="auth-error" style={{ marginBottom: '16px' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateRule}>
              <div className="form-group">
                <label className="form-label">Rule Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Critical Auth Failure" 
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Trigger Condition</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={newRuleCondition}
                  onChange={(e) => setNewRuleCondition(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Service Process</label>
                <select 
                  className="form-input" 
                  value={newRuleService}
                  onChange={(e) => setNewRuleService(e.target.value)}
                  style={{ background: '#0a0d11' }}
                >
                  <option value="Any">Any Service (Global)</option>
                  <option value="auth-service">auth-service</option>
                  <option value="payment-gateway">payment-gateway</option>
                  <option value="user-dashboard">user-dashboard</option>
                  <option value="billing-engine">billing-engine</option>
                  <option value="image-processor">image-processor</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="splunk-btn" 
                style={{ width: '100%', padding: '14px', justifyContent: 'center', marginTop: '14px' }}
              >
                Establish Alert rule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
