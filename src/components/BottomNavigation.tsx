'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname === '/habitats';
    }
    return pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Habitats', path: '/', icon: '㗊' },
    { label: 'Chemistry', path: '/chemistry', icon: '💧' },
    { label: 'Maintenance', path: '/maintenance', icon: '📖' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '420px',
      height: '64px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderRadius: '32px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0 8px',
      zIndex: 999,
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
      border: '1px solid rgba(15, 23, 42, 0.05)'
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
              justifyContent: 'center'
            }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: active ? 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)' : 'transparent',
              color: active ? '#ffffff' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: active ? '1.35rem' : '1.35rem',
              boxShadow: active ? '0 6px 16px rgba(6, 182, 212, 0.25)' : 'none',
              transform: active ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <span>{item.icon}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
