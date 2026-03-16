import { getTranslations } from 'next-intl/server';
import { GNB } from '@/components/gnb';
import { Button } from '@/components/ui/button';
import { Marquee } from '@/components/ui/marquee';
import { BlurFade } from '@/components/ui/blur-fade';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { ScrollIndicator } from '@/components/scroll-indicator';
import { CoreCompetencies } from '@/components/core-competencies';
import { ArtworkGallery, type DriveFile } from '@/components/artwork-gallery';

const SKILLS = ['Figma', 'UX Research', 'IA Design', 'Design Systems', 'Motion Design', 'AI Design', 'Prototyping', 'Accessibility'];
const DOMAINS = ['Automotive HMI', 'Healthcare UX', 'B2B SaaS', 'SDV Cabin UX', 'Design Tokens', 'Service Design', 'Smart Factory', 'Interaction Design'];
const CORE_KEYS = ['domain', 'data', 'ai', 'production', 'collab'] as const;
const PROJECT_KEYS = ['m8', 'sauna', 'ev', 'taste', 'sds'] as const;
const AI_SERVICE_KEYS = ['chartstory', 'vibecodingskillset'] as const;
const AI_SERVICE_URLS: Record<string, string> = {
    chartstory: 'https://chartstory.vercel.app/',
    vibecodingskillset: 'https://vibecodingskillset.vercel.app/',
};
const PROJECT_THUMBNAILS: Record<string, string | null> = {
    m8: '/M8.png',
    sauna: '/saunabooth.png',
    ev: '/evcharging.png',
    taste: '/platform.png',
    sds: null,
};

