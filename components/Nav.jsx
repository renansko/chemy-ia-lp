// components/Nav.jsx

function Nav({ t, lang, setLang, theme, setTheme }) {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'color-mix(in srgb, var(--bg) 85%, transparent)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)'
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <Logo />
          <div style={{ display: 'flex', gap: 24, fontSize: 14, color: 'var(--fg-muted)' }}>
            <a href="#product">{t.nav.product}</a>
            <a href="#features">{t.nav.features}</a>
            <a href="#ia">{t.nav.ia}</a>
            <a href="#customers">{t.nav.customers}</a>
            <a href="#pricing">{t.nav.pricing}</a>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
            className="mono"
            style={{
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--fg-muted)', padding: '6px 10px', borderRadius: 999,
              fontSize: 11, cursor: 'pointer', letterSpacing: '0.1em'
            }}
          >
            {lang === 'pt' ? 'EN' : 'PT'}
          </button>
          <a href="#" style={{ fontSize: 14, color: 'var(--fg-muted)' }}>{t.cta.signin}</a>
          <a className="btn primary sm" href="#final">{t.cta.demo} →</a>
        </div>
      </div>
    </nav>
  );
}

Object.assign(window, { Nav });
