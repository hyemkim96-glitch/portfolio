'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'

export function FloatingContact() {
    const locale = useLocale()
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="fixed bottom-8 right-6 z-50 sm:right-8"
                >
                    <Link
                        href={`/${locale}#contact`}
                        className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:opacity-80 transition-opacity"
                    >
                        Say hello →
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
