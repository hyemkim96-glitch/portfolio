import { getTranslations } from 'next-intl/server';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { BlurFade } from '@/components/ui/blur-fade';

export default async function ArticlePage() {
    const t = await getTranslations('Article');

    return (
        <LayoutWrapper>
            <section className="min-h-[60vh] flex flex-col justify-center py-24">
                <BlurFade delay={0.05} duration={0.5}>
                    <p className="text-xs text-muted-foreground font-medium tracking-widest uppercase mb-6">
                        {t('eyebrow')}
                    </p>
                </BlurFade>

                <BlurFade delay={0.1} duration={0.7}>
                    <h1
                        className="font-bold text-foreground leading-[1.1] tracking-tight mb-8"
                        style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
                    >
                        {t('title')}
                    </h1>
                </BlurFade>

                <BlurFade delay={0.2} duration={0.6}>
                    <p className="text-base text-muted-foreground mb-4 max-w-md">
                        {t('description')}
                    </p>
                </BlurFade>

                <BlurFade delay={0.3} duration={0.6}>
                    <p className="text-sm text-muted-foreground/70 max-w-md whitespace-pre-line leading-relaxed mb-10">
                        {t('comingSoon')}
                    </p>
                </BlurFade>

                <BlurFade delay={0.4} duration={0.6}>
                    <a
                        href="mailto:hyemkim0296@gmail.com"
                        className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
                    >
                        {t('notify')} →
                    </a>
                </BlurFade>
            </section>
        </LayoutWrapper>
    );
}
