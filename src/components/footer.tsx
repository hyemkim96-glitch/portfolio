'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

export function Footer() {
    const t = useTranslations('Common')
    const locale = useLocale()
    const currentYear = new Date().getFullYear()

    return (
        <footer className="mt-auto border-t border-border bg-muted/30 py-8">
            <div className="mx-auto max-w-5xl px-6 sm:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <span>© {currentYear} Hyemin Kim</span>
                    <div className="flex items-center gap-6">
                        <Link href={`/${locale}/portfolio`} className="hover:text-foreground transition-colors">{t('portfolio')}</Link>
                        <Link href={`/${locale}/contact`} className="hover:text-foreground transition-colors">{t('contact')}</Link>
                        <a href="https://drive.google.com/file/d/1ixfvxceh_CsJ6phMqhGQA-JNm53gWdbZ/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">{t('resume')}</a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
                        <a href="https://www.linkedin.com/in/hyemin-kim-bb2a0123a" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
