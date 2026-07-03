import styles from "./odyssey-map.module.css";

interface Step {
  id: number;
  label: string;
  sublabel: string;
  icon: "ship" | "warriors" | "islands" | "lotus" | "cyclops" | "winds" | "styx" | "oracle" | "sirens" | "monster" | "forge" | "prison" | "city";
  color: string;
  glow: string;
}

const STEPS: Step[] = [
  { id: 1, label: "Depart from Troy", sublabel: "STEP 01", icon: "ship", color: "#c9a84c", glow: "#e8cc7a" },
  { id: 2, label: "Gather your Spartan Crew", sublabel: "STEP 02", icon: "warriors", color: "#7aafcb", glow: "#9fcfe8" },
  { id: 3, label: "Chart the Archipelago", sublabel: "STEP 03", icon: "islands", color: "#6aaa7a", glow: "#8aca9a" },
  { id: 4, label: "Escape the Lotus Eaters", sublabel: "STEP 04", icon: "lotus", color: "#b87aaf", glow: "#d89ace" },
  { id: 5, label: "Raid the Cyclops' Hoard", sublabel: "STEP 05", icon: "cyclops", color: "#cf7a5a", glow: "#ef9a7a" },
  { id: 6, label: "Harness the Winds of Aeolus", sublabel: "STEP 06", icon: "winds", color: "#7aaacf", glow: "#9acaef" },
  { id: 7, label: "Cross the River Styx", sublabel: "STEP 07", icon: "styx", color: "#9a7acf", glow: "#ba9aef" },
  { id: 8, label: "Consult the Oracle", sublabel: "STEP 08", icon: "oracle", color: "#cfaa5a", glow: "#efca7a" },
  { id: 9, label: "Navigate the Sirens", sublabel: "STEP 09", icon: "sirens", color: "#7acfaf", glow: "#9aefcf" },
  { id: 10, label: "Pass Scylla and Charybdis", sublabel: "STEP 10", icon: "monster", color: "#cf5a7a", glow: "#ef7a9a" },
  { id: 11, label: "Forge your Armor", sublabel: "STEP 11", icon: "forge", color: "#cf8a4a", glow: "#efaa6a" },
  { id: 12, label: "Escape Calypso's Isle", sublabel: "STEP 12", icon: "prison", color: "#7acaaf", glow: "#9aeacf" },
  { id: 13, label: "Arrive at Ithaca", sublabel: "STEP 13", icon: "city", color: "#c9a84c", glow: "#e8cc7a" },
];

// Canvas dimensions
const CANVAS_WIDTH = 3900;
const CANVAS_HEIGHT = 520;
const STEP_COUNT = STEPS.length;
const MARGIN_LEFT = 180;
const MARGIN_RIGHT = 180;
const USABLE_WIDTH = CANVAS_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
const STEP_SPACING = USABLE_WIDTH / (STEP_COUNT - 1);

// Wave amplitude and pattern
const BASE_Y = CANVAS_HEIGHT / 2;
const WAVE_AMPLITUDE = 120;

function getStepY(index: number): number {
  // Sinusoidal wave: alternates above and below center line
  const angle = (index / (STEP_COUNT - 1)) * Math.PI * 3.5;
  return BASE_Y + Math.sin(angle) * WAVE_AMPLITUDE;
}

function getStepX(index: number): number {
  return MARGIN_LEFT + index * STEP_SPACING;
}

// Build the SVG path string for the wavy connector
function buildPath(): string {
  const points = STEPS.map((_, i) => ({ x: getStepX(i), y: getStepY(i) }));
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    d += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

// --- Icon Components (inline SVGs) ---

function ShipIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      <ellipse cx="0" cy="8" rx="26" ry="10" fill={color} opacity="0.85" />
      <polygon points="0,-22 -6,8 6,8" fill={glow} opacity="0.9" />
      <rect x="-1" y="-22" width="2" height="30" fill={glow} opacity="0.7" />
      <line x1="-14" y1="-10" x2="14" y2="-10" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <ellipse cx="0" cy="8" rx="26" ry="10" fill="none" stroke={glow} strokeWidth="1.5" opacity="0.6" />
    </g>
  );
}

function WarriorsIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      {[-12, 0, 12].map((offset, i) => (
        <g key={i} transform={`translate(${offset}, 0)`}>
          <circle cx="0" cy="-12" r="6" fill={color} opacity="0.9" />
          <rect x="-4" y="-6" width="8" height="14" rx="2" fill={color} opacity="0.85" />
          <line x1="-2" y1="-20" x2="-2" y2="-26" stroke={glow} strokeWidth="1.5" />
          <polygon points="-2,-30 -5,-26 1,-26" fill={glow} />
        </g>
      ))}
    </g>
  );
}

function IslandsIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      <ellipse cx="-12" cy="4" rx="16" ry="10" fill={color} opacity="0.8" />
      <ellipse cx="10" cy="2" rx="13" ry="8" fill={color} opacity="0.7" />
      <ellipse cx="0" cy="-4" rx="11" ry="7" fill={glow} opacity="0.6" />
      <polygon points="0,-18 -8,-4 8,-4" fill={glow} opacity="0.8" />
      <polygon points="-14,-12 -20,-2 -8,-2" fill={color} opacity="0.7" />
    </g>
  );
}

function LotusIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <ellipse
          key={i}
          cx={Math.cos((angle * Math.PI) / 180) * 12}
          cy={Math.sin((angle * Math.PI) / 180) * 12}
          rx="10"
          ry="5"
          transform={`rotate(${angle}, ${Math.cos((angle * Math.PI) / 180) * 12}, ${Math.sin((angle * Math.PI) / 180) * 12})`}
          fill={color}
          opacity="0.75"
        />
      ))}
      <circle cx="0" cy="0" r="7" fill={glow} opacity="0.9" />
    </g>
  );
}

function CyclopsIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      <ellipse cx="0" cy="4" rx="18" ry="20" fill={color} opacity="0.8" />
      <circle cx="0" cy="-8" r="9" fill={glow} opacity="0.85" />
      <circle cx="0" cy="-8" r="4" fill="#1a1a2e" opacity="0.9" />
      <circle cx="0" cy="-8" r="2" fill={glow} opacity="1" />
      <line x1="-18" y1="6" x2="-24" y2="18" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="18" y1="6" x2="24" y2="18" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function WindsIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      <circle cx="0" cy="0" r="20" fill={color} opacity="0.25" stroke={glow} strokeWidth="1.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <line
          key={i}
          x1="0"
          y1="0"
          x2={Math.cos((angle * Math.PI) / 180) * 18}
          y2={Math.sin((angle * Math.PI) / 180) * 18}
          stroke={glow}
          strokeWidth={i % 2 === 0 ? 2 : 1}
          opacity="0.8"
        />
      ))}
      <circle cx="0" cy="0" r="5" fill={glow} opacity="0.9" />
      {[0, 90, 180, 270].map((angle, i) => (
        <polygon
          key={i}
          points="0,0 4,10 -4,10"
          transform={`rotate(${angle}) translate(0,-12)`}
          fill={color}
          opacity="0.85"
        />
      ))}
    </g>
  );
}

function StyxIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      <path d="M -22 6 Q -8 -10 0 0 Q 8 10 22 -6" stroke={color} strokeWidth="3" fill="none" opacity="0.8" />
      <path d="M -20 14 Q -6 -2 2 8 Q 10 18 22 2" stroke={glow} strokeWidth="2" fill="none" opacity="0.6" />
      <ellipse cx="-8" cy="8" rx="6" ry="3" fill={color} opacity="0.7" />
      <polygon points="-8,4 -4,8 -8,12 -12,8" fill={glow} opacity="0.9" />
      <line x1="-8" y1="4" x2="-8" y2="-18" stroke={glow} strokeWidth="1.5" opacity="0.7" />
    </g>
  );
}

function OracleIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      <polygon points="0,-22 -18,10 18,10" fill={color} opacity="0.75" stroke={glow} strokeWidth="1.5" />
      <rect x="-14" y="10" width="28" height="6" rx="2" fill={color} opacity="0.6" />
      {[-8, 0, 8].map((x, i) => (
        <rect key={i} x={x - 1} y="-6" width="3" height="14" rx="1" fill={glow} opacity="0.5" />
      ))}
      <circle cx="0" cy="-10" r="4" fill={glow} opacity="0.9" />
    </g>
  );
}

function SirensIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      <ellipse cx="-8" cy="6" rx="8" ry="14" fill={color} opacity="0.7" />
      <circle cx="-8" cy="-10" r="7" fill={glow} opacity="0.8" />
      <path d="M -8 6 Q 0 18 10 10 Q 16 4 14 -4" stroke={color} strokeWidth="3" fill="none" opacity="0.8" />
      <path d="M 6 -2 Q 14 -8 18 -16" stroke={glow} strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 10 2 Q 18 -2 22 -10" stroke={glow} strokeWidth="1" fill="none" opacity="0.5" />
    </g>
  );
}

function MonsterIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      <path d="M -20 0 Q -10 -20 0 0 Q 10 20 20 0" stroke={color} strokeWidth="4" fill="none" opacity="0.85" strokeLinecap="round" />
      <circle cx="-18" cy="4" r="8" fill={color} opacity="0.3" stroke={color} strokeWidth="1.5" />
      <circle cx="18" cy="-4" r="6" fill={glow} opacity="0.2" stroke={glow} strokeWidth="1" />
      {[-20, -10, 0, 10, 20].map((x, i) => (
        <circle key={i} cx={x} cy={Math.sin((x / 20) * Math.PI) * 20} r="2" fill={glow} opacity="0.7" />
      ))}
      <path d="M -22 6 Q -12 -2 -8 2" stroke={glow} strokeWidth="2" fill="none" opacity="0.7" />
    </g>
  );
}

function ForgeIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      <rect x="-14" y="-4" width="28" height="18" rx="3" fill={color} opacity="0.8" />
      <rect x="-10" y="-10" width="20" height="8" rx="2" fill={color} opacity="0.6" />
      {[-6, 0, 6].map((x, i) => (
        <path key={i} d={`M ${x} -10 Q ${x + 3} -18 ${x} -22`} stroke={glow} strokeWidth="2" fill="none" opacity={0.5 + i * 0.15} />
      ))}
      <ellipse cx="0" cy="6" rx="8" ry="5" fill={glow} opacity="0.6" />
      <line x1="-20" y1="10" x2="20" y2="10" stroke={glow} strokeWidth="2" opacity="0.4" />
    </g>
  );
}

function PrisonIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      <ellipse cx="0" cy="4" rx="20" ry="14" fill={color} opacity="0.3" stroke={color} strokeWidth="1.5" />
      <ellipse cx="0" cy="4" rx="12" ry="8" fill={color} opacity="0.5" />
      {[-12, -6, 0, 6, 12].map((x, i) => (
        <line key={i} x1={x} y1="-10" x2={x} y2="18" stroke={glow} strokeWidth="1.5" opacity="0.65" />
      ))}
      <path d="M -8 -14 Q 0 -22 8 -14" stroke={glow} strokeWidth="2" fill="none" opacity="0.8" />
      <circle cx="0" cy="-6" r="4" fill={glow} opacity="0.85" />
    </g>
  );
}

function CityIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      {[-16, -6, 6, 16].map((x, i) => (
        <rect key={i} x={x - 4} y={-18 - i * 4} width="8" height={18 + i * 4} rx="1" fill={color} opacity={0.6 + i * 0.1} />
      ))}
      <rect x="-22" y="0" width="44" height="8" rx="2" fill={glow} opacity="0.5" />
      {[-16, -6, 6, 16].map((x, i) => (
        <polygon key={i} points={`${x},${-18 - i * 4} ${x - 5},${-22 - i * 4} ${x + 5},${-22 - i * 4}`} fill={glow} opacity="0.7" />
      ))}
      <rect x="-4" y="-6" width="8" height="14" fill={glow} opacity="0.4" />
    </g>
  );
}

