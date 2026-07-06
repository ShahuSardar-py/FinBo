'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { addLivestock } from '@/app/actions/livestockActions';
import { FormHeader, FormBanner, formStyles } from './FormStyles';

interface LivestockFormProps {
  tankId: string;
  tankName: string;
}

const COMMON_SPECIES = [
  { name: 'Neon Tetra', emoji: '🐟' },
  { name: 'Clownfish', emoji: '🐠' },
  { name: 'Blue Tang', emoji: '🐟' },
  { name: 'Cherry Shrimp', emoji: '🦐' },
  { name: 'Amano Shrimp', emoji: '🦐' },
  { name: 'Mystery Snail', emoji: '🐌' },
];

export default function LivestockForm({ tankId, tankName }: LivestockFormProps) {
  const [species, setSpecies] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addLivestock(formData);
    } catch (err: any) {
      alert(err.message || 'Failed to add livestock');
      setIsPending(false);
    }
  };

  return (
    <div style={formStyles.container}>
      {/* Form Header */}
      <FormHeader 
        title="Add Livestock" 
        subtitle={`Introduce new aquatic fauna specimens to ${tankName}.`} 
        backUrl={`/tanks/${tankId}`} 
      />

      {/* Thick Border Form Card */}
      <div style={formStyles.card}>
        
        {/* Real-time Image Preview */}
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          alignItems: 'center',
          background: '#f8fafc',
          padding: '1.25rem',
          borderRadius: '20px',
          border: '3.5px solid #0f172a'
        }}>
          <div style={{
            width: '74px',
            height: '74px',
            borderRadius: '16px',
            border: '3.5px solid #0f172a',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="Preview" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '';
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <span style={{ fontSize: '1.8rem' }}>🐟</span>
            )}
          </div>
          <div>
            <h4 style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>Live Image Preview</h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.725rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
              Paste a web image URL below to verify the specimen preview.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input type="hidden" name="tankId" value={tankId} />

          {/* Image URL input */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="imageUrl" style={formStyles.label}>Image URL (Optional)</label>
            <input 
              type="url" 
              id="imageUrl" 
              name="imageUrl" 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              style={formStyles.input}
            />
          </div>

          {/* Species with Suggestions */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="species" style={formStyles.label}>Species / Breed *</label>
            <input 
              type="text" 
              id="species" 
              name="species" 
              required 
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              placeholder="e.g. Neon Tetra"
              style={formStyles.input}
            />
            
            {/* Suggestion Chips */}
            <div style={{ marginTop: '0.35rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                QUICK SELECT SPECIES:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {COMMON_SPECIES.map((spec) => (
                  <button
                    key={spec.name}
                    type="button"
                    onClick={() => setSpecies(spec.name)}
                    style={{
                      background: species === spec.name ? '#e0f7fa' : '#ffffff',
                      color: species === spec.name ? '#00838f' : '#64748b',
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
                    <span>{spec.emoji}</span>
                    <span>{spec.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Nickname / Custom Name */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="name" style={formStyles.label}>Nickname / Specimen Name (Optional)</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="e.g. Neon School, Bluey"
              style={formStyles.input}
            />
          </div>

          {/* Qty & Size Class */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={formStyles.fieldGroup}>
              <label htmlFor="quantity" style={formStyles.label}>Quantity *</label>
              <input 
                type="number" 
                id="quantity" 
                name="quantity" 
                required 
                min="1"
                defaultValue="1"
                style={formStyles.input}
              />
            </div>

            <div style={formStyles.fieldGroup}>
              <label htmlFor="size" style={formStyles.label}>Size Class (Optional)</label>
              <select id="size" name="size" defaultValue="" style={formStyles.input}>
                <option value="">Select size...</option>
                <option value="Juvenile (< 0.5 inch)">Juvenile (&lt; 0.5")</option>
                <option value="Small (0.5 - 1 inch)">Small (0.5 - 1")</option>
                <option value="Medium (1 - 2 inches)">Medium (1 - 2")</option>
                <option value="Large (2 - 4 inches)">Large (2 - 4")</option>
                <option value="Specimen (> 4 inches)">Specimen (&gt; 4")</option>
              </select>
            </div>
          </div>

          {/* Source Vendor & Purchase Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={formStyles.fieldGroup}>
              <label htmlFor="boughtFrom" style={formStyles.label}>Vendor Store (Optional)</label>
              <input 
                type="text" 
                id="boughtFrom" 
                name="boughtFrom" 
                placeholder="e.g. Local Fish Store"
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
                placeholder="e.g. 9.99"
                style={formStyles.input}
              />
            </div>
          </div>

          {/* Date Logged */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="addedDate" style={formStyles.label}>Acquisition Date *</label>
            <input 
              type="date" 
              id="addedDate" 
              name="addedDate" 
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
              {isPending ? 'Logging Specimen...' : 'Save Livestock'}
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
