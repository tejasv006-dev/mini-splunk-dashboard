import React from 'react';
import { 
  ShieldAlert, 
  Fingerprint, 
  AlertOctagon, 
  Microscope, 
  ChevronRight, 
  Info, 
  BarChart2 as BarChart // Safer version name
} from 'lucide-react';
import { CLINICAL_PRESETS } from '../data/clinicalDatabase';
import { analyzeMutations } from '../utils/mutationAnalyzer';

export default function ClinicalSidebar({ patientSeq = "", refSeq = "", alignmentData }) {
  // Safety checks for logic data
  const pStr = String(patientSeq || "");
  const rStr = String(refSeq || "");
  
  const isMatch = pStr.length > 0 && pStr === rStr;
  const score = alignmentData?.score || 0;
  
  // Calculate homology percentage (prevent NaN)
  const maxPossibleScore = Math.max(pStr.length, rStr.length) * 2; // Assuming match = 2
  const homologyPercent = maxPossibleScore > 0 
    ? Math.min(Math.round((score / maxPossibleScore) * 100), 100) 
    : 0;

  const getScoreSignificance = (s) => {
    if (!alignmentData || s === 0) return { label: "No Alignment", color: "#94a3b8", desc: "Sequences are entirely unrelated or pending calculation." };
    if (homologyPercent > 80) return { label: "High Homology", color: "#10b981", desc: "Sequences show strong evolutionary conservation." };
    if (homologyPercent > 40) return { label: "Moderate Similarity", color: "#f59e0b", desc: "Potential common ancestor or functional domain match." };
    return { label: "Weak Similarity", color: "#ef4444", desc: "Alignment may be random or highly diverged." };
  };

  const sig = getScoreSignificance(score);
  
  // 1. Auto-Diagnostic Engine Check (Database Check)
  const matchedPreset = CLINICAL_PRESETS.find(preset => 
    preset.diagnosis && 
    preset.patientSeq === pStr && 
    preset.refSeq === rStr
  );

  // 2. Automated Molecular Analysis (Real-time Analysis)
  const automatedAnalysis = !matchedPreset && alignmentData && alignmentData.paths?.length > 1
    ? analyzeMutations(alignmentData.paths, alignmentData.seq1, alignmentData.seq2)
    : null;
  
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, borderTop: '4px solid #10b981', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 🟢 CLINICAL INTELLIGENCE SECTION */}
      <div>
        <h3 style={{ marginBottom: '1rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
          <ShieldAlert size={18} />
          Clinical Intelligence
        </h3>
        
        {isMatch ? (
          <div className="diagnostic-card success">
            <p style={{ margin: 0, color: 'white', fontWeight: 500 }}>No genomic variants detected.</p>
          </div>
        ) : matchedPreset ? (
          <div className={`diagnostic-card ${matchedPreset.diagnosis.severity}`}>
            <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <AlertOctagon size={16} />
               {matchedPreset.diagnosis.title}
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#f8fafc', lineHeight: '1.4' }}>
              {matchedPreset.diagnosis.description}
            </p>
          </div>
        ) : automatedAnalysis ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <div className="diagnostic-card warning" style={{ marginBottom: '0.5rem' }}>
                <h4 style={{ margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                   <Microscope size={14} /> Molecular Profile
                </h4>
             </div>
             {automatedAnalysis.mutations?.slice(0, 3).map((mut, idx) => (
                <div key={idx} className="mutation-row" style={{ padding: '0.5rem' }}>
                  <span className={`badge ${mut.type.toLowerCase()}`} style={{ fontSize: '0.6rem' }}>{mut.type}</span>
                  <span style={{ flex: 1, fontSize: '0.8rem' }}>{mut.ref} → {mut.alt}</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>p.{mut.pos}</span>
                </div>
             ))}
          </div>
        ) : (
          <div className="diagnostic-card warning">
             <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#f59e0b' }}>
                <Fingerprint size={14} style={{ marginRight: '4px' }} /> Waiting for Alignment...
             </h4>
          </div>
        )}
      </div>

      {/* 🔵 SCORE SIGNIFICANCE SECTION */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem' }}>
        <h4 style={{ color: '#10b981', fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {BarChart && <BarChart size={16} />} Score Significance
        </h4>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Significance</span>
            <span style={{ fontSize: '0.8rem', color: sig.color, fontWeight: 'bold' }}>{sig.label || "N/A"}</span>
          </div>
          <div style={{ height: '4px', width: '100%', background: '#334155', borderRadius: '2px', marginBottom: '0.75rem' }}>
            <div style={{ height: '100%', width: `${homologyPercent || 0}%`, background: sig.color, borderRadius: '2px', transition: 'width 0.5s ease' }}></div>
          </div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4' }}>
            {sig.desc} The <strong>Optimal Score ({score})</strong> represents peak similarity.
          </p>
        </div>
      </div>

      {/* 🧠 SCIENTIFIC GLOSSARY */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem' }}>
        <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={14} /> Algorithm Insights
        </h4>
        <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', lineHeight: '1.4' }}>
          <strong>Optimal Score:</strong> The peak similarity found by the dynamic programming recurrence. Traceback starts here and identifies the most parsimonious local alignment path.
        </p>
      </div>

    </div>
  );
}
