'use client';

import { BlurFade } from '@/components/ui/blur-fade';

interface Comp { title: string; desc: string; }
interface Props {
    translations: { domain: Comp; data: Comp; ai: Comp; production: Comp; collab: Comp; };
}

const KEYS = ['domain', 'data', 'ai', 'production', 'collab'] as const;

const TAGS: Record<string, string> = {
    domain: 'Multi-Domain',
    data: 'Research',
    ai: 'AI Workflow',
    production: 'Delivery',
    collab: 'Teamwork',
};

export function CoreCompetencies({ translations }: Props) {
    return (
        <section className="py-16">
            <BlurFade delay={0.05} inView>
                <p className="text-sm text-muted-foreground font-medium tracking-widest uppercase mb-12">
                    핵심 역량
                </p>
            </BlurFade>

            <div>
                {KEYS.map((key, i) => (
                    <BlurFade key={key} delay={0.05 + i * 0.07} inView>
                        <div className="group border-t border-border py-10 grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-6 md:gap-16 hover:bg-muted/30 -mx-6 sm:-mx-8 px-6 sm:px-8 transition-colors cursor-default">
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
                                <span className="inline-flex w-fit text-[10px] font-medium tracking-widest uppercase text-muted-foreground border border-border rounded-full px-2.5 py-1">
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
            </div>
        </section>
    );
}
