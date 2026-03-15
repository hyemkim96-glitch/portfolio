'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface Comp { title: string; desc: string; }
interface Props {
    translations: { domain: Comp; data: Comp; ai: Comp; production: Comp; collab: Comp; };
}

/* ─────────────── SVG DEFS shared ─────────────── */
const SharedDefs = () => (
    <defs>
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-sm" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
    </defs>
);

/* ─────────────── 1. DOMAIN ─────────────── */
const ORBIT_NODES = [
    { a: 0, r: 148, label: 'Automotive HMI' },
    { a: 60, r: 140, label: 'Healthcare UX' },
    { a: 120, r: 148, label: 'B2B SaaS' },
    { a: 180, r: 142, label: 'SDV Cabin' },
    { a: 240, r: 148, label: 'Service Design' },
    { a: 300, r: 140, label: 'Smart Factory' },
];
function DomainArt() {
    return (
        <svg viewBox="0 0 480 480" fill="none" className="w-full h-full">
            <SharedDefs />
            <defs>
                <radialGradient id="rg-domain" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>
            </defs>
            <circle cx="240" cy="240" r="200" fill="url(#rg-domain)" />
            {/* Sphere rings */}
            <circle cx="240" cy="240" r="140" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.18" fill="none" />
            {[-50, -25, 0, 25, 50].map((dy, i) => {
                const halfW = Math.sqrt(Math.max(0, 140 * 140 - dy * dy));
                return <ellipse key={i} cx="240" cy={240 + dy} rx={halfW} ry={halfW * 0.28} stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.12" fill="none" />;
            })}
            {/* Rotating meridian */}
            <motion.ellipse cx="240" cy="240" rx="70" ry="140" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.15" fill="none"
                style={{ transformOrigin: '240px 240px' }}
                animate={{ rotateY: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />
            {/* Orbit nodes */}
            {ORBIT_NODES.map(({ a, r, label }, i) => {
                const rad = (a * Math.PI) / 180;
                const cx = 240 + r * Math.cos(rad), cy = 240 + r * Math.sin(rad);
                return (
                    <motion.g key={i} animate={{ x: [0, Math.sin(i) * 6, 0], y: [0, Math.cos(i) * 6, 0] }}
                        transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}>
                        <line x1="240" y1="240" x2={cx} y2={cy} stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 5" strokeOpacity="0.2" />
                        <circle cx={cx} cy={cy} r="16" fill="currentColor" fillOpacity="0.06" />
                        <circle cx={cx} cy={cy} r="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" fill="none" filter="url(#glow-sm)" />
                        <circle cx={cx} cy={cy} r="2.5" fill="currentColor" fillOpacity="0.9" />
                        <text x={cx} y={cy + 22} textAnchor="middle" fontSize="8" fill="currentColor" fillOpacity="0.35" fontFamily="inherit">{label}</text>
                    </motion.g>
                );
            })}
            {/* Core */}
            <circle cx="240" cy="240" r="22" fill="currentColor" fillOpacity="0.12" />
            <circle cx="240" cy="240" r="12" fill="currentColor" filter="url(#glow)" />
            <motion.circle cx="240" cy="240" r="30" stroke="currentColor" strokeWidth="1" fill="none" strokeOpacity="0.35"
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }} style={{ transformOrigin: '240px 240px' }}
                transition={{ duration: 2.5, repeat: Infinity }} />
            <motion.circle cx="240" cy="240" r="48" stroke="currentColor" strokeWidth="0.5" fill="none" strokeOpacity="0.2"
                animate={{ scale: [1, 1.5, 1], opacity: [0.25, 0, 0.25] }} style={{ transformOrigin: '240px 240px' }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }} />
        </svg>
    );
}

/* ─────────────── 2. DATA ─────────────── */
const PTS = [{ x: 80, y: 190 }, { x: 160, y: 140 }, { x: 240, y: 165 }, { x: 320, y: 108 }, { x: 400, y: 135 }];
const PART = [20, 55, 95, 130, 170, 205, 250, 290, 330, 370, 410, 445];

