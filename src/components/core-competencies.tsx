'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BlurFade } from '@/components/ui/blur-fade';

interface Comp { title: string; desc: string; }
interface Props {
    translations: { domain: Comp; data: Comp; ai: Comp; production: Comp; collab: Comp; };
}

const KEYS = ['domain', 'data', 'ai', 'production', 'collab'] as const;
type CompKey = typeof KEYS[number];

const TAGS: Record<CompKey, string> = {
    domain: 'Multi-Domain',
    data: 'Research',
    ai: 'AI Workflow',
    production: 'Delivery',
    collab: 'Teamwork',
};

/**
 * 이미지 경로를 여기에 채워주세요.
 * 예: domain: '/images/competency-domain.jpg'
 * 이미지가 없으면 null로 두면 플레이스홀더가 표시됩니다.
 */
const IMAGES: Record<CompKey, string | null> = {
    domain: null,
    data: null,
    ai: null,
    production: null,
    collab: null,
};

export function CoreCompetencies({ translations }: Props) {
    const [hoveredKey, setHoveredKey] = useState<CompKey | null>(null);

    return (
        <section className="py-16">
            <BlurFade delay={0.05} inView>
                <p className="text-base text-muted-foreground font-medium tracking-widest uppercase mb-12">
                    핵심 역량
                </p>
            </BlurFade>

            <div className="relative">
                {KEYS.map((key, i) => (
                    <BlurFade key={key} delay={0.05 + i * 0.07} inView>
                        <div
                            className="group border-t border-border py-10 grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-6 md:gap-16 hover:bg-muted/30 -mx-6 sm:-mx-8 px-6 sm:px-8 transition-colors cursor-default"
                            onMouseEnter={() => setHoveredKey(key)}
                            onMouseLeave={() => setHoveredKey(null)}
                        >
                            {/* Left: number + title */}
                            <div className="flex flex-col justify-center gap-3">
                                <span className="text-xs text-muted-foreground font-mono">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <h3
                                    className="font-bold text-foreground leading-tight tracking-tight"
                                    style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)' }}
                                >
                                    {translations[key].title}
                                </h3>
                                <span className="inline-flex w-fit text-[12px] font-medium tracking-widest uppercase text-muted-foreground border border-border rounded-full px-2.5 py-1">
                                    {TAGS[key]}
                                </span>
                            </div>

                            {/* Right: description */}
                            <div className="flex items-center">
                                <p
                                    className="text-sm md:text-base text-muted-foreground leading-relaxed"
                                    style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
                                >
                                    {translations[key].desc}
                                </p>
                            </div>
                        </div>
                    </BlurFade>
                ))}
                <div className="border-t border-border" />

                {/* Hover image preview — fixed to right side of viewport */}
                <AnimatePresence>
                    {hoveredKey && (
                        <motion.div
                            key={hoveredKey}
                            initial={{ opacity: 0, x: 16, scale: 0.96 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 16, scale: 0.96 }}
                            transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
                            className="hidden lg:block fixed right-10 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
                        >
                            <div className="w-72 xl:w-80 aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-muted shadow-2xl">
                                {IMAGES[hoveredKey] ? (
                                    <img
                                        src={IMAGES[hoveredKey]!}
                                        alt={translations[hoveredKey].title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    /* 이미지 준비 전 플레이스홀더 */
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <path d="m21 15-5-5L5 21" />
                                        </svg>
                                        <span className="text-xs font-mono tracking-widest uppercase">
                                            {TAGS[hoveredKey]}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
