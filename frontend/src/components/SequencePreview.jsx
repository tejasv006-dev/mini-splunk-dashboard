import React from 'react';
import { analyzeMutations } from '../utils/mutationAnalyzer';

export default function SequencePreview({ alignmentData }) {
  if (!alignmentData || !alignmentData.paths) return null;

  const { alignedSeq1, alignedSeq2 } = analyzeMutations(
    alignmentData.paths,
    alignmentData.seq1,
    alignmentData.seq2
  );

  return (
    <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '1rem', fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '0.2rem' }}>
        <span style={{ color: 'var(--text-muted)', width: '80px', fontSize: '0.8rem' }}>PATIENT</span>
        <div style={{ display: 'flex' }}>
          {alignedSeq1.split('').map((char, i) => (
            <span key={i} style={{ color: char === '-' ? 'var(--error)' : (char !== alignedSeq2[i] ? 'var(--path-color)' : 'var(--accent-primary)') }}>
              {char}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '0.2rem' }}>
        <span style={{ color: 'var(--text-muted)', width: '80px', fontSize: '0.8rem' }}>REF GENOME</span>
        <div style={{ display: 'flex' }}>
          {alignedSeq2.split('').map((char, i) => (
            <span key={i} style={{ color: char === '-' ? 'var(--error)' : 'var(--text-muted)' }}>
              {char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
