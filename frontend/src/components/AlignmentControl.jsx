import React, { useState } from 'react';
import { CLINICAL_PRESETS } from '../data/clinicalDatabase';
import { FileUp, Settings2, Database, Search, Loader } from 'lucide-react';

export default function AlignmentControl({ params, setParams }) {
  const [ncbiQuery, setNcbiQuery] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: isNaN(value) ? value : Number(value) }));
  };

  const handleNCBIFetch = async () => {
    if (!ncbiQuery) return;
    setIsFetching(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/ncbi/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gene_name: ncbiQuery, organism: 'Homo sapiens' })
      });
      
      if (response.ok) {
        const data = await response.json();
        setParams(prev => ({ ...prev, refSeq: data.seq }));
        setNcbiQuery('');
      } else {
        alert("Gene not found on NCBI. Try 'BRCA1' or 'HBB'.");
      }
    } catch (error) {
      console.error("NCBI Fetch Error:", error);
    } finally {
      setIsFetching(false);
    }
  };
  
  const handleFileUpload = (e, targetField) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const lines = content.split('\n');
      const sequenceLines = lines.filter(line => !line.trim().startsWith('>'));
      const rawSequence = sequenceLines.join('').replace(/\s+/g, '').toUpperCase();
      
      const safeSequence = rawSequence.substring(0, 500);
      setParams(prev => ({ ...prev, [targetField]: safeSequence }));
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Settings2 size={20} />
        Sequence Parameters
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Real-world NCBI Search */}
        <div className="input-group">
          <div className="input-label">
            <span><Search size={12} style={{ display: 'inline', marginRight: '4px' }} /> NCBI Global Gene Search</span>
          </div>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="dna-input" 
              placeholder="Enter gene (e.g. BRCA1)" 
              value={ncbiQuery}
              onChange={(e) => setNcbiQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNCBIFetch()}
            />
            <button 
              onClick={handleNCBIFetch}
              disabled={isFetching}
              style={{ 
                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', padding: '4px 8px',
                color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center'
              }}
            >
              {isFetching ? <Loader size={14} className="animate-spin" /> : <Search size={14} />}
            </button>
          </div>
        </div>

        <div className="input-group">
          <div className="input-label">
            <span><Database size={12} style={{ display: 'inline', marginRight: '4px' }} /> Load Clinical Case Study</span>
          </div>
          <select 
            className="dna-input" 
            style={{ appearance: 'auto' }}
            onChange={(e) => {
              const preset = CLINICAL_PRESETS.find(p => p.name === e.target.value);
              if (preset && preset.name !== "Custom (Manual Entry)") {
                setParams(prev => ({ ...prev, patientSeq: preset.patientSeq, refSeq: preset.refSeq }));
              }
            }}
          >
            {CLINICAL_PRESETS.map(preset => (
              <option key={preset.name} value={preset.name} style={{ background: '#1e293b' }}>{preset.name}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <div className="input-label">
            <span>Patient DNA Sequence</span>
            <label style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FileUp size={12} /> Upload .FASTA
              <input type="file" accept=".fasta,.txt" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'patientSeq')} />
            </label>
          </div>
          <input 
            type="text" 
            name="patientSeq" 
            value={params.patientSeq} 
            onChange={handleChange} 
            className="dna-input"
            placeholder="e.g. ATGCGTACA"
          />
        </div>
        
        <div className="input-group">
          <div className="input-label">
            <span>Reference Genome (NCBI)</span>
            <label style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FileUp size={12} /> Upload .FASTA
              <input type="file" accept=".fasta,.txt" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'refSeq')} />
            </label>
          </div>
          <input 
            type="text" 
            name="refSeq" 
            value={params.refSeq} 
            onChange={handleChange} 
            className="dna-input"
            placeholder="e.g. ATGCATACA"
          />
        </div>

        <div style={{ borderTop: '1px solid var(--card-border)', margin: '0.5rem 0' }}></div>

        <div className="slider-box">
          <div className="input-label">
            <span>Match Score</span>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>+{params.matchScore}</span>
          </div>
          <input type="range" name="matchScore" value={params.matchScore} onChange={handleChange} min="1" max="5" style={{ width: '100%', accentColor: 'var(--accent-primary)' }} />
        </div>

        <div className="slider-box">
          <div className="input-label">
            <span>Mismatch Penalty</span>
            <span style={{ color: 'var(--error)', fontWeight: 'bold' }}>{params.mismatchScore}</span>
          </div>
          <input type="range" name="mismatchScore" value={params.mismatchScore} onChange={handleChange} min="-5" max="-1" style={{ width: '100%', accentColor: 'var(--error)' }} />
        </div>

        <div className="slider-box">
           <div className="input-label">
            <span>Gap Penalty</span>
            <span style={{ color: 'var(--error)', fontWeight: 'bold' }}>{params.gapPenalty}</span>
          </div>
          <input type="range" name="gapPenalty" value={params.gapPenalty} onChange={handleChange} min="-5" max="-1" style={{ width: '100%', accentColor: 'var(--error)' }} />
        </div>
      </div>
    </div>
  );
}
