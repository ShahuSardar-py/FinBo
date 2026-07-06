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
          title: `Toxic Ammonia Detected in "${tank.name}"`,
          message: `Ammonia level is at ${latestLog.ammonia} ppm. Ammonia should always be 0 ppm. Perform a 30% water change immediately and add conditioner.`,
          tankId: tank.id,
          timestamp: latestLog.timestamp
        });
      }
      if (latestLog.nitrite > 0) {
        alerts.push({
          type: 'danger',
          title: `Toxic Nitrite Detected in "${tank.name}"`,
          message: `Nitrite level is at ${latestLog.nitrite} ppm. Nitrite should always be 0 ppm. Nitrite inhibits oxygen absorption in fish. Perform a water change.`,
          tankId: tank.id,
          timestamp: latestLog.timestamp
        });
      }
      if (latestLog.nitrate > 25) {
        alerts.push({
          type: 'warning',
          title: `High Nitrates in "${tank.name}"`,
          message: `Nitrate level is at ${latestLog.nitrate} ppm. High nitrates can stress fish and trigger algae blooms. Consider a regular water change.`,
          tankId: tank.id,
          timestamp: latestLog.timestamp
        });
      }
      if (latestLog.ph !== null && (latestLog.ph < 6.0 || latestLog.ph > 8.5)) {
        alerts.push({
          type: 'warning',
          title: `pH Out of Ideal Range in "${tank.name}"`,
          message: `pH is at ${latestLog.ph}. Most freshwater species prefer a pH between 6.5 and 8.0. Avoid sudden fluctuations.`,
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
        title: `No Maintenance History for "${tank.name}"`,
        message: `You haven't logged any maintenance activities yet. Track your filter cleaning and water changes to maintain stability.`,
        tankId: tank.id,
        timestamp: tank.setupDate
      });
    } else {
      const daysSince = (Date.now() - new Date(lastMaintenance.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince > 14) {
        alerts.push({
          type: 'warning',
          title: `Maintenance Overdue for "${tank.name}"`,
          message: `It has been ${Math.round(daysSince)} days since your last logged maintenance ("${lastMaintenance.activityType}"). A bi-weekly water change is recommended.`,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <header>
        <h1 className="heading-1">Alerts & Notifications</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Automated ecosystem diagnostics and schedule reminders.</p>
      </header>

      {alerts.length === 0 ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center', background: '#ecfdf5', border: '1px solid #34d399' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
          <h2 style={{ color: '#065f46', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Ecosystem Status: Optimal</h2>
          <p style={{ color: '#047857', maxWidth: '500px', margin: '0 auto' }}>All parameters are within normal safe ranges, and recent maintenance logs are up to date.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {alerts.map((alert, index) => {
            let borderColor = 'var(--border-color)';
            let icon = '🔔';
            let titleColor = 'var(--text-primary)';

            if (alert.type === 'danger') {
              borderColor = '#f87171';
              icon = '🚨';
              titleColor = '#b91c1c';
            } else if (alert.type === 'warning') {
              borderColor = '#fbbf24';
              icon = '⚠️';
              titleColor = '#b45309';
            } else if (alert.type === 'info') {
              borderColor = '#60a5fa';
              icon = '💡';
              titleColor = '#1d4ed8';
            }

            return (
              <div 
                key={index} 
                className="card" 
                style={{ 
                  display: 'flex', 
                  gap: '1.5rem', 
                  borderLeft: `5px solid ${borderColor}`,
                  padding: '1.5rem',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ fontSize: '1.75rem', lineHeight: 1 }}>{icon}</div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: titleColor, margin: '0 0 0.5rem 0' }}>
                    {alert.title}
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                    {alert.message}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>Reported: {new Date(alert.timestamp).toLocaleString()}</span>
                    <Link href={`/tanks/${alert.tankId}`} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                      Inspect Habitat →
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
