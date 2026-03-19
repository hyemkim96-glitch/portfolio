'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChatbotModal } from './chatbot-modal'

export function FloatingContact() {
    const [visible, setVisible] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <>
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="fixed bottom-8 right-6 z-40 sm:right-8"
                    >
                        <button
                            onClick={() => setModalOpen(true)}
                            className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:opacity-80 transition-opacity"
                        >
                            Say hello →
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <ChatbotModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </>
    )
}