function DataArt() {
    return (
        <svg viewBox="0 0 480 360" fill="none" className="w-full h-full">
            <SharedDefs />
            <defs>
                <linearGradient id="lg-wave" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.01" />
                </linearGradient>
            </defs>
            {/* Grid */}
            {[80, 150, 220, 290].map(y => <line key={y} x1="30" y1={y} x2="450" y2={y} stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.07" />)}
            {[100, 180, 260, 340, 420].map(x => <line key={x} x1={x} y1="30" x2={x} y2="330" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.05" />)}
            {/* Area */}
            <motion.path d="M80 190 Q120 155,160 140 T240 165 T320 108 T400 135 L400 330 L80 330 Z"
                fill="url(#lg-wave)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} />
            {/* Wave line */}
            <motion.path d="M80 190 Q120 155,160 140 T240 165 T320 108 T400 135"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"
                filter="url(#glow-sm)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: 'easeInOut' }} />
            {/* Data points */}
            {PTS.map((pt, i) => (
                <motion.g key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 2.2 + i * 0.3, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}>
                    <circle cx={pt.x} cy={pt.y} r="14" fill="currentColor" fillOpacity="0.07" />
                    <circle cx={pt.x} cy={pt.y} r="5.5" fill="currentColor" fillOpacity="0.8" />
                    <motion.circle cx={pt.x} cy={pt.y} r="10" stroke="currentColor" strokeWidth="1" fill="none" strokeOpacity="0.4"
                        animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }} style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                        transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.4 }} />
                </motion.g>
            ))}
            {/* Rising particles */}
            {PART.map((x, i) => (
                <motion.circle key={i} cx={x} cy={0} r="1.8" fill="currentColor"
                    animate={{ y: [340, -10], opacity: [0, 0.7, 0.7, 0] }}
                    transition={{ duration: 5 + (i % 4), repeat: Infinity, delay: i * 0.45, ease: 'linear' }} />
            ))}
            {/* Axis */}
            <line x1="30" y1="330" x2="450" y2="330" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
        </svg>
    );
}

/* ─────────────── 3. AI ─────────────── */
const BRANCHES = [0, 51, 103, 154, 206, 257, 309].map((a, i) => ({ a, len: 120 + (i % 2) * 15 }));
const NODES2 = [20, 72, 128, 181, 234, 287, 344].map((a, i) => ({ a, r: 80 + (i % 3) * 10 }));

function AIArt() {
    return (
        <svg viewBox="0 0 480 480" fill="none" className="w-full h-full">
            <SharedDefs />
            <defs>
                <radialGradient id="rg-ai" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>
            </defs>
            <circle cx="240" cy="240" r="210" fill="url(#rg-ai)" />
            {/* Outer rings */}
            {[100, 140, 180].map((r, i) => (
                <motion.circle key={i} cx="240" cy="240" r={r} stroke="currentColor" strokeWidth="0.6" fill="none"
                    animate={{ scale: [1, 1.08, 1], opacity: [0.12, 0.03, 0.12] }} style={{ transformOrigin: '240px 240px' }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.7 }} />
            ))}
            {/* Branches */}
            {BRANCHES.map(({ a, len }, i) => {
                const rad = (a * Math.PI) / 180;
                const x2 = 240 + len * Math.cos(rad), y2 = 240 + len * Math.sin(rad);
                return <motion.line key={i} x1="240" y1="240" x2={x2} y2={y2}
                    stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.22"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.9 }} />;
            })}
            {/* Sub-branch nodes */}
            {NODES2.map(({ a, r }, i) => {
                const rad = (a * Math.PI) / 180;
                const cx = 240 + r * Math.cos(rad), cy = 240 + r * Math.sin(rad);
                const x2 = cx + 28 * Math.cos(rad + 0.5), y2 = cy + 28 * Math.sin(rad + 0.5);
                const x3 = cx + 26 * Math.cos(rad - 0.5), y3 = cy + 26 * Math.sin(rad - 0.5);
                return (
                    <g key={i}>
                        <motion.line x1={cx} y1={cy} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.16"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9 + i * 0.1, duration: 0.5 }} />
                        <motion.line x1={cx} y1={cy} x2={x3} y2={y3} stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.16"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1 + i * 0.1, duration: 0.5 }} />
                        <motion.circle cx={cx} cy={cy} r="4" fill="currentColor"
                            animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.2 }} />
                    </g>
                );
            })}
            {/* Energy packets */}
            {BRANCHES.slice(0, 6).map(({ a, len }, i) => {
                const rad = (a * Math.PI) / 180;
                return (
                    <motion.circle key={i} r="3.5" fill="currentColor" filter="url(#glow-sm)"
                        animate={{ x: [240, 240 + len * Math.cos(rad)], y: [240, 240 + len * Math.sin(rad)], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.32, ease: 'easeIn' }} />
                );
            })}
            {/* Spinning dashed ring */}
            <motion.circle cx="240" cy="240" r="32" stroke="currentColor" strokeWidth="1.2" fill="none"
                strokeDasharray="5 7" strokeOpacity="0.5"
                animate={{ rotate: 360 }} style={{ transformOrigin: '240px 240px' }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
            {/* Core */}
            <circle cx="240" cy="240" r="18" fill="currentColor" fillOpacity="0.9" filter="url(#glow)" />
            <circle cx="240" cy="240" r="10" fill="currentColor" />
        </svg>
    );
}

