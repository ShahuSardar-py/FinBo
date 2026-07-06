'use client';

import React from 'react';
import { updateTank } from '@/app/actions/tankActions';

interface Tank {
  id: string;
  name: string;
  volume: number;
  equipment: string | null;
  hasGravel: number;
  isPlanted: number;
  targetTemp: number | null;
  targetPh: number | null;
  imageUrl: string | null;
}

interface EditTankModalProps {
  tank: Tank;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditTankModal({ tank, isOpen, onClose }: EditTankModalProps) {
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await updateTank(formData);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to update tank');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem',
      boxSizing: 'border-box'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        background: '#ffffff',
        animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        
        {/* Style block for animations */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes modalSlideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <h2 className="heading-2">Edit Tank Configuration</h2>
          <button 
            type="button" 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '0.25rem'
            }}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input type="hidden" name="id" value={tank.id} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="name" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Tank Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              defaultValue={tank.name}
              placeholder="e.g. Zen Garden"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="volume" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Volume (Liters)</label>
              <input 
                type="number" 
                id="volume" 
                name="volume" 
                required 
                min="1"
                step="0.1"
                defaultValue={tank.volume}
                placeholder="e.g. 150"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="imageUrl" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Image URL (Optional)</label>
              <input 
                type="url" 
                id="imageUrl" 
                name="imageUrl" 
                defaultValue={tank.imageUrl || ''}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="targetTemp" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Target Temp (°C)</label>
              <input 
                type="number" 
                id="targetTemp" 
                name="targetTemp" 
                step="0.1"
                min="0"
                max="40"
                defaultValue={tank.targetTemp !== null ? tank.targetTemp : 24.0}
                placeholder="e.g. 24.5"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="targetPh" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Target pH Level</label>
              <input 
                type="number" 
                id="targetPh" 
                name="targetPh" 
                step="0.1"
                min="0"
                max="14"
                defaultValue={tank.targetPh !== null ? tank.targetPh : 7.0}
                placeholder="e.g. 6.8"
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="equipment" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Equipment Specs</label>
            <textarea 
              id="equipment" 
              name="equipment" 
              rows={3}
              defaultValue={tank.equipment || ''}
              placeholder="Canister filters, LED lights, heaters, etc."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Substrate</span>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input type="radio" name="hasGravel" value="yes" defaultChecked={tank.hasGravel === 1} />
                  Gravel/Sand
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input type="radio" name="hasGravel" value="no" defaultChecked={tank.hasGravel !== 1} />
                  Bare Bottom
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Planting</span>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input type="radio" name="isPlanted" value="yes" defaultChecked={tank.isPlanted === 1} />
                  Planted
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input type="radio" name="isPlanted" value="no" defaultChecked={tank.isPlanted !== 1} />
                  Unplanted
                </label>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
