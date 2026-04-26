// components/SplashReveal.jsx — content emerges from within a growing paint splash

const { useEffect: useEffectS, useLayoutEffect: useLayoutEffectS, useRef: useRefS, useState: useStateS, useMemo: useMemoS } = React;

function makeSplatterUrl(seed) {
  const rand = (n) => {
    const x = Math.sin(seed * 9999 + n) * 10000;
    return x - Math.floor(x);
  };

  const cx = 50, cy = 50;
  const points = 14;
  let path = '';
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const r = 34 + rand(i) * 18;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    path += (i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  path += ' Z';

  let dots = '';
  for (let i = 0; i < 16; i++) {
    const a = rand(i + 100) * Math.PI * 2;
    const dist = 38 + rand(i + 200) * 22;
    const dx = cx + Math.cos(a) * dist;
    const dy = cy + Math.sin(a) * dist;
    const dr = 1 + rand(i + 300) * 4;
    dots += `<circle cx="${dx.toFixed(2)}" cy="${dy.toFixed(2)}" r="${dr.toFixed(2)}" fill="white"/>`;
  }

  let drips = '';
  for (let i = 0; i < 6; i++) {
    const dx = cx - 30 + rand(i + 400) * 60;
    const dy = cy + 25 + rand(i + 500) * 15;
    const dlen = 8 + rand(i + 600) * 18;
    const dwidth = 1.2 + rand(i + 700) * 1.6;
    drips += `<rect x="${(dx - dwidth/2).toFixed(2)}" y="${dy.toFixed(2)}" width="${dwidth.toFixed(2)}" height="${dlen.toFixed(2)}" rx="${(dwidth/2).toFixed(2)}" fill="white"/>`;
  }

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>
    <path d='${path}' fill='white'/>
    ${dots}
    ${drips}
  </svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

function SplashReveal({ children, delay = 0, seed = 1 }) {
  const hostRef = useRefS(null);
  const contentRef = useRefS(null);
  const shadowRef = useRefS(null);
  const [visible, setVisible] = useStateS(false);
  const splatterUrl = useMemoS(() => makeSplatterUrl(seed), [seed]);

  // Imperatively set mask styles so BOTH -webkit-mask and mask land in the DOM.
  // React inline-style only writes one of the two depending on key spelling.
  // useLayoutEffect runs before paint to avoid a flash of fully-visible content on mount.
  useLayoutEffectS(() => {
    const apply = (el, size) => {
      if (!el) return;
      el.style.setProperty('-webkit-mask-image', splatterUrl);
      el.style.setProperty('mask-image', splatterUrl);
      el.style.setProperty('-webkit-mask-repeat', 'no-repeat');
      el.style.setProperty('mask-repeat', 'no-repeat');
      el.style.setProperty('-webkit-mask-position', 'center');
      el.style.setProperty('mask-position', 'center');
      el.style.setProperty('-webkit-mask-size', size);
      el.style.setProperty('mask-size', size);
    };
    apply(contentRef.current, visible ? '300% 300%' : '6% 6%');
    apply(shadowRef.current, visible ? '340% 340%' : '4% 4%');
  }, [visible, splatterUrl]);

  useEffectS(() => {
    if (!hostRef.current) return;
    const el = hostRef.current;
    const fallback = setTimeout(() => setVisible(true), 1500);

    const rect = el.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewport) {
      const t = setTimeout(() => setVisible(true), delay);
      clearTimeout(fallback);
      return () => clearTimeout(t);
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          clearTimeout(fallback);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(fallback); };
  }, [delay]);

  return (
    <div ref={hostRef} className="splash-reveal-host">
      <div
        ref={shadowRef}
        aria-hidden="true"
        className={'splash-shadow' + (visible ? ' in' : '')}
      />
      <div ref={contentRef} className={'splash-reveal-content' + (visible ? ' in' : '')}>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { SplashReveal });
