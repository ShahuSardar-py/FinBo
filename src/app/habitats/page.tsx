import { db } from '@/lib/db';
import Link from 'next/link';

export default async function HabitatsPage() {
  const tanks = await db.prepare('SELECT * FROM Tank ORDER BY setupDate DESC').all() as any[];

  // Retrieve statistics for each tank
  for (const tank of tanks) {
    // Count fauna (FishProfile)
    const fishCount = await db.prepare('SELECT SUM(quantity) as count FROM FishProfile WHERE tankId = ?').get(tank.id) as any;
    tank.faunaCount = fishCount?.count || 0;

    // Count flora (PlantProfile)
    const plantCount = await db.prepare('SELECT SUM(quantity) as count FROM PlantProfile WHERE tankId = ?').get(tank.id) as any;
    tank.floraCount = plantCount?.count || 0;

    // Latest water parameters
    const latestLog = await db.prepare('SELECT * FROM WaterLog WHERE tankId = ? ORDER BY timestamp DESC LIMIT 1').get(tank.id) as any;
    tank.latestParam = latestLog || null;

    // Drift alerts
    const targetTemp = tank.targetTemp !== null && tank.targetTemp !== undefined ? tank.targetTemp : 24.0;
    const targetPh = tank.targetPh !== null && tank.targetPh !== undefined ? tank.targetPh : 7.0;
    tank.hasTempAlert = latestLog && latestLog.temperature !== null && Math.abs(latestLog.temperature - targetTemp) > 1.5;
    tank.hasPhAlert = latestLog && latestLog.ph !== null && Math.abs(latestLog.ph - targetPh) > 0.5;
  }

  const totalVolume = tanks.reduce((sum, tank) => sum + tank.volume, 0);
  const avgHealth = tanks.length > 0 ? Math.round(tanks.reduce((sum, tank) => sum + tank.healthScore, 0) / tanks.length) : 100;
  const activeAlertsCount = tanks.filter(t => t.hasTempAlert || t.hasPhAlert).length;

  return (
    <div style={{
      maxWidth: '540px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      padding: '1rem 0 5rem 0' // extra bottom spacing for floating nav
    }}>
      
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #bae6fd 0%, #e0f2fe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.6)'
          }}>
            👩‍🎨
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--tertiary)' }}>Finbo</span>
        </div>
        
        <Link href="/notifications" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            position: 'relative',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
            border: '1px solid var(--border-color)'
          }}>
            🔔
            {activeAlertsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '11px',
                right: '11px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ef4444',
                border: '1.5px solid #ffffff'
              }} />
            )}
          </div>
        </Link>
      </div>

      {/* System Health Card (Cyan Gradient) */}
      <div style={{
        background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
        borderRadius: '30px',
        padding: '2rem 2.25rem',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 15px 35px rgba(6, 182, 212, 0.15)'
      }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', opacity: 0.85, textTransform: 'uppercase' }}>
          SYSTEM HEALTH
        </span>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
          <span style={{ fontSize: '4rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
            {avgHealth}%
          </span>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#0891b2',
            padding: '0.35rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: 700,
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginLeft: '0.25rem'
          }}>
            📈 OPTIMAL
          </div>
        </div>
        
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '1rem 0 0 0', opacity: 0.95, letterSpacing: '-0.02em' }}>
          Global Stability
        </h2>

        {/* Water droplet outline graphic */}
        <div style={{
          position: 'absolute',
          right: '1.75rem',
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0.18,
          pointerEvents: 'none'
        }}>
          <svg width="80" height="98" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.5C12 2.5 4 11.5 4 16.5C4 20.9183 7.58172 24.5 12 24.5C16.4183 24.5 20 20.9183 20 16.5C20 11.5 12 2.5 12 2.5Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '0.75rem' }}>
        {/* Habitats Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '1rem 1.25rem',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            HABITATS
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--tertiary)', marginTop: '0.15rem' }}>
            {tanks.length}
          </div>
        </div>

        {/* Volume Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '1rem 1.25rem',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            VOLUME
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--tertiary)', marginTop: '0.15rem' }}>
            {totalVolume} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>L</span>
          </div>
        </div>

        {/* Rhythms/Alerts Card (Soft Light Cyan) */}
        <div style={{
          background: '#e0f7fa',
          borderRadius: '24px',
          padding: '1rem 1.25rem',
          boxShadow: '0 4px 12px rgba(6, 182, 212, 0.03)',
          border: '1px solid #b2ebf2'
        }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#00838f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ALERTS
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#00838f', marginTop: '0.15rem' }}>
            {activeAlertsCount}
          </div>
        </div>
      </div>

      {/* Active Habitats Heading Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--tertiary)', margin: 0 }}>
          Active Habitats
        </h3>
        <Link href="/tanks/new" style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none', letterSpacing: '0.05em' }}>
          + ADD NEW
        </Link>
      </div>

      {/* Habitats Vertical List */}
      {tanks.length === 0 ? (
        <div style={{
          background: '#ffffff',
          borderRadius: '30px',
          padding: '3rem 2rem',
          textAlign: 'center',
          border: '2px dashed var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '2.5rem' }}>🐠</div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--tertiary)', margin: '0 0 0.25rem 0' }}>No Habitats Logged</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              Setup your first enclosure to begin tracking stability.
            </p>
          </div>
          <Link href="/tanks/new" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--primary)',
              color: '#ffffff',
              padding: '0.6rem 1.5rem',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.75rem'
            }}>
              + Add Habitat
            </div>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tanks.map(tank => {
            const isOptimal = tank.healthScore >= 90;
            const isStable = tank.healthScore >= 70 && tank.healthScore < 90;

            return (
              <Link href={`/tanks/${tank.id}`} key={tank.id} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#ffffff',
                  borderRadius: '40px',
                  padding: '0.75rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)',
                  border: '1px solid var(--border-color)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer'
                }} className="habitat-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    {/* Circle icon */}
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: tank.isPlanted ? '#e0f7fa' : '#eef2ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem'
                    }}>
                      {tank.isPlanted ? '🌿' : '🐠'}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--tertiary)' }}>
                        {tank.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {tank.isPlanted ? 'Freshwater Planted' : 'Saltwater Reef'}
                      </div>
                    </div>
                  </div>

                  {/* Right Status badge */}
                  <div style={{
                    border: isOptimal ? '1px solid #b2f5ea' : isStable ? '1px solid #e2e8f0' : '1px solid #fed7d7',
                    background: isOptimal ? '#e6fffa' : isStable ? '#f8fafc' : '#fff5f5',
                    color: isOptimal ? '#00a389' : isStable ? '#64748b' : '#e53e3e',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '20px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em'
                  }}>
                    {isOptimal ? 'OPTIMAL' : isStable ? 'STABLE' : 'ATTENTION'}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Dashed Interaction Area */}
      <div style={{
        border: '2px dashed #cbd5e1',
        borderRadius: '30px',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '0.75rem',
        background: 'rgba(255, 255, 255, 0.4)',
        marginTop: '0.5rem'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          color: '#64748b'
        }}>
          📅
        </div>

        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--tertiary)', margin: '0 0 0.15rem 0' }}>
            Recent Meditations
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4, maxWidth: '280px' }}>
            No manual logs today. Interaction increases focus by 15%.
          </p>
        </div>

        {tanks.length > 0 ? (
          <Link href={`/tanks/${tanks[0].id}/maintenance/new`} style={{ textDecoration: 'none', width: '100%', maxWidth: '220px', marginTop: '0.25rem' }}>
            <div style={{
              background: '#0f172a',
              color: '#ffffff',
              padding: '0.8rem 1.25rem',
              borderRadius: '30px',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
            }} className="interaction-btn">
              LOG INTERACTION
            </div>
          </Link>
        ) : (
          <Link href="/tanks/new" style={{ textDecoration: 'none', width: '100%', maxWidth: '220px', marginTop: '0.25rem' }}>
            <div style={{
              background: '#0f172a',
              color: '#ffffff',
              padding: '0.8rem 1.25rem',
              borderRadius: '30px',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              textAlign: 'center',
              cursor: 'pointer'
            }} className="interaction-btn">
              LOG INTERACTION
            </div>
          </Link>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .habitat-row:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05) !important;
        }
        .interaction-btn:hover {
          opacity: 0.95;
        }
      `}} />
    </div>
  );
}
