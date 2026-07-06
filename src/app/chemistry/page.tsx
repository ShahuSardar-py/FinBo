import { db } from '@/lib/db';
import Link from 'next/link';

export default async function ChemistryPage() {
  const tanks = await db.prepare('SELECT id, name FROM Tank').all() as any[];
  const logs = await db.prepare(`
    SELECT WaterLog.*, Tank.name as tankName 
    FROM WaterLog 
    JOIN Tank ON WaterLog.tankId = Tank.id 
    ORDER BY WaterLog.timestamp DESC 
    LIMIT 30
  `).all() as any[];

  // Helper to determine status classes and text
  const getStatus = (param: string, value: number | null) => {
    if (value === null) return { text: '--', color: '#64748b', bg: '#f1f5f9' };
    
    switch (param) {
      case 'ammonia':
        if (value === 0) return { text: 'Ideal (0.0)', color: '#10b981', bg: '#ecfdf5' };
        if (value <= 0.25) return { text: 'Warning', color: '#f59e0b', bg: '#fffbeb' };
        return { text: 'Toxic!', color: '#ef4444', bg: '#fef2f2' };
      case 'nitrite':
        if (value === 0) return { text: 'Ideal (0.0)', color: '#10b981', bg: '#ecfdf5' };
        if (value <= 0.25) return { text: 'Warning', color: '#f59e0b', bg: '#fffbeb' };
        return { text: 'Toxic!', color: '#ef4444', bg: '#fef2f2' };
      case 'nitrate':
        if (value <= 10) return { text: 'Optimal', color: '#10b981', bg: '#ecfdf5' };
        if (value <= 25) return { text: 'Acceptable', color: '#3b82f6', bg: '#eff6ff' };
        if (value <= 40) return { text: 'Warning', color: '#f59e0b', bg: '#fffbeb' };
        return { text: 'Dangerous!', color: '#ef4444', bg: '#fef2f2' };
      case 'ph':
        if (value >= 6.5 && value <= 7.5) return { text: 'Neutral', color: '#10b981', bg: '#ecfdf5' };
        if (value >= 6.0 && value <= 8.2) return { text: 'Acceptable', color: '#3b82f6', bg: '#eff6ff' };
        return { text: 'Out of Range', color: '#ef4444', bg: '#fef2f2' };
      default:
        return { text: 'Logged', color: '#64748b', bg: '#f1f5f9' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="heading-1">Water Chemistry logs</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track biological parameters, hardness levels, and temperature cycles.</p>
        </div>
      </header>

      {/* Grid of tanks shortcuts to log */}
      <section className="card">
        <h2 className="heading-2" style={{ marginBottom: '1rem' }}>Log New Measurements</h2>
        {tanks.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Please add a tank before logging parameters.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {tanks.map(tank => (
              <Link 
                href={`/tanks/${tank.id}/chemistry/new`} 
                key={tank.id} 
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                🧪 Log for {tank.name}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Param status chart explanation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Table of logs */}
        <section className="card" style={{ overflowX: 'auto', padding: '1.5rem 0' }}>
          <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
            <h2 className="heading-2" style={{ margin: 0 }}>Recent Water Parameter Logs</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Showing last 30 readings across all enclosures.</p>
          </div>

          {logs.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No water parameters logged yet. Select a tank above to log your first parameter.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                  <th style={{ padding: '1rem 1.5rem' }}>Habitat</th>
                  <th style={{ padding: '1rem' }}>Date & Time</th>
                  <th style={{ padding: '1rem' }}>Temp</th>
                  <th style={{ padding: '1rem' }}>pH</th>
                  <th style={{ padding: '1rem' }}>Ammonia</th>
                  <th style={{ padding: '1rem' }}>Nitrite</th>
                  <th style={{ padding: '1rem' }}>Nitrate</th>
                  <th style={{ padding: '1rem' }}>GH / KH</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const ammoniaStatus = getStatus('ammonia', log.ammonia);
                  const nitriteStatus = getStatus('nitrite', log.nitrite);
                  const nitrateStatus = getStatus('nitrate', log.nitrate);
                  const phStatus = getStatus('ph', log.ph);

                  return (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.875rem', transition: 'background-color 0.2s' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>
                        <Link href={`/tanks/${log.tankId}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                          {log.tankName}
                        </Link>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>
                        {log.temperature !== null ? `${log.temperature}°C` : '--'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          color: phStatus.color, 
                          background: phStatus.bg, 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '4px', 
                          fontWeight: 600,
                          fontSize: '0.8rem'
                        }}>
                          {log.ph !== null ? log.ph : '--'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          color: ammoniaStatus.color, 
                          background: ammoniaStatus.bg, 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '4px', 
                          fontWeight: 600,
                          fontSize: '0.8rem'
                        }}>
                          {log.ammonia !== null ? `${log.ammonia} ppm` : '--'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          color: nitriteStatus.color, 
                          background: nitriteStatus.bg, 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '4px', 
                          fontWeight: 600,
                          fontSize: '0.8rem'
                        }}>
                          {log.nitrite !== null ? `${log.nitrite} ppm` : '--'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          color: nitrateStatus.color, 
                          background: nitrateStatus.bg, 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '4px', 
                          fontWeight: 600,
                          fontSize: '0.8rem'
                        }}>
                          {log.nitrate !== null ? `${log.nitrate} ppm` : '--'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                        {log.gh !== null ? `${log.gh}°d` : '--'} / {log.kh !== null ? `${log.kh}°d` : '--'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </div>

    </div>
  );
}
