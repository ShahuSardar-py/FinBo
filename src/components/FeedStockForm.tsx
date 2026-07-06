'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { addFeedStock } from '@/app/actions/feedActions';
import { FormHeader, FormBanner, formStyles } from './FormStyles';

interface FeedStockFormProps {
  tankId: string;
  tankName: string;
}

const COMMON_BRANDS = [
  'Hikari',
  'Fluval Bug Bites',
  'TetraMin',
  'New Life Spectrum',
  'Sera',
  'Omega One',
];

const FOOD_TYPES = [
  'Flakes',
  'Pellets',
  'Wafers / Tablets',
  'Freeze-Dried',
  'Frozen Blocks',
  'Gel Food',
  'Liquid Feed',
  'Other',
];

export default function FeedStockForm({ tankId, tankName }: FeedStockFormProps) {
  const [brandName, setBrandName] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addFeedStock(formData);
    } catch (err: any) {
      alert(err.message || 'Failed to save feed stock');
      setIsPending(false);
    }
  };

  return (
    <div style={formStyles.container}>
      {/* Form Header */}
      <FormHeader 
        title="Add Feed Stock" 
        subtitle={`Log fish food brand inventories and quality lifespans for ${tankName}.`} 
        backUrl={`/tanks/${tankId}`} 
      />

      {/* Thick Border Form Card */}
      <div style={formStyles.card}>
        
        {/* Banner */}
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          alignItems: 'center',
          background: '#f8fafc',
          padding: '1.25rem',
          borderRadius: '20px',
          border: '3.5px solid #0f172a'
        }}>
          <span style={{ fontSize: '1.8rem' }}>🥫</span>
          <div>
            <h4 style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>Feed Inventory Log</h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.725rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
              Log food brands, net weights, and expiry dates to track feeding inventory and quality control.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input type="hidden" name="tankId" value={tankId} />

          {/* Brand Name with Suggestions */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="brandName" style={formStyles.label}>Brand / Product Name *</label>
            <input 
              type="text" 
              id="brandName" 
              name="brandName" 
              required 
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Hikari Micro Pellets"
              style={formStyles.input}
            />
            
            {/* Presets */}
            <div style={{ marginTop: '0.35rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                QUICK SELECT BRANDS:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {COMMON_BRANDS.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => setBrandName(brand)}
                    style={{
                      background: brandName === brand ? '#e0f7fa' : '#ffffff',
                      color: brandName === brand ? '#00838f' : '#64748b',
                      border: '3.5px solid #0f172a',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '16px',
                      fontSize: '0.725rem',
                      cursor: 'pointer',
                      fontWeight: 800,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Food Type & Weight */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={formStyles.fieldGroup}>
              <label htmlFor="foodType" style={formStyles.label}>Food Type *</label>
              <select id="foodType" name="foodType" required defaultValue="" style={formStyles.input}>
                <option value="">-- Select Type --</option>
                {FOOD_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div style={formStyles.fieldGroup}>
              <label htmlFor="weight" style={formStyles.label}>Weight (Grams)</label>
              <input 
                type="number" 
                id="weight" 
                name="weight" 
                step="0.1"
                min="0"
                placeholder="e.g. 50"
                style={formStyles.input}
              />
            </div>
          </div>

          {/* Purchase Date & Expiration Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={formStyles.fieldGroup}>
              <label htmlFor="boughtDate" style={formStyles.label}>Bought Date *</label>
              <input 
                type="date" 
                id="boughtDate" 
                name="boughtDate" 
                required
                defaultValue={new Date().toISOString().split('T')[0]}
                style={formStyles.input}
              />
            </div>

            <div style={formStyles.fieldGroup}>
              <label htmlFor="expirationDate" style={formStyles.label}>Expiration Date</label>
              <input 
                type="date" 
                id="expirationDate" 
                name="expirationDate" 
                style={formStyles.input}
              />
            </div>
          </div>

          {/* Notes description box */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="notes" style={formStyles.label}>Notes (Optional)</label>
            <textarea 
              id="notes" 
              name="notes" 
              rows={3}
              placeholder="e.g. High protein, color enhancement."
              style={{ ...formStyles.input, resize: 'vertical' }}
            />
          </div>

          {/* Buttons */}
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
              {isPending ? 'Saving Brand...' : 'Save Feed Stock'}
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
