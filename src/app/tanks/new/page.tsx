import { addTank } from '@/app/actions/tankActions';
import Link from 'next/link';
import { FormHeader, formStyles } from '@/components/FormStyles';

export default function AddNewTank() {
  return (
    <div style={formStyles.container}>
      {/* Form Header */}
      <FormHeader 
        title="Add New Tank" 
        subtitle="Design your aquatic masterpiece. Enter the core parameters to start tracking." 
        backUrl="/" 
      />

      {/* Form Form */}
      <div style={formStyles.card}>
        <form action={addTank} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Tank Name */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="name" style={formStyles.label}>Tank Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              placeholder="e.g., Midnight Reef"
              style={formStyles.input}
            />
          </div>

          {/* Volume & Temp Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={formStyles.fieldGroup}>
              <label htmlFor="volume" style={formStyles.label}>Volume</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input 
                  type="number" 
                  id="volume" 
                  name="volume" 
                  required 
                  min="1"
                  step="0.1"
                  placeholder="120"
                  style={{ ...formStyles.input, paddingRight: '2.5rem' }}
                />
                <span style={{
                  position: 'absolute',
                  right: '1.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem'
                }}>
                  L
                </span>
              </div>
            </div>

            <div style={formStyles.fieldGroup}>
              <label htmlFor="targetTemp" style={formStyles.label}>Target Temp</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input 
                  type="number" 
                  id="targetTemp" 
                  name="targetTemp" 
                  step="0.1"
                  min="0"
                  max="40"
                  defaultValue="25"
                  style={{ ...formStyles.input, paddingRight: '2.5rem' }}
                />
                <span style={{
                  position: 'absolute',
                  right: '1.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem'
                }}>
                  °C
                </span>
              </div>
            </div>
          </div>

          {/* Target pH */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="targetPh" style={formStyles.label}>Target pH</label>
            <input 
              type="number" 
              id="targetPh" 
              name="targetPh" 
              step="0.1"
              min="0"
              max="14"
              defaultValue="7.0"
              style={formStyles.input}
            />
          </div>

          {/* Cover Photo */}
          <div style={formStyles.fieldGroup}>
            <label htmlFor="imageUrl" style={formStyles.label}>Tank Cover Photo</label>
            <input 
              type="url" 
              id="imageUrl" 
              name="imageUrl" 
              placeholder="Paste image URL (Optional)"
              style={formStyles.input}
            />
            {/* Mock Preview Banner */}
            <div style={{
              marginTop: '0.5rem',
              height: '160px',
              borderRadius: '24px',
              border: '1.5px solid rgba(15, 23, 42, 0.08)',
              background: 'url(/aquascape_banner.png) center/cover no-repeat',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(15, 23, 42, 0.25)',
              }} />
              <div style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.85)',
                color: '#0f172a',
                padding: '0.5rem 1.25rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 4px 12px rgba(15,23,42,0.06)'
              }}>
                📤 UPLOAD PHOTO
              </div>
            </div>
          </div>

          {/* Substrate Type Selector (5 Hobbyist Options) */}
          <div style={formStyles.fieldGroup}>
            <span style={formStyles.label}>Substrate Type</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '0.2rem' }}>
              <input type="radio" id="substrate_sand" name="hasGravel" value="no" defaultChecked className="option-radio" />
              <label htmlFor="substrate_sand" className="option-label" style={{ width: 'calc(50% - 0.375rem)', flex: 'none' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#e0f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}>
                  🫧
                </div>
                <span>White Sand</span>
              </label>

              <input type="radio" id="substrate_soil" name="hasGravel" value="yes" className="option-radio" />
              <label htmlFor="substrate_soil" className="option-label" style={{ width: 'calc(50% - 0.375rem)', flex: 'none' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#ffedd5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem'
                }}>
                  🪨
                </div>
                <span>Aqua Soil</span>
              </label>

              <input type="radio" id="substrate_gravel" name="hasGravel" value="yes" className="option-radio" />
              <label htmlFor="substrate_gravel" className="option-label" style={{ width: 'calc(50% - 0.375rem)', flex: 'none' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}>
                  🏔️
                </div>
                <span>River Gravel</span>
              </label>

              <input type="radio" id="substrate_coral" name="hasGravel" value="no" className="option-radio" />
              <label htmlFor="substrate_coral" className="option-label" style={{ width: 'calc(50% - 0.375rem)', flex: 'none' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}>
                  🐚
                </div>
                <span>Crushed Coral</span>
              </label>

              <input type="radio" id="substrate_bare" name="hasGravel" value="no" className="option-radio" />
              <label htmlFor="substrate_bare" className="option-label" style={{ width: '100%', flex: 'none' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}>
                  ✨
                </div>
                <span>Bare Bottom</span>
              </label>
            </div>
          </div>

          {/* Planting Setup (Planted, Non-Planted) */}
          <div style={formStyles.fieldGroup}>
            <span style={formStyles.label}>Planting Setup</span>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
              <input type="radio" id="planting_yes" name="isPlanted" value="yes" defaultChecked className="planting-radio" />
              <label htmlFor="planting_yes" className="planting-label">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <span style={{ fontSize: '1.1rem' }}>🌿</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>Planted Tank</div>
                    <div style={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 500 }}>Live flora aquascape</div>
                  </div>
                </div>
              </label>

              <input type="radio" id="planting_no" name="isPlanted" value="no" className="planting-radio" />
              <label htmlFor="planting_no" className="planting-label">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <span style={{ fontSize: '1.1rem' }}>🐠</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>Non-Planted</div>
                    <div style={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 500 }}>Hardscape only</div>
                  </div>
                </div>
              </label>
            </div>
          </div>


          {/* Form Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="submit" style={formStyles.submitBtn}>
              💾 Save Tank
            </button>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={formStyles.cancelBtn}>
                Cancel
              </div>
            </Link>
          </div>

        </form>

        {/* CSS styles for custom radios */}
        <style dangerouslySetInnerHTML={{ __html: `
          .option-radio {
            display: none !important;
          }
          .option-label {
            flex: 1;
            border: 1.5px solid rgba(15, 23, 42, 0.08);
            border-radius: 24px;
            padding: 1.25rem 0.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-weight: 800;
            font-size: 0.725rem;
            cursor: pointer;
            color: #64748b;
            background: #ffffff;
            transition: all 0.2s ease;
            text-transform: uppercase;
            box-sizing: border-box;
            text-align: center;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.02);
          }
          .option-radio:checked + .option-label {
            border-color: #00f2fe !important;
            color: #00838f !important;
            box-shadow: 0 6px 20px rgba(6, 182, 212, 0.12) !important;
            transform: scale(1.02);
          }

          .planting-radio {
            display: none !important;
          }
          .planting-label {
            flex: 1;
            border: 1.5px solid rgba(15, 23, 42, 0.08);
            border-radius: 28px;
            padding: 0.8rem 1rem;
            cursor: pointer;
            color: #0f172a;
            background: #ffffff;
            transition: all 0.2s ease;
            box-sizing: border-box;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.02);
          }
          .planting-radio:checked + .planting-label {
            border-color: #00f2fe !important;
            color: #00838f !important;
            box-shadow: 0 6px 20px rgba(6, 182, 212, 0.1) !important;
          }
        `}} />
      </div>
    </div>
  );
}
