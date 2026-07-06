'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { addWaterLog } from '@/app/actions/chemistryActions';

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
    <div style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href={`/tanks/${tankId}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
          ← Back to {tankName}
        </Link>
        <h1 className="heading-1" style={{ margin: 0 }}>Log Water Chemistry</h1>
      </div>

      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Helper Banner */}
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '2rem' }}>🧪</span>
          <div>
            <h4 style={{ margin: 0, fontWeight: 600, color: 'var(--tertiary)' }}>Chemistry Analyzer</h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Log water test parameters. Input box guides highlight corresponding liquid test kit colors.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <input type="hidden" name="tankId" value={tankId} />

          {/* pH & Temperature */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            
            {/* pH field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="ph" style={{ fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>pH Level</span>
                <span style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  backgroundColor: getPhColor(ph),
                  border: '1px solid rgba(0,0,0,0.1)',
                  transition: 'background-color 0.25s ease'
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
              />
            </div>

            {/* Temperature */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="temperature" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Temperature (°C)</label>
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
              />
            </div>

          </div>

          {/* Ammonia, Nitrite, Nitrate */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
            
            {/* Ammonia */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="ammonia" style={{ fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Ammonia (ppm)</span>
                <span style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  backgroundColor: getAmmoniaColor(ammonia),
                  border: '1px solid rgba(0,0,0,0.1)',
                  transition: 'background-color 0.25s ease'
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
                placeholder="e.g. 0.0"
              />
            </div>

            {/* Nitrite */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="nitrite" style={{ fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Nitrite (ppm)</span>
                <span style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  backgroundColor: getNitriteColor(nitrite),
                  border: '1px solid rgba(0,0,0,0.1)',
                  transition: 'background-color 0.25s ease'
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
                placeholder="e.g. 0.0"
              />
            </div>

            {/* Nitrate */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="nitrate" style={{ fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Nitrate (ppm)</span>
                <span style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  backgroundColor: getNitrateColor(nitrate),
                  border: '1px solid rgba(0,0,0,0.1)',
                  transition: 'background-color 0.25s ease'
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
                placeholder="e.g. 10"
              />
            </div>

          </div>

          {/* Hardness: GH / KH */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="gh" style={{ fontWeight: 600, fontSize: '0.85rem' }}>General Hardness (GH - dGH)</label>
              <input 
                type="number" 
                id="gh" 
                name="gh" 
                step="0.5"
                min="0"
                value={gh}
                onChange={(e) => setGh(e.target.value)}
                placeholder="e.g. 6.0"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="kh" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Carbonate Hardness (KH - dKH)</label>
              <input 
                type="number" 
                id="kh" 
                name="kh" 
                step="0.5"
                min="0"
                value={kh}
                onChange={(e) => setKh(e.target.value)}
                placeholder="e.g. 4.0"
              />
            </div>
          </div>

          {/* Measurement Timestamp */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="timestamp" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Date & Time of Measurement</label>
            <input 
              type="datetime-local" 
              id="timestamp" 
              name="timestamp" 
              defaultValue={new Date().toISOString().substring(0, 16)}
            />
          </div>

          {/* Buttons */}
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
              {isPending ? 'Saving Logs...' : 'Save Chemistry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
