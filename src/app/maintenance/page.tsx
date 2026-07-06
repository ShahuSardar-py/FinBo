import { db } from '@/lib/db';
import Link from 'next/link';

export default async function MaintenancePage() {
  const tanks = await db.prepare('SELECT id, name FROM Tank').all() as any[];
  const logs = await db.prepare(`
    SELECT MaintenanceLog.*, Tank.name as tankName 
    FROM MaintenanceLog 
    JOIN Tank ON MaintenanceLog.tankId = Tank.id 
    WHERE MaintenanceLog.activityType != 'Feeding'
    ORDER BY MaintenanceLog.timestamp DESC 
    LIMIT 30
  `).all() as any[];

  return (
    <div style={{
      maxWidth: '480px',
      margin: '0 auto',
      padding: '1rem 0 6rem 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      
      <header>
        <h1 className="heading-1" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 0.25rem 0' }}>
          Maintenance Ledger
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Track biological cleans, water changes, and equipment modifications.</p>
      </header>

      {/* Log shortcuts */}
      <section style={{
        background: '#ffffff',
        border: '1.5px solid rgba(15, 23, 42, 0.06)',
        borderRadius: '30px',
        padding: '1.5rem 1.25rem',
        boxShadow: '0 12px 24px rgba(15, 23, 42, 0.02)'
      }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.75rem 0', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
          Log New Session
        </h2>
        {tanks.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Please add a tank before logging maintenance actions.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {tanks.map(tank => (
              <Link 
                href={`/tanks/${tank.id}/maintenance/new`} 
                key={tank.id} 
                style={{
                  background: '#005b60',
                  color: '#ffffff',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 10px rgba(0, 91, 96, 0.15)'
                }}
              >
                <span>🔧</span>
                <span>{tank.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Maintenance Activities list */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
          Recent Activities
        </h2>

        {logs.length === 0 ? (
          <div style={{
            background: '#ffffff',
            borderRadius: '30px',
            padding: '3rem 1.5rem',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            border: '1.5px solid rgba(15, 23, 42, 0.06)'
          }}>
            No maintenance actions logged yet. Select a tank above to log your first session.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} style={{
              background: '#ffffff',
              border: '1.5px solid rgba(15, 23, 42, 0.06)',
              borderRadius: '28px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.01)'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href={`/tanks/${log.tankId}`} style={{
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: '#00838f',
                  textDecoration: 'none'
                }}>
                  {log.tankName}
                </Link>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {new Date(log.timestamp).toLocaleDateString()}
                </span>
              </div>

              {/* Title row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                  {log.activityType}
                </span>

                {log.waterChangePercent > 0 && (
                  <span style={{
                    background: '#e0f7fa',
                    color: '#00838f',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.25rem 0.6rem',
                    borderRadius: '12px'
                  }}>
                    💧 {log.waterChangePercent}% Vol Replaced
                  </span>
                )}
              </div>

              {/* Notes */}
              <div style={{
                background: '#f8fafc',
                padding: '0.75rem 1rem',
                borderRadius: '16px',
                fontSize: '0.8rem',
                color: '#475569',
                lineHeight: 1.4,
                border: '1px solid rgba(15, 23, 42, 0.03)'
              }}>
                {log.notes || 'No description provided.'}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
