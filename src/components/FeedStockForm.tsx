'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { addFeedStock } from '@/app/actions/feedActions';

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
  'NorthFin',
  'Repashy Gel',
];

const FOOD_TYPES = [
  'Flakes',
  'Pellets',
  'Wafers / Tablets',
  'Freeze-Dried',
  'Frozen Blocks',
  'Gel Food',
  'Liquid Feed',
  'Live Culture',
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
    <div style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href={`/tanks/${tankId}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
          ← Back to {tankName}
        </Link>
        <h1 className="heading-1" style={{ margin: 0 }}>Add Feed Stock</h1>
      </div>

      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Banner */}
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '2rem' }}>🥫</span>
          <div>
            <h4 style={{ margin: 0, fontWeight: 600, color: 'var(--tertiary)' }}>Feed Inventory Log</h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Log your fish food brands, types, and expiry dates to track feeding inventory and quality control.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <input type="hidden" name="tankId" value={tankId} />

          {/* Brand Name with Suggestions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="brandName" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Brand / Product Name *</label>
            <input 
              type="text" 
              id="brandName" 
              name="brandName" 
              required 
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Hikari Micro Pellets"
            />
            
            {/* Presets */}
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                QUICK BRANDS:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {COMMON_BRANDS.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => setBrandName(brand)}
                    style={{
                      background: brandName === brand ? 'var(--secondary)' : '#ffffff',
                      color: brandName === brand ? 'var(--primary)' : 'var(--text-secondary)',
                      border: brandName === brand ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      padding: '0.35rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      fontWeight: 500,
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Food Type & Weight */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="foodType" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Food Type *</label>
              <select id="foodType" name="foodType" required defaultValue="">
                <option value="">-- Select Type --</option>
                {FOOD_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="weight" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Net Weight (Grams - Optional)</label>
              <input 
                type="number" 
                id="weight" 
                name="weight" 
                step="0.1"
                min="0"
                placeholder="e.g. 50"
              />
            </div>
          </div>

          {/* Purchase Date & Expiration Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="boughtDate" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Bought Date *</label>
              <input 
                type="date" 
                id="boughtDate" 
                name="boughtDate" 
                required
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="expirationDate" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Expiration Date (Optional)</label>
              <input 
                type="date" 
                id="expirationDate" 
                name="expirationDate" 
              />
            </div>
          </div>

          {/* Notes description box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="notes" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Notes (Optional)</label>
            <textarea 
              id="notes" 
              name="notes" 
              rows={3}
              placeholder="e.g. High protein, great for Neon Tetras color enhancement."
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
              {isPending ? 'Saving Brand...' : 'Save Feed Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
