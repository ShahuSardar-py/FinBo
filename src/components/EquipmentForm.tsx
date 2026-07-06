'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { addEquipment } from '@/app/actions/equipmentActions';

interface EquipmentFormProps {
  tankId: string;
  tankName: string;
}

const COMMON_HARDWARE = [
  { name: 'Canister Filter', icon: '⚙️', brand: 'Oase / Fluval' },
  { name: 'Sump Filtration', icon: '🌀', brand: 'Custom Reef' },
  { name: 'LED Aquarium Light', icon: '💡', brand: 'Twinstar / Radion' },
  { name: 'Submersible Heater', icon: '🌡️', brand: 'Eheim / Oase' },
  { name: 'CO2 Regulator System', icon: '🧪', brand: 'CO2Art' },
  { name: 'Wavemaker Pump', icon: '🌊', brand: 'Nero / Ecotech' },
  { name: 'Protein Skimmer', icon: '🧼', brand: 'Reef Octopus' },
  { name: 'Auto Dosing Pump', icon: '🧪', brand: 'Kamoer' },
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
    // Suggest standard brands
    const firstBrand = preset.brand.split(' / ')[0];
    setCompany(firstBrand);
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href={`/tanks/${tankId}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
          ← Back to {tankName}
        </Link>
        <h1 className="heading-1" style={{ margin: 0 }}>Add Equipment</h1>
      </div>

      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Helper Banner */}
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '2rem' }}>⚙️</span>
          <div>
            <h4 style={{ margin: 0, fontWeight: 600, color: 'var(--tertiary)' }}>Hardware Telemetry Logging</h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Log filters, heaters, CO2 and wave regulators to complete your aquarium's technical specs.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input type="hidden" name="tankId" value={tankId} />

          {/* Name with suggestions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="name" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Equipment / Hardware Name *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. BioMaster Thermo 350"
            />
            
            {/* Presets */}
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                QUICK SELECT CATEGORY:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {COMMON_HARDWARE.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    style={{
                      background: name === preset.name ? 'var(--secondary)' : '#ffffff',
                      color: name === preset.name ? 'var(--primary)' : 'var(--text-secondary)',
                      border: name === preset.name ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      padding: '0.35rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      transition: 'var(--transition-smooth)'
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="company" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Manufacturer / Brand (Optional)</label>
            <input 
              type="text" 
              id="company" 
              name="company" 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Oase, Fluval, Ecotech Marine"
            />
          </div>

          {/* Shop Source & Purchase Cost */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="boughtFrom" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Vendor Store (Optional)</label>
              <input 
                type="text" 
                id="boughtFrom" 
                name="boughtFrom" 
                placeholder="e.g. Amazon, Local Pet Store"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="price" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Price Paid (Optional)</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                step="0.01"
                min="0"
                placeholder="e.g. 249.99"
              />
            </div>
          </div>

          {/* Date Bought */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="boughtDate" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Purchase Date *</label>
            <input 
              type="date" 
              id="boughtDate" 
              name="boughtDate" 
              required
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Submit controls */}
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
              {isPending ? 'Saving Hardware...' : 'Save Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
