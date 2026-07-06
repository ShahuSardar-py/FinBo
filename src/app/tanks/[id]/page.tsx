import { db } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import VirtualAquarium from '@/components/VirtualAquarium';
import EditTankButton from '@/components/EditTankButton';
import QuickFeedButton from '@/components/QuickFeedButton';

export default async function TankDashboard({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const tank = await db.prepare('SELECT * FROM Tank WHERE id = ?').get(resolvedParams.id) as any;
  
  if (!tank) return notFound();

  tank.fishProfiles = await db.prepare('SELECT * FROM FishProfile WHERE tankId = ?').all(tank.id);
  tank.plantProfiles = await db.prepare('SELECT * FROM PlantProfile WHERE tankId = ?').all(tank.id);
  tank.equipmentItems = await db.prepare('SELECT * FROM Equipment WHERE tankId = ? ORDER BY boughtDate DESC').all(tank.id);
  tank.waterLogs = await db.prepare('SELECT * FROM WaterLog WHERE tankId = ? ORDER BY timestamp DESC LIMIT 6').all(tank.id);
  tank.maintenanceLogs = await db.prepare("SELECT * FROM MaintenanceLog WHERE tankId = ? AND activityType != 'Feeding' ORDER BY timestamp DESC LIMIT 6").all(tank.id);
  tank.feedingLogs = await db.prepare("SELECT * FROM MaintenanceLog WHERE tankId = ? AND activityType = 'Feeding' ORDER BY timestamp DESC LIMIT 6").all(tank.id);
  tank.feedStock = await db.prepare('SELECT * FROM FeedStock WHERE tankId = ? ORDER BY boughtDate DESC').all(tank.id);

  // Latest log parameters for hero overlay
  const latestLog = tank.waterLogs[0] || null;

  const targetTemp = tank.targetTemp !== null && tank.targetTemp !== undefined ? tank.targetTemp : 24.0;
  const targetPh = tank.targetPh !== null && tank.targetPh !== undefined ? tank.targetPh : 7.0;
  
  const currentTemp = latestLog && latestLog.temperature !== null ? latestLog.temperature : null;
  const currentPh = latestLog && latestLog.ph !== null ? latestLog.ph : null;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Header Row (Leafy-style: Pick Your Goods / Tank Name) */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1.5rem',
        marginBottom: '-0.5rem'
      }}>
        <Link href="/" style={{ 
          color: 'var(--text-secondary)', 
          textDecoration: 'none', 
          fontWeight: 600, 
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          ← Back
        </Link>
        <h1 style={{ 
          fontFamily: 'Georgia, serif', 
          fontWeight: 'normal', 
          fontSize: '2rem', 
          margin: 0,
          color: 'var(--tertiary)',
          letterSpacing: '-0.02em',
          textAlign: 'center'
        }}>
          {tank.name}
        </h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <EditTankButton tank={tank} />
        </div>
      </div>

      {/* Main Content Area: Left/Center Workspace & Right Dark Panel */}
      <div style={{ 
        display: 'flex', 
        gap: '2.5rem', 
        flexDirection: 'row',
        alignItems: 'flex-start'
      }} className="responsive-detail-layout">
        
        {/* Left/Center Main Workspace (flex: 1) */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2.5rem', minWidth: '320px' }}>
          
          {/* Top Grid: Canvas (Left) & Ecosystem HUD (Right) */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '2rem' 
          }}>
            
            {/* Left Card: Virtual Aquarium Canvas */}
            <div style={{ 
              position: 'relative', 
              borderRadius: '28px', 
              overflow: 'hidden', 
              boxShadow: 'var(--shadow-premium)',
              height: '380px'
            }}>
              <VirtualAquarium 
                hasGravel={tank.hasGravel} 
                isPlanted={tank.isPlanted} 
                fish={tank.fishProfiles} 
                plants={tank.plantProfiles} 
              />
              
              {/* Type Pill (Top Left) */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--tertiary)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
              }}>
                📍 Type: {tank.isPlanted ? 'Planted' : 'Bare bottom'}
              </div>
              
              {/* Quick Feed Glass Overlay (Center) */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 20
              }}>
                <QuickFeedButton tankId={tank.id} variant="glass" />
              </div>
            </div>

            {/* Right Card: Ecosystem HUD (Grocery Pack style) */}
            <div className="card" style={{ 
              borderRadius: '28px', 
              padding: '2rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.25rem',
              background: '#ffffff',
              boxShadow: 'var(--shadow-premium)',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h2 style={{ 
                    fontFamily: 'Georgia, serif', 
                    fontSize: '2rem', 
                    fontWeight: 'normal', 
                    margin: 0,
                    color: 'var(--tertiary)'
                  }}>
                    Ecosystem HUD
                  </h2>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b' }}>
                    {tank.healthScore !== null ? `${tank.healthScore} ✨` : 'N/A'}
                  </span>
                </div>
                
                {/* Active Livestock catalog list (In your bag style) */}
                <div style={{ marginTop: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Active Livestock:
                  </span>
                  
                  {tank.fishProfiles.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic', marginTop: '0.5rem' }}>
                      No livestock active.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                      {tank.fishProfiles.map((fish: any) => (
                        <div key={fish.id} style={{
                          background: 'var(--secondary)',
                          padding: '0.5rem 0.85rem',
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                        }}>
                          <span style={{ fontSize: '1.2rem' }}>🐟</span>
                          <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--tertiary)' }}>{fish.species}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>qty: {fish.quantity}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom status indicators */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <span className="badge" style={{ background: '#f0fdf4', color: '#166534', padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 700 }}>
                  🌡️ Temp: {currentTemp !== null ? `${currentTemp}°C` : 'N/A'} (Set: {targetTemp}°C)
                </span>
                <span className="badge" style={{ background: '#eff6ff', color: '#1e40af', padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 700 }}>
                  🧪 pH: {currentPh !== null ? currentPh : 'N/A'} (Set: {targetPh})
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Row: Ecosystem Catalogs (Pick your goods items list style) */}
          <div>
            <h3 style={{ 
              fontFamily: 'Georgia, serif', 
              fontSize: '1.5rem', 
              fontWeight: 'normal', 
              marginBottom: '1.25rem',
              color: 'var(--tertiary)' 
            }}>
              Ecosystem Catalogs
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
              gap: '1rem' 
            }}>
              {/* Card 1: Add Livestock */}
              <Link href={`/tanks/${tank.id}/livestock/new`} style={{ textDecoration: 'none' }}>
                <div className="card catalog-action-card" style={{
                  padding: '1.25rem',
                  borderRadius: '20px',
                  background: '#ffffff',
                  boxShadow: 'var(--shadow-flat)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                  <span style={{ fontSize: '2.5rem' }}>🐟</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--tertiary)' }}>Livestock</span>
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    +
                  </div>
                </div>
              </Link>

              {/* Card 2: Add Plants */}
              <Link href={`/tanks/${tank.id}/plants/new`} style={{ textDecoration: 'none' }}>
                <div className="card catalog-action-card" style={{
                  padding: '1.25rem',
                  borderRadius: '20px',
                  background: '#ffffff',
                  boxShadow: 'var(--shadow-flat)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                  <span style={{ fontSize: '2.5rem' }}>🌿</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--tertiary)' }}>Flora</span>
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    +
                  </div>
                </div>
              </Link>

              {/* Card 3: Add Equipment */}
              <Link href={`/tanks/${tank.id}/equipment/new`} style={{ textDecoration: 'none' }}>
                <div className="card catalog-action-card" style={{
                  padding: '1.25rem',
                  borderRadius: '20px',
                  background: '#ffffff',
                  boxShadow: 'var(--shadow-flat)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                  <span style={{ fontSize: '2.5rem' }}>⚙️</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--tertiary)' }}>Hardware</span>
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    +
                  </div>
                </div>
              </Link>

              {/* Card 4: Add Chemistry */}
              <Link href={`/tanks/${tank.id}/chemistry/new`} style={{ textDecoration: 'none' }}>
                <div className="card catalog-action-card" style={{
                  padding: '1.25rem',
                  borderRadius: '20px',
                  background: '#ffffff',
                  boxShadow: 'var(--shadow-flat)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                  <span style={{ fontSize: '2.5rem' }}>🧪</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--tertiary)' }}>Chemistry</span>
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    +
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            .catalog-action-card:hover {
              transform: translateY(-4px) !important;
              box-shadow: var(--shadow-premium) !important;
              border-color: var(--primary) !important;
            }
          `}} />

        </div>

        {/* Right Side Panel: Dark Maintenance & Logs Console */}
        <div style={{ 
          width: '380px', 
          background: 'var(--tertiary)', 
          color: '#f8fafc', 
          borderRadius: '30px', 
          padding: '2.5rem', 
          boxSizing: 'border-box',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2rem',
          minWidth: '300px',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)'
        }} className="responsive-dark-panel">
          
          <div>
            <h3 style={{ 
              fontFamily: 'Georgia, serif', 
              fontSize: '1.75rem', 
              fontWeight: 'normal', 
              margin: 0,
              color: '#ffffff',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              paddingBottom: '1rem'
            }}>
              Control Center
            </h3>
          </div>

          {/* Activity presets (Product Size style) */}
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.75rem' }}>
              Maintenance Presets:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', padding: '0.5rem 0.85rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                Glass Clean
              </span>
              <span style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', padding: '0.5rem 0.85rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                Filter Rinse
              </span>
              <span style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', padding: '0.5rem 0.85rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                Co2 Check
              </span>
            </div>
          </div>

          {/* Water Change Toggles (Package style) */}
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.75rem' }}>
              Water Change Volume:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '0.75rem',
                borderRadius: '16px',
                textAlign: 'center',
                cursor: 'pointer'
              }}>
                <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700 }}>10%</span>
                <span style={{ display: 'block', fontSize: '0.6rem', color: '#94a3b8' }}>Lite</span>
              </div>
              <div style={{
                background: '#ffffff',
                border: '1px solid #ffffff',
                color: 'var(--tertiary)',
                padding: '0.75rem',
                borderRadius: '16px',
                textAlign: 'center',
                cursor: 'pointer'
              }}>
                <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700 }}>25%</span>
                <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Normal</span>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '0.75rem',
                borderRadius: '16px',
                textAlign: 'center',
                cursor: 'pointer'
              }}>
                <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700 }}>50%</span>
                <span style={{ display: 'block', fontSize: '0.6rem', color: '#94a3b8' }}>Heavy</span>
              </div>
            </div>
          </div>

          {/* Quick telemetry indicators (Delivery options style) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.825rem', color: '#e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
              <span>Bioluminescence Mode:</span>
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Active ✔</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
              <span>Auto Co2 Doser:</span>
              <span style={{ fontWeight: 600, color: '#22c55e' }}>Running ⚡</span>
            </div>
          </div>

          {/* Large Serif display for Stability Index (Total Price style) */}
          <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Stability Index</span>
              <span style={{ 
                fontFamily: 'Georgia, serif', 
                fontSize: '2.5rem', 
                fontWeight: 'normal',
                color: '#ffffff'
              }}>
                {tank.healthScore}%
              </span>
            </div>
          </div>

          {/* Large bottom primary action button (Add to cart style) */}
          <Link href={`/tanks/${tank.id}/maintenance/new`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--primary)',
              color: '#ffffff',
              padding: '1rem',
              borderRadius: '20px',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 10px 20px rgba(78, 168, 222, 0.25)',
              cursor: 'pointer',
              transition: 'all 0.25s'
            }} className="console-action-btn">
              Log Maintenance
            </div>
          </Link>

          <style dangerouslySetInnerHTML={{ __html: `
            .console-action-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 12px 24px rgba(78, 168, 222, 0.35);
              background: #64b5f6;
            }
          `}} />

        </div>

      </div>

      {/* Legacy/Tabular Logs and Details Area (kept at bottom for completeness) */}
      <div className="desktop-only" style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '2.5rem' }}>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 'normal', marginBottom: '1.5rem', color: 'var(--tertiary)' }}>
          Detailed Historical Log Ledger
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
          {/* Water logs */}
          <div className="card" style={{ background: '#ffffff', padding: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700, fontSize: '0.9rem', color: 'var(--tertiary)' }}>Chemistry Trends</h4>
            {tank.waterLogs.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontStyle: 'italic' }}>No chemistry entries.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {tank.waterLogs.map((log: any) => (
                  <div key={log.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                      {log.temperature && <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.temperature}°C</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                      {log.ph !== null && <span>pH: <b>{log.ph}</b></span>}
                      {log.ammonia !== null && <span style={{ color: log.ammonia > 0 ? '#ef4444' : 'inherit' }}>NH3: <b>{log.ammonia}</b></span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feeding history */}
          <div className="card" style={{ background: '#ffffff', padding: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700, fontSize: '0.9rem', color: 'var(--tertiary)' }}>Feeding History</h4>
            {tank.feedingLogs.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontStyle: 'italic' }}>No feeding logs.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {tank.feedingLogs.map((log: any) => (
                  <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', borderLeft: '3px solid #10b981', paddingLeft: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: '#059669' }}>Fed</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{new Date(log.timestamp).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Maintenance Logs */}
          <div className="card" style={{ background: '#ffffff', padding: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700, fontSize: '0.9rem', color: 'var(--tertiary)' }}>Maintenance Ledger</h4>
            {tank.maintenanceLogs.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontStyle: 'italic' }}>No maintenance logs.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {tank.maintenanceLogs.map((log: any) => (
                  <div key={log.id} style={{ fontSize: '0.75rem', borderLeft: '3px solid var(--primary)', paddingLeft: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                      <span>{log.activityType}</span>
                      {log.waterChangePercent > 0 && <span>💧 {log.waterChangePercent}%</span>}
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{new Date(log.timestamp).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
