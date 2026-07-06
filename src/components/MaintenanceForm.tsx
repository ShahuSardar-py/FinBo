'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { addMaintenanceLog } from '@/app/actions/maintenanceActions';

interface MaintenanceFormProps {
  tankId: string;
  tankName: string;
}

const COMMON_ACTIVITIES = [
  'Water Change',
  'Filter Maintenance',
  'Glass Cleaning',
  'Substrate Vacuuming',
  'Plant Trimming/Pruning',
  'Equipment Calibration',
  'Pest Control / Treatment',
  'Other'
];

const NOTE_PRESETS = [
  'Performed a 25% water change.',
  'Added liquid water conditioner (dechlorinator).',
  'Scraped algae off front and side glass panes.',
  'Pruned overgrown stem plants in the background.',
  'Cleaned pre-filter sponge blocks.',
  'Calibrated heater thermostat settings.',
  'Dosed micro & macro fertilizer supplements.',
];

export default function MaintenanceForm({ tankId, tankName }: MaintenanceFormProps) {
  const [activityType, setActivityType] = useState('');
  const [waterChangePercent, setWaterChangePercent] = useState(0);
  const [notes, setNotes] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addMaintenanceLog(formData);
    } catch (err: any) {
      alert(err.message || 'Failed to save maintenance log');
      setIsPending(false);
    }
  };

  const handleAppendNote = (preset: string) => {
    setNotes((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return preset;
      if (trimmed.endsWith('.') || trimmed.endsWith('!')) return `${trimmed} ${preset}`;
      return `${trimmed}. ${preset}`;
    });
  };

  const isWaterChange = activityType === 'Water Change' || activityType.toLowerCase().includes('water change');

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href={`/tanks/${tankId}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
          ← Back to {tankName}
        </Link>
        <h1 className="heading-1" style={{ margin: 0 }}>Log Maintenance</h1>
      </div>

      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Banner Info */}
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '2rem' }}>🔧</span>
          <div>
            <h4 style={{ margin: 0, fontWeight: 600, color: 'var(--tertiary)' }}>Maintenance Ledger</h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Regular maintenance builds your ecosystem stability score. Log tasks to track water changes.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input type="hidden" name="tankId" value={tankId} />

          {/* Activity Type Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="activityType" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Activity Type *</label>
            <select 
              id="activityType" 
              name="activityType" 
              required
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              style={{ background: 'white' }}
            >
              <option value="">-- Select Activity --</option>
              {COMMON_ACTIVITIES.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>

          {/* Water Change Slider - Displays when Water Change activity is chosen */}
          <div style={{
            opacity: isWaterChange ? 1 : 0.4,
            pointerEvents: isWaterChange ? 'auto' : 'none',
            transition: 'var(--transition-smooth)',
            background: isWaterChange ? 'var(--secondary)' : '#f8fafc',
            border: isWaterChange ? '1px solid rgba(2, 132, 199, 0.25)' : '1px solid var(--border-color)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: isWaterChange ? 'var(--primary)' : 'var(--text-secondary)' }}>
                Water Volume Replaced (%) {!isWaterChange && '(Choose "Water Change" to activate)'}
              </span>
              <span style={{ 
                fontSize: '1.25rem', 
                fontWeight: 800, 
                color: isWaterChange ? 'var(--primary)' : 'var(--text-secondary)'
              }}>
                {waterChangePercent}%
              </span>
            </div>
            
            <input 
              type="range" 
              id="waterChangePercent" 
              name="waterChangePercent" 
              min="0" 
              max="100" 
              step="5"
              value={waterChangePercent}
              onChange={(e) => setWaterChangePercent(parseInt(e.target.value, 10))}
              style={{
                width: '100%',
                cursor: isWaterChange ? 'pointer' : 'default',
                accentColor: 'var(--primary)'
              }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              <span>0% (None)</span>
              <span>25% (Standard)</span>
              <span>50% (Heavy)</span>
              <span>100% (Complete)</span>
            </div>
          </div>

          {/* Notes description box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="notes" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Detailed Notes / Log Description</label>
            <textarea 
              id="notes" 
              name="notes" 
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe what was performed in this session..."
            />

            {/* Note preset helpers */}
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                QUICK BUILD NOTES (TAP TO APPEND):
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {NOTE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAppendNote(preset)}
                    style={{
                      background: '#ffffff',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-color)',
                      padding: '0.3rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--text-secondary)';
                      (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-color)';
                      (e.currentTarget as HTMLButtonElement).style.background = '#ffffff';
                    }}
                  >
                    + {preset.substring(0, 35)}...
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DateTime field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="timestamp" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Date & Time of Session</label>
            <input 
              type="datetime-local" 
              id="timestamp" 
              name="timestamp" 
              defaultValue={new Date().toISOString().substring(0, 16)}
            />
          </div>

          {/* Action buttons */}
          <div style={{ marginTop: '1rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Link href={`/tanks/${tankId}`} className="btn">
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={isPending}
              className="btn btn-primary"
              style={{ opacity: isPending ? 0.7 : 1, cursor: isPending ? 'not-allowed' : 'pointer' }}
            >
              {isPending ? 'Saving Ledger...' : 'Save Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
