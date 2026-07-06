'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNavigation() {
  const pathname = usePathname();

  // Hide bottom navigation bar on home/habitats page since we hide sidebar there?
  // No, on mobile app layouts, the bottom navigation bar ALWAYS displays on all pages! That is key to mobile app layouts.
  
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname === '/habitats';
    }
    return pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Habitats', path: '/', icon: '🏠' },
    { label: 'Chemistry', path: '/chemistry', icon: '📊' },
    { label: 'Maintenance', path: '/maintenance', icon: '🔧' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="mobile-only" style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '450px',
      height: '64px',
      background: 'rgba(15, 23, 42, 0.96)',
      backdropFilter: 'blur(20px)',
      borderRadius: '32px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0 8px',
      zIndex: 999,
      boxShadow: '0 12px 35px rgba(15, 23, 42, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <Link 
            key={item.path} 
            href={item.path}
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{
              width: active ? '48px' : '44px',
              height: active ? '48px' : '44px',
              borderRadius: '50%',
              background: active ? '#ffffff' : 'transparent',
              color: active ? '#0f172a' : '#94a3b8',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: active ? '1.5rem' : '1.35rem',
              boxShadow: active ? '0 8px 16px rgba(0,0,0,0.15)' : 'none',
              transform: active ? 'scale(1.08)' : 'scale(1)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <span>{item.icon}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
