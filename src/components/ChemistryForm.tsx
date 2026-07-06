'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { addWaterLog } from '@/app/actions/chemistryActions';
import { FormHeader, FormBanner, formStyles } from './FormStyles';

interface ChemistryFormProps {
  tankId: string;
  tankName: string;
}

export default function ChemistryForm({ tankId, tankName }: ChemistryFormProps) {
  const [ph, setPh] = useState<string>('');
  const [temperature, setTemperature] = useState<string>('');
  const [ammonia, setAmmonia] = useState<string>('');
  const [nitrite, setNitrite] = useState<string>('');
  const [nitrate, setNitrate] = useState<string>('');
  const [gh, setGh] = useState<string>('');
  const [kh, setKh] = useState<string>('');
  const [isPending, setIsPending] = useState(false);

  // Live test kit color preview helpers (maps parameters to API Test Kit colors)
  const getPhColor = (valStr: string) => {
    const val = parseFloat(valStr);
    if (isNaN(val)) return '#cbd5e1'; // grey
    if (val < 6.0) return '#facc15'; // yellow
    if (val <= 6.6) return '#a3e635'; // light green
    if (val <= 7.2) return '#22c55e'; // green
    if (val <= 7.8) return '#0ea5e9'; // blue
    return '#8b5cf6'; // purple
  };

  const getAmmoniaColor = (valStr: string) => {
    const val = parseFloat(valStr);
    if (isNaN(val)) return '#cbd5e1';
    if (val === 0) return '#facc15'; // yellow (safe)
    if (val <= 0.25) return '#d9f99d'; // light lime green
    if (val <= 1.0) return '#4ade80'; // green
    return '#15803d'; // dark green (danger)
  };

  const getNitriteColor = (valStr: string) => {
    const val = parseFloat(valStr);
    if (isNaN(val)) return '#cbd5e1';
    if (val === 0) return '#38bdf8'; // light blue (safe)
    if (val <= 0.25) return '#c084fc'; // light purple
    if (val <= 1.0) return '#a855f7'; // purple
    return '#6b21a8'; // dark purple (danger)
  };

  const getNitrateColor = (valStr: string) => {
    const val = parseFloat(valStr);
    if (isNaN(val)) return '#cbd5e1';
    if (val <= 5.0) return '#facc15'; // yellow (safe)
    if (val <= 10.0) return '#f97316'; // orange (safe/mild)
    if (val <= 20.0) return '#ea580c'; // dark orange (warning)
    return '#dc2626'; // red (danger)
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addWaterLog(formData);
    } catch (err: any) {
      alert(err.message || 'Failed to save chemistry log');
      setIsPending(false);
    }
  };

  return (
    <div style={formStyles.container}>
      {/* Form Header */}
      <FormHeader 
        title="Log Water Chemistry" 
        subtitle={`Record current telemetry and biological cycles for ${tankName}.`} 
        backUrl={`/tanks/${tankId}`} 
      />

      {/* Thick Border Form Card */}
      <div style={formStyles.card}>
        
        {/* Helper Banner */}
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          alignItems: 'center',
          background: '#f8fafc',
          padding: '1.25rem',
          borderRadius: '20px',
          border: '3.5px solid #0f172a'
        }}>
          <span style={{ fontSize: '1.8rem' }}>🧪</span>
          <div>
            <h4 style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>Chemistry Analyzer</h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.725rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
              Input water parameters below. Dot indicators mimic liquid test kit color reactions.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input type="hidden" name="tankId" value={tankId} />

          {/* pH & Temperature Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={formStyles.fieldGroup}>
              <label htmlFor="ph" style={{ ...formStyles.label, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>pH Level</span>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  backgroundColor: getPhColor(ph),
                  border: '1px solid rgba(0,0,0,0.15)',
                  transition: 'background-color 0.2s ease'
                }} />
              </label>
              <input 
                type="number" 
                id="ph" 
                name="ph" 
                step="0.1"
                min="0"
                max="14"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                placeholder="e.g. 7.2"
                style={formStyles.input}
              />
            </div>

            <div style={formStyles.fieldGroup}>
              <label htmlFor="temperature" style={formStyles.label}>Temp (°C)</label>
              <input 
                type="number" 
                id="temperature" 
                name="temperature" 
                step="0.1"
                min="0"
                max="45"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="e.g. 24.5"
                style={formStyles.input}
              />
            </div>
          </div>

          {/* Ammonia, Nitrite, Nitrate Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div style={formStyles.fieldGroup}>
              <label htmlFor="ammonia" style={{ ...formStyles.label, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>NH3 (ppm)</span>
                <span style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  backgroundColor: getAmmoniaColor(ammonia),
                  border: '1px solid rgba(0,0,0,0.15)',
                  transition: 'background-color 0.2s ease'
                }} />
              </label>
              <input 
                type="number" 
                id="ammonia" 
                name="ammonia" 
                step="0.01"
                min="0"
                value={ammonia}
                onChange={(e) => setAmmonia(e.target.value)}
                placeholder="0.0"
                style={formStyles.input}
              />
            </div>

            <div style={formStyles.fieldGroup}>
              <label htmlFor="nitrite" style={{ ...formStyles.label, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>NO2 (ppm)</span>
                <span style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  backgroundColor: getNitriteColor(nitrite),
                  border: '1px solid rgba(0,0,0,0.15)',
                  transition: 'background-color 0.2s ease'
                }} />
              </label>
              <input 
                type="number" 
                id="nitrite" 
                name="nitrite" 
                step="0.01"
                min="0"
                value={nitrite}
                onChange={(e) => setNitrite(e.target.value)}
                placeholder="0.0"
                style={formStyles.input}
              />
            </div>

            <div style={formStyles.fieldGroup}>
              <label htmlFor="nitrate" style={{ ...formStyles.label, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>NO3 (ppm)</span>
                <span style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  backgroundColor: getNitrateColor(nitrate),
                  border: '1px solid rgba(0,0,0,0.15)',
                  transition: 'background-color 0.2s ease'
                }} />
              </label>
              <input 
                type="number" 
                id="nitrate" 
                name="nitrate" 
                step="0.5"
                min="0"
                value={nitrate}
                onChange={(e) => setNitrate(e.target.value)}
                placeholder="10"
                style={formStyles.input}
              />
            </div>
          </div>

          {/* Hardness dGH & dKH Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={formStyles.fieldGroup}>
              <label htmlFor="gh" style={formStyles.label}>GH (General dGH)</label>
              <input 
                type="number" 
                id="gh" 
                name="gh" 
                step="0.5"
                min="0"
                value={gh}
                onChange={(e) => setGh(e.target.value)}
                placeholder="e.g. 6.0"
                style={formStyles.input}
              />
            </div>

            <div style={formStyles.fieldGroup}>
              <label htmlFor="kh" style={formStyles.label}>KH (Carbonate dKH)</label>
              <input 
                type="number" 
                id="kh" 
                name="kh" 
                step="0.5"
                min="0"
                value={kh}
                onChange={(e) => setKh(e.target.value)}
                placeholder="e.g. 4.0"
                style={formStyles.input}
              />
            </div>
          </div>

          {/* Measurement Timestamp */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="timestamp" style={formStyles.label}>Date & Time of Measurement</label>
            <input 
              type="datetime-local" 
              id="timestamp" 
              name="timestamp" 
              defaultValue={new Date().toISOString().substring(0, 16)}
              style={formStyles.input}
            />
          </div>

          {/* Action Buttons */}
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
              {isPending ? 'Saving Logs...' : 'Save Chemistry'}
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
