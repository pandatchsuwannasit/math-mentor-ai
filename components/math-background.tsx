const EQUATIONS = [
  { text: "d/dx sin x = cos x", top: "6%", left: "2%", size: "text-lg" },
  { text: "∫ₐᵇ f(x) dx", top: "12%", left: "37%", size: "text-xl" },
  { text: "E = mc²", top: "30%", left: "40%", size: "text-2xl" },
  { text: "∑ 1/n² = π²/6", top: "44%", left: "39%", size: "text-lg" },
  { text: "∇²φ = 0", top: "60%", left: "42%", size: "text-lg" },
  { text: "sin²x + cos²x = 1", top: "84%", left: "34%", size: "text-lg" },
  { text: "a² + b² = c²", top: "74%", left: "4%", size: "text-base" },
  { text: "lim x→∞ 1/x = 0", top: "50%", left: "3%", size: "text-base" },
]

export function MathBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Connected-dots network accent */}
      <svg
        className="absolute inset-0 h-full w-full opacity-30"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1200 700"
      >
        <defs>
          <radialGradient id="glow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="oklch(0.72 0.15 220)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="oklch(0.72 0.15 220)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1200" height="700" fill="url(#glow)" />
        {NODES.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r} fill="oklch(0.72 0.15 220)" opacity={n.o} />
        ))}
        {EDGES.map((e, i) => (
          <line
            key={i}
            x1={NODES[e[0]].x}
            y1={NODES[e[0]].y}
            x2={NODES[e[1]].x}
            y2={NODES[e[1]].y}
            stroke="oklch(0.72 0.15 220)"
            strokeWidth="0.6"
            opacity="0.25"
          />
        ))}
      </svg>

      {/* Faint floating equations */}
      {EQUATIONS.map((eq, i) => (
        <span
          key={i}
          className={`absolute font-mono italic text-foreground/10 ${eq.size}`}
          style={{ top: eq.top, left: eq.left }}
        >
          {eq.text}
        </span>
      ))}
    </div>
  )
}

const NODES = [
  { x: 120, y: 90, r: 2.5, o: 0.7 },
  { x: 220, y: 160, r: 1.8, o: 0.5 },
  { x: 90, y: 240, r: 2, o: 0.6 },
  { x: 300, y: 80, r: 1.6, o: 0.5 },
  { x: 760, y: 120, r: 2.4, o: 0.7 },
  { x: 860, y: 200, r: 1.8, o: 0.5 },
  { x: 700, y: 260, r: 1.6, o: 0.5 },
  { x: 960, y: 110, r: 2, o: 0.6 },
  { x: 1080, y: 220, r: 1.8, o: 0.5 },
  { x: 150, y: 520, r: 2, o: 0.6 },
  { x: 80, y: 600, r: 1.6, o: 0.5 },
  { x: 1000, y: 520, r: 2.2, o: 0.6 },
  { x: 1120, y: 600, r: 1.6, o: 0.5 },
]

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [4, 5],
  [5, 6],
  [4, 7],
  [7, 8],
  [9, 10],
  [11, 12],
]
