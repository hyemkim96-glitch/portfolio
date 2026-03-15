import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { Button } from '@/components/ui/button';
import { Marquee } from '@/components/ui/marquee';
import { BlurFade } from '@/components/ui/blur-fade';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { ScrollIndicator } from '@/components/scroll-indicator';
import { CoreCompetencies } from '@/components/core-competencies';

const SKILLS = ['Figma', 'UX Research', 'IA Design', 'Design Systems', 'Motion Design', 'AI Design', 'Prototyping', 'Accessibility'];
const DOMAINS = ['Automotive HMI', 'Healthcare UX', 'B2B SaaS', 'SDV Cabin UX', 'Design Tokens', 'Service Design', 'Smart Factory', 'Interaction Design'];
const CORE_KEYS = ['domain', 'data', 'ai', 'production', 'collab'] as const;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations('Hero');
    const ab = await getTranslations('About');

    const coreTranslations = Object.fromEntries(
        CORE_KEYS.map((key) => [key, { title: ab(`core.${key}.title`), desc: ab(`core.${key}.desc`) }])
    ) as Record<typeof CORE_KEYS[number], { title: string; desc: string }>;

    return (
        <LayoutWrapper>
            {/* ── Top UX Skills Marquee Strip (Original restored to top) ── */}
            <div className="-mx-6 sm:-mx-8 border-b border-border py-6 space-y-4 bg-muted/30 overflow-hidden">
                <Marquee className="[--duration:40s] [--gap:3rem]" pauseOnHover>
                    {SKILLS.map((item) => (
                        <span key={item} className="text-sm font-medium text-muted-foreground px-6 shrink-0">
                            {item}
                        </span>
                    ))}
                </Marquee>
                <Marquee className="[--duration:35s] [--gap:3rem]" reverse pauseOnHover>
                    {DOMAINS.map((item) => (
                        <span key={item} className="text-sm font-medium text-muted-foreground/60 px-6 shrink-0">
                            {item}
                        </span>
                    ))}
                </Marquee>
            </div>

            {/* ── Hero ── */}
            <section
                className="pb-16 pt-12 min-h-[45vh] flex flex-col justify-center"
                style={{ position: 'relative' }}
            >
                <div className="space-y-8 max-w-2xl">
                    <BlurFade delay={0.05} duration={0.5}>
                        <div className="inline-flex items-center rounded-full border border-border bg-secondary px-4 py-1.5">
                            <AnimatedGradientText
                                colorFrom="#525252"
                                colorTo="#a3a3a3"
                                speed={0.6}
                                className="text-xs font-medium tracking-widest uppercase"
                            >
                                UX / UI Designer · 5+ Years
                            </AnimatedGradientText>
                        </div>
                    </BlurFade>

                    <BlurFade delay={0.1} duration={0.7}>
                        <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-[1.2] tracking-tight whitespace-pre-line">
                            {t('headline')}
                        </h1>
                    </BlurFade>

                    <BlurFade delay={0.25} duration={0.6}>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            {t('description')}
                        </p>
                    </BlurFade>

                    <BlurFade delay={0.35} duration={0.6}>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Button asChild size="lg">
                                <Link href={`/${locale}/portfolio`}>{t('viewPortfolio')}</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <a href="https://drive.google.com/file/d/1ixfvxceh_CsJ6phMqhGQA-JNm53gWdbZ/view?usp=sharing" target="_blank" rel="noopener noreferrer">{t('downloadResume')}</a>
                            </Button>
                        </div>
                    </BlurFade>
                </div>

                <ScrollIndicator />
            </section>

            {/* ── Core Competencies (Sticky Scroll) ── */}
            <div className="mt-8">
                <CoreCompetencies translations={coreTranslations} />
            </div>
        </LayoutWrapper>
    );
}