const ICON_MAP: Record<Step["icon"], (props: { color: string; glow: string }) => React.ReactElement> = {
  ship: ShipIcon,
  warriors: WarriorsIcon,
  islands: IslandsIcon,
  lotus: LotusIcon,
  cyclops: CyclopsIcon,
  winds: WindsIcon,
  styx: StyxIcon,
  oracle: OracleIcon,
  sirens: SirensIcon,
  monster: MonsterIcon,
  forge: ForgeIcon,
  prison: PrisonIcon,
  city: CityIcon,
};

// Ocean wave decorative paths for background atmosphere
function OceanWaves() {
  return (
    <g opacity="0.12">
      {Array.from({ length: 12 }).map((_, i) => (
        <path
          key={i}
          d={`M 0 ${60 + i * 40} Q ${CANVAS_WIDTH / 4} ${50 + i * 40} ${CANVAS_WIDTH / 2} ${60 + i * 40} Q ${(CANVAS_WIDTH * 3) / 4} ${70 + i * 40} ${CANVAS_WIDTH} ${60 + i * 40}`}
          stroke="#4a8ab8"
          strokeWidth="1.5"
          fill="none"
        />
      ))}
    </g>
  );
}

// Decorative compass rose
function CompassRose({ x, y, size = 40 }: { x: number; y: number; size?: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.25">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="0"
          y1="0"
          x2={Math.cos(((angle - 90) * Math.PI) / 180) * size}
          y2={Math.sin(((angle - 90) * Math.PI) / 180) * size}
          stroke="#c9a84c"
          strokeWidth={angle % 90 === 0 ? 2 : 1}
        />
      ))}
      <circle cx="0" cy="0" r={size / 4} fill="none" stroke="#c9a84c" strokeWidth="1" />
      <circle cx="0" cy="0" r="3" fill="#c9a84c" />
      <text x="0" y={-size - 6} textAnchor="middle" fill="#c9a84c" fontSize="10" fontFamily="serif">N</text>
    </g>
  );
}

// Island cluster decorations scattered across canvas
function DecorativeIslands() {
  const islands = [
    { x: 400, y: 420, r: 30, r2: 18 },
    { x: 900, y: 80, r: 22, r2: 14 },
    { x: 1400, y: 440, r: 35, r2: 20 },
    { x: 1900, y: 90, r: 28, r2: 16 },
    { x: 2400, y: 430, r: 32, r2: 19 },
    { x: 2900, y: 85, r: 24, r2: 15 },
    { x: 3400, y: 450, r: 26, r2: 16 },
  ];
  return (
    <g opacity="0.18">
      {islands.map((island, i) => (
        <g key={i} transform={`translate(${island.x}, ${island.y})`}>
          <ellipse cx="0" cy="0" rx={island.r} ry={island.r2} fill="#2a5a3a" />
          <ellipse cx={island.r * 0.3} cy={-island.r2 * 0.5} rx={island.r * 0.6} ry={island.r2 * 0.6} fill="#3a7a4a" />
        </g>
      ))}
    </g>
  );
}

