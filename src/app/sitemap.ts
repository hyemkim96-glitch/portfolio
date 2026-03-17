import { MetadataRoute } from 'next';

const LOCALES = ['ko', 'en'] as const;
const ROUTES = ['', '/work', '/portfolio', '/contact', '/article', '/ai-artwork', '/ai-sites'];

export default function sitemap(): MetadataRoute.Sitemap {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hyemin.design';
    const entries: MetadataRoute.Sitemap = [];

    for (const locale of LOCALES) {
        for (const route of ROUTES) {
            entries.push({
                url: `${siteUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: route === '' ? 'weekly' : 'monthly',
                priority: route === '' ? 1 : 0.7,
            });
        }
    }

    return entries;
}
