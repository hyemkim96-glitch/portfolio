import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/theme-provider';
import { FloatingContact } from '@/components/floating-contact';
import { CustomCursor } from '@/components/custom-cursor';
import '@/app/globals.css';
import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hyemin.design';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const title = 'Hyemin Kim | UX/UI Designer';
    const description = locale === 'ko'
        ? 'B2B LaaS, 가전, 차량용 HMI 등 다양한 도메인에서 5년+ 경력을 쌓아온 UX/UI 디자이너 김혜민의 포트폴리오입니다.'
        : 'Portfolio of Hyemin Kim, a UX/UI Designer with 5+ years of experience in Automotive HMI, Healthcare, and B2B SaaS.';

    return {
        title,
        description,
        metadataBase: new URL(SITE_URL),
        alternates: {
            canonical: `${SITE_URL}/${locale}`,
            languages: {
                'ko': `${SITE_URL}/ko`,
                'en': `${SITE_URL}/en`,
            },
        },
        openGraph: {
            title,
            description,
            url: `${SITE_URL}/${locale}`,
            siteName: 'Hyemin Kim Portfolio',
            locale: locale === 'ko' ? 'ko_KR' : 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

export function generateStaticParams() {
    return [{ locale: 'ko' }, { locale: 'en' }];
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="data-theme"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <NextIntlClientProvider messages={messages}>
                        {children}
                        <FloatingContact />
                        <CustomCursor />
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
