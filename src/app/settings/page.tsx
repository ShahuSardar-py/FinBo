import { db } from '@/lib/db';
import { SeedButton, ClearButton } from '@/components/SettingsButtons';

export default async function SettingsPage() {
  // Query counts for statistics
  const tankCount = await db.prepare('SELECT COUNT(*) as count FROM Tank').get() as any;
  const fishCount = await db.prepare('SELECT COUNT(*) as count FROM FishProfile').get() as any;
  const plantCount = await db.prepare('SELECT COUNT(*) as count FROM PlantProfile').get() as any;
  const eqCount = await db.prepare('SELECT COUNT(*) as count FROM Equipment').get() as any;
  const logCount = await db.prepare('SELECT COUNT(*) as count FROM WaterLog').get() as any;
  const maintCount = await db.prepare('SELECT COUNT(*) as count FROM MaintenanceLog').get() as any;

  const isPostgres = !!process.env.DATABASE_URL;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px', margin: '0 auto', paddingBottom: '5rem' }}>
      
      <header>
        <h1 className="heading-1" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 0.25rem 0' }}>
          Finbo Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Check your synchronization status, manage metrics, or load demo enclosures.</p>
      </header>

      {/* Database status */}
      <section style={{
        background: '#ffffff',
        border: '3.5px solid #0f172a',
        borderRadius: '30px',
        padding: '2rem 1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxShadow: '0 12px 24px rgba(15, 23, 42, 0.04)'
      }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
          {isPostgres ? 'Cloud Sync (Postgres) Status' : 'Local Data (SQLite) Status'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '3px solid #0f172a' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>My Aquariums</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>{tankCount?.count || 0} Enclosures</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '3px solid #0f172a' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Specimen Fauna</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>{fishCount?.count || 0} Livestock</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '3px solid #0f172a' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Planted Flora</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>{plantCount?.count || 0} Varietals</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '3px solid #0f172a' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Equipment Devices</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>{eqCount?.count || 0} Active</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '3px solid #0f172a' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Chemistry Logs</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>{logCount?.count || 0} Tests</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '3px solid #0f172a' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Maintenance Logs</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>{maintCount?.count || 0} Activities</div>
          </div>
        </div>
      </section>

      {/* Database operations */}
      <section style={{
        background: '#ffffff',
        border: '3.5px solid #0f172a',
        borderRadius: '30px',
        padding: '2rem 1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: '0 12px 24px rgba(15, 23, 42, 0.04)'
      }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Reset & Demo Utilities</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
          Populate your Finbo catalog with pre-configured demo aquariums (like the Zen Garden and Pacific Reef) to immediately preview health index behaviors.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <SeedButton />
          <ClearButton />
        </div>
      </section>

    </div>
  );
}