/* ─────────────── 4. PRODUCTION ─────────────── */
const FRAMES = [
    { x: 60, y: 70, w: 175, h: 85, label: 'Header Component' },
    { x: 60, y: 175, w: 120, h: 75, label: 'Nav Item' },
    { x: 200, y: 175, w: 235, h: 75, label: 'Content Block' },
    { x: 60, y: 270, w: 375, h: 70, label: 'Footer Grid' },
];
function ProductionArt() {
    return (
        <svg viewBox="0 0 480 400" fill="none" className="w-full h-full">
            <SharedDefs />
            <defs>
                <linearGradient id="lg-scan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                    <stop offset="45%" stopColor="currentColor" stopOpacity="0.55" />
                    <stop offset="55%" stopColor="currentColor" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* Blueprint grid */}
            {Array.from({ length: 11 }, (_, i) => (
                <line key={`v${i}`} x1={40 + i * 40} y1="20" x2={40 + i * 40} y2="380" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.06" />
            ))}
            {Array.from({ length: 9 }, (_, i) => (
                <line key={`h${i}`} x1="20" y1={40 + i * 40} x2="460" y2={40 + i * 40} stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.06" />
            ))}
            {/* Outer frame */}
            <motion.rect x="40" y="40" width="400" height="320" rx="3" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />
            {/* Inner frames */}
            {FRAMES.map((f, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.3, duration: 0.5 }}>
                    <rect x={f.x} y={f.y} width={f.w} height={f.h} rx="2"
                        stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" fill="currentColor" fillOpacity="0.04" />
                    <text x={f.x + 10} y={f.y + 14} fontSize="7.5" fill="currentColor" fillOpacity="0.32" fontFamily="monospace">{f.label}</text>
                    <line x1={f.x + 10} y1={f.y + 30} x2={f.x + f.w - 15} y2={f.y + 30} stroke="currentColor" strokeWidth="1" strokeOpacity="0.14" />
                    <line x1={f.x + 10} y1={f.y + 46} x2={f.x + f.w * 0.55} y2={f.y + 46} stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" />
                </motion.g>
            ))}
            {/* Scan bar */}
            <motion.rect x="20" width="440" height="28" fill="url(#lg-scan)" filter="url(#glow-sm)"
                animate={{ y: [20, 375, 20] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }} />
            {/* Dimension annotations */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                <line x1="450" y1="70" x2="450" y2="155" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="2 3" />
                <text x="458" y="120" fontSize="7" fill="currentColor" fillOpacity="0.4" fontFamily="monospace">85px</text>
            </motion.g>
        </svg>
    );
}

/* ─────────────── 5. COLLAB ─────────────── */
const PEERS = [
    { cx: 160, cy: 160, delay: 0 },
    { cx: 320, cy: 160, delay: 0.4 },
    { cx: 160, cy: 320, delay: 0.8 },
    { cx: 320, cy: 320, delay: 1.2 },
];
function CollabArt() {
    return (
        <svg viewBox="0 0 480 480" fill="none" className="w-full h-full">
            <SharedDefs />
            <defs>
                <radialGradient id="rg-collab-center" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>
            </defs>
            {/* Peer circles */}
            {PEERS.map((p, i) => (
                <motion.g key={i} animate={{ scale: [1, 1.05, 1] }} style={{ transformOrigin: `${p.cx}px ${p.cy}px` }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}>
                    <circle cx={p.cx} cy={p.cy} r="90" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
                    <circle cx={p.cx} cy={p.cy} r="10" fill="currentColor" fillOpacity="0.7" />
                    {/* Arc to center */}
                    <motion.path d={`M${p.cx} ${p.cy} Q240 ${p.cy > 240 ? 200 : 280},240 240`}
                        stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 5" strokeOpacity="0.3" fill="none"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 + i * 0.2, duration: 1 }} />
                </motion.g>
            ))}
            {/* Synergy center */}
            <circle cx="240" cy="240" r="60" fill="url(#rg-collab-center)" />
            {[40, 65, 95].map((r, i) => (
                <motion.circle key={i} cx="240" cy="240" r={r} stroke="currentColor" strokeWidth="1" fill="none"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }} style={{ transformOrigin: '240px 240px' }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }} />
            ))}
            {/* Interlocking rings geometry */}
            <motion.circle cx="240" cy="240" r="50" stroke="currentColor" strokeWidth="1.5" fill="none" strokeOpacity="0.5"
                animate={{ rotate: 360 }} style={{ transformOrigin: '240px 240px' }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} strokeDasharray="8 12" />
            <motion.circle cx="240" cy="240" r="50" stroke="currentColor" strokeWidth="1" fill="none" strokeOpacity="0.3"
                animate={{ rotate: -360 }} style={{ transformOrigin: '240px 240px' }}
                transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} strokeDasharray="4 16" />
            <circle cx="240" cy="240" r="16" fill="currentColor" filter="url(#glow)" />
            <circle cx="240" cy="240" r="8" fill="currentColor" />
        </svg>
    );
}

