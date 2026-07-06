import { addPlant } from '@/app/actions/plantActions';
import Link from 'next/link';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function AddPlant({ params }: { params: { id: string } }) {
  const tank = await db.prepare('SELECT * FROM Tank WHERE id = ?').get(params.id) as any;
  if (!tank) return notFound();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href={`/tanks/${tank.id}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          ← Back to {tank.name}
        </Link>
        <h1 className="heading-1" style={{ margin: 0 }}>Add Plants / Flora</h1>
      </div>

      <div className="card">
        <form action={addPlant} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <input type="hidden" name="tankId" value={tank.id} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="species" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Plant Species *</label>
            <input 
              type="text" 
              id="species" 
              name="species" 
              required 
              placeholder="e.g. Anubias Nana, Java Moss, Rotala"
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
              <label htmlFor="quantity" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Quantity *</label>
              <input 
                type="number" 
                id="quantity" 
                name="quantity" 
                required 
                min="1"
                defaultValue="1"
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
              <label htmlFor="price" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Price (Optional)</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                step="0.01"
                min="0"
                placeholder="e.g. 5.99"
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="boughtFrom" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Bought From (Optional)</label>
            <input 
              type="text" 
              id="boughtFrom" 
              name="boughtFrom" 
              placeholder="e.g. Tropica, Local Fish Store"
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
            <label htmlFor="addedDate" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Date Added *</label>
            <input 
              type="date" 
              id="addedDate" 
              name="addedDate" 
              required
              defaultValue={new Date().toISOString().split('T')[0]}
              style={{
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link href={`/tanks/${tank.id}`} className="btn">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Save Plants
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
