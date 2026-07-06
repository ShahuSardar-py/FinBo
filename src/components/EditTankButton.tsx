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
}

export default function EditTankButton({ tank }: EditTankButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="btn"
        style={{
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
          transition: 'var(--transition-smooth)'
        }}
      >
        ⚙️ Edit Configuration
      </button>

      <EditTankModal 
        tank={tank} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
