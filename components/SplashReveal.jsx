// components/SplashReveal.jsx — wraps content with scroll-triggered paint splash reveal

const { useEffect: useEffectS, useRef: useRefS, useState: useStateS } = React;

function SplashReveal({ children, blobs = [], delay = 0 }) {
  const ref = useRefS(null);
  const [visible, setVisible] = useStateS(false);

  useEffectS(() => {
    if (!ref.current) return;
    const el = ref.current;

    // Defensive fallback: if IO doesn't fire within 200ms, just reveal
    const fallback = setTimeout(() => setVisible(true), 1200);

    // If element is already in viewport on mount, reveal immediately
    const rect = el.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewport) {
      setTimeout(() => setVisible(true), delay);
      clearTimeout(fallback);
      return () => {};
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          clearTimeout(fallback);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -5% 0px' });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(fallback); };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={'splash-reveal' + (visible ? ' in-view' : '')}
      style={{ position: 'relative' }}
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          className="splash-blob"
          style={{
            width: b.size, height: b.size,
            top: b.top, left: b.left, right: b.right, bottom: b.bottom,
            transitionDelay: ((b.delay || 0) + delay) + 'ms'
          }}
        />
      ))}
      {children}
    </div>
  );
}

Object.assign(window, { SplashReveal });
