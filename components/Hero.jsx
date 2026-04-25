// components/Hero.jsx — two variants

function HeroV1({ t, lang, paint, setPaint }) {
  // Editorial hero — big serif headline over swatches
  const swatches = window.PAINT_SWATCHES;
  return (
    <section style={{ position: 'relative', overflow: 'hidden', paddingBottom: 0 }}>
      <div className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ maxWidth: 980 }}>
          <span className="eyebrow">{t.hero.eyebrow}</span>
          <h1 style={{
            fontFamily: 'var(--sans)', fontWeight: 500,
            fontSize: 'clamp(44px, 6.4vw, 92px)', lineHeight: 0.98,
            letterSpacing: '-0.035em', marginTop: 24, color: 'var(--fg)'
          }}>
            {t.hero.title_pre}
            <span className="serif" style={{ fontStyle: 'italic', color: 'var(--accent)' }}>
              {t.hero.title_em}
            </span>
            {t.hero.title_post}
          </h1>
          <p style={{
            fontSize: 19, color: 'var(--fg-muted)', maxWidth: 620,
            marginTop: 28, lineHeight: 1.5
          }}>{t.hero.sub}</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
            <a href="#final" className="btn primary">{t.hero.cta_primary} →</a>
            <a href="dashboard.html" className="btn ghost">{t.hero.cta_secondary}</a>
          </div>
        </div>

        {/* Paint swatch strip */}
        <div style={{
          marginTop: 72, display: 'grid',
          gridTemplateColumns: `repeat(${swatches.length}, 1fr)`,
          gap: 0, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
          overflow: 'hidden', background: 'var(--bg-elev)'
        }}>
          {swatches.map((s, i) => {
            const active = paint === s.id;
            return (
              <button
                key={i}
                onClick={() => setPaint && setPaint(s.id)}
                title={lang === 'pt' ? `Aplicar ${s.name.pt}` : `Apply ${s.name.en}`}
                style={{
                  borderRight: i < swatches.length - 1 ? '1px solid var(--border)' : 'none',
                  border: 'none', background: 'transparent',
                  borderTop: active ? '3px solid var(--paint-hue)' : '3px solid transparent',
                  cursor: 'pointer', padding: 0, textAlign: 'left',
                  fontFamily: 'inherit', color: 'inherit',
                  transition: 'transform 200ms ease',
                  transform: active ? 'translateY(-4px)' : 'none'
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{
                  background: s.hex, height: 140, position: 'relative',
                  boxShadow: active ? 'inset 0 0 0 3px var(--bg-elev)' : 'none'
                }}>
                  {active && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'var(--bg-elev)', color: 'var(--paint-hue)',
                      fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 600
                    }}>✓</div>
                  )}
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--fg-dim)', letterSpacing: '0.08em' }}>
                    {s.code}
                  </div>
                  <div style={{ fontSize: 13, marginTop: 4, color: 'var(--fg)' }}>{s.name[lang]}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, marginTop: 56 }}>
          {t.hero.stats.map((s, i) => (
            <div key={i} style={{ borderLeft: '1px solid var(--border-strong)', paddingLeft: 20 }}>
              <div className="serif" style={{ fontSize: 48, lineHeight: 1, color: 'var(--fg)' }}>{s.k}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 8 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroV2({ t, lang, paint, setPaint }) {
  // Dashboard-forward hero — split with product preview
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ paddingTop: 64, paddingBottom: 48 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 48, alignItems: 'center'
        }}>
          <div>
            <span className="eyebrow">{t.hero.eyebrow}</span>
            <h1 style={{
              fontFamily: 'var(--sans)', fontWeight: 500,
              fontSize: 'clamp(40px, 4.8vw, 68px)', lineHeight: 1.0,
              letterSpacing: '-0.035em', marginTop: 20
            }}>
              {t.hero.title_pre}
              <span className="serif" style={{ fontStyle: 'italic', color: 'var(--accent)' }}>
                {t.hero.title_em}
              </span>
              {t.hero.title_post}
            </h1>
            <p style={{ fontSize: 17, color: 'var(--fg-muted)', marginTop: 24, maxWidth: 520 }}>
              {t.hero.sub}
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <a href="#final" className="btn primary">{t.hero.cta_primary} →</a>
              <a href="dashboard.html" className="btn ghost">{t.hero.cta_secondary}</a>
            </div>
            <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
              {t.hero.stats.map((s, i) => (
                <div key={i}>
                  <div className="serif" style={{ fontSize: 32, lineHeight: 1 }}>{s.k}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 6 }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <HeroMiniDash lang={lang} paint={paint} setPaint={setPaint} />
        </div>
      </div>
    </section>
  );
}

function HeroMiniDash({ lang, paint, setPaint }) {
  const swatches = window.PAINT_SWATCHES.slice(0, 6);
  return (
    <div style={{
      background: 'var(--bg-elev)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: 18, position: 'relative',
      boxShadow: '0 30px 60px -30px rgba(0,0,0,0.5)'
    }}>
      {/* top bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        <div style={{ width: 10, height: 10, borderRadius: 5, background: '#33363D' }} />
        <div style={{ width: 10, height: 10, borderRadius: 5, background: '#33363D' }} />
        <div style={{ width: 10, height: 10, borderRadius: 5, background: '#33363D' }} />
        <div className="mono" style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--fg-dim)', letterSpacing: '0.1em' }}>
          CHEMY · PRODUÇÃO · LOTE #B-2814
        </div>
      </div>
      {/* batch card */}
      <div style={{
        background: 'var(--bg-elev-2)', border: '1px solid var(--border)',
        borderRadius: 12, padding: 16, marginBottom: 12
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--fg-dim)' }}>CH-3207 · GUAVA RED</div>
            <div style={{ fontSize: 18, marginTop: 4 }}>Batelada 2814</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>1.200L · Linha 2 · 14:30</div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#D94A38' }} />
        </div>
        {/* progress */}
        <div style={{ marginTop: 14, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: '68%', height: '100%', background: 'var(--accent)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--fg-muted)' }}>
          <span>Mistura</span><span>68%</span>
        </div>
      </div>
      {/* IA suggestion */}
      <div style={{
        background: 'var(--accent-soft)', border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
        borderRadius: 12, padding: 14, marginBottom: 12
      }}>
        <div className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em' }}>● CHEMY IA</div>
        <div style={{ fontSize: 13, marginTop: 6, color: 'var(--fg)', lineHeight: 1.4 }}>
          {lang === 'pt'
            ? 'Casa das Tintas não compra há 23 dias. Proposta pronta: 180L Branco Neve.'
            : 'Casa das Tintas dormant for 23d. Proposal ready: 180L Snow White.'}
        </div>
      </div>
      {/* swatch grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
        {swatches.map((s, i) => {
          const active = paint === s.id;
          return (
            <button key={i} onClick={() => setPaint && setPaint(s.id)} title={s.name[lang]} style={{
              aspectRatio: '1', background: s.hex, borderRadius: 6,
              border: active ? '2px solid var(--fg)' : '1px solid var(--border)',
              cursor: 'pointer', padding: 0,
              boxShadow: active ? '0 0 0 2px var(--bg-elev), 0 0 0 3px var(--paint-hue)' : 'none'
            }} />
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { HeroV1, HeroV2 });
