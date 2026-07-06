import { addPlant } from '@/app/actions/plantActions';
import Link from 'next/link';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { FormHeader, FormBanner, formStyles } from '@/components/FormStyles';

export default async function AddPlant({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const tank = await db.prepare('SELECT * FROM Tank WHERE id = ?').get(resolvedParams.id) as any;
  if (!tank) return notFound();

  return (
    <div style={formStyles.container}>
      {/* Form Header */}
      <FormHeader 
        title="Add Plants / Flora" 
        subtitle={`Introduce aquatic plants and flora to ${tank.name}.`} 
        backUrl={`/tanks/${tank.id}`} 
      />

      {/* Thick Border Form Card */}
      <div style={formStyles.card}>
        <form action={addPlant} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input type="hidden" name="tankId" value={tank.id} />
          
          {/* Plant Species */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="species" style={formStyles.label}>Plant Species *</label>
            <input 
              type="text" 
              id="species" 
              name="species" 
              required 
              placeholder="e.g. Anubias Nana, Java Moss, Rotala"
              style={formStyles.input}
            />
          </div>

          {/* Qty & Price Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={formStyles.fieldGroup}>
              <label htmlFor="quantity" style={formStyles.label}>Quantity *</label>
              <input 
                type="number" 
                id="quantity" 
                name="quantity" 
                required 
                min="1"
                defaultValue="1"
                style={formStyles.input}
              />
            </div>

            <div style={formStyles.fieldGroup}>
              <label htmlFor="price" style={formStyles.label}>Price Paid (Optional)</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                step="0.01"
                min="0"
                placeholder="e.g. 5.99"
                style={formStyles.input}
              />
            </div>
          </div>

          {/* Vendor Source */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="boughtFrom" style={formStyles.label}>Bought From (Optional)</label>
            <input 
              type="text" 
              id="boughtFrom" 
              name="boughtFrom" 
              placeholder="e.g. Tropica, Local Fish Store"
              style={formStyles.input}
            />
          </div>

          {/* Date Added */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="addedDate" style={formStyles.label}>Date Added *</label>
            <input 
              type="date" 
              id="addedDate" 
              name="addedDate" 
              required
              defaultValue={new Date().toISOString().split('T')[0]}
              style={formStyles.input}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="submit" style={formStyles.submitBtn}>
              Save Plants
            </button>
            <Link href={`/tanks/${tank.id}`} style={{ textDecoration: 'none' }}>
              <div style={formStyles.cancelBtn}>
                Cancel
              </div>
            </Link>
          </div>

        </form>
      </div>

      <FormBanner />
    </div>
  );
}
