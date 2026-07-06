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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <header>
        <h1 className="heading-1">System Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage application data, seed sample metrics, or reset configurations.</p>
      </header>

      {/* Database status */}
      <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 className="heading-2">SQLite Database Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Habitats</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.25rem' }}>{tankCount?.count || 0}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Fauna Profiles</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.25rem' }}>{fishCount?.count || 0}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Flora Profiles</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.25rem' }}>{plantCount?.count || 0}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Equipment Items</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.25rem' }}>{eqCount?.count || 0}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Water logs</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.25rem' }}>{logCount?.count || 0}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Maintenance logs</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.25rem' }}>{maintCount?.count || 0}</div>
          </div>
        </div>
      </section>

      {/* Database operations */}
      <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 className="heading-2">Operations & Seeding</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
          Seed the database with realistic sample aquariums (Zen Garden and Pacific Reef) to test the UI metrics and health index alerts immediately.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <SeedButton />
          <ClearButton />
        </div>
      </section>

    </div>
  );
}
