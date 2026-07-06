'use client';

import { seedDatabase, clearDatabase } from '@/app/actions/seedActions';
import { useState } from 'react';

export function SeedButton() {
  const [loading, setLoading] = useState(false);

  return (
    <form 
      action={async () => {
        setLoading(true);
        try {
          await seedDatabase();
        } finally {
          setLoading(false);
        }
      }}
    >
      <button 
        type="submit" 
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer',
          background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
          color: '#0f172a',
          fontWeight: 800,
          fontSize: '0.8rem',
          padding: '0.75rem 1.25rem',
          borderRadius: '20px',
          border: '3px solid #0f172a',
          boxShadow: '0 4px 12px rgba(6, 182, 212, 0.15)'
        }}
      >
        {loading ? '⚡ Loading demo...' : '⚡ Load Demo Aquariums'}
      </button>
    </form>
  );
}

export function ClearButton() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    if (!confirm('Are you sure you want to wipe all aquariums, livestock, and logs from your Finbo catalog? This cannot be undone.')) {
      e.preventDefault();
    } else {
      setLoading(true);
    }
  };

  return (
    <form action={clearDatabase} onSubmit={handleSubmit}>
      <button 
        type="submit" 
        disabled={loading}
        style={{ 
          color: '#ef4444', 
          background: '#ffffff',
          fontWeight: 800,
          fontSize: '0.8rem',
          padding: '0.75rem 1.25rem',
          borderRadius: '20px',
          border: '3px solid #0f172a',
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.05)'
        }}
      >
        {loading ? '🗑️ Wiping...' : '🗑️ Reset Database'}
      </button>
    </form>
  );
}