export default function OdysseyMap() {
  const pathD = buildPath();

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <p className={styles.headerSub}>THE AEGEAN VOYAGE</p>
        <h1 className={styles.headerTitle}>Chart of the Odyssey</h1>
        <p className={styles.headerDesc}>Scroll east across the deep to sail from Troy to the shores of Ithaca.</p>
      </header>

      {/* Scroll Container */}
      <div className={styles.scrollContainer}>
        <svg
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          className={styles.canvas}
          aria-label="Chart of the Odyssey — 13-step journey map"
        >
          <defs>
            {/* Ocean gradient background */}
            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d1b2a" />
              <stop offset="40%" stopColor="#0e2238" />
              <stop offset="100%" stopColor="#0a1e34" />
            </linearGradient>
            {/* Glow filter for nodes */}
            <filter id="nodeGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Glow filter for path */}
            <filter id="pathGlow" x="-5%" y="-200%" width="110%" height="500%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Text shadow filter */}
            <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.8" />
            </filter>
            {/* Node outer glow */}
            <filter id="outerGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Step label bg */}
            <filter id="labelBg" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="4" floodColor="#050e18" floodOpacity="0.95" />
            </filter>
          </defs>

          {/* Ocean background */}
          <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="url(#oceanGrad)" />

          {/* Decorative wave lines */}
          <OceanWaves />

          {/* Decorative islands */}
          <DecorativeIslands />

          {/* Compass rose decorations */}
          <CompassRose x={620} y={200} size={50} />
          <CompassRose x={1850} y={380} size={40} />
          <CompassRose x={3150} y={170} size={45} />

          {/* --- The Wavy Path --- */}
          {/* Shadow/glow layer */}
          <path
            d={pathD}
            stroke="#c9a84c"
            strokeWidth="6"
            fill="none"
            opacity="0.18"
            filter="url(#pathGlow)"
          />
          {/* Main dashed path */}
          <path
            d={pathD}
            stroke="#c9a84c"
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="10 8"
            opacity="0.85"
            filter="url(#pathGlow)"
          />
          {/* Bright center line */}
          <path
            d={pathD}
            stroke="#e8cc7a"
            strokeWidth="1"
            fill="none"
            strokeDasharray="10 8"
            opacity="0.5"
          />

          {/* --- Step nodes & labels --- */}
          {STEPS.map((step, index) => {
            const x = getStepX(index);
            const y = getStepY(index);
            const IconComp = ICON_MAP[step.icon];
            const isAbove = y < BASE_Y;
            const labelY = isAbove ? y + 60 : y - 65;
            const stepNumY = isAbove ? labelY + 22 : labelY + 20;

            return (
              <g key={step.id}>
                {/* Outer glow ring */}
                <circle
                  cx={x}
                  cy={y}
                  r="36"
                  fill={step.color}
                  opacity="0.08"
                  filter="url(#outerGlow)"
                />

                {/* Node background disc */}
                <circle
                  cx={x}
                  cy={y}
                  r="28"
                  fill="#0d1b2a"
                  stroke={step.color}
                  strokeWidth="2.5"
                  opacity="0.95"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="28"
                  fill={step.color}
                  opacity="0.1"
                />

                {/* Decorative inner ring */}
                <circle
                  cx={x}
                  cy={y}
                  r="22"
                  fill="none"
                  stroke={step.glow}
                  strokeWidth="0.75"
                  opacity="0.4"
                  strokeDasharray="4 4"
                />

                {/* Icon */}
                <g transform={`translate(${x}, ${y})`} filter="url(#nodeGlow)">
                  <IconComp color={step.color} glow={step.glow} />
                </g>

                {/* Label: Title */}
                <text
                  x={x}
                  y={labelY}
                  textAnchor="middle"
                  fill="#f0e6d0"
                  fontSize="13.5"
                  fontFamily="'IM Fell English', serif"
                  fontStyle="italic"
                  filter="url(#labelBg)"
                  letterSpacing="0.3"
                >
                  {step.label}
                </text>

                {/* Label: Step number */}
                <text
                  x={x}
                  y={stepNumY}
                  textAnchor="middle"
                  fill={step.color}
                  fontSize="9.5"
                  fontFamily="'Cinzel', serif"
                  fontWeight="700"
                  letterSpacing="2.5"
                  filter="url(#labelBg)"
                  opacity="0.9"
                >
                  {step.sublabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendInner}>
          <p className={styles.legendTitle}>Map Legend</p>
          <div className={styles.legendItems}>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: "#6aaa7a" }} />
              <span>Completed</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: "#c9a84c" }} />
              <span>Current</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: "#3a5a7a" }} />
              <span>Undiscovered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
