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
        if (value === 0) return { text: 'Ideal', color: '#166534', bg: '#dcfce7' };
        if (value <= 0.25) return { text: 'Warning', color: '#854d0e', bg: '#fef9c3' };
        return { text: 'Toxic!', color: '#991b1b', bg: '#fee2e2' };
      case 'nitrite':
        if (value === 0) return { text: 'Ideal', color: '#166534', bg: '#dcfce7' };
        if (value <= 0.25) return { text: 'Warning', color: '#854d0e', bg: '#fef9c3' };
        return { text: 'Toxic!', color: '#991b1b', bg: '#fee2e2' };
      case 'nitrate':
        if (value <= 10) return { text: 'Optimal', color: '#166534', bg: '#dcfce7' };
        if (value <= 25) return { text: 'Normal', color: '#1e40af', bg: '#dbeafe' };
        if (value <= 40) return { text: 'Warning', color: '#854d0e', bg: '#fef9c3' };
        return { text: 'Danger!', color: '#991b1b', bg: '#fee2e2' };
      case 'ph':
        if (value >= 6.5 && value <= 7.5) return { text: 'Neutral', color: '#166534', bg: '#dcfce7' };
        if (value >= 6.0 && value <= 8.2) return { text: 'Stable', color: '#1e40af', bg: '#dbeafe' };
        return { text: 'Alert', color: '#991b1b', bg: '#fee2e2' };
      default:
        return { text: 'Logged', color: '#64748b', bg: '#f1f5f9' };
    }
  };

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
          Chemistry Analyzer
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Track biological parameters, hardness levels, and temperature cycles.</p>
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
          Log New Measurements
        </h2>
        {tanks.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Please add a tank before logging parameters.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {tanks.map(tank => (
              <Link 
                href={`/tanks/${tank.id}/chemistry/new`} 
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
                <span>🧪</span>
                <span>{tank.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Parameter Logs List */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
          Historical Telemetry
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
            No water parameters logged yet. Select a tank above to record measurements.
          </div>
        ) : (
          logs.map((log) => {
            const ammoniaStatus = getStatus('ammonia', log.ammonia);
            const nitriteStatus = getStatus('nitrite', log.nitrite);
            const nitrateStatus = getStatus('nitrate', log.nitrate);
            const phStatus = getStatus('ph', log.ph);

            return (
              <div key={log.id} style={{
                background: '#ffffff',
                border: '1.5px solid rgba(15, 23, 42, 0.06)',
                borderRadius: '28px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
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
                    {new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: '#0f172a' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '0.4rem 0.75rem', borderRadius: '12px' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Temperature</span>
                    <span style={{ fontWeight: 700 }}>{log.temperature !== null ? `${log.temperature}°C` : '--'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '0.4rem 0.75rem', borderRadius: '12px' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>pH Level</span>
                    <span style={{
                      color: phStatus.color,
                      background: phStatus.bg,
                      padding: '0.05rem 0.4rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}>
                      {log.ph !== null ? log.ph : '--'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '0.4rem 0.75rem', borderRadius: '12px' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Ammonia (NH3)</span>
                    <span style={{
                      color: ammoniaStatus.color,
                      background: ammoniaStatus.bg,
                      padding: '0.05rem 0.4rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}>
                      {log.ammonia !== null ? `${log.ammonia} ppm` : '--'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '0.4rem 0.75rem', borderRadius: '12px' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Nitrite (NO2)</span>
                    <span style={{
                      color: nitriteStatus.color,
                      background: nitriteStatus.bg,
                      padding: '0.05rem 0.4rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}>
                      {log.nitrite !== null ? `${log.nitrite} ppm` : '--'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '0.4rem 0.75rem', borderRadius: '12px' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Nitrate (NO3)</span>
                    <span style={{
                      color: nitrateStatus.color,
                      background: nitrateStatus.bg,
                      padding: '0.05rem 0.4rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}>
                      {log.nitrate !== null ? `${log.nitrate} ppm` : '--'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '0.4rem 0.75rem', borderRadius: '12px' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Hardness (GH/KH)</span>
                    <span style={{ fontWeight: 700 }}>
                      {log.gh !== null ? `${log.gh}°` : '--'}/{log.kh !== null ? `${log.kh}°` : '--'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
