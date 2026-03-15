import { getTranslations } from 'next-intl/server';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

const MY_SITES = [
    { key: 'chartstory', url: 'https://chartstory.vercel.app/' },
    { key: 'vibecodingskillset', url: 'https://vibecodingskillset.vercel.app/' },
];

export default async function AISitesPage() {
    const t = await getTranslations('AISites');

    return (
        <LayoutWrapper>
            <section className="py-12">
                <div className="mb-10 space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
                    <p className="text-muted-foreground">{t('description')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MY_SITES.map((site) => (
                        <Card
                            key={site.key}
                            className="group border-border shadow-none hover:border-foreground/20 transition-colors"
                        >
                            <CardContent className="p-6 flex flex-col gap-3 h-full">
                                <h3 className="font-semibold text-foreground">
                                    {t(`sites.${site.key}.name`)}
                                </h3>
                                <p className="text-sm text-muted-foreground flex-grow leading-relaxed">
                                    {t(`sites.${site.key}.description`)}
                                </p>
                                <a
                                    href={site.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2 w-fit"
                                >
                                    {t('visitSite')}
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </a>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </LayoutWrapper>
    );
}
