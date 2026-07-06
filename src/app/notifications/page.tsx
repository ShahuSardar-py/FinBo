import { db } from '@/lib/db';
import Link from 'next/link';

export default async function NotificationsPage() {
  const tanks = await db.prepare('SELECT id, name, healthScore FROM Tank').all() as any[];
  
  const alerts: any[] = [];

  for (const tank of tanks) {
    // Check latest water parameters
    const latestLog = await db.prepare('SELECT * FROM WaterLog WHERE tankId = ? ORDER BY timestamp DESC LIMIT 1').get(tank.id) as any;
    if (latestLog) {
      if (latestLog.ammonia > 0) {
        alerts.push({
          type: 'danger',
          title: `Ammonia Spike in "${tank.name}"`,
          message: `Ammonia level is at ${latestLog.ammonia} ppm. Perform a 30% water change immediately and add dechlorinator conditioner.`,
          tankId: tank.id,
          timestamp: latestLog.timestamp
        });
      }
      if (latestLog.nitrite > 0) {
        alerts.push({
          type: 'danger',
          title: `Nitrite Spike in "${tank.name}"`,
          message: `Nitrite is at ${latestLog.nitrite} ppm. Nitrite inhibits fish oxygen transport. Perform water change immediately.`,
          tankId: tank.id,
          timestamp: latestLog.timestamp
        });
      }
      if (latestLog.nitrate > 25) {
        alerts.push({
          type: 'warning',
          title: `Nitrates Rising in "${tank.name}"`,
          message: `Nitrate is at ${latestLog.nitrate} ppm. High levels cause stress. Consider a scheduled water change.`,
          tankId: tank.id,
          timestamp: latestLog.timestamp
        });
      }
      if (latestLog.ph !== null && (latestLog.ph < 6.0 || latestLog.ph > 8.5)) {
        alerts.push({
          type: 'warning',
          title: `pH Out of Range in "${tank.name}"`,
          message: `pH is at ${latestLog.ph}. Fluctuations stress fauna. Keep pH stable to maintain your ecosystem.`,
          tankId: tank.id,
          timestamp: latestLog.timestamp
        });
      }
    }

    // Check last maintenance date
    const lastMaintenance = await db.prepare('SELECT * FROM MaintenanceLog WHERE tankId = ? ORDER BY timestamp DESC LIMIT 1').get(tank.id) as any;
    if (!lastMaintenance) {
      alerts.push({
        type: 'info',
        title: `No History for "${tank.name}"`,
        message: `You haven't logged any maintenance activities yet. Track filter cleans and water changes to establish stability history.`,
        tankId: tank.id,
        timestamp: tank.setupDate
      });
    } else {
      const daysSince = (Date.now() - new Date(lastMaintenance.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince > 14) {
        alerts.push({
          type: 'warning',
          title: `Maintenance Overdue for "${tank.name}"`,
          message: `It has been ${Math.round(daysSince)} days since your last logged maintenance ("${lastMaintenance.activityType}"). A bi-weekly change is recommended.`,
          tankId: tank.id,
          timestamp: lastMaintenance.timestamp
        });
      }
    }
  }

  // Sort alerts: danger first, then warning, then info
  const typeWeight: Record<string, number> = { danger: 3, warning: 2, info: 1 };
  alerts.sort((a, b) => typeWeight[b.type] - typeWeight[a.type]);

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
          Diagnostics & Alerts
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Automated ecosystem monitoring and maintenance indicators.</p>
      </header>

      {alerts.length === 0 ? (
        <div style={{
          padding: '3rem 1.5rem',
          textAlign: 'center',
          background: '#ecfdf5',
          border: '1.5px solid #a7f3d0',
          borderRadius: '30px',
          boxShadow: '0 12px 24px rgba(16, 185, 129, 0.05)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#d1fae5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            margin: '0 auto 1rem auto'
          }}>
            🛡️
          </div>
          <h2 style={{ color: '#065f46', fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
            System Status: Optimal
          </h2>
          <p style={{ color: '#047857', maxWidth: '380px', margin: '0 auto', fontSize: '0.825rem', lineHeight: 1.4 }}>
            All parameters are within normal safe ranges, and recent maintenance logs are up to date.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {alerts.map((alert, index) => {
            let badgeBg = '#f1f5f9';
            let icon = '🔔';
            let titleColor = '#0f172a';

            if (alert.type === 'danger') {
              badgeBg = '#fee2e2';
              icon = '🚨';
              titleColor = '#991b1b';
            } else if (alert.type === 'warning') {
              badgeBg = '#fef9c3';
              icon = '⚠️';
              titleColor = '#854d0e';
            } else if (alert.type === 'info') {
              badgeBg = '#dbeafe';
              icon = '💡';
              titleColor = '#1e40af';
            }

            return (
              <div 
                key={index} 
                style={{ 
                  background: '#ffffff',
                  border: '1.5px solid rgba(15, 23, 42, 0.06)',
                  borderRadius: '28px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex', 
                  gap: '1rem',
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.01)'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: badgeBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  flexShrink: 0
                }}>
                  {icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '0.9rem', fontWeight: 800, color: titleColor, margin: '0 0 0.25rem 0', letterSpacing: '-0.01em' }}>
                    {alert.title}
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 0.75rem 0', lineHeight: 1.4 }}>
                    {alert.message}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    <span style={{ fontWeight: 600 }}>
                      Logged: {new Date(alert.timestamp).toLocaleDateString()}
                    </span>
                    <Link href={`/tanks/${alert.tankId}`} style={{ color: '#00838f', fontWeight: 800, textDecoration: 'none' }}>
                      Inspect Enclosure →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
