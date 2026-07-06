'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { addMaintenanceLog } from '@/app/actions/maintenanceActions';
import { FormHeader, FormBanner, formStyles } from './FormStyles';

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
  'Other'
];

const NOTE_PRESETS = [
  'Performed a 25% water change.',
  'Added liquid water conditioner.',
  'Scraped algae off front glass.',
  'Pruned overgrown stem plants.',
  'Cleaned pre-filter sponge blocks.',
  'Dosed liquid fertilizer supplements.',
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
    <div style={formStyles.container}>
      {/* Form Header */}
      <FormHeader 
        title="Log Maintenance" 
        subtitle={`Record maintenance activities and water exchange volume for ${tankName}.`} 
        backUrl={`/tanks/${tankId}`} 
      />

      {/* Thick Border Form Card */}
      <div style={formStyles.card}>
        
        {/* Banner Info */}
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          alignItems: 'center',
          background: '#f8fafc',
          padding: '1.25rem',
          borderRadius: '20px',
          border: '3.5px solid #0f172a'
        }}>
          <span style={{ fontSize: '1.8rem' }}>🔧</span>
          <div>
            <h4 style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>Maintenance Ledger</h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.725rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
              Logging tasks helps track parameter shifts. Dosing and water replacement increases stability.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input type="hidden" name="tankId" value={tankId} />

          {/* Activity Type Selection */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="activityType" style={formStyles.label}>Activity Type *</label>
            <select 
              id="activityType" 
              name="activityType" 
              required
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              style={formStyles.input}
            >
              <option value="">-- Select Activity --</option>
              {COMMON_ACTIVITIES.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>

          {/* Water Change Slider */}
          <div style={{
            opacity: isWaterChange ? 1 : 0.45,
            pointerEvents: isWaterChange ? 'auto' : 'none',
            transition: 'opacity 0.2s ease',
            background: isWaterChange ? '#e0f7fa' : '#f8fafc',
            border: '3.5px solid #0f172a',
            padding: '1.25rem',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#0f172a' }}>
                Water Volume Replaced {!isWaterChange && '(Choose "Water Change" to activate)'}
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00838f' }}>
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
                accentColor: '#0891b2'
              }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>
              <span>0%</span>
              <span>25% (Std)</span>
              <span>50% (Heavy)</span>
              <span>100%</span>
            </div>
          </div>

          {/* Notes description box */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="notes" style={formStyles.label}>Detailed Notes / Log Description</label>
            <textarea 
              id="notes" 
              name="notes" 
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe what was performed in this session..."
              style={formStyles.input}
            />

            {/* Note preset helpers */}
            <div style={{ marginTop: '0.35rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem', fontWeight: 800, letterSpacing: '0.05em' }}>
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
                      color: '#64748b',
                      border: '3px solid #0f172a',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      fontWeight: 700,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    + {preset.replace('Performed a ', '').replace('Added ', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DateTime field */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="timestamp" style={formStyles.label}>Date & Time of Session</label>
            <input 
              type="datetime-local" 
              id="timestamp" 
              name="timestamp" 
              defaultValue={new Date().toISOString().substring(0, 16)}
              style={formStyles.input}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <button 
              type="submit" 
              disabled={isPending}
              style={{
                ...formStyles.submitBtn,
                opacity: isPending ? 0.7 : 1,
                cursor: isPending ? 'not-allowed' : 'pointer'
              }}
            >
              {isPending ? 'Saving Ledger...' : 'Save Log'}
            </button>
            <Link href={`/tanks/${tankId}`} style={{ textDecoration: 'none' }}>
              <div style={formStyles.cancelBtn}>
                Cancel
              </div>
            </Link>
          </div>
        </form>
      </div>

      <FormBanner />
    </div>
  );
}
