'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { addLivestock } from '@/app/actions/livestockActions';

interface LivestockFormProps {
  tankId: string;
  tankName: string;
}

const COMMON_SPECIES = [
  { name: 'Neon Tetra', emoji: '🐟', description: 'Small schooling fish' },
  { name: 'Clownfish', emoji: '🐠', description: 'Bright orange reef fish' },
  { name: 'Blue Tang', emoji: '🐟', description: 'Vibrant blue surgeonfish' },
  { name: 'Cherry Shrimp', emoji: '🦐', description: 'Red dwarf algae eater' },
  { name: 'Amano Shrimp', emoji: '🦐', description: 'Hardy dwarf cleaner' },
  { name: 'Otocinclus Catfish', emoji: '🐱', description: 'Dwarf algae sucker' },
  { name: 'Betta Fish', emoji: '🐠', description: 'Beautiful long fins' },
  { name: 'Guppy', emoji: '🐟', description: 'Colorful active livebearer' },
  { name: 'Mystery Snail', emoji: '🐌', description: 'Peaceful scavenger' },
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
    <div style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href={`/tanks/${tankId}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
          ← Back to {tankName}
        </Link>
        <h1 className="heading-1" style={{ margin: 0 }}>Add Livestock</h1>
      </div>

      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Real-time Image Preview */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed #cbd5e1',
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
              <span style={{ fontSize: '2rem' }}>🐟</span>
            )}
          </div>
          <div>
            <h4 style={{ margin: 0, fontWeight: 600, color: 'var(--tertiary)' }}>Live Image Preview</h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Paste a web URL in the field below to see a real-time preview of your specimen.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input type="hidden" name="tankId" value={tankId} />

          {/* Image URL input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="imageUrl" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Image URL (Optional)</label>
            <input 
              type="url" 
              id="imageUrl" 
              name="imageUrl" 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="e.g. https://images.unsplash.com/photo-..."
            />
          </div>

          {/* Species with Suggestions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="species" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Species / Breed *</label>
            <input 
              type="text" 
              id="species" 
              name="species" 
              required 
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              placeholder="e.g. Neon Tetra"
            />
            
            {/* Suggestion Chips */}
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                QUICK SELECT SPECIES:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {COMMON_SPECIES.map((spec) => (
                  <button
                    key={spec.name}
                    type="button"
                    onClick={() => setSpecies(spec.name)}
                    style={{
                      background: species === spec.name ? 'var(--secondary)' : '#ffffff',
                      color: species === spec.name ? 'var(--primary)' : 'var(--text-secondary)',
                      border: species === spec.name ? '1px solid var(--primary)' : '1px solid var(--border-color)',
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
                    <span>{spec.emoji}</span>
                    <span>{spec.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Nickname / Custom Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="name" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Nickname / Specimen Name (Optional)</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="e.g. Neon School, Bluey"
            />
          </div>

          {/* Qty & Size Class */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="quantity" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Quantity *</label>
              <input 
                type="number" 
                id="quantity" 
                name="quantity" 
                required 
                min="1"
                defaultValue="1"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="size" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Size Class (Optional)</label>
              <select id="size" name="size" defaultValue="">
                <option value="">Select standard size...</option>
                <option value="Juvenile (< 0.5 inch)">Juvenile (&lt; 0.5 inch)</option>
                <option value="Small (0.5 - 1 inch)">Small (0.5 - 1 inch)</option>
                <option value="Medium (1 - 2 inches)">Medium (1 - 2 inches)</option>
                <option value="Large (2 - 4 inches)">Large (2 - 4 inches)</option>
                <option value="Specimen (> 4 inches)">Specimen (&gt; 4 inches)</option>
              </select>
            </div>
          </div>

          {/* Source Vendor & Purchase Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="boughtFrom" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Vendor Store (Optional)</label>
              <input 
                type="text" 
                id="boughtFrom" 
                name="boughtFrom" 
                placeholder="e.g. Local Fish Store, Aquarists UK"
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
                placeholder="e.g. 9.99"
              />
            </div>
          </div>

          {/* Date Logged */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="addedDate" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Acquisition Date *</label>
            <input 
              type="date" 
              id="addedDate" 
              name="addedDate" 
              required
              defaultValue={new Date().toISOString().split('T')[0]}
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
              {isPending ? 'Logging Specimen...' : 'Save Livestock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
