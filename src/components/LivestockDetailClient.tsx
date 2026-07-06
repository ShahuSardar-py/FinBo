'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { updateLivestock, deleteLivestock } from '@/app/actions/livestockActions';
import { FormHeader, FormBanner, formStyles } from './FormStyles';

interface Tank {
  id: string;
  name: string;
}

interface FishProfile {
  id: string;
  tankId: string;
  species: string;
  name: string | null;
  quantity: number;
  size: string | null;
  boughtFrom: string | null;
  price: number | null;
  imageUrl: string | null;
  addedDate: string;
}

interface LivestockDetailClientProps {
  tank: Tank;
  fish: FishProfile;
}

const getScientificName = (species: string) => {
  const lower = species.toLowerCase();
  if (lower.includes('neon tetra')) return 'PARACHEIRODON INNESI';
  if (lower.includes('clownfish')) return 'AMPHIPRIONINAE';
  if (lower.includes('blue tang')) return 'PARACANTHURUS HEPATUS';
  if (lower.includes('cherry shrimp')) return 'NEOCARIDINA DAVIDI';
  if (lower.includes('amano shrimp')) return 'CARIDINA MULTIDENTATA';
  if (lower.includes('mystery snail')) return 'POMACEA BRIDGESII';
  if (lower.includes('oscar')) return 'ASTRONOTUS OCELLATUS';
  if (lower.includes('pleco') || lower.includes('bristlenose')) return 'ANCISTRUS CIRRHOSUS';
  if (lower.includes('guppy')) return 'POECILIA RETICULATA';
  if (lower.includes('betta')) return 'BETTA SPLENDENS';
  if (lower.includes('silver dollar')) return 'METYNNIS ARGENTEUS';
  return species.toUpperCase();
};

