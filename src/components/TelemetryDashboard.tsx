'use client';

import React from 'react';

interface TelemetryDashboardProps {
  healthScore: number;
  targetTemp: number;
  currentTemp: number | null;
  targetPh: number;
  currentPh: number | null;
}

export default function TelemetryDashboard({
  healthScore,
  targetTemp,
  currentTemp,
  targetPh,
  currentPh,
}: TelemetryDashboardProps) {
  const isTempDeviated = currentTemp !== null && Math.abs(currentTemp - targetTemp) > 1.5;
  const isPhDeviated = currentPh !== null && Math.abs(currentPh - targetPh) > 0.5;

  const tempDiff = currentTemp !== null ? (currentTemp - targetTemp).toFixed(1) : '0.0';
  const phDiff = currentPh !== null ? (currentPh - targetPh).toFixed(1) : '0.0';

  const radius = 46;
  const circumference = 2 * Math.PI * radius;

  // Soothing, calm state-of-the-art colors
  const getStabilityColor = (score: number) => {
    if (score >= 90) return '#10b981'; // Soothing Emerald
    if (score >= 75) return '#f59e0b'; // Amber
    return '#ef4444'; // Coral Red
  };

  const getTempColor = () => {
    if (currentTemp === null) return '#94a3b8';
    return isTempDeviated ? '#f87171' : '#0ea5e9'; // Pastel Coral vs Electric Sky
  };

  const getPhColor = () => {
    if (currentPh === null) return '#94a3b8';
    return isPhDeviated ? '#f87171' : '#10b981';
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '2rem',
      width: '100%',
    }}>
      {/* Defs block for SVG glow filters */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }}>
        <defs>
          <filter id="glow-stability" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-temp" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-ph" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>

      {/* 1. STABILITY CARD */}
      <div className="card" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1.75rem 2rem',
        background: '#ffffff',
      }}>
        {/* Minimal indicator bar inside */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: '20%',
          bottom: '20%',
          width: '3.5px',
          borderRadius: '0 4px 4px 0',
          backgroundColor: getStabilityColor(healthScore)
        }} />

        {/* Circular Gauge */}
        <div style={{ position: 'relative', width: '105px', height: '105px', flexShrink: 0 }}>
          <svg style={{ transform: 'rotate(-90deg)', width: '105px', height: '105px' }}>
            <circle 
              cx="52.5" cy="52.5" r={radius} 
              fill="transparent" 
              stroke="rgba(15, 23, 42, 0.03)" 
              strokeWidth="4" 
            />
            <circle 
              cx="52.5" cy="52.5" r={radius} 
              fill="transparent" 
              stroke={getStabilityColor(healthScore)} 
              strokeWidth="4" 
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (healthScore / 100) * circumference}
              strokeLinecap="round"
              filter="url(#glow-stability)"
              style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '105px',
            height: '105px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.45rem',
            fontWeight: 800,
            color: 'var(--tertiary)'
          }}>
            {healthScore}%
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
            stability index
          </span>
          <h4 style={{ margin: '0.2rem 0 0.35rem 0', fontWeight: 700, fontSize: '1rem', color: getStabilityColor(healthScore) }}>
            {healthScore >= 90 ? '🔒 Stable' : healthScore >= 75 ? '⚠️ Fluctuating' : '🚨 Stressed'}
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
            Aggregate health of plants, filters and substrate.
          </p>
        </div>
      </div>

      {/* 2. TEMPERATURE CARD */}
      <div className="card" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1.75rem 2rem',
        background: '#ffffff',
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: '20%',
          bottom: '20%',
          width: '3.5px',
          borderRadius: '0 4px 4px 0',
          backgroundColor: getTempColor()
        }} />

        {/* Pulsing Alert boundary ring */}
        {isTempDeviated && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            border: '2px solid rgba(248, 113, 113, 0.4)',
            borderRadius: 'var(--radius-md)',
            animation: 'pulseBorder 2.5s infinite',
            pointerEvents: 'none'
          }} />
        )}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes pulseBorder {
            0% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.9; }
            100% { opacity: 0.3; }
          }
        `}} />

        <div style={{ position: 'relative', width: '105px', height: '105px', flexShrink: 0 }}>
          <svg style={{ transform: 'rotate(-90deg)', width: '105px', height: '105px' }}>
            <circle cx="52.5" cy="52.5" r={radius} fill="transparent" stroke="rgba(15, 23, 42, 0.03)" strokeWidth="4" />
            <circle 
              cx="52.5" cy="52.5" r={radius} 
              fill="transparent" 
              stroke={getTempColor()} 
              strokeWidth="4" 
              strokeDasharray={circumference}
              strokeDashoffset={currentTemp !== null ? circumference - (Math.min(currentTemp, 35) / 35) * circumference : circumference}
              strokeLinecap="round"
              filter="url(#glow-temp)"
              style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '105px',
            height: '105px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--tertiary)'
          }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 800 }}>
              {currentTemp !== null ? `${currentTemp.toFixed(1)}` : '--'}
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '-0.1rem' }}>°C</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
            Temperature
          </span>
          <h4 style={{ margin: '0.2rem 0 0.35rem 0', fontWeight: 700, fontSize: '0.95rem', color: 'var(--tertiary)' }}>
            Target: {targetTemp.toFixed(1)}°C
          </h4>
          {currentTemp !== null ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{
                fontSize: '0.72rem',
                color: isTempDeviated ? '#ef4444' : 'var(--text-secondary)',
                fontWeight: isTempDeviated ? 700 : 500
              }}>
                Deviation: {parseFloat(tempDiff) > 0 ? `+${tempDiff}` : tempDiff}°C
              </span>
              {isTempDeviated && (
                <span style={{ 
                  fontSize: '0.65rem', 
                  background: 'rgba(248, 113, 113, 0.12)', 
                  color: '#ef4444', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: 'var(--radius-sm)', 
                  width: 'fit-content', 
                  fontWeight: 700,
                  marginTop: '0.25rem',
                  letterSpacing: '0.02em'
                }}>
                  🚨 DRIFT DETECTED
                </span>
              )}
            </div>
          ) : (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic' }}>
              No temperature data.
            </p>
          )}
        </div>
      </div>

      {/* 3. pH LEVEL CARD */}
      <div className="card" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1.75rem 2rem',
        background: '#ffffff',
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: '20%',
          bottom: '20%',
          width: '3.5px',
          borderRadius: '0 4px 4px 0',
          backgroundColor: getPhColor()
        }} />

        {isPhDeviated && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            border: '2px solid rgba(248, 113, 113, 0.4)',
            borderRadius: 'var(--radius-md)',
            animation: 'pulseBorder 2.5s infinite',
            pointerEvents: 'none'
          }} />
        )}

        <div style={{ position: 'relative', width: '105px', height: '105px', flexShrink: 0 }}>
          <svg style={{ transform: 'rotate(-90deg)', width: '105px', height: '105px' }}>
            <circle cx="52.5" cy="52.5" r={radius} fill="transparent" stroke="rgba(15, 23, 42, 0.03)" strokeWidth="4" />
            <circle 
              cx="52.5" cy="52.5" r={radius} 
              fill="transparent" 
              stroke={getPhColor()} 
              strokeWidth="4" 
              strokeDasharray={circumference}
              strokeDashoffset={currentPh !== null ? circumference - (Math.min(currentPh, 14) / 14) * circumference : circumference}
              strokeLinecap="round"
              filter="url(#glow-ph)"
              style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '105px',
            height: '105px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--tertiary)'
          }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 800 }}>
              {currentPh !== null ? `${currentPh.toFixed(1)}` : '--'}
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '-0.1rem' }}>pH</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
            pH Value
          </span>
          <h4 style={{ margin: '0.2rem 0 0.35rem 0', fontWeight: 700, fontSize: '0.95rem', color: 'var(--tertiary)' }}>
            Target: {targetPh.toFixed(1)}
          </h4>
          {currentPh !== null ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{
                fontSize: '0.72rem',
                color: isPhDeviated ? '#ef4444' : 'var(--text-secondary)',
                fontWeight: isPhDeviated ? 700 : 500
              }}>
                Deviation: {parseFloat(phDiff) > 0 ? `+${phDiff}` : phDiff}
              </span>
              {isPhDeviated && (
                <span style={{ 
                  fontSize: '0.65rem', 
                  background: 'rgba(248, 113, 113, 0.12)', 
                  color: '#ef4444', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: 'var(--radius-sm)', 
                  width: 'fit-content', 
                  fontWeight: 700,
                  marginTop: '0.25rem',
                  letterSpacing: '0.02em'
                }}>
                  🚨 DRIFT DETECTED
                </span>
              )}
            </div>
          ) : (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic' }}>
              No pH data.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
