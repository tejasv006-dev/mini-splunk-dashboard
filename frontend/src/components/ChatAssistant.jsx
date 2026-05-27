import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';

export default function ChatAssistant() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: "Greetings, Operator! I am your SIEM Navigation Assistant. I can execute navigation commands, query indexed telemetry, or explain how this project works.\n\nTry asking me: *\"how many logs do we have?\"* or type *\"go to settings\"* to navigate!"
    }
  ]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setTyping(true);

    // Simulate thinking interval
    setTimeout(async () => {
      const responseText = await getBotResponse(userText);
      setMessages(prev => [...prev, { sender: 'bot', text: responseText }]);
      setTyping(false);
    }, 800);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  // Local Offline NLP Command Engine
  const getBotResponse = async (query) => {
    const q = query.toLowerCase().trim();
    const token = localStorage.getItem('token');

    // 1. PATH NAVIGATION COMMAND INTENTS
    if (q.includes('go to logs') || q.includes('show logs') || q.includes('open logs') || q.includes('log explorer') || q.includes('explorer') || q.includes('navigate to logs')) {
      setTimeout(() => navigate('/logs'), 800);
      return "Redirecting you to the **Log Explorer** tab... 🔎";
    }
    if (q.includes('go to dashboard') || q.includes('go to home') || q.includes('overview') || q.includes('dashboard') || q.includes('home') || q.includes('landing')) {
      setTimeout(() => navigate('/'), 800);
      return "Redirecting you to the **Overview Dashboard**... 📊";
    }
    if (q.includes('go to alerts') || q.includes('go to incidents') || q.includes('incident center') || q.includes('incidents') || q.includes('alerts') || q.includes('security command')) {
      setTimeout(() => navigate('/alerts'), 800);
      return "Redirecting you to the **Security Incident Command Center**... 🚨";
    }
    if (q.includes('go to settings') || q.includes('open settings') || q.includes('settings') || q.includes('retention') || q.includes('security check')) {
      setTimeout(() => navigate('/settings'), 800);
      return "Redirecting you to the **System Control Console**... ⚙️";
    }

    // 2. TELEMETRY DATABASE QUERY INTENTS
    if (q.includes('how many logs') || q.includes('log count') || q.includes('total logs') || q.includes('volume')) {
      if (!token) return "We are indexing live telemetry records. Please log in to view active statistics!";
      try {
        const res = await axios.get('/api/logs/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        return `We are currently indexing **${res.data?.totalLogs?.toLocaleString() || 0} active telemetry logs** across **${res.data?.trafficByService?.length || 0} microservice channels**.`;
      } catch (err) {
        return "Failed to retrieve statistics. Make sure the backend server is active!";
      }
    }
    
    if (q.includes('how many errors') || q.includes('error count') || q.includes('show errors') || q.includes('active errors') || q.includes('critical exceptions')) {
      if (!token) return "Critical error alerts are being parsed in real-time. Please log in to retrieve status logs!";
      try {
        const res = await axios.get('/api/logs/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const errorCount = res.data?.levelDistribution?.find(l => l._id === 'ERROR')?.count || 0;
        return `There are currently **${errorCount} critical exceptions** indexed. You can view, acknowledge, or resolve them inside the **Incident Center**!`;
      } catch (err) {
        return "Failed to retrieve incident statistics. Verify backend connection.";
      }
    }

    // 3. SIEM ARCHITECTURE & EXPLAINER INTENTS
    if (q.includes('what is this') || q.includes('about the project') || q.includes('how does it work') || q.includes('siem') || q.includes('project details') || q.includes('mern') || q.includes('about this')) {
      setTimeout(() => navigate('/about'), 800);
      return "Redirecting you to the **About this** info center tab! 💻\n\nThere you will find complete structural blueprints, ingestion pipelines, database schemas, and visual command highlights in high-fidelity glassmorphism layouts.";
    }
    
    if (q.includes('security') || q.includes('rate limit') || q.includes('bcrypt') || q.includes('rbac') || q.includes('protection')) {
      return "Four advanced security protocols are active in this workspace:\n\n1. **JWT Verification**: Protects all log retrieval and alert channels.\n2. **Bcrypt Hashing**: Encrypts credentials with 10 salts before storage.\n3. **Brute Force Limiter**: Custom middleware locks logins to max 5 requests/min per IP.\n4. **Role-Based Access Control**: Restricts rule creation and deletion to Admins, granting Operators read-only triage privileges.";
    }

    if (q.includes('creator') || q.includes('author') || q.includes('contributor') || q.includes('who built this')) {
      return "This SIEM Security Dashboard was engineered for the **Full Stack & MERN Stack** subject internals evaluation to demonstrate expert competency in state-of-the-art web architectures.";
    }

    // Default Fallback Response
    return "I am your SIEM Navigation Assistant. I can execute path navigation commands or query telemetry indices. Try asking me:\n\n- *\"go to log explorer\"* (Navigates page)\n- *\"how many logs do we have?\"* (Queries stats)\n- *\"tell me about project security\"* (Explains stack)";
  };

  return (
    <>
      {/* Floating Action Button Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="chatbot-trigger"
        title="SIEM Navigation Command"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Floating Glassmorphic Chat Window */}
      {isOpen && (
        <div className="glass-panel chatbot-window animate-fade-in">
          
          {/* Header */}
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bot className="text-info" size={20} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>SIEM Navigator</span>
                <span style={{ fontSize: '10px', color: 'var(--accent-green)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={10} /> NLP Engine Online
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}
            >
              <X size={16} style={{ opacity: 0.7 }} />
            </button>
          </div>

          {/* Messages list */}
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`chat-bubble ${msg.sender}`}
                style={{ whiteSpace: 'pre-line' }}
              >
                {msg.text}
              </div>
            ))}
            {typing && (
              <div className="chat-bubble bot" style={{ opacity: 0.6, fontSize: '12px' }}>
                Analyzing command intent...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="chat-suggestions">
            <button className="chat-suggestion-chip" onClick={() => handleSuggestionClick("go to log explorer")}>🔎 Logs</button>
            <button className="chat-suggestion-chip" onClick={() => handleSuggestionClick("go to incidents")}>🚨 Incidents</button>
            <button className="chat-suggestion-chip" onClick={() => handleSuggestionClick("how many logs do we have?")}>📊 Stats</button>
            <button className="chat-suggestion-chip" onClick={() => handleSuggestionClick("what is this project?")}>💻 About SIEM</button>
          </div>

          {/* Message Input area */}
          <form onSubmit={handleSend} className="chatbot-input-area">
            <input 
              type="text" 
              className="chatbot-input" 
              placeholder="Type command, question, or path..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
            />
            <button type="submit" className="chatbot-send-btn">
              <Send size={16} />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
