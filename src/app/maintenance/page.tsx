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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="heading-1">Maintenance Ledgers</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track biological cleans, water changes, and equipment modifications.</p>
        </div>
      </header>

      {/* Grid of tanks shortcuts to log */}
      <section className="card">
        <h2 className="heading-2" style={{ marginBottom: '1rem' }}>Log New Maintenance Session</h2>
        {tanks.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Please add a tank before logging maintenance actions.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {tanks.map(tank => (
              <Link 
                href={`/tanks/${tank.id}/maintenance/new`} 
                key={tank.id} 
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                🔧 Log for {tank.name}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Table of logs */}
      <section className="card" style={{ overflowX: 'auto', padding: '1.5rem 0' }}>
        <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
          <h2 className="heading-2" style={{ margin: 0 }}>Recent Maintenance Activities</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Showing last 30 entries across all enclosures.</p>
        </div>

        {logs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No maintenance actions logged yet. Select a tank above to log your first maintenance.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem 1.5rem' }}>Habitat</th>
                <th style={{ padding: '1rem' }}>Date & Time</th>
                <th style={{ padding: '1rem' }}>Activity Type</th>
                <th style={{ padding: '1rem' }}>Water Change</th>
                <th style={{ padding: '1rem', width: '40%' }}>Notes / Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.875rem', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>
                    <Link href={`/tanks/${log.tankId}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                      {log.tankName}
                    </Link>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>
                    {log.activityType}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {log.waterChangePercent > 0 ? (
                      <span style={{ 
                        background: 'var(--secondary)', 
                        color: 'var(--primary)', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        fontWeight: 700,
                        fontSize: '0.8rem'
                      }}>
                        💧 {log.waterChangePercent}%
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)' }}>--</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {log.notes || 'No description provided.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

    </div>
  );
}
