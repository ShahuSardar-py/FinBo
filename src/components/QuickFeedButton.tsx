'use client';

import React, { useState } from 'react';
import { quickFeed } from '@/app/actions/maintenanceActions';

interface QuickFeedButtonProps {
  tankId: string;
  variant?: 'glass' | 'standard';
}

export default function QuickFeedButton({ tankId, variant = 'standard' }: QuickFeedButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleQuickFeed = async () => {
    setIsPending(true);
    try {
      await quickFeed(tankId);
    } catch (err: any) {
      alert(err.message || 'Failed to log feeding');
    } finally {
      setIsPending(false);
    }
  };

  const isGlass = variant === 'glass';

  return (
    <button
      onClick={handleQuickFeed}
      disabled={isPending}
      className="btn"
      style={{
        background: isGlass 
          ? 'rgba(255, 255, 255, 0.25)' 
          : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        backdropFilter: isGlass ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: isGlass ? 'blur(12px)' : 'none',
        color: isGlass ? '#ffffff' : 'white',
        border: isGlass ? '1px solid rgba(255, 255, 255, 0.35)' : 'none',
        padding: '0.75rem 1.75rem',
        borderRadius: '30px',
        cursor: isPending ? 'not-allowed' : 'pointer',
        fontWeight: 600,
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        opacity: isPending ? 0.75 : 1,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isGlass ? '0 8px 32px rgba(0, 0, 0, 0.15)' : '0 4px 12px rgba(16, 185, 129, 0.15)'
      }}
    >
      <span>🥫</span>
      <span>{isPending ? 'Logging Feed...' : 'Quick Feed'}</span>
    </button>
  );
}
