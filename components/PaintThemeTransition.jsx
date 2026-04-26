// components/PaintThemeTransition.jsx
// Full-screen paint splash overlay triggered on paint/theme change.
// 5 blobs at random screen positions, all growing synchronously.

const {
  useEffect: useEffectPT,
  useRef:    useRefPT,
  useState:  useStatePT,
} = React;

function seededR(seed, n) {
  const x = Math.sin(seed * 9301 + n * 49297) * 10000;
  return x - Math.floor(x);
}

function makeBlobSvg(seed, color) {
  const cx = 50, cy = 50, pts = 16;
  let d = '';
  for (let i = 0; i < pts; i++) {
    const a = (i / pts) * Math.PI * 2;
    const r = 30 + seededR(seed, i) * 22;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    d += i === 0 ? `M${x.toFixed(1)} ${y.toFixed(1)}` : ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  d += ' Z';

  let extras = '';
  // satellite dots
  for (let i = 0; i < 20; i++) {
    const a   = seededR(seed, i + 60)  * Math.PI * 2;
    const dist = 36 + seededR(seed, i + 120) * 26;
    const dx  = (cx + Math.cos(a) * dist).toFixed(1);
    const dy  = (cy + Math.sin(a) * dist).toFixed(1);
    const dr  = (1.2 + seededR(seed, i + 180) * 5).toFixed(1);
    extras += `<circle cx="${dx}" cy="${dy}" r="${dr}" fill="${color}"/>`;
  }
  // drips
  for (let i = 0; i < 8; i++) {
    const dx    = (cx - 32 + seededR(seed, i + 240) * 64).toFixed(1);
    const dy    = (cy + 22 + seededR(seed, i + 300) * 18).toFixed(1);
    const dlen  = (10 + seededR(seed, i + 360) * 22).toFixed(1);
    const dw    = (1.4 + seededR(seed, i + 420) * 2).toFixed(1);
    const rx    = (parseFloat(dw) / 2).toFixed(1);
    extras += `<rect x="${(parseFloat(dx)-parseFloat(dw)/2).toFixed(1)}" y="${dy}" width="${dw}" height="${dlen}" rx="${rx}" fill="${color}"/>`;
  }

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='${d}' fill='${color}'/>${extras}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

function PaintThemeTransition({ paint, theme }) {
  const isFirst  = useRefPT(true);
  const [blobs, setBlobs]     = useStatePT([]);
  const [animKey, setAnimKey] = useStatePT(0);

  useEffectPT(() => {
    // Skip the very first mount — no transition needed on initial load
    if (isFirst.current) { isFirst.current = false; return; }

    // Read the freshly-applied CSS variable (App sets data-paint before this effect fires)
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue('--paint-hue').trim() || '#C87A6B';

    // 5 random origin points spread across the viewport
    const newBlobs = Array.from({ length: 5 }, (_, i) => ({
      id:    i,
      x:     8 + Math.random() * 84,   // 8%–92% horizontal
      y:     8 + Math.random() * 84,   // 8%–92% vertical
      seed:  Math.floor(Math.random() * 9999),
      color,
    }));

    setBlobs(newBlobs);
    setAnimKey(k => k + 1);

    // Remove blobs after animation finishes (2.8s grow + 0.4s fade buffer)
    const t = setTimeout(() => setBlobs([]), 3400);
    return () => clearTimeout(t);
  }, [paint, theme]);

  if (!blobs.length) return null;

  return (
    <div className="pt-overlay" aria-hidden="true">
      {blobs.map(b => (
        <div
          key={`${animKey}-${b.id}`}
          className="pt-blob"
          style={{
            left:            `${b.x}%`,
            top:             `${b.y}%`,
            backgroundImage: makeBlobSvg(b.seed, b.color),
          }}
        />
      ))}
    </div>
  );
}

Object.assign(window, { PaintThemeTransition });
