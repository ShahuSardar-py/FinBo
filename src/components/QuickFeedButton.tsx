'use client';

import React, { useState } from 'react';
import { quickFeed } from '@/app/actions/maintenanceActions';

interface QuickFeedButtonProps {
  tankId: string;
  variant?: 'glass' | 'standard' | 'darkTeal';
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
  const isDarkTeal = variant === 'darkTeal';

  let buttonBg = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
  let buttonColor = 'white';
  let buttonBorder = 'none';
  let buttonShadow = '0 4px 12px rgba(16, 185, 129, 0.15)';

  if (isGlass) {
    buttonBg = 'rgba(255, 255, 255, 0.25)';
    buttonColor = '#ffffff';
    buttonBorder = '1px solid rgba(255, 255, 255, 0.35)';
    buttonShadow = '0 8px 32px rgba(0, 0, 0, 0.15)';
  } else if (isDarkTeal) {
    buttonBg = '#005b60';
    buttonColor = '#ffffff';
    buttonBorder = 'none';
    buttonShadow = '0 8px 24px rgba(0, 91, 96, 0.25)';
  }

  return (
    <button
      onClick={handleQuickFeed}
      disabled={isPending}
      style={{
        background: buttonBg,
        color: buttonColor,
        border: buttonBorder,
        boxShadow: buttonShadow,
        padding: '0.85rem 2rem',
        borderRadius: '30px',
        cursor: isPending ? 'not-allowed' : 'pointer',
        fontWeight: 700,
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.6rem',
        opacity: isPending ? 0.75 : 1,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        width: 'auto'
      }}
      className="action-hover-btn"
    >
      <span>🍴</span>
      <span>{isPending ? 'Feeding...' : 'Quick Feed'}</span>
    </button>
  );
}
