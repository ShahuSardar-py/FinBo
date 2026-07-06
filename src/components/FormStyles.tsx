import React from 'react';
import Link from 'next/link';

export function FormHeader({ title, subtitle, backUrl = '/' }: { title: string; subtitle: string; backUrl?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '0.5rem' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #bae6fd 0%, #e0f2fe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            boxShadow: '0 4px 10px rgba(15, 23, 42, 0.03)',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.6)'
          }}>
            👩‍🎨
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--tertiary)' }}>Finbo</span>
        </div>
        
        <Link href="/notifications" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            position: 'relative',
            boxShadow: '0 4px 10px rgba(15, 23, 42, 0.03)',
            border: '1px solid rgba(15, 23, 42, 0.05)'
          }}>
            🔔
          </div>
        </Link>
      </div>

      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export function FormBanner() {
  return null;
}

export const formStyles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '1rem 0 5rem 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  label: {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    marginLeft: '0.75rem'
  },
  input: {
    width: '100%',
    border: '1.5px solid rgba(15, 23, 42, 0.08)',
    borderRadius: '28px',
    padding: '0.9rem 1.5rem',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#0f172a',
    background: '#ffffff',
    outline: 'none',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease'
  },
  submitBtn: {
    width: '100%',
    border: 'none',
    borderRadius: '30px',
    padding: '1.1rem',
    background: '#0a192f',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '0.8rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
    transition: 'opacity 0.2s ease'
  },
  cancelBtn: {
    width: '100%',
    border: 'none',
    background: 'transparent',
    color: '#64748b',
    fontWeight: 700,
    fontSize: '0.75rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    textAlign: 'center',
    padding: '0.5rem 0',
    transition: 'color 0.2s ease'
  }
};
