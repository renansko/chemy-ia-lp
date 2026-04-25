// components/PaintingScene.jsx — animated SVG "AI painting a house" loop
// Used as a background scene; CSS-driven loop, no video file needed.

function PaintingScene({ t, lang }) {
  return (
    <section id="ai-paint" style={{
      position: 'relative', overflow: 'hidden',
      minHeight: '92vh',
      background: 'var(--bg)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)'
    }}>
      {/* Background animated scene */}
      <div className="paint-scene-bg" aria-hidden="true">
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--paint-hue-soft)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--paint-hue-deep)" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--paint-hue-deep)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--paint-hue-deep)" stopOpacity="0.1" />
            </linearGradient>
            <clipPath id="wallClip">
              <polygon points="380,360 1100,300 1100,720 380,720" />
            </clipPath>
            <clipPath id="roofClip">
              <polygon points="380,360 740,180 1100,300 1100,360 380,360" />
            </clipPath>
            <pattern id="brushPattern" width="40" height="6" patternUnits="userSpaceOnUse">
              <rect width="40" height="6" fill="var(--paint-hue)" />
              <rect width="2" height="6" x="8" fill="var(--paint-hue-deep)" opacity="0.4" />
              <rect width="3" height="6" x="22" fill="var(--paint-hue-soft)" opacity="0.3" />
              <rect width="1" height="6" x="34" fill="var(--paint-hue-deep)" opacity="0.5" />
            </pattern>
          </defs>

          {/* Sky */}
          <rect width="1600" height="600" fill="url(#sky)" />
          {/* Ground */}
          <rect y="600" width="1600" height="300" fill="url(#ground)" />

          {/* Sun / overhead light disk */}
          <circle cx="1320" cy="180" r="64" fill="var(--paint-hue-soft)" opacity="0.35" />
          <circle cx="1320" cy="180" r="36" fill="var(--paint-hue-soft)" opacity="0.6" />

          {/* Distant trees silhouettes */}
          <g opacity="0.22" fill="var(--paint-hue-deep)">
            <ellipse cx="180" cy="600" rx="120" ry="60" />
            <ellipse cx="1450" cy="610" rx="140" ry="70" />
            <ellipse cx="80" cy="610" rx="80" ry="40" />
          </g>

          {/* HOUSE — base outline (light base coat) */}
          {/* Wall */}
          <polygon points="380,360 1100,300 1100,720 380,720" fill="var(--paint-hue-soft)" opacity="0.45" />
          {/* Roof */}
          <polygon points="380,360 740,180 1100,300 1100,360 380,360" fill="var(--paint-hue-deep)" opacity="0.55" />

          {/* Painted wall — animated stripes filling in */}
          <g clipPath="url(#wallClip)">
            <g className="paint-stripes">
              {Array.from({ length: 14 }).map((_, i) => (
                <rect key={i}
                  x={380}
                  y={360 + i * 26}
                  width={720}
                  height={22}
                  fill="url(#brushPattern)"
                  className="paint-stripe"
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              ))}
            </g>
          </g>

          {/* Painted roof streak */}
          <g clipPath="url(#roofClip)">
            <rect x="380" y="180" width="720" height="180" fill="var(--paint-hue)" className="paint-roof" opacity="0.78" />
          </g>

          {/* Window cutouts */}
          <rect x="500" y="440" width="100" height="120" fill="var(--bg)" opacity="0.6" />
          <rect x="500" y="440" width="100" height="120" fill="none" stroke="var(--paint-hue-deep)" strokeWidth="3" />
          <line x1="550" y1="440" x2="550" y2="560" stroke="var(--paint-hue-deep)" strokeWidth="2" />
          <line x1="500" y1="500" x2="600" y2="500" stroke="var(--paint-hue-deep)" strokeWidth="2" />

          <rect x="860" y="440" width="100" height="120" fill="var(--bg)" opacity="0.6" />
          <rect x="860" y="440" width="100" height="120" fill="none" stroke="var(--paint-hue-deep)" strokeWidth="3" />
          <line x1="910" y1="440" x2="910" y2="560" stroke="var(--paint-hue-deep)" strokeWidth="2" />
          <line x1="860" y1="500" x2="960" y2="500" stroke="var(--paint-hue-deep)" strokeWidth="2" />

          {/* Door */}
          <rect x="690" y="580" width="100" height="140" fill="var(--paint-hue-deep)" opacity="0.7" />
          <circle cx="775" cy="650" r="3" fill="var(--paint-hue-soft)" />

          {/* AI brush — moves across the wall */}
          <g className="paint-brush">
            <line x1="0" y1="-40" x2="0" y2="-4" stroke="var(--fg)" strokeWidth="3" opacity="0.75" />
            <rect x="-22" y="-4" width="44" height="14" rx="2" fill="var(--paint-hue)" stroke="var(--fg)" strokeWidth="1.5" />
            <rect x="-26" y="10" width="52" height="6" rx="3" fill="var(--paint-hue)" />
            {/* drip */}
            <circle cx="0" cy="22" r="3" fill="var(--paint-hue)" className="paint-drip" />
          </g>

          {/* Tracking AI dots — like a vision system aligning */}
          <g className="paint-trackers" stroke="var(--paint-hue)" strokeWidth="1.5" fill="none" opacity="0.7">
            <rect x="375" y="355" width="40" height="40" />
            <rect x="1060" y="285" width="40" height="40" />
            <rect x="375" y="685" width="40" height="40" />
            <rect x="1060" y="685" width="40" height="40" />
          </g>

          {/* HUD crosshair following brush */}
          <g className="paint-hud" fill="none" stroke="var(--paint-hue-soft)" strokeWidth="1" opacity="0.55">
            <circle r="28" />
            <line x1="-40" y1="0" x2="-32" y2="0" />
            <line x1="32" y1="0" x2="40" y2="0" />
            <line x1="0" y1="-40" x2="0" y2="-32" />
            <line x1="0" y1="32" x2="0" y2="40" />
          </g>
        </svg>
      </div>

      {/* Foreground content */}
      <div className="container" style={{
        position: 'relative', zIndex: 2, padding: '120px 32px',
        minHeight: '92vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
      }}>
        <div style={{ maxWidth: 720 }}>
          <span className="eyebrow">{lang === 'pt' ? 'CHEMY · VISION' : 'CHEMY · VISION'}</span>
          <h2 className="serif" style={{
            fontStyle: 'italic',
            fontSize: 'clamp(40px, 5.6vw, 84px)',
            letterSpacing: '-0.03em',
            lineHeight: 1.0,
            marginTop: 18,
            color: 'var(--fg)',
            textShadow: '0 4px 30px rgba(0,0,0,0.4)'
          }}>
            {lang === 'pt'
              ? 'A IA que vê a casa e simula o tom certo.'
              : 'AI that sees the house and simulates the right tone.'}
          </h2>
          <p style={{ fontSize: 18, color: 'var(--fg-muted)', marginTop: 24, maxWidth: 560, lineHeight: 1.55 }}>
            {lang === 'pt'
              ? 'Cliente envia uma foto. Chemy.ia identifica fachadas, sugere paletas da sua linha, calcula litragem e gera a proposta automática para o representante.'
              : 'Customer sends a photo. Chemy.ia identifies facades, suggests palettes from your line, calculates volume and generates the proposal for your rep.'}
          </p>
          <div style={{ display: 'flex', gap: 24, marginTop: 40, flexWrap: 'wrap' }}>
            {[
              { k: '0.8s', v: lang === 'pt' ? 'tempo de análise' : 'analysis time' },
              { k: '94%', v: lang === 'pt' ? 'precisão de superfície' : 'surface precision' },
              { k: '↓42%', v: lang === 'pt' ? 'desperdício de tinta' : 'paint waste' }
            ].map((s, i) => (
              <div key={i} style={{ borderLeft: '2px solid var(--paint-hue)', paddingLeft: 14 }}>
                <div className="serif" style={{ fontSize: 36, lineHeight: 1, color: 'var(--fg)' }}>{s.k}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { PaintingScene });
