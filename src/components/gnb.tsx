'use client'

import { useTheme } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export function GNB() {
    const t = useTranslations('Common')
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    const { theme, setTheme } = useTheme()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false)
    }, [pathname])

    // Prevent scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [isMenuOpen])

    const navItems = [
        { label: t('home'), href: `/${locale}` },
        { label: t('portfolio'), href: `/${locale}/portfolio` },
        { label: t('aiArtwork'), href: `/${locale}/ai-artwork` },
        { label: t('aiService'), href: `/${locale}/ai-sites` },
        { label: t('contact'), href: `/${locale}/contact` },
    ]

    const toggleLanguage = () => {
        const newLocale = locale === 'ko' ? 'en' : 'ko'
        const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
        router.push(newPath)
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6 sm:px-8">
                <div className="flex items-center gap-8">
                    <Link href={`/${locale}`} className="text-base font-bold tracking-tight text-foreground">
                        Hyemin.
                    </Link>
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-3 py-1.5 text-sm rounded-md transition-colors",
                                        isActive
                                            ? "text-foreground font-medium"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            )
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors uppercase"
                        title="Switch Language"
                    >
                        {locale === 'ko' ? 'EN' : 'KO'}
                    </button>
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors md:hidden"
                        title="Toggle Menu"
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 top-14 z-40 bg-background md:hidden">
                    <div className="flex flex-col p-6 gap-4">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "py-3 text-lg font-medium transition-colors border-b border-border/50",
                                        isActive ? "text-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            )
                        })}
                        <div className="pt-4">
                            <a
                                href="https://drive.google.com/file/d/1ixfvxceh_CsJ6phMqhGQA-JNm53gWdbZ/view?usp=sharing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center py-3 bg-primary text-primary-foreground rounded-md font-medium"
                            >
                                {t('resume')}
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
