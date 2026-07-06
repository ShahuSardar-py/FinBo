'use client';

import React, { useState } from 'react';
import EditTankModal from './EditTankModal';

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

interface EditTankButtonProps {
  tank: Tank;
  variant?: 'standard' | 'icon';
}

export default function EditTankButton({ tank, variant = 'standard' }: EditTankButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isIcon = variant === 'icon';

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        style={isIcon ? {
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
          boxShadow: '0 4px 10px rgba(15, 23, 42, 0.03)',
          transition: 'transform 0.2s ease',
          padding: 0
        } : {
          background: 'var(--tertiary)',
          color: 'white',
          border: 'none',
          padding: '0.6rem 1.2rem',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s ease'
        }}
        className="action-hover-btn"
      >
        ⚙️ {!isIcon && 'Edit Configuration'}
      </button>

      <EditTankModal 
        tank={tank} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