async function getDriveFiles(): Promise<DriveFile[]> {
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
    const folderId = process.env.GOOGLE_DRIVE_ARTWORK_FOLDER_ID;
    if (!apiKey || !folderId) return [];
    try {
        const params = new URLSearchParams({
            q: `'${folderId}' in parents and trashed=false`,
            key: apiKey,
            fields: 'files(id,name,mimeType)',
            orderBy: 'createdTime desc',
            pageSize: '100',
        });
        const res = await fetch(
            `https://www.googleapis.com/drive/v3/files?${params}`,
            { next: { revalidate: 300 } }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return data.files ?? [];
    } catch {
        return [];
    }
}

export default async function HomePage() {
    const t = await getTranslations('Hero');
    const ab = await getTranslations('About');
    const ct = await getTranslations('ContactSection');
    const wt = await getTranslations('Work');
    const pt = await getTranslations('Portfolio');
    const at = await getTranslations('AISites');

    const coreTranslations = Object.fromEntries(
        CORE_KEYS.map((key) => [key, { title: ab(`core.${key}.title`), desc: ab(`core.${key}.desc`) }])
    ) as Record<typeof CORE_KEYS[number], { title: string; desc: string }>;

    const files = await getDriveFiles();

    return (
        <div className="flex flex-col bg-background">
            <GNB />

            {/* ═══════════════════════════════════════
                SECTION 1 — HERO
            ═══════════════════════════════════════ */}
            <section
                id="hero"
                className="relative flex flex-col justify-center min-h-[100svh] px-6 sm:px-8"
                style={{ paddingTop: '3.5rem' }}
            >
                <div className="mx-auto w-full max-w-5xl">
                    <div className="space-y-8 max-w-3xl">
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
                            <h1
                                className="font-bold text-foreground whitespace-pre-line leading-[1.15] tracking-tight"
                                style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)', wordBreak: 'keep-all' }}
                            >
                                {t('headline')}
                            </h1>
                        </BlurFade>

                        <BlurFade delay={0.25} duration={0.6}>
                            <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                                {t('description')}
                            </p>
                        </BlurFade>

                        <BlurFade delay={0.35} duration={0.6}>
                            <div className="flex flex-wrap gap-3 pt-2">
                                <Button asChild size="lg">
                                    <a href="#work">{t('viewWork')}</a>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <a
                                        href="/portfolio.pdf"
                                        download="Hyemin_Portfolio.pdf"
                                    >
                                        {t('downloadResume')}
                                    </a>
                                </Button>
                            </div>
                        </BlurFade>
                    </div>
                </div>

                <ScrollIndicator />
            </section>

            {/* ── Marquee Strip ── */}
            <div className="border-y border-border py-6 space-y-4 bg-muted/30 overflow-hidden">
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

            {/* ── Core Competencies ── */}
            <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
                <CoreCompetencies translations={coreTranslations} />
            </div>

            {/* ═══════════════════════════════════════
                SECTION 2 — WORK
            ═══════════════════════════════════════ */}
            <section id="work" className="mt-24 border-t border-border">
                <div className="mx-auto max-w-5xl px-6 sm:px-8">

                    {/* Work Header */}
                    <div className="py-16 border-b border-border">
                        <BlurFade delay={0.05} inView>
                            <h2
                                className="font-bold text-foreground leading-[1.1] tracking-tight"
                                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
                            >
                                {wt('title')}
                            </h2>
                        </BlurFade>
                    </div>

                    {/* UX/UI Projects */}
                    <div className="mt-12 mb-24">
                        <BlurFade delay={0.05} inView>
                            <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3">
                                {wt('projectsTitle')}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-10">{wt('projectsDescription')}</p>
                        </BlurFade>

                        <div className="space-y-0">
                            {PROJECT_KEYS.map((key, i) => {
                                const subtitle = pt(`projects.${key}.subtitle`);
                                const period = pt(`projects.${key}.period`);
                                const description = pt(`projects.${key}.description`);
                                const deckUrl = key !== 'sds' ? pt(`projects.${key}.deckUrl`) : null;
                                const isPrivate = key === 'sds';

                                const thumb = PROJECT_THUMBNAILS[key];
                                const rowClass = "group border-t border-border py-8 flex flex-col sm:flex-row sm:items-start gap-6 hover:bg-muted/30 -mx-6 sm:-mx-8 px-6 sm:px-8 transition-colors";
                                const rowInner = (
                                    <>
                                        <span className="text-xs text-muted-foreground font-mono w-8 shrink-0 mt-1">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-6">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                                    <p className="text-base font-bold text-foreground whitespace-pre-line">{subtitle}</p>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <span className="text-xs text-muted-foreground">{period}</span>
                                                        {isPrivate && (
                                                            <span className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1">
                                                                {wt('privateNote')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                                                {deckUrl && (
                                                    <div className="mt-4">
                                                        <span className="inline-flex items-center border border-foreground/40 rounded-full px-4 py-1.5 text-xs font-medium text-foreground group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-colors">
                                                            {wt('viewDeck')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {thumb && (
                                                <div className="w-full sm:w-48 aspect-video rounded-md overflow-hidden bg-muted shrink-0">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={thumb}
                                                        alt={subtitle}
                                                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </>
                                );

                                return (
                                    <BlurFade key={key} delay={0.05 + i * 0.07} inView>
                                        {deckUrl ? (
                                            <a href={deckUrl} target="_blank" rel="noopener noreferrer" className={rowClass}>{rowInner}</a>
                                        ) : (
                                            <div className={rowClass}>{rowInner}</div>
                                        )}
                                    </BlurFade>
                                );
                            })}
                            <div className="border-t border-border" />
                        </div>

                        {/* PDF CTA */}
                        <div className="mt-10 flex justify-start">
                            <a
                                href="/Hyemin_Portfolio.pdf"
                                download="Hyemin_Portfolio.pdf"
                                className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                            >
                                {wt('viewFullPdf')} ↓
                            </a>
                        </div>
                    </div>

                    {/* AI Artwork */}
                    <div className="mb-24">
                        <BlurFade delay={0.05} inView>
                            <div className="mb-10">
                                <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3">
                                    {wt('artworkTitle')}
                                </h3>
                                <p className="text-sm text-muted-foreground">{wt('artworkDescription')}</p>
                            </div>
                        </BlurFade>
                        <ArtworkGallery files={files} />
                    </div>

                    {/* AI Services */}
                    <div className="mb-24">
                        <BlurFade delay={0.05} inView>
                            <div className="mb-10">
                                <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3">
                                    {wt('servicesTitle')}
                                </h3>
                                <p className="text-sm text-muted-foreground">{wt('servicesDescription')}</p>
                            </div>
                        </BlurFade>

                        <div className="space-y-0">
                            {AI_SERVICE_KEYS.map((key, i) => (
                                <BlurFade key={key} delay={0.1 + i * 0.1} inView>
                                    <a
                                        href={AI_SERVICE_URLS[key]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-start gap-6 border-t border-border py-8 hover:bg-muted/30 -mx-6 sm:-mx-8 px-6 sm:px-8 transition-colors"
                                    >
                                        {/* Thumbnail */}
                                        <div className="w-36 sm:w-48 aspect-video rounded-md overflow-hidden bg-muted shrink-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={`https://api.microlink.io/?url=${encodeURIComponent(AI_SERVICE_URLS[key])}&screenshot=true&meta=false&embed=screenshot.url`}
                                                alt={at(`sites.${key}.name`)}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg font-bold text-foreground mb-2">{at(`sites.${key}.name`)}</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{at(`sites.${key}.description`)}</p>
                                            <span className="inline-flex items-center border border-foreground/40 rounded-full px-4 py-1.5 text-xs font-medium text-foreground group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-colors">
                                                {wt('visitSite')}
                                            </span>
                                        </div>
                                    </a>
                                </BlurFade>
                            ))}
                            <div className="border-t border-border" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                SECTION 3 — CONTACT
            ═══════════════════════════════════════ */}
            <section id="contact" className="bg-foreground text-background">
                <div className="mx-auto max-w-5xl px-6 sm:px-8 py-24">
                    <BlurFade delay={0.05} inView>
                        <h2
                            className="font-bold leading-[1.1] tracking-tight mb-8"
                            style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
                        >
                            {ct('headline')}
                        </h2>
                    </BlurFade>
                    <BlurFade delay={0.2} inView>
                        <p className="text-base mb-12" style={{ opacity: 0.6 }}>
                            {ct('available')}
                        </p>
                    </BlurFade>

                    <BlurFade delay={0.3} inView>
                        <div className="flex flex-wrap gap-4 mb-24">
                            <a
                                href="mailto:hyemkim0296@gmail.com"
                                className="inline-flex items-center gap-2 border border-background/30 px-6 py-3 rounded-full text-sm font-medium hover:bg-background hover:text-foreground transition-colors"
                            >
                                {ct('sendEmail')} →
                            </a>
                            <a
                                href="/resume.pdf"
                                download="이력서.pdf"
                                className="inline-flex items-center gap-2 border border-background/30 px-6 py-3 rounded-full text-sm font-medium hover:bg-background hover:text-foreground transition-colors"
                            >
                                {ct('viewResume')} →
                            </a>
                        </div>
                    </BlurFade>

                    <div
                        className="border-t pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                        style={{ borderColor: 'rgba(255,255,255,0.15)', opacity: 0.5 }}
                    >
                        <span>{ct('copyright')}</span>
                        <div className="flex items-center gap-6">
                            <a
                                href="https://www.linkedin.com/in/hyemin-kim-bb2a0123a"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-100 transition-opacity"
                            >
                                LinkedIn
                            </a>
                            <a
                                href="https://github.com/hyemkim96-glitch"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-100 transition-opacity"
                            >
                                GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
