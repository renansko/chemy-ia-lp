// components/PaintThemeTransition.jsx
// Full-screen paint splash overlay triggered on paint/theme change.
// 5 blobs at random screen positions, all growing synchronously.
// The page underneath stays in the OLD paint until the splashes cover the
// screen — only then is data-paint swapped, so the splashes FORM the new
// theme rather than hiding the existing page.

const {
  useEffect: useEffectPT,
  useRef:    useRefPT,
  useState:  useStatePT,
} = React;

// Mirror of the CSS palette in styles.css [data-paint="..."] blocks.
// Read-only — kept in JS so we don't depend on getComputedStyle ordering.
const PAINT_HUES = {
  neve:      '#F5F1EA',
  urbano:    '#9AA0A6',
  grafite:   '#1E1F22',
  goiaba:    '#D94A38',
  petroleo:  '#114E5C',
  salvia:    '#8FA886',
  sahara:    '#C89B5A',
  terracota: '#C87A6B',
};

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
  for (let i = 0; i < 20; i++) {
    const a    = seededR(seed, i + 60)  * Math.PI * 2;
    const dist = 36 + seededR(seed, i + 120) * 26;
    const dx   = (cx + Math.cos(a) * dist).toFixed(1);
    const dy   = (cy + Math.sin(a) * dist).toFixed(1);
    const dr   = (1.2 + seededR(seed, i + 180) * 5).toFixed(1);
    extras += `<circle cx="${dx}" cy="${dy}" r="${dr}" fill="${color}"/>`;
  }
  for (let i = 0; i < 8; i++) {
    const dx   = (cx - 32 + seededR(seed, i + 240) * 64).toFixed(1);
    const dy   = (cy + 22 + seededR(seed, i + 300) * 18).toFixed(1);
    const dlen = (10 + seededR(seed, i + 360) * 22).toFixed(1);
    const dw   = (1.4 + seededR(seed, i + 420) * 2).toFixed(1);
    const rx   = (parseFloat(dw) / 2).toFixed(1);
    extras += `<rect x="${(parseFloat(dx)-parseFloat(dw)/2).toFixed(1)}" y="${dy}" width="${dw}" height="${dlen}" rx="${rx}" fill="${color}"/>`;
  }

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='${d}' fill='${color}'/>${extras}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

function PaintThemeTransition({ paint, theme }) {
  const isFirst = useRefPT(true);
  const pendingPaint = useRefPT(null);  // paint to apply when current splash finishes
  const [blobs,   setBlobs]   = useStatePT([]);
  const [animKey, setAnimKey] = useStatePT(0);

  useEffectPT(() => {
    // First mount: apply data-paint instantly, no animation.
    if (isFirst.current) {
      isFirst.current = false;
      document.documentElement.setAttribute('data-paint', paint);
      return;
    }

    // Reduced-motion: skip animation, swap immediately.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.setAttribute('data-paint', paint);
      return;
    }

    // The new paint that will be revealed — splashes carry this color.
    const newColor = PAINT_HUES[paint] || '#C87A6B';
    pendingPaint.current = paint;

    const newBlobs = Array.from({ length: 5 }, (_, i) => ({
      id:    i,
      x:     8 + Math.random() * 84,
      y:     8 + Math.random() * 84,
      seed:  Math.floor(Math.random() * 9999),
      color: newColor,
    }));

    setBlobs(newBlobs);
    setAnimKey(k => k + 1);
  }, [paint, theme]);

  // Fired by the FIRST blob whose grow animation ends. All blobs start
  // together so any single animationend signals full coverage.
  const handleAnimEnd = () => {
    if (pendingPaint.current) {
      document.documentElement.setAttribute('data-paint', pendingPaint.current);
      pendingPaint.current = null;
    }
    setBlobs([]);
  };

  if (!blobs.length) return null;

  return (
    <div className="pt-overlay" aria-hidden="true">
      {blobs.map((b, idx) => (
        <div
          key={`${animKey}-${b.id}`}
          className="pt-blob"
          style={{
            left:            `${b.x}%`,
            top:             `${b.y}%`,
            backgroundImage: makeBlobSvg(b.seed, b.color),
          }}
          onAnimationEnd={idx === 0 ? handleAnimEnd : undefined}
        />
      ))}
    </div>
  );
}

Object.assign(window, { PaintThemeTransition });
