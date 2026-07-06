import { addTank } from '@/app/actions/tankActions';
import Link from 'next/link';

export default function AddNewTank() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          ← Back
        </Link>
        <h1 className="heading-1" style={{ margin: 0 }}>Add New Tank</h1>
      </div>

      <div className="card">
        <form action={addTank} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="name" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Tank Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              placeholder="e.g. Zen Garden"
              style={{
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="volume" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Size (Liters)</label>
            <input 
              type="number" 
              id="volume" 
              name="volume" 
              required 
              min="1"
              step="0.1"
              placeholder="e.g. 150"
              style={{
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="equipment" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Equipment (Optional)</label>
            <textarea 
              id="equipment" 
              name="equipment" 
              rows={3}
              placeholder="Filters, heaters, lights, etc."
              style={{
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="imageUrl" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Image URL (Optional)</label>
            <input 
              type="url" 
              id="imageUrl" 
              name="imageUrl" 
              placeholder="e.g. https://images.unsplash.com/photo-..."
              style={{
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="targetTemp" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Target Temp (°C)</label>
              <input 
                type="number" 
                id="targetTemp" 
                name="targetTemp" 
                step="0.1"
                min="0"
                max="40"
                defaultValue="24.0"
                style={{
                  padding: '0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="targetPh" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Target pH</label>
              <input 
                type="number" 
                id="targetPh" 
                name="targetPh" 
                step="0.1"
                min="0"
                max="14"
                defaultValue="7.0"
                style={{
                  padding: '0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Gravel Radio */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Substrate</span>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input type="radio" name="hasGravel" value="yes" defaultChecked />
                  Gravel/Sand
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input type="radio" name="hasGravel" value="no" />
                  Bare Bottom
                </label>
              </div>
            </div>

            {/* Planted Radio */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Planting</span>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input type="radio" name="isPlanted" value="yes" />
                  Planted
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input type="radio" name="isPlanted" value="no" defaultChecked />
                  Unplanted
                </label>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link href="/" className="btn">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Save Tank
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
