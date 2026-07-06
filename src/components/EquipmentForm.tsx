'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { addEquipment } from '@/app/actions/equipmentActions';
import { FormHeader, FormBanner, formStyles } from './FormStyles';

interface EquipmentFormProps {
  tankId: string;
  tankName: string;
}

const COMMON_HARDWARE = [
  { name: 'Canister Filter', icon: '⚙️', brand: 'Oase' },
  { name: 'Sump Filtration', icon: '🌀', brand: 'Custom' },
  { name: 'LED Aquarium Light', icon: '💡', brand: 'Twinstar' },
  { name: 'Submersible Heater', icon: '🌡️', brand: 'Eheim' },
  { name: 'CO2 Regulator System', icon: '🧪', brand: 'CO2Art' },
  { name: 'Wavemaker Pump', icon: '🌊', brand: 'Nero' },
];

export default function EquipmentForm({ tankId, tankName }: EquipmentFormProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addEquipment(formData);
    } catch (err: any) {
      alert(err.message || 'Failed to log equipment');
      setIsPending(false);
    }
  };

  const handleSelectPreset = (preset: typeof COMMON_HARDWARE[0]) => {
    setName(preset.name);
    setCompany(preset.brand);
  };

  return (
    <div style={formStyles.container}>
      {/* Form Header */}
      <FormHeader 
        title="Add Equipment" 
        subtitle={`Log new hardware, filtration, and lighting spec systems for ${tankName}.`} 
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
          <span style={{ fontSize: '1.8rem' }}>⚙️</span>
          <div>
            <h4 style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>Hardware Specifications</h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.725rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
              Log filters, heaters, CO2 and wave regulators to complete your aquarium's technical specifications.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input type="hidden" name="tankId" value={tankId} />

          {/* Name with suggestions */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="name" style={formStyles.label}>Equipment / Hardware Name *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. BioMaster Thermo 350"
              style={formStyles.input}
            />
            
            {/* Presets */}
            <div style={{ marginTop: '0.35rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                QUICK SELECT CATEGORY:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {COMMON_HARDWARE.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    style={{
                      background: name === preset.name ? '#e0f7fa' : '#ffffff',
                      color: name === preset.name ? '#00838f' : '#64748b',
                      border: '3.5px solid #0f172a',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '16px',
                      fontSize: '0.725rem',
                      cursor: 'pointer',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Manufacturer Brand */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="company" style={formStyles.label}>Manufacturer / Brand (Optional)</label>
            <input 
              type="text" 
              id="company" 
              name="company" 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Oase, Fluval, Ecotech"
              style={formStyles.input}
            />
          </div>

          {/* Vendor Source & Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={formStyles.fieldGroup}>
              <label htmlFor="boughtFrom" style={formStyles.label}>Vendor Store (Optional)</label>
              <input 
                type="text" 
                id="boughtFrom" 
                name="boughtFrom" 
                placeholder="e.g. Amazon, Local Pet Store"
                style={formStyles.input}
              />
            </div>

            <div style={formStyles.fieldGroup}>
              <label htmlFor="price" style={formStyles.label}>Price Paid (Optional)</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                step="0.01"
                min="0"
                placeholder="e.g. 249.99"
                style={formStyles.input}
              />
            </div>
          </div>

          {/* Date Bought */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="boughtDate" style={formStyles.label}>Purchase Date *</label>
            <input 
              type="date" 
              id="boughtDate" 
              name="boughtDate" 
              required
              defaultValue={new Date().toISOString().split('T')[0]}
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
              {isPending ? 'Saving Hardware...' : 'Save Equipment'}
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
