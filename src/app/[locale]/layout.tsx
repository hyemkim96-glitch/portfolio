import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/theme-provider';
import { FloatingContact } from '@/components/floating-contact';
import '@/app/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Hyemin Portfolio | UX/UI Designer',
    description: 'Portfolio of Hyemin, a UX/UI Designer with 5.5 years of experience in Automotive, Healthcare, and B2B SaaS.',
};

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
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
