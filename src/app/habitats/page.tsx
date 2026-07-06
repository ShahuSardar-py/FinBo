import { db } from '@/lib/db';
import Link from 'next/link';

export default async function HabitatsPage() {
  const tanks = await db.prepare('SELECT * FROM Tank ORDER BY setupDate DESC').all() as any[];

  // Retrieve statistics for the tanks
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Desktop View Header Area (visible on desktop only) */}
      <div className="desktop-only" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '1.5rem',
          marginBottom: '-0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
            <div>
              <h1 className="heading-2" style={{ margin: 0, fontWeight: 800, fontSize: '1.65rem', color: 'var(--tertiary)', letterSpacing: '-0.03em' }}>Finbo</h1>
              <p style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', margin: '0.15rem 0 0 0', textTransform: 'uppercase' }}>
                Aquarium Control
              </p>
            </div>
            <nav style={{ display: 'flex', gap: '0.5rem' }}>
              <Link href="/" style={{ 
                fontWeight: 600, 
                color: 'var(--primary)', 
                fontSize: '0.9rem',
                background: 'var(--secondary)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)'
              }}>
                📊 Habitats
              </Link>
              <Link href="/chemistry" className="nav-item-top" style={{ 
                fontWeight: 500, 
                color: 'var(--text-secondary)', 
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                transition: 'var(--transition-smooth)'
              }}>
                🧪 Chemistry Logs
              </Link>
              <Link href="/maintenance" className="nav-item-top" style={{ 
                fontWeight: 500, 
                color: 'var(--text-secondary)', 
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                transition: 'var(--transition-smooth)'
              }}>
                🔧 Maintenance Logs
              </Link>
              <Link href="/notifications" className="nav-item-top" style={{ 
                fontWeight: 500, 
                color: 'var(--text-secondary)', 
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                transition: 'var(--transition-smooth)'
              }}>
                🔔 Alerts Center
              </Link>
              <Link href="/settings" className="nav-item-top" style={{ 
                fontWeight: 500, 
                color: 'var(--text-secondary)', 
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                transition: 'var(--transition-smooth)'
              }}>
                ⚙️ Settings
              </Link>
            </nav>
          </div>
          
          <Link href="/tanks/new" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
            + Add New Habitat
          </Link>
          
          <style dangerouslySetInnerHTML={{ __html: `
            .nav-item-top:hover {
              color: var(--primary) !important;
              background: var(--secondary);
            }
          `}} />
        </header>

        {/* Overview Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Total Ecosystems</span>
            <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--tertiary)', marginTop: '0.25rem' }}>{tanks.length}</div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Total Water Volume</span>
            <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--primary)', marginTop: '0.25rem' }}>{totalVolume} L</div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Average Ecosystem Stability</span>
            <div style={{ fontSize: '2rem', fontWeight: 600, color: '#10b981', marginTop: '0.25rem' }}>{avgHealth}%</div>
          </div>
        </div>
      </div>
      
      {/* Mobile View Header Area (visible on mobile only) */}
      <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '0.5rem', gap: '0.5rem', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
            fontSize: '1.4rem'
          }}>
            🐠
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Good morning, Saif</span>
          <h1 className="heading-1" style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--tertiary)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            A healthier aquarium,<br />today
          </h1>
        </div>

        {/* Suggested Advisor: Ecosystem Tips */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--tertiary)' }}>Your AI Guide</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>See All</span>
          </div>
          
          <div className="card" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            background: '#ffffff',
            boxShadow: 'var(--shadow-flat)',
            borderRadius: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: '#ffedd5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem'
              }}>
                💡
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Suggested</div>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)' }}>Daily: Feed Neon Tetras micro-pellets</div>
              </div>
            </div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }}>✕</span>
          </div>
        </div>

        {/* 2x2 Grid block Today's Water Signals */}
        <div>
          <div style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--tertiary)' }}>Today's Water Signals</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{
              background: '#ffffff',
              padding: '0.9rem 1.25rem',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: 'var(--shadow-flat)',
              border: '1px solid var(--border-color)'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🌡️</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Temp Stable</span>
            </div>
            <div style={{
              background: '#ffffff',
              padding: '0.9rem 1.25rem',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: 'var(--shadow-flat)',
              border: '1px solid var(--border-color)'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🧪</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>pH Perfect</span>
            </div>
            <div style={{
              background: '#ffffff',
              padding: '0.9rem 1.25rem',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: 'var(--shadow-flat)',
              border: '1px solid var(--border-color)'
            }}>
              <span style={{ fontSize: '1.2rem' }}>💧</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Nitrates Low</span>
            </div>
            <div style={{
              background: '#ffffff',
              padding: '0.9rem 1.25rem',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: 'var(--shadow-flat)',
              border: '1px solid var(--border-color)'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🦠</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Cycle Safe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Enclosures Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--tertiary)' }}>Active Enclosures</span>
          <Link href="/tanks/new" className="mobile-only" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
            + Add Tank
          </Link>
        </div>
      </div>

      {/* Habitats Grid */}
      {tanks.length === 0 ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center', borderStyle: 'dashed' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐠</div>
          <h2 className="heading-2" style={{ marginBottom: '0.5rem' }}>No Habitats Logged</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Start by creating your first aquarium habitat to monitor water parameters, flora, and fauna.</p>
          <Link href="/tanks/new" className="btn btn-primary">Add Habitat</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {tanks.map((tank) => (
            <Link href={`/tanks/${tank.id}`} key={tank.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%', 
                cursor: 'pointer', 
                padding: 0, 
                overflow: 'hidden',
                border: (tank.hasTempAlert || tank.hasPhAlert) ? '1.5px solid #ef4444' : '1px solid var(--border-color)',
                boxShadow: (tank.hasTempAlert || tank.hasPhAlert) ? '0 10px 15px -3px rgba(239, 68, 68, 0.1)' : 'var(--shadow-flat)'
              }}>
                
                {/* Premium Cover Image or Pastel Sky Gradient */}
                <div style={{
                  height: '160px',
                  background: tank.imageUrl 
                    ? `url(${tank.imageUrl}) center/cover no-repeat` 
                    : 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                  position: 'relative',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  {/* Glowing warning aura on card head if drift is detected */}
                  {(tank.hasTempAlert || tank.hasPhAlert) && (
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      background: 'rgba(239, 68, 68, 0.15)',
                      backdropFilter: 'blur(1px)',
                      pointerEvents: 'none'
                    }} />
                  )}
                  
                  {/* Floating badges */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '0.35rem',
                    zIndex: 2
                  }}>
                    <div style={{
                      background: tank.healthScore > 90 ? '#10b981' : '#f59e0b',
                      color: 'white',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      {tank.healthScore}% Stability
                    </div>
                    
                    {(tank.hasTempAlert || tank.hasPhAlert) && (
                      <div style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        animation: 'pulseAlert 1.5s infinite'
                      }}>
                        ⚠️ DRIFT ALERT
                      </div>
                    )}
                  </div>
                </div>

                {/* Details list */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--tertiary)' }}>{tank.name}</h2>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      Setup: {new Date(tank.setupDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Size & Volume:</span>
                      <span style={{ fontWeight: 600 }}>{tank.volume} Liters</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Species Profile:</span>
                      <span style={{ fontWeight: 600 }}>
                        🐟 {tank.faunaCount} Fish • 🌿 {tank.floraCount} Plants
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Aquascape Specs:</span>
                      <span style={{ fontWeight: 600 }}>
                        {tank.isPlanted ? '🌿 Planted' : '🌊 Unplanted'} • {tank.hasGravel ? '🪨 Gravel' : '🧼 Bare'}
                      </span>
                    </div>
                  </div>

                  {/* Chemistry overview */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                      Live Parameters
                    </span>
                    {tank.latestParam ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                        <div style={{ 
                          background: tank.hasTempAlert ? '#fee2e2' : '#f8fafc', 
                          padding: '0.4rem', 
                          borderRadius: 'var(--radius-sm)',
                          border: tank.hasTempAlert ? '1px solid rgba(239, 68, 68, 0.2)' : 'none'
                        }}>
                          <div style={{ fontSize: '0.6rem', color: tank.hasTempAlert ? '#ef4444' : 'var(--text-secondary)', fontWeight: tank.hasTempAlert ? 700 : 500 }}>TEMP</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: tank.hasTempAlert ? '#ef4444' : 'var(--primary)' }}>
                            {tank.latestParam.temperature !== null ? `${tank.latestParam.temperature.toFixed(1)}°C` : '--'}
                          </div>
                        </div>
                        <div style={{ 
                          background: tank.hasPhAlert ? '#fee2e2' : '#f8fafc', 
                          padding: '0.4rem', 
                          borderRadius: 'var(--radius-sm)',
                          border: tank.hasPhAlert ? '1px solid rgba(239, 68, 68, 0.2)' : 'none'
                        }}>
                          <div style={{ fontSize: '0.6rem', color: tank.hasPhAlert ? '#ef4444' : 'var(--text-secondary)', fontWeight: tank.hasPhAlert ? 700 : 500 }}>PH</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: tank.hasPhAlert ? '#ef4444' : 'var(--primary)' }}>
                            {tank.latestParam.ph !== null ? tank.latestParam.ph.toFixed(1) : '--'}
                          </div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '0.4rem', borderRadius: 'var(--radius-sm)' }}>
                          <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>NITRATE</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: tank.latestParam.nitrate > 20 ? '#f59e0b' : '#10b981' }}>
                            {tank.latestParam.nitrate !== null ? `${tank.latestParam.nitrate}ppm` : '--'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        No chemistry parameters logged yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* CSS keyframe helper */}
                <style dangerouslySetInnerHTML={{ __html: `
                  @keyframes pulseAlert {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                  }
                `}} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
