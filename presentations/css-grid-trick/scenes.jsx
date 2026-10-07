// scenes.jsx — scenes for the CSS grid breakdown animation
// Tailwind-docs-inspired aesthetic. Original design.

const C = {
  bg: '#ffffff',
  panel: '#f8fafc',     // slate-50
  border: '#e2e8f0',    // slate-200
  borderStrong: '#cbd5e1', // slate-300
  ink: '#0f172a',       // slate-900
  body: '#334155',      // slate-700
  muted: '#64748b',     // slate-500
  faint: '#94a3b8',     // slate-400
  sky: '#0ea5e9',       // sky-500
  skyDeep: '#0284c7',   // sky-600
  skyTint: '#e0f2fe',   // sky-100
  skyEdge: '#7dd3fc',   // sky-300
  indigo: '#6366f1',    // indigo-500
  indigoTint: '#e0e7ff',// indigo-100
  emerald: '#10b981',   // emerald-500
  emeraldTint: '#d1fae5', // emerald-100
  amber: '#f59e0b',     // amber-500
  amberTint: '#fef3c7', // amber-100
  rose: '#f43f5e',      // rose-500
  roseTint: '#ffe4e6',  // rose-100
  code: '#0f172a',
};

const FONT_SANS = "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const FONT_MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function lerp(a, b, t) { return a + (b - a) * t; }

// A simple framing chrome — title in the corner, current segment label.
function FrameChrome({ stepLabel, stepIdx, totalSteps }) {
  return (
    <>
      <div style={{
        position: 'absolute',
        top: 32, left: 48,
        display: 'flex', alignItems: 'center', gap: 12,
        fontFamily: FONT_SANS,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: 2,
          background: C.sky,
        }} />
        <div style={{
          fontSize: 14, fontWeight: 600, color: C.ink, letterSpacing: '-0.01em',
        }}>
          Anatomy of a CSS Grid declaration
        </div>
      </div>
      <div style={{
        position: 'absolute',
        top: 32, right: 48,
        fontFamily: FONT_MONO,
        fontSize: 12,
        color: C.muted,
        letterSpacing: '0.04em',
      }}>
        {stepIdx != null ? `${String(stepIdx).padStart(2, '0')} / ${String(totalSteps).padStart(2, '0')}` : ''}
        {stepLabel ? <span style={{ marginLeft: 16, color: C.body }}>{stepLabel}</span> : null}
      </div>
    </>
  );
}

// CodeLine renders the full declaration with optional per-token highlight.
// Tokens specified as substring matches; matched ranges get the active style.
function CodeLine({
  highlights = [],   // array of {match: string, color, bg}
  dim = false,
  fontSize = 38,
  centerY = 540,
  letterSpacing = '-0.005em',
}) {
  const code = "grid-template-columns: repeat(auto-fill, minmax(min(3.75rem, 100%), 1fr));";

  // Build segments. We'll scan for highlight matches in priority order.
  // To keep it simple, we'll do a pre-pass marking each char's highlight index.
  const marks = new Array(code.length).fill(null);
  highlights.forEach((h, idx) => {
    let from = 0;
    while (true) {
      const i = code.indexOf(h.match, from);
      if (i < 0) break;
      for (let k = i; k < i + h.match.length; k++) {
        if (marks[k] == null) marks[k] = idx;
      }
      from = i + h.match.length;
    }
  });

  // Group into runs by mark.
  const runs = [];
  let cur = { mark: marks[0], text: '' };
  for (let i = 0; i < code.length; i++) {
    if (marks[i] !== cur.mark) {
      runs.push(cur);
      cur = { mark: marks[i], text: '' };
    }
    cur.text += code[i];
  }
  runs.push(cur);

  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      top: centerY,
      transform: 'translate(-50%, -50%)',
      fontFamily: FONT_MONO,
      fontSize,
      fontWeight: 500,
      letterSpacing,
      whiteSpace: 'pre',
      color: dim ? C.faint : C.ink,
      transition: 'color 240ms',
    }}>
      {runs.map((r, i) => {
        const h = r.mark != null ? highlights[r.mark] : null;
        const style = h ? {
          color: h.color || C.skyDeep,
          background: h.bg || C.skyTint,
          padding: '4px 6px',
          margin: '0 -2px',
          borderRadius: 6,
          boxDecorationBreak: 'clone',
          fontWeight: 600,
        } : {};
        return <span key={i} style={style}>{r.text}</span>;
      })}
    </div>
  );
}

