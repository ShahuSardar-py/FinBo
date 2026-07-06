'use client';

import { seedDatabase, clearDatabase } from '@/app/actions/seedActions';
import { useState } from 'react';

export function SeedButton() {
  const [loading, setLoading] = useState(false);

  return (
    <form 
      action={async (formData) => {
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
        className="btn btn-primary" 
        disabled={loading}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? '⚡ Seeding...' : '⚡ Seed Sample Data'}
      </button>
    </form>
  );
}

export function ClearButton() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    if (!confirm('Are you sure you want to delete all database entries? This cannot be undone.')) {
      e.preventDefault();
    } else {
      setLoading(true);
    }
  };

  return (
    <form action={clearDatabase} onSubmit={handleSubmit}>
      <button 
        type="submit" 
        className="btn" 
        disabled={loading}
        style={{ 
          color: '#ef4444', 
          borderColor: '#fca5a5', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '🗑️ Wiping...' : '🗑️ Wipe Database'}
      </button>
    </form>
  );
}
