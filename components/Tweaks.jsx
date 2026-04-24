// components/Tweaks.jsx — floating panel with paint palette selector

function Tweaks({ theme, setTheme, hero, setHero, lang, setLang, paint, setPaint, open, setOpen }) {
  if (!open) return null;
  const row = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--border)' };
  const seg = (active) => ({
    padding: '4px 10px', fontSize: 12, borderRadius: 999, cursor: 'pointer',
    background: active ? 'var(--paint-hue)' : 'transparent',
    color: active ? 'var(--accent-ink)' : 'var(--fg-muted)',
    border: active ? 'none' : '1px solid var(--border)',
    fontFamily: 'inherit'
  });
  const paints = [
    { id: 'grafite', label: 'Grafite', hex: '#1E1F22' },
    { id: 'goiaba', label: 'Goiaba', hex: '#D94A38' },
    { id: 'petroleo', label: 'Petróleo', hex: '#114E5C' },
    { id: 'salvia', label: 'Sálvia', hex: '#8FA886' },
    { id: 'sahara', label: 'Sahara', hex: '#C89B5A' },
    { id: 'terracota', label: 'Terracota', hex: '#C87A6B' },
    { id: 'urbano', label: 'Urbano', hex: '#9AA0A6' },
    { id: 'neve', label: 'Neve', hex: '#F5F1EA' }
  ];
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 100,
      background: 'var(--bg-elev)', border: '1px solid var(--border-strong)',
      borderRadius: 14, padding: 16, width: 280,
      boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--fg-muted)' }}>TWEAKS</div>
        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--fg-dim)', cursor: 'pointer', fontSize: 16 }}>×</button>
      </div>

      <div style={{ padding: '14px 0 10px', borderTop: '1px solid var(--border)', marginTop: 10 }}>
        <div style={{ fontSize: 12, color: 'var(--fg)', marginBottom: 10 }}>Paleta</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {paints.map(p => {
            const active = paint === p.id;
            return (
              <button key={p.id} onClick={() => setPaint(p.id)} title={p.label} style={{
                aspectRatio: '1', background: p.hex, borderRadius: 8,
                border: active ? '2px solid var(--fg)' : '1px solid var(--border)',
                cursor: 'pointer', padding: 0,
                boxShadow: active ? '0 0 0 2px var(--bg-elev), 0 0 0 3px var(--paint-hue)' : 'none'
              }} />
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 8, fontFamily: 'var(--mono)' }}>
          {paints.find(p => p.id === paint)?.label}
        </div>
      </div>

      <div style={row}>
        <span style={{ fontSize: 13 }}>Theme</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={seg(theme === 'dark')} onClick={() => setTheme('dark')}>Dark</button>
          <button style={seg(theme === 'light')} onClick={() => setTheme('light')}>Light</button>
        </div>
      </div>
      <div style={row}>
        <span style={{ fontSize: 13 }}>Hero</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={seg(hero === 'v1')} onClick={() => setHero('v1')}>Editorial</button>
          <button style={seg(hero === 'v2')} onClick={() => setHero('v2')}>Dashboard</button>
        </div>
      </div>
      <div style={row}>
        <span style={{ fontSize: 13 }}>Language</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={seg(lang === 'pt')} onClick={() => setLang('pt')}>PT</button>
          <button style={seg(lang === 'en')} onClick={() => setLang('en')}>EN</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Tweaks });
