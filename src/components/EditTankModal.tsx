'use client';

import React from 'react';
import { updateTank } from '@/app/actions/tankActions';
import { formStyles } from './FormStyles';

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
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem',
      boxSizing: 'border-box'
    }}>
      <div style={{
        ...formStyles.card,
        width: '100%',
        maxWidth: '460px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        background: '#f8fafc',
        borderRadius: '30px',
        padding: '2rem 1.75rem',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
        animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        
        {/* Style block for animations */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes modalSlideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .option-radio {
            display: none !important;
          }
          .option-label {
            flex: 1;
            border: 1.5px solid rgba(15, 23, 42, 0.08);
            border-radius: 20px;
            padding: 1rem 0.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-weight: 800;
            font-size: 0.7rem;
            cursor: pointer;
            color: #64748b;
            background: #ffffff;
            transition: all 0.2s ease;
            text-transform: uppercase;
            box-sizing: border-box;
            text-align: center;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.02);
          }
          .option-radio:checked + .option-label {
            border-color: #00f2fe !important;
            color: #00838f !important;
            box-shadow: 0 6px 20px rgba(6, 182, 212, 0.12) !important;
          }

          .planting-radio {
            display: none !important;
          }
          .planting-label {
            flex: 1;
            border: 1.5px solid rgba(15, 23, 42, 0.08);
            border-radius: 28px;
            padding: 0.8rem 1rem;
            cursor: pointer;
            color: #0f172a;
            background: #ffffff;
            transition: all 0.2s ease;
            box-sizing: border-box;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.02);
          }
          .planting-radio:checked + .planting-label {
            border-color: #00f2fe !important;
            color: #00838f !important;
            box-shadow: 0 6px 20px rgba(6, 182, 212, 0.1) !important;
          }
        `}} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(15, 23, 42, 0.08)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Edit Configuration</h2>
          <button 
            type="button" 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#0f172a',
              padding: '0.25rem',
              fontWeight: 850
            }}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input type="hidden" name="id" value={tank.id} />

          {/* Tank Name */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="name" style={formStyles.label}>Tank Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              defaultValue={tank.name}
              placeholder="e.g., Midnight Reef"
              style={formStyles.input}
            />
          </div>

          {/* Volume & Image URL Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={formStyles.fieldGroup}>
              <label htmlFor="volume" style={formStyles.label}>Volume (L)</label>
              <input 
                type="number" 
                id="volume" 
                name="volume" 
                required 
                min="1"
                step="0.1"
                defaultValue={tank.volume}
                style={formStyles.input}
              />
            </div>
            <div style={formStyles.fieldGroup}>
              <label htmlFor="imageUrl" style={formStyles.label}>Image URL</label>
              <input 
                type="url" 
                id="imageUrl" 
                name="imageUrl" 
                defaultValue={tank.imageUrl || ''}
                placeholder="Paste URL"
                style={formStyles.input}
              />
            </div>
          </div>

          {/* Target Temp & pH */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={formStyles.fieldGroup}>
              <label htmlFor="targetTemp" style={formStyles.label}>Target Temp (°C)</label>
              <input 
                type="number" 
                id="targetTemp" 
                name="targetTemp" 
                step="0.1"
                min="0"
                max="40"
                defaultValue={tank.targetTemp !== null ? tank.targetTemp : 25}
                style={formStyles.input}
              />
            </div>
            <div style={formStyles.fieldGroup}>
              <label htmlFor="targetPh" style={formStyles.label}>Target pH</label>
              <input 
                type="number" 
                id="targetPh" 
                name="targetPh" 
                step="0.1"
                min="0"
                max="14"
                defaultValue={tank.targetPh !== null ? tank.targetPh : 7.0}
                style={formStyles.input}
              />
            </div>
          </div>

          {/* Substrate Type Selection (5 Hobbyist Options) */}
          <div style={formStyles.fieldGroup}>
            <span style={formStyles.label}>Substrate Type</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '0.2rem' }}>
              <input type="radio" id="edit_substrate_sand" name="hasGravel" value="no" defaultChecked={tank.hasGravel !== 1} className="option-radio" />
              <label htmlFor="edit_substrate_sand" className="option-label" style={{ width: 'calc(50% - 0.375rem)', flex: 'none', padding: '0.8rem 0.5rem', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>🫧</span>
                  <span>White Sand</span>
                </div>
              </label>

              <input type="radio" id="edit_substrate_soil" name="hasGravel" value="yes" defaultChecked={tank.hasGravel === 1} className="option-radio" />
              <label htmlFor="edit_substrate_soil" className="option-label" style={{ width: 'calc(50% - 0.375rem)', flex: 'none', padding: '0.8rem 0.5rem', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>🪨</span>
                  <span>Aqua Soil</span>
                </div>
              </label>

              <input type="radio" id="edit_substrate_gravel" name="hasGravel" value="yes" className="option-radio" />
              <label htmlFor="edit_substrate_gravel" className="option-label" style={{ width: 'calc(50% - 0.375rem)', flex: 'none', padding: '0.8rem 0.5rem', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>🏔️</span>
                  <span>River Gravel</span>
                </div>
              </label>

              <input type="radio" id="edit_substrate_coral" name="hasGravel" value="no" className="option-radio" />
              <label htmlFor="edit_substrate_coral" className="option-label" style={{ width: 'calc(50% - 0.375rem)', flex: 'none', padding: '0.8rem 0.5rem', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>🐚</span>
                  <span>Crushed Coral</span>
                </div>
              </label>

              <input type="radio" id="edit_substrate_bare" name="hasGravel" value="no" className="option-radio" />
              <label htmlFor="edit_substrate_bare" className="option-label" style={{ width: '100%', flex: 'none', padding: '0.8rem 0.5rem', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>✨</span>
                  <span>Bare Bottom</span>
                </div>
              </label>
            </div>
          </div>

          {/* Planting Setup (Planted, Non-Planted) */}
          <div style={formStyles.fieldGroup}>
            <span style={formStyles.label}>Planting Setup</span>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
              <input type="radio" id="edit_planting_yes" name="isPlanted" value="yes" defaultChecked={tank.isPlanted === 1} className="planting-radio" />
              <label htmlFor="edit_planting_yes" className="planting-label" style={{ padding: '0.6rem 0.75rem', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                  <span>🌿 Planted Tank</span>
                </div>
              </label>

              <input type="radio" id="edit_planting_no" name="isPlanted" value="no" defaultChecked={tank.isPlanted !== 1} className="planting-radio" />
              <label htmlFor="edit_planting_no" className="planting-label" style={{ padding: '0.6rem 0.75rem', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                  <span>🐠 Non-Planted</span>
                </div>
              </label>
            </div>
          </div>

          {/* Equipment Specs */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="equipment" style={formStyles.label}>Equipment specs</label>
            <textarea 
              id="equipment" 
              name="equipment" 
              rows={3}
              defaultValue={tank.equipment || ''}
              style={{ ...formStyles.input, borderRadius: '20px', resize: 'vertical' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="submit" style={formStyles.submitBtn}>
              💾 Save Changes
            </button>
            <button type="button" onClick={onClose} style={formStyles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
