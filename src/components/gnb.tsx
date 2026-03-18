'use client'

import { useTheme } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { Sun, Moon, Menu, X, SquareArrowOutUpRight } from 'lucide-react'
import { useState, useEffect } from 'react'

export function GNB() {
    const t = useTranslations('Common')
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    const { theme, setTheme } = useTheme()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState('hero')

    const isHome = pathname === `/${locale}` || pathname === `/${locale}/`

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY
            setScrolled(y > 40)

            if (isHome) {
                const workEl = document.getElementById('work')
                if (workEl) {
                    setActiveSection(
                        workEl.getBoundingClientRect().top <= window.innerHeight * 0.4 ? 'work' : 'hero'
                    )
                }
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener('scroll', onScroll)
    }, [isHome])

    useEffect(() => {
        setIsMenuOpen(false)
    }, [pathname])

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isMenuOpen])

    const toggleLanguage = () => {
        const newLocale = locale === 'ko' ? 'en' : 'ko'
        const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
        router.push(newPath)
    }

    const navItems = [
        { label: t('home'), href: isHome ? '#hero' : `/${locale}`, sectionId: 'hero', isArticle: false },
        { label: t('work'), href: isHome ? '#work' : `/${locale}#work`, sectionId: 'work', isArticle: false },
        { label: t('article'), href: null, sectionId: null, isArticle: true },
    ]

    const navBg = isHome && !scrolled
        ? 'bg-transparent border-transparent'
        : 'bg-background/90 backdrop-blur-md border-border'

    return (
        <nav className={cn('sticky top-0 z-50 w-full border-b transition-all duration-300', navBg)}>
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6 sm:px-8">
                <div className="flex items-center gap-8">
                    <a href={isHome ? '#hero' : `/${locale}`} className="text-base font-bold tracking-tight text-foreground">
                        Hyemin.
                    </a>
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            if (item.isArticle) {
                                return (
                                    <div key="article" className="relative group/article">
                                        <span
                                            className="px-3 py-1.5 text-sm rounded-md transition-colors text-muted-foreground cursor-default inline-flex items-center gap-1"
                                        >
                                            {item.label}
                                            <SquareArrowOutUpRight className="h-3 w-3" />
                                        </span>
                                        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2.5 py-1 text-xs bg-popover text-popover-foreground border border-border rounded-md whitespace-nowrap opacity-0 group-hover/article:opacity-100 pointer-events-none transition-opacity z-50 shadow-sm">
                                            {t('articleTooltip')}
                                        </span>
                                    </div>
                                )
                            }
                            const isActive = item.sectionId
                                ? isHome ? activeSection === item.sectionId : false
                                : false
                            return (
                                <a
                                    key={item.href}
                                    href={item.href!}
                                    className={cn(
                                        'px-3 py-1.5 text-sm rounded-md transition-colors',
                                        isActive
                                            ? 'text-foreground font-medium'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                    )}
                                >
                                    {item.label}
                                </a>
                            )
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors uppercase"
                    >
                        {locale === 'ko' ? 'EN' : 'KO'}
                    </button>
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors md:hidden"
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="fixed inset-0 top-14 z-40 bg-background md:hidden">
                    <div className="flex flex-col p-6 gap-4">
                        {navItems.map((item) => {
                            if (item.isArticle) {
                                return (
                                    <span
                                        key="article-mobile"
                                        className="py-3 text-lg font-medium border-b border-border/50 text-muted-foreground inline-flex items-center gap-2"
                                    >
                                        {item.label}
                                        <SquareArrowOutUpRight className="h-4 w-4" />
                                        <span className="text-xs font-normal">({t('articleTooltip')})</span>
                                    </span>
                                )
                            }
                            const isActive = item.sectionId
                                ? isHome && activeSection === item.sectionId
                                : false
                            return (
                                <a
                                    key={item.href}
                                    href={item.href!}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={cn(
                                        'py-3 text-lg font-medium transition-colors border-b border-border/50',
                                        isActive ? 'text-foreground' : 'text-muted-foreground'
                                    )}
                                >
                                    {item.label}
                                </a>
                            )
                        })}
                        <div className="pt-4">
                            <a
                                href="/resume.pdf"
                                download="이력서.pdf"
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
