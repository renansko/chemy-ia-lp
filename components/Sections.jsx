// components/Sections.jsx — all sections driven by --paint-hue CSS variable

function LogoStrip({ t }) {
  const logos = ["TINTAS HORIZONTE", "POLÍCROM", "CORAL VALE", "VERNIZES DO SUL", "PIGMENTA", "NOVA CAMADA", "ATLAS COLORS", "INDÚSTRIA BRAVA"];
  return (
    <section style={{
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-elev)'
    }}>
      <div className="container" style={{ padding: '36px 32px' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--fg-dim)', textTransform: 'uppercase', marginBottom: 20 }}>{t.logos}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 24 }}>
          {logos.map((l, i) => (
            <div key={i} className="mono" style={{
              fontSize: 11, color: 'var(--fg-muted)', letterSpacing: '0.06em',
              padding: '14px 8px', textAlign: 'center',
              borderLeft: i > 0 ? '1px solid var(--border)' : 'none'
            }}>{l}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pillars({ t }) {
  return (
    <section id="features" style={{ padding: '120px 0', background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, marginBottom: 64 }}>
          <span className="eyebrow">{t.pillars.eyebrow}</span>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 500,
            letterSpacing: '-0.03em', lineHeight: 1.05
          }}>{t.pillars.title}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          {t.pillars.items.map((it, i) => (
            <div key={i} style={{
              padding: 32,
              background: i === 4 ? 'var(--paint-hue)' : 'var(--bg-elev)',
              color: i === 4 ? 'var(--accent-ink)' : 'var(--fg)',
              minHeight: 220,
              display: 'flex', flexDirection: 'column'
            }}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: i === 4 ? 'var(--accent-ink)' : 'var(--paint-hue)', opacity: i === 4 ? 0.75 : 1 }}>{it.tag}</div>
              <div style={{ fontSize: 22, marginTop: 14, fontWeight: 500, letterSpacing: '-0.02em' }}>{it.t}</div>
              <div style={{ fontSize: 14, marginTop: 10, lineHeight: 1.55, opacity: 0.85 }}>{it.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IASection({ t, lang }) {
  return (
    <section id="ia" style={{
      padding: '120px 0', background: 'var(--bg-elev)',
      borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 60, left: -60, width: 260, height: 260, borderRadius: '50%', background: 'var(--paint-hue)', opacity: 0.18, filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: 40, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'var(--paint-hue-deep)', opacity: 0.25, filter: 'blur(80px)' }} />
      <div className="container" style={{ position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="eyebrow" style={{ justifyContent: 'center' }}>{t.ia.eyebrow}</span>
          <h2 className="serif" style={{
            fontSize: 'clamp(40px, 5.2vw, 76px)', fontStyle: 'italic',
            letterSpacing: '-0.03em', marginTop: 20, lineHeight: 1.02
          }}>{t.ia.title}</h2>
          <p style={{ fontSize: 17, color: 'var(--fg-muted)', maxWidth: 620, margin: '20px auto 0' }}>{t.ia.sub}</p>
        </div>
        <div style={{ maxWidth: 820, margin: '0 auto', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 8 }}>
          <div className="mono" style={{ fontSize: 10, color: 'var(--fg-dim)', letterSpacing: '0.14em', padding: '14px 18px 10px' }}>
            {lang === 'pt' ? '▍ FEED DA CHEMY IA · HOJE' : '▍ CHEMY AI FEED · TODAY'}
          </div>
          {t.ia.examples.map((ex, i) => (
            <div key={i} style={{
              padding: '18px 20px',
              borderTop: '1px solid var(--border)',
              display: 'grid', gridTemplateColumns: '6px 64px 1fr auto', gap: 16, alignItems: 'start'
            }}>
              <div style={{ width: 6, height: 36, background: 'var(--paint-hue)', borderRadius: 2 }} />
              <div className="mono" style={{ fontSize: 11, color: 'var(--fg-dim)' }}>{ex.time}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{ex.t}</div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4, lineHeight: 1.5 }}>{ex.body}</div>
              </div>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--accent-soft)',
                border: '1px solid var(--paint-hue)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--paint-hue)', fontSize: 14
              }}>→</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Customers({ t }) {
  return (
    <section id="customers" style={{ padding: '120px 0', background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64, alignItems: 'center' }}>
          <div>
            <span className="eyebrow">{t.customers.eyebrow}</span>
            <h2 style={{ fontSize: 'clamp(28px, 3.2vw, 44px)', fontWeight: 500, letterSpacing: '-0.03em', marginTop: 20, lineHeight: 1.1 }}>
              {t.customers.title}
            </h2>
          </div>
          <div>
            <div className="serif" style={{ fontSize: 32, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
              <span style={{ color: 'var(--paint-hue)', marginRight: 8, fontSize: 56, lineHeight: 0 }}>“</span>
              {t.customers.quote}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 28 }}>— {t.customers.by}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing({ t }) {
  return (
    <section id="pricing" style={{ padding: '120px 0', background: 'var(--bg-elev)', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="eyebrow" style={{ justifyContent: 'center' }}>{t.pricing.eyebrow}</span>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 500, letterSpacing: '-0.03em', marginTop: 18 }}>{t.pricing.title}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 1000, margin: '0 auto' }}>
          {t.pricing.plans.map((p, i) => (
            <div key={i} style={{
              background: p.highlight ? 'var(--paint-hue)' : 'var(--bg)',
              color: p.highlight ? 'var(--accent-ink)' : 'var(--fg)',
              border: p.highlight ? '1px solid var(--paint-hue)' : '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: 28,
              transform: p.highlight ? 'translateY(-12px)' : 'none',
              boxShadow: p.highlight ? '0 24px 48px -20px color-mix(in srgb, var(--paint-hue) 60%, transparent)' : 'none'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', opacity: 0.7 }}>{String(i + 1).padStart(2, '0')}</div>
                {p.highlight && (
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', background: 'var(--accent-ink)', color: 'var(--paint-hue)', padding: '4px 8px', borderRadius: 999 }}>★</div>
                )}
              </div>
              <div style={{ fontSize: 20, marginTop: 20, fontWeight: 500 }}>{p.name}</div>
              <div style={{ fontSize: 40, marginTop: 12, letterSpacing: '-0.02em', fontWeight: 500 }}>
                {p.price}<span style={{ fontSize: 14, opacity: 0.6, marginLeft: 4 }}>{p.unit}</span>
              </div>
              <div style={{ fontSize: 13, opacity: 0.75, marginTop: 16, lineHeight: 1.5, minHeight: 60 }}>{p.desc}</div>
              <button className="btn" style={{
                marginTop: 24, width: '100%', justifyContent: 'center',
                background: p.highlight ? 'var(--accent-ink)' : 'transparent',
                color: p.highlight ? 'var(--paint-hue)' : 'inherit',
                border: p.highlight ? 'none' : '1px solid currentColor'
              }}>{p.cta} →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ t }) {
  return (
    <section id="final" style={{
      padding: '140px 0', textAlign: 'center', position: 'relative', overflow: 'hidden',
      background: 'var(--paint-hue)', color: 'var(--accent-ink)'
    }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.35 }}>
        <div style={{ position: 'absolute', top: '15%', left: '8%', width: 220, height: 220, borderRadius: '50%', background: 'var(--paint-hue-deep)', filter: 'blur(70px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 260, height: 260, borderRadius: '50%', background: 'var(--paint-hue-soft)', filter: 'blur(70px)' }} />
      </div>
      <div className="container" style={{ position: 'relative' }}>
        <h2 className="serif" style={{
          fontSize: 'clamp(44px, 6vw, 88px)', fontStyle: 'italic',
          letterSpacing: '-0.03em', lineHeight: 1.02, maxWidth: 900, margin: '0 auto'
        }}>{t.final.title}</h2>
        <p style={{ fontSize: 18, opacity: 0.85, marginTop: 24 }}>{t.final.sub}</p>
        <div style={{ marginTop: 40, display: 'flex', gap: 12, justifyContent: 'center' }}>
          <a className="btn" href="#" style={{ background: 'var(--accent-ink)', color: 'var(--paint-hue)' }}>{t.final.cta} →</a>
          <a className="btn" href="dashboard.html" style={{ background: 'transparent', color: 'var(--accent-ink)', border: '1px solid currentColor' }}>Ver produto</a>
        </div>
      </div>
    </section>
  );
}

function Footer({ t }) {
  return (
    <footer style={{ background: 'var(--bg-elev-2)', borderTop: '1px solid var(--border)', padding: '64px 0 32px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(3, 1fr)', gap: 48 }}>
          <div>
            <Logo />
            <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 16, maxWidth: 260, lineHeight: 1.55 }}>{t.footer.tagline}</p>
          </div>
          {t.footer.cols.map((c, i) => (
            <div key={i}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--fg-dim)', textTransform: 'uppercase' }}>{c.h}</div>
              <ul style={{ listStyle: 'none', marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {c.links.map((l, j) => (
                  <li key={j} style={{ fontSize: 13, color: 'var(--fg-muted)' }}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--border)', marginTop: 56, paddingTop: 20, fontSize: 12, color: 'var(--fg-dim)', display: 'flex', justifyContent: 'space-between' }}>
          <span>{t.footer.copy}</span>
          <span className="mono" style={{ letterSpacing: '0.1em' }}>v1.0 · 2026</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { LogoStrip, Pillars, IASection, Customers, Pricing, FinalCTA, Footer });
