'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname === '/habitats' || pathname.startsWith('/tanks');
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
      background: '#272a30',
      borderRadius: '32px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0 8px',
      zIndex: 999,
      boxShadow: '0 12px 32px rgba(15, 23, 42, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.05)'
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
              background: active ? '#005b60' : 'transparent',
              color: active ? '#00f2fe' : '#7b8794',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              boxShadow: active ? '0 4px 12px rgba(0, 91, 96, 0.2)' : 'none',
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
