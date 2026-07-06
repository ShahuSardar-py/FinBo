'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname() || '/';

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname === '/habitats';
    }
    return pathname.startsWith(path);
  };

  // Hide sidebar on landing habitats views as requested by the user
  if (pathname === '/' || pathname === '/habitats') {
    return null;
  }

  const menuItems = [
    { icon: '🏠', path: '/', label: 'Habitats' },
    { icon: '📊', path: '/chemistry', label: 'Chemistry' },
    { icon: '🔧', path: '/maintenance', label: 'Maintenance' },
    { icon: '⚙️', path: '/settings', label: 'Settings' },
  ];

  return (
    <aside className="desktop-only" style={{
      width: '80px',
      height: '100vh',
      background: 'var(--secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '2.5rem 0',
      boxSizing: 'border-box',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand Logo */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'var(--primary)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '1.25rem',
          boxShadow: '0 4px 10px rgba(78, 168, 222, 0.2)'
        }}>
          F
        </div>
        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--tertiary)', letterSpacing: '0.05em' }}>Finbo</span>
      </div>

      {/* Navigation Icons Group */}
      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        alignItems: 'center'
      }}>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link 
              key={item.path} 
              href={item.path}
              title={item.label}
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
                background: active ? 'var(--tertiary)' : 'transparent',
                color: active ? '#ffffff' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                boxShadow: active ? '0 6px 14px rgba(15, 23, 42, 0.15)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                {item.icon}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Avatar with Green status dot exactly like mockup */}
      <div style={{
        position: 'relative',
        cursor: 'pointer'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: '#fee2e2',
          border: '2px solid #ffffff',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-flat)',
          fontSize: '1.25rem'
        }}>
          👤
        </div>
        <div style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: '#22c55e',
          border: '2px solid #ffffff'
        }} />
      </div>
    </aside>
  );
}
