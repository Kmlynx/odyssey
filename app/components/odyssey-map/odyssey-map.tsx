import styles from "./odyssey-map.module.css";

interface Step {
  id: number;
  label: string;
  sublabel: string;
  icon:
    | "ship"
    | "warriors"
    | "islands"
    | "lotus"
    | "cyclops"
    | "winds"
    | "styx"
    | "oracle"
    | "sirens"
    | "monster"
    | "forge"
    | "prison"
    | "city";
  color: string;
  glow: string;
}

const STEPS: Step[] = [
  { id: 1, label: "Depart from Troy", sublabel: "STEP 01", icon: "ship", color: "#9a6b2f", glow: "#d8ab5a" },
  { id: 2, label: "Gather your Spartan Crew", sublabel: "STEP 02", icon: "warriors", color: "#8a5a2a", glow: "#d09a56" },
  { id: 3, label: "Chart the Archipelago", sublabel: "STEP 03", icon: "islands", color: "#5f7a3a", glow: "#9ac06a" },
  { id: 4, label: "Escape the Lotus Eaters", sublabel: "STEP 04", icon: "lotus", color: "#8a4a72", glow: "#c98ab4" },
  { id: 5, label: "Raid the Cyclops' Hoard", sublabel: "STEP 05", icon: "cyclops", color: "#a5542f", glow: "#e39a68" },
  { id: 6, label: "Harness the Winds of Aeolus", sublabel: "STEP 06", icon: "winds", color: "#3a6a8a", glow: "#7ab4d6" },
  { id: 7, label: "Cross the River Styx", sublabel: "STEP 07", icon: "styx", color: "#5a4a8a", glow: "#9a8ad0" },
  { id: 8, label: "Consult the Oracle", sublabel: "STEP 08", icon: "oracle", color: "#9a7a2a", glow: "#e0c060" },
  { id: 9, label: "Navigate the Sirens", sublabel: "STEP 09", icon: "sirens", color: "#2f8a72", glow: "#6ad6b4" },
  { id: 10, label: "Pass Scylla and Charybdis", sublabel: "STEP 10", icon: "monster", color: "#a53a5a", glow: "#e37a9a" },
  { id: 11, label: "Forge your Armor", sublabel: "STEP 11", icon: "forge", color: "#a56a2a", glow: "#e3a860" },
  { id: 12, label: "Escape Calypso's Isle", sublabel: "STEP 12", icon: "prison", color: "#2f8a8a", glow: "#6ad6d6" },
  { id: 13, label: "Arrive at Ithaca", sublabel: "STEP 13", icon: "city", color: "#9a6b2f", glow: "#e3c060" },
];

// Canvas dimensions — two 16:9 painted panels placed side by side (undistorted).
const PANEL_WIDTH = 1950;
const CANVAS_WIDTH = PANEL_WIDTH * 2; // 3900
const CANVAS_HEIGHT = Math.round((PANEL_WIDTH * 9) / 16); // 1097

const STEP_COUNT = STEPS.length;
const MARGIN_LEFT = 210;
const MARGIN_RIGHT = 210;
const USABLE_WIDTH = CANVAS_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
const STEP_SPACING = USABLE_WIDTH / (STEP_COUNT - 1);

// Wave amplitude and pattern
const BASE_Y = 560;
const WAVE_AMPLITUDE = 150;

function getStepY(index: number): number {
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
      <ellipse cx="0" cy="8" rx="26" ry="10" fill={color} opacity="0.9" />
      <polygon points="0,-22 -6,8 6,8" fill={glow} opacity="0.95" />
      <rect x="-1" y="-22" width="2" height="30" fill={color} opacity="0.85" />
      <line x1="-14" y1="-10" x2="14" y2="-10" stroke={color} strokeWidth="1.5" opacity="0.8" />
      <ellipse cx="0" cy="8" rx="26" ry="10" fill="none" stroke={glow} strokeWidth="1.5" opacity="0.7" />
    </g>
  );
}

function WarriorsIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      {[-12, 0, 12].map((offset, i) => (
        <g key={i} transform={`translate(${offset}, 0)`}>
          <circle cx="0" cy="-12" r="6" fill={color} opacity="0.95" />
          <rect x="-4" y="-6" width="8" height="14" rx="2" fill={color} opacity="0.9" />
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
      <ellipse cx="-12" cy="4" rx="16" ry="10" fill={color} opacity="0.85" />
      <ellipse cx="10" cy="2" rx="13" ry="8" fill={color} opacity="0.75" />
      <ellipse cx="0" cy="-4" rx="11" ry="7" fill={glow} opacity="0.7" />
      <polygon points="0,-18 -8,-4 8,-4" fill={glow} opacity="0.85" />
      <polygon points="-14,-12 -20,-2 -8,-2" fill={color} opacity="0.8" />
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
          opacity="0.8"
        />
      ))}
      <circle cx="0" cy="0" r="7" fill={glow} opacity="0.95" />
    </g>
  );
}

function CyclopsIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      <ellipse cx="0" cy="4" rx="18" ry="20" fill={color} opacity="0.85" />
      <circle cx="0" cy="-8" r="9" fill={glow} opacity="0.9" />
      <circle cx="0" cy="-8" r="4" fill="#1a1a2e" opacity="0.95" />
      <circle cx="0" cy="-8" r="2" fill={glow} opacity="1" />
      <line x1="-18" y1="6" x2="-24" y2="18" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="18" y1="6" x2="24" y2="18" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function WindsIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      <circle cx="0" cy="0" r="20" fill={color} opacity="0.28" stroke={glow} strokeWidth="1.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <line
          key={i}
          x1="0"
          y1="0"
          x2={Math.cos((angle * Math.PI) / 180) * 18}
          y2={Math.sin((angle * Math.PI) / 180) * 18}
          stroke={glow}
          strokeWidth={i % 2 === 0 ? 2 : 1}
          opacity="0.85"
        />
      ))}
      <circle cx="0" cy="0" r="5" fill={glow} opacity="0.95" />
      {[0, 90, 180, 270].map((angle, i) => (
        <polygon key={i} points="0,0 4,10 -4,10" transform={`rotate(${angle}) translate(0,-12)`} fill={color} opacity="0.9" />
      ))}
    </g>
  );
}

function StyxIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      <path d="M -22 6 Q -8 -10 0 0 Q 8 10 22 -6" stroke={color} strokeWidth="3" fill="none" opacity="0.85" />
      <path d="M -20 14 Q -6 -2 2 8 Q 10 18 22 2" stroke={glow} strokeWidth="2" fill="none" opacity="0.7" />
      <ellipse cx="-8" cy="8" rx="6" ry="3" fill={color} opacity="0.8" />
      <polygon points="-8,4 -4,8 -8,12 -12,8" fill={glow} opacity="0.95" />
      <line x1="-8" y1="4" x2="-8" y2="-18" stroke={glow} strokeWidth="1.5" opacity="0.8" />
    </g>
  );
}

function OracleIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      <polygon points="0,-22 -18,10 18,10" fill={color} opacity="0.8" stroke={glow} strokeWidth="1.5" />
      <rect x="-14" y="10" width="28" height="6" rx="2" fill={color} opacity="0.7" />
      {[-8, 0, 8].map((x, i) => (
        <rect key={i} x={x - 1} y="-6" width="3" height="14" rx="1" fill={glow} opacity="0.6" />
      ))}
      <circle cx="0" cy="-10" r="4" fill={glow} opacity="0.95" />
    </g>
  );
}

function SirensIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      <ellipse cx="-8" cy="6" rx="8" ry="14" fill={color} opacity="0.8" />
      <circle cx="-8" cy="-10" r="7" fill={glow} opacity="0.85" />
      <path d="M -8 6 Q 0 18 10 10 Q 16 4 14 -4" stroke={color} strokeWidth="3" fill="none" opacity="0.85" />
      <path d="M 6 -2 Q 14 -8 18 -16" stroke={glow} strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M 10 2 Q 18 -2 22 -10" stroke={glow} strokeWidth="1" fill="none" opacity="0.6" />
    </g>
  );
}

function MonsterIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      <path d="M -20 0 Q -10 -20 0 0 Q 10 20 20 0" stroke={color} strokeWidth="4" fill="none" opacity="0.9" strokeLinecap="round" />
      <circle cx="-18" cy="4" r="8" fill={color} opacity="0.35" stroke={color} strokeWidth="1.5" />
      <circle cx="18" cy="-4" r="6" fill={glow} opacity="0.25" stroke={glow} strokeWidth="1" />
      {[-20, -10, 0, 10, 20].map((x, i) => (
        <circle key={i} cx={x} cy={Math.sin((x / 20) * Math.PI) * 20} r="2" fill={glow} opacity="0.8" />
      ))}
      <path d="M -22 6 Q -12 -2 -8 2" stroke={glow} strokeWidth="2" fill="none" opacity="0.8" />
    </g>
  );
}

function ForgeIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      <rect x="-14" y="-4" width="28" height="18" rx="3" fill={color} opacity="0.85" />
      <rect x="-10" y="-10" width="20" height="8" rx="2" fill={color} opacity="0.7" />
      {[-6, 0, 6].map((x, i) => (
        <path key={i} d={`M ${x} -10 Q ${x + 3} -18 ${x} -22`} stroke={glow} strokeWidth="2" fill="none" opacity={0.55 + i * 0.15} />
      ))}
      <ellipse cx="0" cy="6" rx="8" ry="5" fill={glow} opacity="0.7" />
      <line x1="-20" y1="10" x2="20" y2="10" stroke={glow} strokeWidth="2" opacity="0.5" />
    </g>
  );
}

function PrisonIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      <ellipse cx="0" cy="4" rx="20" ry="14" fill={color} opacity="0.35" stroke={color} strokeWidth="1.5" />
      <ellipse cx="0" cy="4" rx="12" ry="8" fill={color} opacity="0.55" />
      {[-12, -6, 0, 6, 12].map((x, i) => (
        <line key={i} x1={x} y1="-10" x2={x} y2="18" stroke={glow} strokeWidth="1.5" opacity="0.7" />
      ))}
      <path d="M -8 -14 Q 0 -22 8 -14" stroke={glow} strokeWidth="2" fill="none" opacity="0.85" />
      <circle cx="0" cy="-6" r="4" fill={glow} opacity="0.9" />
    </g>
  );
}

function CityIcon({ color, glow }: { color: string; glow: string }) {
  return (
    <g>
      {[-16, -6, 6, 16].map((x, i) => (
        <rect key={i} x={x - 4} y={-18 - i * 4} width="8" height={18 + i * 4} rx="1" fill={color} opacity={0.65 + i * 0.1} />
      ))}
      <rect x="-22" y="0" width="44" height="8" rx="2" fill={glow} opacity="0.6" />
      {[-16, -6, 6, 16].map((x, i) => (
        <polygon key={i} points={`${x},${-18 - i * 4} ${x - 5},${-22 - i * 4} ${x + 5},${-22 - i * 4}`} fill={glow} opacity="0.8" />
      ))}
      <rect x="-4" y="-6" width="8" height="14" fill={glow} opacity="0.5" />
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
            {/* Glow filter for path */}
            <filter id="pathGlow" x="-5%" y="-200%" width="110%" height="500%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Node drop shadow */}
            <filter id="nodeShadow" x="-60%" y="-60%" width="220%" height="220%">
              <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#2a1a08" floodOpacity="0.55" />
            </filter>
            {/* Text readability: dark ink + light halo */}
            <filter id="labelHalo" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f5ead0" floodOpacity="0.95" />
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#f5ead0" floodOpacity="0.9" />
            </filter>
            {/* Radial fill for medallion */}
            <radialGradient id="medallionFill" cx="45%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#fbf1d8" />
              <stop offset="70%" stopColor="#efdcae" />
              <stop offset="100%" stopColor="#d8bd82" />
            </radialGradient>
          </defs>

          {/* Painted background — two seamless 16:9 panels */}
          <image href="/odyssey/map-west.png" x={0} y={0} width={PANEL_WIDTH} height={CANVAS_HEIGHT} preserveAspectRatio="xMidYMid slice" />
          <image href="/odyssey/map-east.png" x={PANEL_WIDTH} y={0} width={PANEL_WIDTH} height={CANVAS_HEIGHT} preserveAspectRatio="xMidYMid slice" />

          {/* --- The Wavy Path --- */}
          <path d={pathD} stroke="#5a3d18" strokeWidth="7" fill="none" opacity="0.28" filter="url(#pathGlow)" />
          <path d={pathD} stroke="#c9a24c" strokeWidth="3" fill="none" strokeDasharray="12 10" opacity="0.95" filter="url(#pathGlow)" />
          <path d={pathD} stroke="#f2d888" strokeWidth="1.2" fill="none" strokeDasharray="12 10" opacity="0.6" />

          {/* --- Step nodes & labels --- */}
          {STEPS.map((step, index) => {
            const x = getStepX(index);
            const y = getStepY(index);
            const IconComp = ICON_MAP[step.icon];
            const isAbove = y < BASE_Y;
            const labelY = isAbove ? y + 62 : y - 68;
            const stepNumY = isAbove ? labelY + 24 : labelY - 22;

            return (
              <g key={step.id}>
                {/* Medallion */}
                <g filter="url(#nodeShadow)">
                  <circle cx={x} cy={y} r="34" fill="#7a5424" />
                  <circle cx={x} cy={y} r="31" fill="url(#medallionFill)" />
                  <circle cx={x} cy={y} r="31" fill="none" stroke="#7a5424" strokeWidth="2" />
                  <circle cx={x} cy={y} r="25" fill="none" stroke={step.color} strokeWidth="1" opacity="0.5" strokeDasharray="3 4" />
                </g>

                {/* Icon */}
                <g transform={`translate(${x}, ${y}) scale(0.82)`}>
                  <IconComp color={step.color} glow={step.glow} />
                </g>

                {/* Label: Title */}
                <text
                  x={x}
                  y={labelY}
                  textAnchor="middle"
                  fill="#2e1f0e"
                  fontSize="20"
                  fontFamily="'Cinzel', serif"
                  fontWeight="600"
                  filter="url(#labelHalo)"
                  letterSpacing="0.5"
                >
                  {step.label}
                </text>

                {/* Label: Step number */}
                <text
                  x={x}
                  y={stepNumY}
                  textAnchor="middle"
                  fill={step.color}
                  fontSize="12.5"
                  fontFamily="'Cinzel', serif"
                  fontWeight="700"
                  letterSpacing="3"
                  filter="url(#labelHalo)"
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
              <span className={styles.legendDot} style={{ background: "#5f7a3a" }} />
              <span>Completed</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: "#c9a24c" }} />
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
