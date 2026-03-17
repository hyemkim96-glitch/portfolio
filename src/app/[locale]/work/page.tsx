import { getTranslations } from 'next-intl/server';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { BlurFade } from '@/components/ui/blur-fade';
import { ArtworkGallery, type DriveFile } from '@/components/artwork-gallery';

const PROJECT_KEYS = ['m8', 'sauna', 'ev', 'taste', 'sds'] as const;
const AI_SERVICE_KEYS = ['chartstory', 'vibecodingskillset'] as const;
const AI_SERVICE_URLS: Record<string, string> = {
    chartstory: 'https://chartstory.vercel.app/',
    vibecodingskillset: 'https://vibecodingskillset.vercel.app/',
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

export default async function WorkPage() {
    const t = await getTranslations('Work');
    const pt = await getTranslations('Portfolio');
    const at = await getTranslations('AISites');
    const files = await getDriveFiles();

    return (
        <LayoutWrapper>
            {/* ── Page Header ── */}
            <div className="pb-16 pt-4 border-b border-border mb-16">
                <BlurFade delay={0.05} duration={0.5}>
                    <p className="text-xs text-muted-foreground font-medium tracking-widest uppercase mb-4">
                        {t('eyebrow')}
                    </p>
                </BlurFade>
                <BlurFade delay={0.1} duration={0.6}>
                    <h1
                        className="font-bold text-foreground leading-[1.1] tracking-tight"
                        style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
                    >
                        {t('title')}
                    </h1>
                </BlurFade>
            </div>

            {/* ── UX/UI Projects ── */}
            <section className="mb-24">
                <BlurFade delay={0.05} inView>
                    <h2 className="text-base font-medium tracking-widest uppercase text-muted-foreground mb-3" style={{ fontFamily: 'PyeojinGothic' }}>
                        {t('projectsTitle')}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-10">{t('projectsDescription')}</p>
                </BlurFade>

                <div className="space-y-0">
                    {PROJECT_KEYS.map((key, i) => {
                        const title = pt(`projects.${key}.title`);
                        const subtitle = pt(`projects.${key}.subtitle`);
                        const period = pt(`projects.${key}.period`);
                        const description = pt(`projects.${key}.description`);
                        const deckUrl = key !== 'sds' ? pt(`projects.${key}.deckUrl`) : null;
                        const isPrivate = key === 'sds';

                        return (
                            <BlurFade key={key} delay={0.05 + i * 0.08} inView>
                                <div className="group border-t border-border py-8 flex flex-col sm:flex-row sm:items-start gap-6 hover:bg-muted/30 -mx-6 sm:-mx-8 px-6 sm:px-8 transition-colors">
                                    <span className="text-xs text-muted-foreground font-mono w-8 shrink-0 mt-1">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                            <div>
                                                <h3 className="text-xl font-bold text-foreground">{title}</h3>
                                                <p className="text-sm font-semibold text-muted-foreground whitespace-pre-line mt-0.5">{subtitle}</p>
                                            </div>
                                            <span className="text-xs text-muted-foreground shrink-0">{period}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
                                        {isPrivate ? (
                                            <span className="inline-flex items-center text-xs text-muted-foreground border border-border rounded-full px-3 py-1">
                                                {t('privateNote')}
                                            </span>
                                        ) : deckUrl ? (
                                            <a
                                                href={deckUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
                                            >
                                                {t('viewDeck')} →
                                            </a>
                                        ) : null}
                                    </div>
                                </div>
                            </BlurFade>
                        );
                    })}
                    <div className="border-t border-border" />
                </div>
            </section>

            {/* ── AI Artwork ── */}
            <section className="mb-24">
                <BlurFade delay={0.05} inView>
                    <div className="mb-10">
                        <h2 className="text-base font-medium tracking-widest uppercase text-muted-foreground mb-3" style={{ fontFamily: 'PyeojinGothic' }}>
                            {t('artworkTitle')}
                        </h2>
                        <p className="text-sm text-muted-foreground">{t('artworkDescription')}</p>
                    </div>
                </BlurFade>
                <ArtworkGallery files={files} />
            </section>

            {/* ── AI Services ── */}
            <section className="mb-16">
                <BlurFade delay={0.05} inView>
                    <div className="mb-10">
                        <h2 className="text-base font-medium tracking-widest uppercase text-muted-foreground mb-3" style={{ fontFamily: 'PyeojinGothic' }}>
                            {t('servicesTitle')}
                        </h2>
                        <p className="text-sm text-muted-foreground">{t('servicesDescription')}</p>
                    </div>
                </BlurFade>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {AI_SERVICE_KEYS.map((key, i) => (
                        <BlurFade key={key} delay={0.1 + i * 0.1} inView>
                            <div className="group border border-border rounded-xl p-6 hover:border-foreground/20 transition-colors bg-card">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <h3 className="text-lg font-bold text-foreground">
                                        {at(`sites.${key}.name`)}
                                    </h3>
                                    <a
                                        href={AI_SERVICE_URLS[key]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-full px-3 py-1"
                                    >
                                        {t('visitSite')} ↗
                                    </a>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {at(`sites.${key}.description`)}
                                </p>
                            </div>
                        </BlurFade>
                    ))}
                </div>
            </section>
        </LayoutWrapper>
    );
}