// Description blurb beneath the code line.
function Caption({ kicker, title, body, x = 960, y = 660, width = 1100, align = 'center' }) {
  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width,
      transform: align === 'center' ? 'translateX(-50%)' : 'none',
      fontFamily: FONT_SANS,
      textAlign: align,
    }}>
      {kicker ? (
        <div style={{
          fontFamily: FONT_MONO,
          fontSize: 12,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: C.sky,
          marginBottom: 12,
          fontWeight: 600,
        }}>{kicker}</div>
      ) : null}
      {title ? (
        <div style={{
          fontSize: 36, fontWeight: 700, color: C.ink, letterSpacing: '-0.02em',
          marginBottom: 14,
          lineHeight: 1.15,
        }}>{title}</div>
      ) : null}
      {body ? (
        <div style={{
          fontSize: 20, color: C.body, lineHeight: 1.5, fontWeight: 400, textWrap: 'pretty',
        }}>{body}</div>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 1 — Intro: full code line lands, "what does it do?"
// 0 .. 9
// ─────────────────────────────────────────────────────────────────────────────
function SceneIntro() {
  const { localTime } = useSprite();

  // Code line slides up + fades in.
  const codeIn = Easing.easeOutCubic(clamp(localTime / 0.9, 0, 1));
  const codeOpacity = codeIn;
  const codeY = lerp(40, 0, codeIn);

  // Title appears slightly later.
  const titleStart = 1.0;
  const titleIn = Easing.easeOutCubic(clamp((localTime - titleStart) / 0.7, 0, 1));

  // Subtitle yet later.
  const subStart = 1.5;
  const subIn = Easing.easeOutCubic(clamp((localTime - subStart) / 0.7, 0, 1));

  // After 5s: question fades in
  const qStart = 5.0;
  const qIn = Easing.easeOutCubic(clamp((localTime - qStart) / 0.7, 0, 1));

  // At 8s exit signal
  const exitStart = 8.0;
  const exit = Easing.easeInCubic(clamp((localTime - exitStart) / 1.0, 0, 1));

  return (
    <>
      {/* Overall fade out via wrapping div */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: 1 - exit,
      }}>
        {/* Tagline */}
        <div style={{
          position: 'absolute',
          top: 220, left: '50%',
          transform: `translate(-50%, ${lerp(20, 0, titleIn)}px)`,
          opacity: titleIn,
          fontFamily: FONT_MONO,
          fontSize: 13,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: C.sky,
          fontWeight: 600,
        }}>
          An intrinsically responsive grid in one line of CSS!
        </div>

        {/* Title */}
        <div style={{
          position: 'absolute',
          top: 270, left: '50%',
          transform: `translate(-50%, ${lerp(24, 0, subIn)}px)`,
          opacity: subIn,
          fontFamily: FONT_SANS,
          fontSize: 64,
          fontWeight: 700,
          color: C.ink,
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          textAlign: 'center',
          width: 1300,
          marginLeft: 0,
          paddingLeft: 0,
        }}>
          Let's break this down.
        </div>

        {/* The code line, big */}
        <div style={{
          position: 'absolute',
          top: 480,
          left: '50%',
          transform: `translate(-50%, ${codeY}px)`,
          opacity: codeOpacity,
          fontFamily: FONT_MONO,
          fontSize: 32,
          fontWeight: 500,
          color: C.ink,
          letterSpacing: '-0.005em',
          whiteSpace: 'pre',
          background: C.panel,
          border: `1px solid ${C.border}`,
          padding: '28px 40px',
          borderRadius: 14,
          boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)',
        }}>
          <span style={{ color: C.indigo, fontWeight: 600 }}>grid-template-columns</span>
          <span>: </span>
          <span style={{ color: C.skyDeep, fontWeight: 600 }}>repeat</span>
          <span>(</span>
          <span style={{ color: C.emerald, fontWeight: 600 }}>auto-fill</span>
          <span>, </span>
          <span style={{ color: C.skyDeep, fontWeight: 600 }}>minmax</span>
          <span>(</span>
          <span style={{ color: C.skyDeep, fontWeight: 600 }}>min</span>
          <span>(</span>
          <span style={{ color: C.amber, fontWeight: 600 }}>3.75rem</span>
          <span>, </span>
          <span style={{ color: C.amber, fontWeight: 600 }}>100%</span>
          <span>), </span>
          <span style={{ color: C.amber, fontWeight: 600 }}>1fr</span>
          <span>));</span>
        </div>

        {/* Question */}
        <div style={{
          position: 'absolute',
          top: 700, left: '50%',
          transform: `translate(-50%, ${lerp(16, 0, qIn)}px)`,
          opacity: qIn,
          fontFamily: FONT_SANS,
          fontSize: 22,
          color: C.body,
          fontWeight: 400,
          letterSpacing: '-0.01em',
        }}>
          Let's walk through it, piece by piece.
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: a generic scene wrapper that pins the code line and renders a
// demo panel above it. Used for Scenes 2..6.
// ─────────────────────────────────────────────────────────────────────────────
function PartScene({
  stepIdx, totalSteps, kicker, title, body,
  highlights,
  children, // demo on the upper canvas
}) {
  const { localTime, duration } = useSprite();
  const fadeIn = Easing.easeOutCubic(clamp(localTime / 0.6, 0, 1));
  const exitStart = duration - 0.5;
  const fadeOut = Easing.easeInCubic(clamp((localTime - exitStart) / 0.5, 0, 1));
  const opacity = fadeIn * (1 - fadeOut);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      <FrameChrome stepLabel={kicker} stepIdx={stepIdx} totalSteps={totalSteps} />
      {children}
      <CodeLine highlights={highlights} centerY={780} fontSize={30} />
      <Caption kicker={kicker} title={title} body={body} y={870} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 2 — grid-template-columns
// ─────────────────────────────────────────────────────────────────────────────
function SceneProperty() {
  const { localTime } = useSprite();
  // Animate columns appearing one by one.
  const cols = [0, 1, 2, 3].map(i => {
    const t0 = 1.0 + i * 0.25;
    return Easing.easeOutBack(clamp((localTime - t0) / 0.5, 0, 1));
  });

  // Container outline appears first.
  const containerIn = Easing.easeOutCubic(clamp((localTime - 0.4) / 0.6, 0, 1));

  const W = 1080;
  const H = 280;
  const X = (1920 - W) / 2;
  const Y = 200;
  const colW = (W - 60) / 4 - 12; // 4 cols, 12px gap, 30px padding each side

  return (
    <PartScene
      stepIdx={1} totalSteps={6}
      kicker="01 — the property"
      title="grid-template-columns defines the column tracks"
      body="Everything after the colon is just a list of columns. The browser reads it left-to-right and creates one track for each entry."
      highlights={[{ match: 'grid-template-columns', color: C.indigo, bg: C.indigoTint }]}
    >
      {/* Container */}
      <div style={{
        position: 'absolute',
        left: X, top: Y, width: W, height: H,
        border: `2px dashed ${C.borderStrong}`,
        borderRadius: 14,
        opacity: containerIn,
        background: '#fff',
      }}>
        {/* Label */}
        <div style={{
          position: 'absolute', top: -34, left: 0,
          fontFamily: FONT_MONO, fontSize: 13, color: C.muted,
        }}>
          .grid (parent container)
        </div>

        {/* Columns */}
        <div style={{
          position: 'absolute', inset: 30,
          display: 'flex', gap: 12,
        }}>
          {cols.map((t, i) => (
            <div key={i} style={{
              flex: 1,
              background: C.indigoTint,
              border: `1px solid ${C.indigo}`,
              borderRadius: 8,
              opacity: t,
              transform: `scaleY(${0.4 + t * 0.6})`,
              transformOrigin: 'top',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              paddingTop: 10,
              fontFamily: FONT_MONO, fontSize: 14, color: C.indigo, fontWeight: 600,
            }}>
              column {i + 1}
            </div>
          ))}
        </div>
      </div>
    </PartScene>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 3 — 1fr
// ─────────────────────────────────────────────────────────────────────────────
function SceneFr() {
  const { localTime } = useSprite();
  // Phase A (0..3.5): show "1fr 1fr 1fr 1fr" demo — equal share.
  // Phase B (3.5..end): show "1fr 2fr 1fr" demo — relative weighting.

  const phaseB = clamp((localTime - 3.5) / 0.6, 0, 1);
  const eased = Easing.easeInOutCubic(phaseB);

  const W = 1080;
  const H = 220;
  const X = (1920 - W) / 2;
  const Y = 240;

  // A: four equal cols. B: 1 / 2 / 1
  const wA = [1, 1, 1, 1];
  const wB = [1, 2, 1, 0]; // last col vanishes
  const weights = wA.map((a, i) => lerp(a, wB[i], eased));
  const total = weights.reduce((a, b) => a + b, 0);

  const colsIn = Easing.easeOutCubic(clamp((localTime - 0.5) / 0.6, 0, 1));

  return (
    <PartScene
      stepIdx={2} totalSteps={6}
      kicker="02 — 1fr"
      title={phaseB > 0.5 ? "1fr is a share, not a fixed size" : "fr means a fraction of the free space"}
      body={phaseB > 0.5
        ? "Bump one column to 2fr and it gets twice the share. The browser figures out the rest based on whatever space is left over."
        : "Four 1fr columns? Each one gets a quarter of whatever space is available."}
      highlights={[{ match: '1fr', color: C.amber, bg: C.amberTint }]}
    >
      {/* Container */}
      <div style={{
        position: 'absolute',
        left: X, top: Y, width: W, height: H,
        border: `2px dashed ${C.borderStrong}`,
        borderRadius: 14,
        background: '#fff',
        opacity: colsIn,
      }}>
        <div style={{
          position: 'absolute', inset: 24,
          display: 'flex', gap: 12,
        }}>
          {weights.map((w, i) => {
            const visible = w > 0.02;
            return (
              <div key={i} style={{
                flexGrow: w,
                flexBasis: 0,
                flexShrink: 0,
                opacity: visible ? 1 : 0,
                background: i === 1 && phaseB > 0.3 ? C.amberTint : C.skyTint,
                border: `1px solid ${i === 1 && phaseB > 0.3 ? C.amber : C.sky}`,
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT_MONO, fontSize: 16, color: i === 1 && phaseB > 0.3 ? C.amber : C.skyDeep, fontWeight: 600,
                transition: 'background 300ms, border-color 300ms, color 300ms',
                minWidth: 0,
              }}>
                {phaseB > 0.5
                  ? (i === 0 ? '1fr' : i === 1 ? '2fr' : i === 2 ? '1fr' : '')
                  : '1fr'}
              </div>
            );
          })}
        </div>
      </div>

      {/* Free-space ruler */}
      <div style={{
        position: 'absolute',
        left: X, top: Y + H + 16, width: W,
        opacity: colsIn,
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: FONT_MONO, fontSize: 12, color: C.muted,
      }}>
        <div style={{ flex: 1, height: 1, background: C.borderStrong }} />
        <div>free space</div>
        <div style={{ flex: 1, height: 1, background: C.borderStrong }} />
      </div>
    </PartScene>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 4 — minmax(X, 1fr)
// ─────────────────────────────────────────────────────────────────────────────
function SceneMinmax() {
  const { localTime, duration } = useSprite();

  // Animate container width oscillating to show clamp behavior.
  // 0..1.5: ramp in. 1.5..end: container width slides between wide and narrow.
  const intro = Easing.easeOutCubic(clamp(localTime / 1.0, 0, 1));

  // Width oscillation — slow back-and-forth
  const t = Math.max(0, localTime - 1.5);
  const cycle = (Math.sin((t / 5) * Math.PI * 2 - Math.PI / 2) + 1) / 2; // 0..1..0
  // We map 0..1 to widthFrac 1.0..0.32
  const widthFrac = lerp(1.0, 0.32, cycle);

  const containerMaxW = 1080;
  const containerW = containerMaxW * widthFrac;
  const X = (1920 - containerW) / 2;
  const Y = 240;
  const H = 220;

  // Min track size (60px scaled up for visibility)
  const MIN_PX = 120; // visual representation of 3.75rem
  const cols = 3;
  const gap = 12;
  const padding = 24;

  // Compute actual column width after clamp:
  // colW = max(MIN_PX, (containerW - 2*padding - (cols-1)*gap) / cols)
  const innerW = containerW - 2 * padding - (cols - 1) * gap;
  const idealColW = innerW / cols;
  const colW = Math.max(MIN_PX, idealColW);
  const totalColsW = colW * cols + (cols - 1) * gap;
  const overflow = totalColsW > containerW - 2 * padding;

  return (
    <PartScene
      stepIdx={3} totalSteps={6}
      kicker="03 — minmax( min, 1fr )"
      title="minmax sets a floor and a ceiling for each track"
      body="Each column grows with 1fr, but never shrinks below the minimum. As the container narrows, the columns hold their ground."
      highlights={[{ match: 'minmax(min(3.75rem, 100%), 1fr)', color: C.skyDeep, bg: C.skyTint }]}
    >
      {/* Outer ruler / "viewport" boundary */}
      <div style={{
        position: 'absolute',
        left: (1920 - containerMaxW) / 2 - 8, top: Y - 8,
        width: containerMaxW + 16, height: H + 16,
        border: `1px dashed ${C.faint}`,
        borderRadius: 14,
        opacity: intro * 0.5,
      }}>
        <div style={{
          position: 'absolute', top: -28, right: 0,
          fontFamily: FONT_MONO, fontSize: 12, color: C.muted,
        }}>
          available width (resizable)
        </div>
      </div>

      {/* Container (animated width) */}
      <div style={{
        position: 'absolute',
        left: X, top: Y, width: containerW, height: H,
        border: `2px solid ${overflow ? C.rose : C.borderStrong}`,
        borderRadius: 14,
        background: '#fff',
        opacity: intro,
        overflow: 'hidden',
        transition: 'border-color 200ms',
      }}>
        <div style={{
          position: 'absolute', inset: padding,
          display: 'flex', gap,
        }}>
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} style={{
              width: colW, height: '100%',
              background: C.skyTint,
              border: `1px solid ${C.sky}`,
              borderRadius: 8,
              flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT_MONO, fontSize: 14, color: C.skyDeep, fontWeight: 600,
            }}>
              {Math.round(colW)}px
            </div>
          ))}
        </div>
      </div>

      {/* Min indicator */}
      <div style={{
        position: 'absolute',
        left: (1920 - containerMaxW) / 2,
        top: Y + H + 24,
        width: containerMaxW,
        opacity: intro,
        display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
      }}>
        <div style={{
          width: MIN_PX,
          height: 28,
          background: C.amberTint,
          border: `1px solid ${C.amber}`,
          borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT_MONO, fontSize: 12, color: C.amber, fontWeight: 600,
        }}>
          min: 3.75rem
        </div>
        <div style={{
          marginLeft: 16,
          fontFamily: FONT_SANS, fontSize: 14, color: overflow ? C.rose : C.muted,
          fontWeight: 500,
          transition: 'color 200ms',
        }}>
          {overflow ? 'heads up — columns no longer fit, so they overflow' : 'columns share whatever space is left (1fr each)'}
        </div>
      </div>
    </PartScene>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 5 — repeat(auto-fill, ...)
// ─────────────────────────────────────────────────────────────────────────────
function SceneAutoFill() {
  const { localTime } = useSprite();

  const intro = Easing.easeOutCubic(clamp(localTime / 0.8, 0, 1));

  // Animate container width: grow over time so we can see new columns appear.
  // Sweep 600 -> 1100 -> 600 over 10s
  const t = Math.max(0, localTime - 1.0);
  const phase = (Math.sin((t / 6) * Math.PI * 2 - Math.PI / 2) + 1) / 2;
  const containerW = lerp(440, 1100, phase);

  const containerMaxW = 1100;
  const X = (1920 - containerW) / 2;
  const Y = 240;
  const H = 220;
  const padding = 24;
  const gap = 12;
  const MIN_PX = 120;

  // auto-fill: as many MIN_PX cols as fit, each then expands to share via 1fr
  const inner = containerW - 2 * padding;
  const nCols = Math.max(1, Math.floor((inner + gap) / (MIN_PX + gap)));
  const colW = (inner - (nCols - 1) * gap) / nCols;

  return (
    <PartScene
      stepIdx={4} totalSteps={6}
      kicker="04 — repeat( auto-fill, … )"
      title="auto-fill packs in as many tracks as will fit"
      body="The browser asks itself: how many tracks of at least the minimum size can I fit in this row? Then it creates that many."
      highlights={[
        { match: 'repeat', color: C.skyDeep, bg: C.skyTint },
        { match: 'auto-fill', color: C.emerald, bg: C.emeraldTint },
      ]}
    >
      {/* Container guide */}
      <div style={{
        position: 'absolute',
        left: (1920 - containerMaxW) / 2 - 8, top: Y - 8,
        width: containerMaxW + 16, height: H + 16,
        border: `1px dashed ${C.faint}`,
        borderRadius: 14,
        opacity: intro * 0.5,
      }} />

      {/* Container */}
      <div style={{
        position: 'absolute',
        left: X, top: Y, width: containerW, height: H,
        border: `2px solid ${C.borderStrong}`,
        borderRadius: 14,
        background: '#fff',
        opacity: intro,
      }}>
        <div style={{
          position: 'absolute', inset: padding,
          display: 'flex', gap,
        }}>
          {Array.from({ length: nCols }).map((_, i) => (
            <div key={i} style={{
              width: colW, height: '100%',
              background: C.emeraldTint,
              border: `1px solid ${C.emerald}`,
              borderRadius: 8,
              flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT_MONO, fontSize: 14, color: C.emerald, fontWeight: 600,
              animation: 'none',
              transition: 'width 100ms linear',
            }}>
              col {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Counter */}
      <div style={{
        position: 'absolute',
        left: 1920 / 2,
        top: Y + H + 28,
        transform: 'translateX(-50%)',
        opacity: intro,
        display: 'flex', alignItems: 'center', gap: 16,
        fontFamily: FONT_MONO,
      }}>
        <div style={{
          padding: '6px 14px',
          background: C.emeraldTint,
          border: `1px solid ${C.emerald}`,
          borderRadius: 6,
          color: C.emerald, fontWeight: 700, fontSize: 18,
        }}>
          {nCols} {nCols === 1 ? 'track' : 'tracks'}
        </div>
        <div style={{ fontSize: 14, color: C.muted }}>
          fitted into {Math.round(containerW)}px
        </div>
      </div>
    </PartScene>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 6 — min(3.75rem, 100%)
// ─────────────────────────────────────────────────────────────────────────────
function SceneNestedMin() {
  const { localTime } = useSprite();
  const intro = Easing.easeOutCubic(clamp(localTime / 0.8, 0, 1));

  // We'll show two phones / containers side by side.
  // Left: containerW = 240px, "min(3.75rem, 100%)" picks 100% (since 100% < 60px? no, 60<240 so picks 60)
  // Hmm — we need a case where the container is NARROWER than 3.75rem.
  // 3.75rem = 60px. So a container of 48px wide. Let's use that for "tiny".
  //
  // Layout:
  //   Left card: WITHOUT min() — uses minmax(60px, 1fr); container is only 48px wide → overflow!
  //   Right card: WITH min(60px, 100%) — when container <60px, min becomes 100% → fits.

  // Animate container shrink across the sequence to make it pop.
  const phase = clamp((localTime - 1.0) / 1.5, 0, 1);
  const eased = Easing.easeInOutCubic(phase);
  const containerW = lerp(240, 56, eased); // both shrink to dramatize

  const Y = 200;
  const H = 280;
  const cardW = 480;
  const gap = 80;
  const totalW = cardW * 2 + gap;
  const X0 = (1920 - totalW) / 2;

  // LEFT (without min): col always at least 120px (visual 3.75rem)
  const MIN_PX = 120;

  // RIGHT (with min): col = min(120, containerW)
  const colW_right = Math.min(MIN_PX, containerW);

  const overflowL = MIN_PX > containerW;

  return (
    <PartScene
      stepIdx={5} totalSteps={6}
      kicker="05 — min(3.75rem, 100%)"
      title="The nested min() keeps things tidy on tiny containers"
      body="If the parent ever gets narrower than 3.75rem, the column shrinks along with it instead of overflowing. A friendly safety net."
      highlights={[{ match: 'min(3.75rem, 100%)', color: C.amber, bg: C.amberTint }]}
    >
      {/* LEFT: without min() */}
      <div style={{
        position: 'absolute',
        left: X0, top: Y - 50,
        width: cardW,
        opacity: intro,
        fontFamily: FONT_MONO, fontSize: 12, color: C.muted,
        marginBottom: 8,
      }}>
        without min() — minmax(3.75rem, 1fr)
      </div>
      <div style={{
        position: 'absolute',
        left: X0 + (cardW - containerW) / 2,
        top: Y, width: containerW, height: H,
        border: `2px solid ${overflowL ? C.rose : C.borderStrong}`,
        borderRadius: 12,
        background: '#fff',
        opacity: intro,
        overflow: 'visible',
        transition: 'border-color 200ms',
      }}>
        <div style={{
          position: 'absolute',
          left: 12, top: 12,
          width: MIN_PX, height: H - 24,
          background: overflowL ? C.roseTint : C.skyTint,
          border: `1px solid ${overflowL ? C.rose : C.sky}`,
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT_MONO, fontSize: 13, color: overflowL ? C.rose : C.skyDeep, fontWeight: 600,
          transition: 'background 200ms, border-color 200ms, color 200ms',
        }}>
          {MIN_PX}px
        </div>
      </div>
      {overflowL ? (
        <div style={{
          position: 'absolute',
          left: X0, top: Y + H + 24,
          width: cardW,
          textAlign: 'center',
          fontFamily: FONT_SANS, fontSize: 14, color: C.rose, fontWeight: 600,
          opacity: intro,
        }}>
          oops — overflows the parent
        </div>
      ) : null}

      {/* RIGHT: with min() */}
      <div style={{
        position: 'absolute',
        left: X0 + cardW + gap, top: Y - 50,
        width: cardW,
        opacity: intro,
        fontFamily: FONT_MONO, fontSize: 12, color: C.muted,
        marginBottom: 8,
      }}>
        with min() — minmax(min(3.75rem, 100%), 1fr)
      </div>
      <div style={{
        position: 'absolute',
        left: X0 + cardW + gap + (cardW - containerW) / 2,
        top: Y, width: containerW, height: H,
        border: `2px solid ${C.emerald}`,
        borderRadius: 12,
        background: '#fff',
        opacity: intro,
      }}>
        <div style={{
          position: 'absolute',
          left: 6, top: 6,
          width: containerW - 12, height: H - 12,
          background: C.emeraldTint,
          border: `1px solid ${C.emerald}`,
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT_MONO, fontSize: 13, color: C.emerald, fontWeight: 600,
        }}>
          {Math.round(colW_right)}px
        </div>
      </div>
      <div style={{
        position: 'absolute',
        left: X0 + cardW + gap, top: Y + H + 24,
        width: cardW,
        textAlign: 'center',
        fontFamily: FONT_SANS, fontSize: 14, color: C.emerald, fontWeight: 600,
        opacity: intro,
      }}>
        fits gracefully
      </div>

      {/* Container width readout */}
      <div style={{
        position: 'absolute',
        left: 1920 / 2, top: Y + H + 80,
        transform: 'translateX(-50%)',
        fontFamily: FONT_MONO, fontSize: 13, color: C.muted,
        opacity: intro,
      }}>
        parent width: {Math.round(containerW)}px
      </div>
    </PartScene>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 7 — Putting it all together: full demo
// ─────────────────────────────────────────────────────────────────────────────
function SceneFinal() {
  const { localTime, duration } = useSprite();
  const intro = Easing.easeOutCubic(clamp(localTime / 0.8, 0, 1));
  const exitStart = duration - 0.5;
  const fadeOut = Easing.easeInCubic(clamp((localTime - exitStart) / 0.5, 0, 1));
  const opacity = intro * (1 - fadeOut);

  // The grand finale: a viewport-like window that resizes through several stops.
  // Sweep through: tiny → small → medium → wide → narrow again → settle medium.
  // Use breathing animation over 25s.
  const t = Math.max(0, localTime - 1.2);

  // Define keyframe widths
  const keyframes = [
    { t: 0,   w: 1100 },
    { t: 4,   w: 700 },
    { t: 8,   w: 380 },
    { t: 12,  w: 180 },
    { t: 16,  w: 520 },
    { t: 20,  w: 1100 },
    { t: 24,  w: 800 },
  ];
  // Find current segment
  let containerW = keyframes[0].w;
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i], b = keyframes[i + 1];
    if (t >= a.t && t <= b.t) {
      const local = (t - a.t) / (b.t - a.t);
      const eased = Easing.easeInOutCubic(local);
      containerW = lerp(a.w, b.w, eased);
      break;
    } else if (t > b.t && i === keyframes.length - 2) {
      containerW = b.w;
    }
  }

  const Y = 280;
  const H = 380;
  const containerMaxW = 1200;
  const X = (1920 - containerW) / 2;
  const padding = 24;
  const gap = 14;
  const MIN_PX = 96; // 3.75rem visualized

  // auto-fill calc
  const inner = Math.max(0, containerW - 2 * padding);
  let nCols, colW;
  if (containerW < MIN_PX) {
    // min(3.75rem, 100%) kicks in -> column = 100% of inner
    nCols = 1;
    colW = inner;
  } else {
    nCols = Math.max(1, Math.floor((inner + gap) / (MIN_PX + gap)));
    colW = (inner - (nCols - 1) * gap) / nCols;
  }

  // Number of "items" (children of the grid) — fixed pool, only first nCols fit per row.
  // Show 12 items; they'll wrap.
  const N_ITEMS = 12;
  const rows = Math.ceil(N_ITEMS / nCols);
  const rowH = 70;
  const visibleH = Math.min(H - 2 * padding, rows * rowH + (rows - 1) * gap);

  // Item palette
  const colors = [C.sky, C.indigo, C.emerald, C.amber, C.rose, C.skyDeep];
  const tints  = [C.skyTint, C.indigoTint, C.emeraldTint, C.amberTint, C.roseTint, C.skyTint];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      <FrameChrome stepLabel="06 — putting it together" stepIdx={6} totalSteps={6} />

      {/* Title above the demo */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 130,
        transform: 'translateX(-50%)',
        fontFamily: FONT_SANS,
        fontSize: 36, fontWeight: 700, color: C.ink, letterSpacing: '-0.02em',
        textAlign: 'center',
      }}>
        One declaration that handles every viewport.
      </div>
      <div style={{
        position: 'absolute',
        left: '50%', top: 188,
        transform: 'translateX(-50%)',
        fontFamily: FONT_SANS,
        fontSize: 18, color: C.body, fontWeight: 400,
        textAlign: 'center', width: 900,
      }}>
        Watch the grid figure itself out as the parent resizes.
      </div>

      {/* Outer guide — full available area */}
      <div style={{
        position: 'absolute',
        left: (1920 - containerMaxW) / 2 - 8, top: Y - 8,
        width: containerMaxW + 16, height: H + 16,
        border: `1px dashed ${C.faint}`,
        borderRadius: 14,
      }} />

      {/* Browser-like chrome label */}
      <div style={{
        position: 'absolute',
        left: X, top: Y - 36,
        fontFamily: FONT_MONO, fontSize: 12, color: C.muted,
        transition: 'left 80ms linear',
      }}>
        .grid · {Math.round(containerW)}px
      </div>

      {/* Container with grid */}
      <div style={{
        position: 'absolute',
        left: X, top: Y, width: containerW, height: H,
        border: `2px solid ${C.borderStrong}`,
        borderRadius: 14,
        background: '#fff',
        boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: padding,
          display: 'grid',
          gridTemplateColumns: `repeat(${nCols}, ${colW}px)`,
          gap,
          alignContent: 'start',
        }}>
          {Array.from({ length: N_ITEMS }).map((_, i) => {
            const c = colors[i % colors.length];
            const tint = tints[i % tints.length];
            return (
              <div key={i} style={{
                height: rowH,
                background: tint,
                border: `1px solid ${c}`,
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT_MONO, fontSize: 13, color: c, fontWeight: 600,
                minWidth: 0,
                overflow: 'hidden',
                transition: 'width 100ms linear',
              }}>
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Status row */}
      <div style={{
        position: 'absolute',
        left: '50%', top: Y + H + 30,
        transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 24,
        fontFamily: FONT_MONO,
      }}>
        <Stat label="parent" value={`${Math.round(containerW)}px`} color={C.muted} />
        <Stat label="tracks" value={String(nCols)} color={C.emerald} />
        <Stat label="track width" value={`${Math.round(colW)}px`} color={C.skyDeep} />
        <Stat label="rows" value={String(rows)} color={C.indigo} />
      </div>

      {/* The full code line, anchored bottom */}
      <CodeLine highlights={[
        { match: 'grid-template-columns', color: C.indigo, bg: C.indigoTint },
        { match: 'auto-fill', color: C.emerald, bg: C.emeraldTint },
        { match: '3.75rem', color: C.amber, bg: C.amberTint },
        { match: '1fr', color: C.skyDeep, bg: C.skyTint },
      ]} centerY={870} fontSize={26} />
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      minWidth: 140,
    }}>
      <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, color, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 8 — Outro: recap with all pieces highlighted
// ─────────────────────────────────────────────────────────────────────────────
function SceneOutro() {
  const { localTime } = useSprite();
  const intro = Easing.easeOutCubic(clamp(localTime / 0.8, 0, 1));

  // Reveal each colored chip in sequence, then the summary line.
  const chips = [
    { label: 'the property',   match: 'grid-template-columns', desc: 'defines column tracks',                  color: C.indigo,   bg: C.indigoTint },
    { label: 'the loop',       match: 'repeat',                desc: 'one definition, repeated',               color: C.skyDeep,  bg: C.skyTint },
    { label: 'the count',      match: 'auto-fill',             desc: 'as many as fit',                          color: C.emerald,  bg: C.emeraldTint },
    { label: 'the floor',      match: '3.75rem',               desc: 'min track width',                         color: C.amber,    bg: C.amberTint },
    { label: 'the safety',     match: '100%',                  desc: 'fall back when parent is tiny',           color: C.rose,     bg: C.roseTint },
    { label: 'the share',      match: '1fr',                   desc: 'split leftover space',                    color: C.skyDeep,  bg: C.skyTint },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: intro }}>
      <FrameChrome stepLabel="recap" stepIdx={null} />

      <div style={{
        position: 'absolute',
        left: '50%', top: 130, transform: 'translateX(-50%)',
        fontFamily: FONT_MONO, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: C.sky, fontWeight: 600,
      }}>
        a quick recap
      </div>
      <div style={{
        position: 'absolute',
        left: '50%', top: 162, transform: 'translateX(-50%)',
        fontFamily: FONT_SANS, fontSize: 44, fontWeight: 700, color: C.ink, letterSpacing: '-0.02em',
        textAlign: 'center',
      }}>
        Six little pieces working together.
      </div>

      {/* The code line at top */}
      <CodeLine
        highlights={chips.map(c => ({ match: c.match, color: c.color, bg: c.bg }))}
        centerY={300}
        fontSize={32}
      />

      {/* Chip grid — staggered in */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 420,
        transform: 'translateX(-50%)',
        width: 1400,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 24,
      }}>
        {chips.map((c, i) => {
          const t0 = 0.8 + i * 0.25;
          const tt = Easing.easeOutBack(clamp((localTime - t0) / 0.5, 0, 1));
          return (
            <div key={i} style={{
              opacity: tt,
              transform: `translateY(${(1 - tt) * 16}px)`,
              padding: '20px 24px',
              background: '#fff',
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
              display: 'flex', alignItems: 'flex-start', flexDirection: 'column', gap: 10,
            }}>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 12, letterSpacing: '0.1em',
                color: C.muted, textTransform: 'uppercase', fontWeight: 600,
              }}>
                {c.label}
              </div>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700,
                color: c.color, background: c.bg,
                padding: '4px 10px', borderRadius: 6,
              }}>
                {c.match}
              </div>
              <div style={{
                fontFamily: FONT_SANS, fontSize: 15, color: C.body, lineHeight: 1.4,
              }}>
                {c.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Plain-English summary */}
      <div style={{
        position: 'absolute',
        left: '50%', bottom: 175,
        transform: 'translateX(-50%)',
        width: 1280,
        opacity: clamp((localTime - 2.4) / 0.8, 0, 1),
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: '18px 28px',
        display: 'flex', alignItems: 'center', gap: 18,
        boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
      }}>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: C.sky, fontWeight: 700,
          flexShrink: 0,
        }}>
          in plain english
        </div>
        <div style={{
          width: 1, alignSelf: 'stretch', background: C.border,
        }} />
        <div style={{
          fontFamily: FONT_SANS, fontSize: 17, color: C.body,
          lineHeight: 1.5, fontWeight: 400, textWrap: 'pretty',
        }}>
          “Give me as many columns as will fit by dividing the container width by 3.75rem,
          then stretch those columns evenly to fill the row.”
        </div>
      </div>

      {/* Final line */}
      <div style={{
        position: 'absolute',
        left: '50%', bottom: 100,
        transform: 'translateX(-50%)',
        fontFamily: FONT_SANS, fontSize: 20, color: C.body, fontWeight: 400,
        opacity: clamp((localTime - 2.6) / 0.8, 0, 1),
        textAlign: 'center',
      }}>
        And the best part — no media queries needed.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Time-stamp screen-label updater (for commenting)
// ─────────────────────────────────────────────────────────────────────────────
function ScreenLabelUpdater() {
  const time = useTime();
  React.useEffect(() => {
    const root = document.getElementById('video-root');
    if (root) {
      const sec = Math.floor(time);
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      root.setAttribute('data-screen-label', `t=${m}:${String(s).padStart(2, '0')}`);
    }
  }, [Math.floor(time)]);
  return null;
}

// Expose to window
Object.assign(window, {
  SceneIntro, SceneProperty, SceneFr, SceneMinmax, SceneAutoFill,
  SceneNestedMin, SceneFinal, SceneOutro, ScreenLabelUpdater,
  C, FONT_SANS, FONT_MONO,
});
