// components/InkFlowBackground.jsx
// Full-screen fluid background. Every paint × theme is a "poster" — the page
// bg tinted by that paint, with its name set large — living on the GPU as wet
// paint: the pointer stirs it like ink in water and it settles back. Changing
// paint or theme pours the next poster in as ink (a drop where you clicked, or
// a jet from the edge), curling into vortices as it spreads.
//
// data-paint / data-theme on <html> are swapped only when the ink has covered
// the screen, so the page chrome changes in step with the background.
//
// Ported from the Ink Flow Carousel: stable fluids with vorticity confinement
// and a pressure projection, moving a *coordinate map* rather than dye. A
// second field carries the incoming poster's ink. Without WebGL2 + half-float
// targets it does nothing and the plain CSS background shows.

const {
  useEffect: useEffectIF,
  useRef:    useRefIF,
  useState:  useStateIF,
} = React;

const IF_THEMES = ['dark', 'light'];

// #region ink
/** Share of a pour spent jetting in before the bloom carries it. */
const POUR = 0.35;
/** From here the incoming ink is raised to a floor everywhere, so the swap is seamless. */
const FILL_START = 0.8;
/** How fast smeared paint returns to where it belongs, per second. */
const RELAX = 2.4;
/** How fast the water stops moving, per second. */
const DISSIPATION = 1.6;
/** Seconds after the last stir before the simulation stops drawing. */
const SETTLE_S = 3.4;
/** How fast the paint's finest detail smooths out, per second. */
const VISCOSITY = 9;

const smoothIF = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};
const fillLevel   = (p) => smoothIF(FILL_START, 1, p);
const jetStrength = (p) => (p >= POUR ? 0 : 1 - p / POUR);
const bloomReach  = (p) => smoothIF(0.04, FILL_START + 0.06, p);
// #endregion

/** Simulation grid (velocity, pressure) and paint grid (coordinate map, ink), by short side. */
const SIM = 160;
const DYE = 512;
const PRESSURE_ITERATIONS = 20;
/** The same, for a device that cannot keep up. Chosen once, by watching the first busy frames. */
const LITE = { sim: 96, dye: 256, iterations: 8 };
const SLOW_FRAME_S = 0.05;
const SLOW_FRAMES = 12;
const CURL = 16;
/** Pointer stir: force per screen-width of pointer travel, and brush size. */
const STIR = 1500;
/** The page has no drag-to-stir, so hovering stirs harder than the carousel's ripple. */
const HOVER_STIR = 2.2;
const STIR_RADIUS = 0.0026;
const JET = 14000;
const DROP = 900;
const FRONT_STIR = 6500;
const DURATION = 1800;
const REDUCED_DURATION = 240;
/** A click this recent is where the next pour drops from. */
const CLICK_WINDOW_MS = 1200;
/** Posters kept on the GPU at once; the rest are painted again on demand. */
const POSTER_CACHE = 4;

const VERT = `#version 300 es
in vec2 a_position;
uniform vec2 u_texel;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
void main() {
  vUv = a_position * 0.5 + 0.5;
  vL = vUv - vec2(u_texel.x, 0.0);
  vR = vUv + vec2(u_texel.x, 0.0);
  vT = vUv + vec2(0.0, u_texel.y);
  vB = vUv - vec2(0.0, u_texel.y);
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const HEAD = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
out vec4 o;
`;
const NEIGHBOURS = `in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
`;