/* ─────────────── Slide ─────────────── */
type ArtComp = () => React.ReactElement;
interface SlideProps {
    title: string; desc: string; index: number; Art: ArtComp;
    rawProgress: ReturnType<typeof useSpring>;
}

function ProgressDot({ index, prog }: { index: number; prog: ReturnType<typeof useSpring> }) {
    const isLast = index === 4;
    const opacity = useTransform(prog,
        [index * 0.2, index * 0.2 + 0.04, isLast ? 1 : (index + 1) * 0.2 - 0.04, isLast ? 1 : (index + 1) * 0.2],
        [0.2, 1, 1, isLast ? 1 : 0.2]
    );
    const h = useTransform(prog, [index * 0.2, (index + 1) * 0.2], ['0%', '100%']);
    return (
        <div className="w-px h-10 bg-border/50 rounded-full overflow-hidden relative">
            <motion.div className="w-full bg-foreground rounded-full absolute bottom-0" style={{ height: h, opacity }} />
        </div>
    );
}

function Slide({ title, desc, index, Art, rawProgress }: SlideProps) {
    const isLast = index === 4;
    const opacity = useTransform(rawProgress,
        [
            index === 0 ? 0 : index * 0.2,
            index === 0 ? 0.001 : index * 0.2 + 0.04,
            isLast ? 1 : (index + 1) * 0.2 - 0.04,
            isLast ? 1 : (index + 1) * 0.2
        ],
        [index === 0 ? 1 : 0, 1, 1, isLast ? 1 : 0]
    );
    const textX = useTransform(rawProgress, [index * 0.2, index * 0.2 + 0.06], [index === 0 ? 10 : 30, 0]);
    const artScale = useTransform(rawProgress, [index * 0.2, index * 0.2 + 0.06], [index === 0 ? 0.95 : 0.9, 1]);

    return (
        <motion.div style={{ opacity, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0 64px' }}>
            {/* Text panel — slightly wider to ensure single-line titles */}
            <motion.div style={{ x: textX, width: '45%', flexShrink: 0, paddingRight: '40px' }}>
                <div style={{ fontSize: '110px', fontWeight: 800, lineHeight: 0.8, opacity: 0.04, letterSpacing: '-6px', userSelect: 'none', color: 'currentcolor', marginBottom: '-20px' }}>
                    {String(index + 1).padStart(2, '0')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, color: 'var(--foreground)', margin: 0, whiteSpace: 'nowrap' }}>{title}</h3>
                    <p style={{ fontSize: '1.05rem', color: 'var(--muted-foreground)', lineHeight: 1.7, margin: 0, wordBreak: 'keep-all', overflowWrap: 'break-word' }}>{desc}</p>
                </div>
            </motion.div>
            {/* Art panel — fills remaining 55%, full height */}
            <motion.div style={{ scale: artScale, flex: 1, minWidth: 0, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground)', padding: '20px 0' }}>
                <Art />
            </motion.div>
        </motion.div>
    );
}

/* ─────────────── Main Component ─────────────── */
const ITEMS = [
    { key: 'domain', Art: DomainArt },
    { key: 'data', Art: DataArt },
    { key: 'ai', Art: AIArt },
    { key: 'production', Art: ProductionArt },
    { key: 'collab', Art: CollabArt },
] as const;

export function CoreCompetencies({ translations }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 0.1', 'end end'] });
    const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 25, restDelta: 0.001 });

    return (
        <div ref={containerRef} style={{ height: '550vh', maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                {/* Background depth glow */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse 55% 55% at 75% 50%, var(--muted), transparent)'
                }} />
                {/* Slides */}
                {ITEMS.map(({ key, Art }, i) => (
                    <Slide key={key} index={i} title={translations[key].title} desc={translations[key].desc}
                        Art={Art} rawProgress={progress} />
                ))}
                {/* Right-edge progress track */}
                <div style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 20 }}>
                    {ITEMS.map((_, i) => <ProgressDot key={i} index={i} prog={progress} />)}
                </div>
            </div>
        </div>
    );
}