export default function LivestockDetailClient({ tank, fish }: LivestockDetailClientProps) {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [imageUrl, setImageUrl] = useState(fish.imageUrl || '');
  const [species, setSpecies] = useState(fish.species);
  const [isPending, setIsPending] = useState(false);

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateLivestock(formData);
      setMode('view');
    } catch (err: any) {
      alert(err.message || 'Failed to update specimen details');
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to remove ${fish.species} from this habitat?`)) {
      setIsPending(true);
      try {
        await deleteLivestock(fish.id, fish.tankId);
      } catch (err: any) {
        alert(err.message || 'Failed to delete specimen');
        setIsPending(false);
      }
    }
  };

  const isView = mode === 'view';

  return (
    <div style={formStyles.container}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <Link href={`/tanks/${tank.id}`} style={{
          textDecoration: 'none',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: '#ffffff',
          border: '1px solid rgba(15, 23, 42, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          color: '#0f172a',
          boxShadow: '0 4px 10px rgba(15, 23, 42, 0.03)'
        }}>
          ←
        </Link>
        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
          {isView ? 'Specimen Profile' : 'Edit Specimen'}
        </span>
        {isView ? (
          <button 
            type="button" 
            onClick={() => setMode('edit')}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid rgba(15, 23, 42, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(15, 23, 42, 0.03)'
            }}
          >
            ⚙️
          </button>
        ) : (
          <div style={{ width: '38px' }} />
        )}
      </div>

      {isView ? (
        /* View Mode: Detailed Report */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Cover Image */}
          <div style={{
            height: '200px',
            borderRadius: '30px',
            border: '1.5px solid rgba(15, 23, 42, 0.08)',
            background: `url(${fish.imageUrl || '/aquascape_banner.png'}) center/cover no-repeat`,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)'
          }}>
            {!fish.imageUrl && (
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(6, 182, 212, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3.5rem'
              }}>
                🐟
              </div>
            )}
          </div>

          {/* Species Info Panel */}
          <div style={{
            background: '#ffffff',
            borderRadius: '30px',
            padding: '2rem 1.75rem',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.02)',
            border: '1px solid rgba(15, 23, 42, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#00838f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                FAUNA Specimen
              </span>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.1rem 0 0.2rem 0', letterSpacing: '-0.02em' }}>
                {fish.species}
              </h1>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>
                {getScientificName(fish.species)}
              </div>
              {fish.name && (
                <div style={{ marginTop: '0.75rem', fontStyle: 'italic', color: '#475569', fontSize: '0.9rem', fontWeight: 600 }}>
                  "{fish.name}"
                </div>
              )}
            </div>

            {/* Metrics List */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              borderTop: '1px solid rgba(15, 23, 42, 0.06)',
              paddingTop: '1rem',
              marginTop: '0.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569' }}>
                <span style={{ fontWeight: 600 }}>Quantity</span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>{fish.quantity}x</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569' }}>
                <span style={{ fontWeight: 600 }}>Acquisition Date</span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>{new Date(fish.addedDate).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569' }}>
                <span style={{ fontWeight: 600 }}>Size Class</span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>{fish.size || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569' }}>
                <span style={{ fontWeight: 600 }}>Vendor Store</span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>{fish.boughtFrom || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569' }}>
                <span style={{ fontWeight: 600 }}>Price Paid</span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>{fish.price !== null ? `$${fish.price.toFixed(2)}` : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Mode: Pill Form */
        <div style={formStyles.card}>
          {/* Live Image Preview */}
          <div style={{
            display: 'flex',
            gap: '1.25rem',
            alignItems: 'center',
            background: '#f8fafc',
            padding: '1.25rem',
            borderRadius: '20px',
            border: '1.5px solid rgba(15, 23, 42, 0.08)'
          }}>
            <div style={{
              width: '74px',
              height: '74px',
              borderRadius: '16px',
              border: '1.5px solid rgba(15, 23, 42, 0.08)',
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

          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <input type="hidden" name="id" value={fish.id} />
            <input type="hidden" name="tankId" value={fish.tankId} />

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

            {/* Species */}
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
            </div>

            {/* Nickname */}
            <div style={formStyles.fieldGroup}>
              <label htmlFor="name" style={formStyles.label}>Nickname (Optional)</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                defaultValue={fish.name || ''}
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
                  defaultValue={fish.quantity}
                  style={formStyles.input}
                />
              </div>

              <div style={formStyles.fieldGroup}>
                <label htmlFor="size" style={formStyles.label}>Size Class (Optional)</label>
                <select id="size" name="size" defaultValue={fish.size || ''} style={formStyles.input}>
                  <option value="">Select size...</option>
                  <option value="Juvenile (< 0.5 inch)">Juvenile (&lt; 0.5")</option>
                  <option value="Small (0.5 - 1 inch)">Small (0.5 - 1")</option>
                  <option value="Medium (1 - 2 inches)">Medium (1 - 2")</option>
                  <option value="Large (2 - 4 inches)">Large (2 - 4")</option>
                  <option value="Specimen (> 4 inches)">Specimen (&gt; 4")</option>
                </select>
              </div>
            </div>

            {/* Vendor & Price */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={formStyles.fieldGroup}>
                <label htmlFor="boughtFrom" style={formStyles.label}>Vendor Store (Optional)</label>
                <input 
                  type="text" 
                  id="boughtFrom" 
                  name="boughtFrom" 
                  defaultValue={fish.boughtFrom || ''}
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
                  defaultValue={fish.price !== null ? fish.price : ''}
                  placeholder="e.g. 9.99"
                  style={formStyles.input}
                />
              </div>
            </div>

            {/* Acquisition Date */}
            <div style={formStyles.fieldGroup}>
              <label htmlFor="addedDate" style={formStyles.label}>Acquisition Date *</label>
              <input 
                type="date" 
                id="addedDate" 
                name="addedDate" 
                required
                defaultValue={new Date(fish.addedDate).toISOString().split('T')[0]}
                style={formStyles.input}
              />
            </div>

            {/* Actions */}
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
                {isPending ? 'Saving...' : '💾 Save Changes'}
              </button>
              
              <button 
                type="button" 
                onClick={handleDelete}
                disabled={isPending}
                style={{
                  ...formStyles.submitBtn,
                  background: '#ef4444',
                  boxShadow: '0 8px 24px rgba(239, 68, 68, 0.15)',
                  opacity: isPending ? 0.7 : 1,
                  cursor: isPending ? 'not-allowed' : 'pointer'
                }}
              >
                🗑️ Remove Specimen
              </button>

              <button type="button" onClick={() => setMode('view')} style={formStyles.cancelBtn}>
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}