const FRAGS = {
  // A gaussian dab: added (velocity) or raised to (ink).
  splat: HEAD + `uniform sampler2D u_target;
uniform float u_aspect;
uniform vec3 u_value;
uniform vec2 u_point;
uniform float u_radius;
uniform float u_raise;
uniform float u_edge;
uniform float u_seed;
void main() {
  vec2 p = vUv - u_point;
  p.x *= u_aspect;
  vec3 dab;
  if (u_edge > 0.0) {
    // A disc whose rim wobbles, so the bloom's edge is never a clean circle.
    float ang = atan(p.y, p.x);
    float r = u_radius * (1.0 + 0.07 * sin(3.0 * ang + u_seed) + 0.04 * sin(7.0 * ang - 1.7 * u_seed));
    dab = (1.0 - smoothstep(r - u_edge, r, length(p))) * u_value;
  } else {
    dab = exp(-dot(p, p) / u_radius) * u_value;
  }
  vec3 base = texture(u_target, vUv).xyz;
  o = vec4(u_raise > 0.5 ? min(base + dab, vec3(1.0)) : base + dab, 1.0);
}`,
  // Carry a field along the flow, looking back upstream (semi-Lagrangian).
  advect: HEAD + `uniform sampler2D u_velocity;
uniform sampler2D u_source;
uniform vec2 u_simTexel;
uniform float u_dt;
uniform float u_dissipation;
void main() {
  vec2 back = vUv - u_dt * texture(u_velocity, vUv).xy * u_simTexel;
  o = texture(u_source, back) / (1.0 + u_dissipation * u_dt);
}`,
  // The coordinate map: carried by the flow, then pulled back toward where
  // each pixel belongs (the paint settling), with a little viscosity so
  // grid-scale speckle smooths out faster than the broad swirls.
  relax: HEAD + NEIGHBOURS + `uniform sampler2D u_velocity;
uniform sampler2D u_source;
uniform vec2 u_simTexel;
uniform float u_dt;
uniform float u_relax;
uniform float u_viscosity;
void main() {
  vec2 back = vUv - u_dt * texture(u_velocity, vUv).xy * u_simTexel;
  vec2 d = texture(u_source, back).xy - vUv;
  vec2 around = 0.25 * (
    texture(u_source, back + vL - vUv).xy - vL +
    texture(u_source, back + vR - vUv).xy - vR +
    texture(u_source, back + vT - vUv).xy - vT +
    texture(u_source, back + vB - vUv).xy - vB);
  d = mix(d, around, 1.0 - exp(-u_viscosity * u_dt));
  o = vec4(vUv + d * exp(-u_relax * u_dt), 0.0, 1.0);
}`,
  identity: HEAD + `void main() { o = vec4(vUv, 0.0, 1.0); }`,
  floor: HEAD + `uniform sampler2D u_source;
uniform float u_level;
void main() { o = vec4(max(texture(u_source, vUv).xyz, vec3(u_level)), 1.0); }`,
  scale: HEAD + `uniform sampler2D u_source;
uniform float u_value;
void main() { o = texture(u_source, vUv) * u_value; }`,
  curl: HEAD + NEIGHBOURS + `uniform sampler2D u_velocity;
void main() {
  float L = texture(u_velocity, vL).y;
  float R = texture(u_velocity, vR).y;
  float T = texture(u_velocity, vT).x;
  float B = texture(u_velocity, vB).x;
  o = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,
  // Vorticity confinement: feed the swirls back in so eddies curl into tendrils.
  vorticity: HEAD + NEIGHBOURS + `uniform sampler2D u_velocity;
uniform sampler2D u_curl;
uniform float u_strength;
uniform float u_dt;
void main() {
  float L = texture(u_curl, vL).x;
  float R = texture(u_curl, vR).x;
  float T = texture(u_curl, vT).x;
  float B = texture(u_curl, vB).x;
  float C = texture(u_curl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= u_strength * C;
  force.y *= -1.0;
  vec2 vel = texture(u_velocity, vUv).xy + force * u_dt;
  o = vec4(clamp(vel, -1000.0, 1000.0), 0.0, 1.0);
}`,
  divergence: HEAD + NEIGHBOURS + `uniform sampler2D u_velocity;
void main() {
  vec2 C = texture(u_velocity, vUv).xy;
  float L = vL.x < 0.0 ? -C.x : texture(u_velocity, vL).x;
  float R = vR.x > 1.0 ? -C.x : texture(u_velocity, vR).x;
  float T = vT.y > 1.0 ? -C.y : texture(u_velocity, vT).y;
  float B = vB.y < 0.0 ? -C.y : texture(u_velocity, vB).y;
  o = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,
  pressure: HEAD + NEIGHBOURS + `uniform sampler2D u_pressure;
uniform sampler2D u_divergence;
void main() {
  float L = texture(u_pressure, vL).x;
  float R = texture(u_pressure, vR).x;
  float T = texture(u_pressure, vT).x;
  float B = texture(u_pressure, vB).x;
  float div = texture(u_divergence, vUv).x;
  o = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
}`,
  gradient: HEAD + NEIGHBOURS + `uniform sampler2D u_pressure;
uniform sampler2D u_velocity;
void main() {
  float L = texture(u_pressure, vL).x;
  float R = texture(u_pressure, vR).x;
  float T = texture(u_pressure, vT).x;
  float B = texture(u_pressure, vB).x;
  o = vec4(texture(u_velocity, vUv).xy - vec2(R - L, T - B), 0.0, 1.0);
}`,
  display: HEAD + `uniform sampler2D u_map;
uniform sampler2D u_mask;
uniform sampler2D u_from;
uniform sampler2D u_to;
uniform float u_fromAspect;
uniform float u_toAspect;
uniform vec2 u_res;
uniform vec2 u_dyeTexel;
uniform float u_wet;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

// object-fit: cover at a point of the coordinate map; the mip level comes from
// the undistorted coordinate so torn paint does not turn into blocky blur.
vec3 cover(sampler2D tex, float imgAspect, vec2 uv) {
  float a = u_res.x / u_res.y;
  vec2 s = a > imgAspect ? vec2(1.0, imgAspect / a) : vec2(a / imgAspect, 1.0);
  vec2 plain = (vUv - 0.5) * s;
  return textureGrad(tex, (uv - 0.5) * s + 0.5, dFdx(plain), dFdy(plain)).rgb;
}

float ink(vec2 p) { return texture(u_mask, p).x; }

void main() {
  vec2 uv = texture(u_map, vUv).xy;
  float m = ink(vUv);
  float e = smoothstep(0.45, 0.55, m);
  vec3 col = mix(cover(u_from, u_fromAspect, uv), cover(u_to, u_toAspect, uv), e);

  vec2 dx = vec2(u_dyeTexel.x, 0.0);
  vec2 dy = vec2(0.0, u_dyeTexel.y);
  vec3 light = normalize(vec3(-0.35, 0.5, 0.8));

  // Pigment piles up at the front of a spreading drop: a darker, glossy rim.
  float front = 4.0 * e * (1.0 - e);
  vec3 nInk = normalize(vec3(ink(vUv - dx) - ink(vUv + dx), ink(vUv - dy) - ink(vUv + dy), 0.12));
  float gloss = pow(max(dot(nInk, light), 0.0), 24.0);
  col = col * (1.0 - 0.18 * front * u_wet) + gloss * 0.22 * front * u_wet;

  col += (hash(floor(vUv * u_res)) - 0.5) * 0.02;
  o = vec4(col, 1.0);
}`,
};

// ── Posters ────────────────────────────────────────────────────────────────

const ifIndex = (theme, paint) => {
  const sw = window.PAINT_SWATCHES;
  const p = Math.max(sw.findIndex((s) => s.id === paint), 0);
  return Math.max(IF_THEMES.indexOf(theme), 0) * sw.length + p;
};
const ifSlot = (i) => {
  const sw = window.PAINT_SWATCHES;
  return { theme: IF_THEMES[Math.floor(i / sw.length)], swatch: sw[i % sw.length] };
};

const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

// Resolve the real tokens for a paint × theme by letting the stylesheet do
// it: [data-theme]/[data-paint] are bare attribute selectors, so they apply to
// a probe element as well as to <html>.
function resolvePosterTokens(theme, paint) {
  const probe = document.createElement('div');
  probe.setAttribute('data-theme', theme);
  probe.setAttribute('data-paint', paint);
  probe.style.cssText =
    'position:absolute;width:0;height:0;visibility:hidden;pointer-events:none;' +
    'background:var(--bg);color:var(--paint-hue);' +
    'border:0 solid var(--paint-hue-deep);outline:0 solid var(--paint-hue-soft)';
  document.body.appendChild(probe);
  const cs = getComputedStyle(probe);
  const out = { bg: cs.backgroundColor, hue: cs.color, deep: cs.borderTopColor, soft: cs.outlineColor };
  probe.remove();
  return out;
}

function paintPoster(canvas, i, lang) {
  const { theme, swatch } = ifSlot(i);
  const tok = resolvePosterTokens(theme, swatch.id);
  const c = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const u = Math.min(W, H);
  const dark = theme === 'dark';
  // Accents in the paint's own hue, unless it would vanish into the bg.
  const lum = luminance(swatch.hex);
  const accent = dark ? (lum < 0.05 ? tok.soft : tok.hue) : (lum > 0.7 ? tok.deep : tok.hue);
  const type = dark ? tok.soft : tok.deep;

  c.globalAlpha = 1;
  c.fillStyle = swatch.hex;
  c.fillStyle = tok.bg; // ignored if the browser cannot parse it; the hex stays
  c.fillRect(0, 0, W, H);

  // A glow of the paint, top right.
  const gx = W * 0.82, gy = H * 0.2;
  const glow = c.createRadialGradient(gx, gy, 0, gx, gy, u * 1.1);
  glow.addColorStop(0, accent);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  c.globalAlpha = dark ? 0.2 : 0.26;
  c.fillStyle = glow;
  c.fillRect(0, 0, W, H);

  // Concentric rings: hard edges are what marble most visibly when stirred.
  c.globalAlpha = dark ? 0.08 : 0.11;
  c.strokeStyle = accent;
  c.lineWidth = u * 0.012;
  for (let r = u * 0.08; r <= u * 0.62; r += u * 0.06) {
    c.beginPath();
    c.arc(W * 0.78, H * 0.58, r, 0, Math.PI * 2);
    c.stroke();
  }

  // The colour's name, set large at the foot (code and hex live in the chip).
  const x = u * 0.06;
  const base = H - u * 0.07;
  let size = u * 0.26;
  c.font = `italic 400 ${size}px "Instrument Serif", "Times New Roman", serif`;
  const width = c.measureText(swatch.name[lang]).width;
  if (width > W - x * 2) {
    size *= (W - x * 2) / width;
    c.font = `italic 400 ${size}px "Instrument Serif", "Times New Roman", serif`;
  }
  c.textBaseline = 'alphabetic';
  c.globalAlpha = dark ? 0.14 : 0.16;
  c.fillStyle = type;
  c.fillText(swatch.name[lang], x, base);
  c.globalAlpha = 1;
}

// ── Component ──────────────────────────────────────────────────────────────

function InkFlowBackground({ paint, theme, lang }) {
  const canvasRef = useRefIF(null);
  const [ready, setReady] = useStateIF(false);
  const [failed, setFailed] = useStateIF(false);
  const [generation, setGeneration] = useStateIF(0);
  const [reduced, setReduced] = useStateIF(false);

  const active = ifIndex(theme, paint);

  useEffectIF(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Swaps the page chrome to a slot once the ink covers the screen.
  const apply = (i) => {
    const { theme: t, swatch } = ifSlot(i);
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.setAttribute('data-paint', swatch.id);
  };

  const live = useRefIF({ reduced, lang });
  live.current = { reduced, lang };
  const engineRef = useRefIF({
    cur: active,
    pour: null,
    stirs: [],
    origin: null,
    clearInk: false,
    energy: 0,
    aspect: 1.6,
    running: false,
    kick: () => {},
    repaint: () => {},
  });
  const E = engineRef.current;

  // Where the last click landed: a swatch or the theme toggle pours from there.
  const lastClick = useRefIF(null);
  useEffectIF(() => {
    const onDown = (e) => {
      lastClick.current = { x: e.clientX / window.innerWidth, y: 1 - e.clientY / window.innerHeight, t: performance.now() };
    };
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onDown);
  }, []);

  // Any paint/theme change pours the new poster in. A pour already running is
  // landed first; two posters of ink at once would need a third texture.
  const previous = useRefIF(null);
  useEffectIF(() => {
    if (previous.current === null) {
      previous.current = active;
      apply(active);
      return;
    }
    if (previous.current === active) return;
    previous.current = active;
    if (!E.running) {
      E.cur = active;
      apply(active);
      return;
    }
    if (E.pour) {
      E.cur = E.pour.to;
      apply(E.cur);
      E.pour = null;
      E.clearInk = true;
    }
    if (active === E.cur) return E.kick();
    const click = lastClick.current;
    const o = click && performance.now() - click.t < CLICK_WINDOW_MS ? click : null;
    const jitter = Math.random() - 0.5;
    E.pour = {
      from: E.cur,
      to: active,
      t: 0,
      duration: (live.current.reduced ? REDUCED_DURATION : DURATION) / 1000,
      x: o ? o.x : 0.985,
      y: o ? o.y : 0.5 + jitter * 0.3,
      dx: o ? 0 : -1,
      dy: o ? 0 : jitter * 0.5,
      drop: !!o,
      kicked: false,
      seed: Math.random() * 100,
    };
    E.kick();
  }, [active]);

  // New language: the posters carry the colour's name, so paint them again.
  useEffectIF(() => { E.repaint(); }, [lang]);

  // ---- engine ----------------------------------------------------------------
  useEffectIF(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false });
    if (!gl || !(gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float'))) {
      setFailed(true);
      return;
    }

    let disposed = false;
    let raf = 0;
    let last = 0;
    let started = false;
    let lite = false;
    let judged = 0;
    let slow = 0;
    const P = {};
    const owned = { textures: [], fbos: [] };
    let vel, pres, map, mask, div, curl;

    // Posters live on the GPU in a small cache, painted on demand.
    const posterCanvas = document.createElement('canvas');
    let posterAspect = 1;
    const posters = new Map(); // slot -> { tex }
    const sizePosters = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const vw = Math.max(window.innerWidth, 1);
      const vh = Math.max(window.innerHeight, 1);
      const long = Math.min(2560, Math.max(vw, vh) * dpr);
      const scale = long / Math.max(vw, vh);
      posterCanvas.width = Math.round(vw * scale);
      posterCanvas.height = Math.round(vh * scale);
      posterAspect = vw / vh;
    };
    const dropPosters = () => {
      for (const p of posters.values()) gl.deleteTexture(p.tex);
      posters.clear();
    };
    const poster = (i) => {
      const hit = posters.get(i);
      if (hit) {
        posters.delete(i);
        posters.set(i, hit); // most recently used last
        return hit;
      }
      paintPoster(posterCanvas, i, live.current.lang);
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, posterCanvas);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      const entry = { tex, aspect: posterAspect };
      posters.set(i, entry);
      const keep = new Set([E.cur, E.pour && E.pour.from, E.pour && E.pour.to, i]);
      for (const k of posters.keys()) {
        if (posters.size <= POSTER_CACHE) break;
        if (keep.has(k)) continue;
        gl.deleteTexture(posters.get(k).tex);
        posters.delete(k);
      }
      return entry;
    };

    const onLost = (e) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onRestored = () => setGeneration((g) => g + 1);
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    const shader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('shader: ' + gl.getShaderInfoLog(s));
      return s;
    };
    const program = (frag) => {
      const prog = gl.createProgram();
      const v = shader(gl.VERTEX_SHADER, VERT);
      const f = shader(gl.FRAGMENT_SHADER, frag);
      gl.attachShader(prog, v);
      gl.attachShader(prog, f);
      gl.bindAttribLocation(prog, 0, 'a_position');
      gl.linkProgram(prog);
      gl.deleteShader(v);
      gl.deleteShader(f);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link: ' + gl.getProgramInfoLog(prog));
      const u = {};
      const count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const info = gl.getActiveUniform(prog, i);
        if (info) u[info.name.replace(/^u_/, '')] = gl.getUniformLocation(prog, info.name);
      }
      return { prog, u };
    };

    // The coordinate map holds positions; at 16 bits the rounding compounds
    // every frame and frays hard edges, so it gets 32 bits where possible.
    const precise = !!gl.getExtension('EXT_color_buffer_float') && !!gl.getExtension('OES_texture_float_linear');
    const target = (w, h, wide = false) => {
      const tex = gl.createTexture();
      const fbo = gl.createFramebuffer();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const full = wide && precise;
      gl.texImage2D(gl.TEXTURE_2D, 0, full ? gl.RGBA32F : gl.RGBA16F, w, h, 0, gl.RGBA, full ? gl.FLOAT : gl.HALF_FLOAT, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('half-float target incomplete');
      owned.textures.push(tex);
      owned.fbos.push(fbo);
      return { tex, fbo, w, h };
    };
    const double = (w, h, wide = false) => {
      const d = { read: target(w, h, wide), write: target(w, h, wide), swap: () => {} };
      d.swap = () => { const t = d.read; d.read = d.write; d.write = t; };
      return d;
    };
    const release = () => {
      for (const t of owned.textures) gl.deleteTexture(t);
      for (const f of owned.fbos) gl.deleteFramebuffer(f);
      owned.textures = [];
      owned.fbos = [];
    };

    const run = (p, dst, u) => {
      gl.useProgram(p.prog);
      let unit = 0;
      for (const k in u) {
        const loc = p.u[k];
        if (!loc) continue;
        const v = u[k];
        if (typeof v === 'number') gl.uniform1f(loc, v);
        else if (Array.isArray(v)) {
          if (v.length === 2) gl.uniform2f(loc, v[0], v[1]);
          else gl.uniform3f(loc, v[0], v[1], v[2]);
        } else {
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, v.tex);
          gl.uniform1i(loc, unit++);
        }
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, dst ? dst.fbo : null);
      gl.viewport(0, 0, dst ? dst.w : canvas.width, dst ? dst.h : canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const zero = (t) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    };
    const texel = (t) => [1 / t.w, 1 / t.h];
    const splat = (d, x, y, value, radius, raise, edge = 0, seed = 0) => {
      run(P.splat, d.write, { target: d.read, point: [x, y], value, radius, aspect: E.aspect, raise: raise ? 1 : 0, edge, seed, texel: texel(d.write) });
      d.swap();
    };
    /** Still water, clean paint, no ink. */
    const settle = () => {
      for (const t of [vel.read, vel.write, pres.read, pres.write]) zero(t);
      run(P.identity, map.read, {});
      run(P.identity, map.write, {});
    };

    const size = (short) =>
      E.aspect >= 1 ? [Math.round(short * E.aspect), short] : [short, Math.round(short / E.aspect)];
    const allocate = () => {
      release();
      const [sw, sh] = size(lite ? LITE.sim : SIM);
      const [dw, dh] = size(lite ? LITE.dye : DYE);
      vel = double(sw, sh);
      pres = double(sw, sh);
      div = target(sw, sh);
      curl = target(sw, sh);
      map = double(dw, dh, true);
      mask = double(dw, dh);
      settle();
      for (const t of [mask.read, mask.write]) zero(t);
    };

    const step = (dt, inking) => {
      const st = texel(vel.read);
      run(P.curl, curl, { velocity: vel.read, texel: st });
      run(P.vorticity, vel.write, { velocity: vel.read, curl, strength: CURL, dt, texel: st });
      vel.swap();
      run(P.divergence, div, { velocity: vel.read, texel: st });
      run(P.scale, pres.write, { source: pres.read, value: 0.8, texel: st });
      pres.swap();
      for (let i = 0, n = lite ? LITE.iterations : PRESSURE_ITERATIONS; i < n; i++) {
        run(P.pressure, pres.write, { pressure: pres.read, divergence: div, texel: st });
        pres.swap();
      }
      run(P.gradient, vel.write, { pressure: pres.read, velocity: vel.read, texel: st });
      vel.swap();
      run(P.advect, vel.write, { velocity: vel.read, source: vel.read, simTexel: st, dt, dissipation: DISSIPATION, texel: st });
      vel.swap();
      run(P.relax, map.write, { velocity: vel.read, source: map.read, simTexel: st, dt, relax: RELAX, viscosity: VISCOSITY, texel: texel(map.read) });
      map.swap();
      if (inking) {
        run(P.advect, mask.write, { velocity: vel.read, source: mask.read, simTexel: st, dt, dissipation: 0, texel: texel(mask.read) });
        mask.swap();
      }
    };

    // The ink: a jet from the edge (or a burst where a click landed), a bloom
    // spreading from it, and eddies seeded along the front so it grows tendrils.
    const pour = (pr, p, dt) => {
      if (pr.drop) {
        if (!pr.kicked) {
          pr.kicked = true;
          for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            const cx = Math.cos(a);
            const cy = Math.sin(a);
            splat(vel, pr.x + (cx * 0.035) / E.aspect, pr.y + cy * 0.035, [cx * DROP, cy * DROP, 0], 0.0012, false);
          }
        }
      } else {
        const j = jetStrength(p) * JET * dt;
        if (j > 0) splat(vel, pr.x, pr.y, [pr.dx * j, pr.dy * j, 0], 0.0022, false);
      }
      if (p < POUR) splat(mask, pr.x, pr.y, [1, 1, 1], 0.0032, true);
      const ox = pr.x * E.aspect;
      const far = Math.max(Math.hypot(ox, pr.y), Math.hypot(E.aspect - ox, pr.y), Math.hypot(ox, 1 - pr.y), Math.hypot(E.aspect - ox, 1 - pr.y));
      const ring = bloomReach(p) * far * 1.1;
      if (ring > 0.01) splat(mask, pr.x, pr.y, [1, 1, 1], ring, true, 0.03, pr.seed + p * 2);
      for (let i = 0; i < 3; i++) {
        const a = Math.random() * Math.PI * 2;
        const fx = pr.x + (Math.cos(a) * ring) / E.aspect;
        const fy = pr.y + Math.sin(a) * ring;
        if (fx < 0 || fx > 1 || fy < 0 || fy > 1) continue;
        const spin = (Math.random() < 0.5 ? -1 : 1) * FRONT_STIR * dt;
        splat(vel, fx, fy, [-Math.sin(a) * spin, Math.cos(a) * spin, 0], 0.0035, false);
      }
    };

    const display = () => {
      const pr = E.pour;
      const from = poster(pr ? pr.from : E.cur);
      const to = pr ? poster(pr.to) : from;
      run(P.display, null, {
        map: map.read,
        mask: mask.read,
        from,
        to,
        fromAspect: from.aspect,
        toAspect: to.aspect,
        res: [canvas.width, canvas.height],
        dyeTexel: texel(map.read),
        wet: live.current.reduced ? 0 : 1,
        texel: texel(map.read),
      });
    };

    const frame = (now) => {
      raf = 0;
      if (disposed || !started) return;
      const raw = (now - last) / 1000;
      last = now;
      // A pour keeps to the clock even when frames are slow.
      const elapsed = Math.min(raw, 0.25);
      const dt = Math.min(elapsed, 1 / 30);
      const still = live.current.reduced;
      if (!lite && judged < 40) {
        judged += 1;
        if (judged > 6 && raw > SLOW_FRAME_S) slow += 1;
        if (slow >= SLOW_FRAMES) {
          lite = true;
          resize(true);
        }
      }
      if (E.clearInk) {
        zero(mask.read);
        zero(mask.write);
        E.clearInk = false;
      }
      for (const s of E.stirs.splice(0)) {
        if (still) continue;
        splat(vel, s.x, s.y, [s.dx * s.force, s.dy * s.force, 0], STIR_RADIUS, false);
        E.energy = now;
      }
      const pr = E.pour;
      let landed = false;
      if (pr) {
        pr.t += elapsed;
        const p = Math.min(pr.t / pr.duration, 1);
        if (!still) pour(pr, p, dt);
        // Reduced motion keeps only the floor: a plain cross-fade, no flow.
        const level = still ? p : fillLevel(p);
        if (level > 0) {
          run(P.floor, mask.write, { source: mask.read, level, texel: texel(mask.read) });
          mask.swap();
        }
        landed = p >= 1;
        E.energy = now;
      }
      if (!still) step(dt, !!pr);
      display();
      if (pr && landed) {
        // The ink covered everything on the frame just drawn, so swapping the
        // poster — and the page's tokens — underneath it is invisible.
        E.cur = pr.to;
        E.pour = null;
        zero(mask.read);
        zero(mask.write);
        apply(E.cur);
      }
      if (E.pour || (!still && now - E.energy < SETTLE_S * 1000)) {
        raf = requestAnimationFrame(frame);
      } else {
        settle();
        display();
      }
    };
    E.kick = () => {
      if (raf || disposed || !started) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    E.repaint = () => {
      if (disposed || !started) return;
      dropPosters();
      display();
    };

    let repaintTimer = 0;
    const resize = (rebuild = false) => {
      const dpr = lite ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (w === 0 || h === 0) return;
      const aspect = w / h;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      if (rebuild || !vel || Math.abs(aspect - E.aspect) / E.aspect > 0.02) {
        E.aspect = aspect;
        allocate();
      }
      // Posters are laid out for the viewport; repaint them once it has
      // changed shape enough for the cover crop to cut into the type.
      if (Math.abs(aspect - posterAspect) / posterAspect > 0.08) {
        clearTimeout(repaintTimer);
        repaintTimer = setTimeout(() => {
          if (disposed) return;
          sizePosters();
          dropPosters();
          display();
        }, 250);
      }
      display();
    };

    // The page covers the canvas, so the pointer is followed on the window.
    let lastPoint = null;
    const onMove = (e) => {
      const p = { x: e.clientX / window.innerWidth, y: 1 - e.clientY / window.innerHeight };
      const prev = lastPoint;
      lastPoint = p;
      if (!prev || live.current.reduced || !started) return;
      E.stirs.push({ x: p.x, y: p.y, dx: p.x - prev.x, dy: p.y - prev.y, force: STIR * HOVER_STIR });
      E.kick();
    };
    const onLeave = () => { lastPoint = null; };

    try {
      for (const k of Object.keys(FRAGS)) P[k] = program(FRAGS[k]);
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      E.aspect = Math.max(canvas.clientWidth, 1) / Math.max(canvas.clientHeight, 1);
      allocate();
    } catch (err) {
      if (!disposed) setFailed(true);
      return;
    }
    const observer = new ResizeObserver(() => started && resize());
    observer.observe(canvas);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    // The posters set the colour's name in the page's fonts: wait for them.
    const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fontsReady.then(() => {
      if (disposed) return;
      sizePosters();
      started = true;
      E.running = true;
      E.cur = previous.current ?? E.cur;
      resize();
      setReady(true);
    });

    return () => {
      disposed = true;
      E.running = false;
      cancelAnimationFrame(raf);
      clearTimeout(repaintTimer);
      E.kick = () => {};
      E.repaint = () => {};
      if (E.pour) {
        E.cur = E.pour.to;
        E.pour = null;
        apply(E.cur);
      }
      observer.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      dropPosters();
      release();
      for (const p of Object.values(P)) gl.deleteProgram(p.prog);
    };
  }, [generation]);

  const { swatch } = ifSlot(active);
  const n = window.PAINT_SWATCHES.length;
  const pos = (active % n) + 1;

  return (
    <>
      {!failed && (
        <canvas ref={canvasRef} className="ifb-canvas" style={{ opacity: ready ? 1 : 0 }} aria-hidden="true" />
      )}
      <div className="ifb-chip" key={active} aria-live="polite">
        <span className="ifb-dot" style={{ background: swatch.hex }} />
        <span className="ifb-count"><b>{String(pos).padStart(2, '0')}</b> / {String(n).padStart(2, '0')}</span>
        <span className="ifb-name">{swatch.name[lang]}</span>
        <span className="ifb-meta">{swatch.code} · {swatch.hex}</span>
      </div>
    </>
  );
}

Object.assign(window, { InkFlowBackground });
