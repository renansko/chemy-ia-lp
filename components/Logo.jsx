// components/Logo.jsx — chemy.ia wordmark

function Logo({ small }) {
  const size = small ? 22 : 28;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: size, height: size, borderRadius: size / 2,
        background: 'conic-gradient(from 210deg, #D94A38, #C89B5A, #8FA886, #114E5C, #C87A6B, #D94A38)',
        position: 'relative',
        boxShadow: '0 0 0 1px var(--border-strong) inset'
      }}>
        <div style={{
          position: 'absolute', inset: 4, borderRadius: '50%',
          background: 'var(--bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--serif)', fontSize: size * 0.55, color: 'var(--fg)',
          fontStyle: 'italic', lineHeight: 1
        }}>c</div>
      </div>
      <div style={{
        fontFamily: 'var(--sans)', fontWeight: 500, fontSize: small ? 15 : 17,
        letterSpacing: '-0.02em', color: 'var(--fg)'
      }}>
        chemy<span style={{ color: 'var(--accent)' }}>.ia</span>
      </div>
    </div>
  );
}

Object.assign(window, { Logo });
