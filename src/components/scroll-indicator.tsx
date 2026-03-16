'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function ScrollIndicator() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY < 60);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    aria-hidden
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.6, delay: 1.2, ease: [0.65, 0, 0.35, 1] }}
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        pointerEvents: 'none',
                        zIndex: 50,
                    }}
                >
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
                    >
                        <div style={{
                            width: '24px',
                            height: '38px',
                            borderRadius: '12px',
                            border: '2px solid var(--muted-foreground)',
                            display: 'flex',
                            justifyContent: 'center',
                            paddingTop: '6px',
                            opacity: 0.65,
                        }}>
                            <motion.div
                                animate={{ y: [0, 8, 0], opacity: [1, 0.15, 1] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                                style={{
                                    width: '4px',
                                    height: '8px',
                                    borderRadius: '2px',
                                    backgroundColor: 'var(--muted-foreground)',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                            <motion.svg
                                width="12" height="7" viewBox="0 0 12 7" fill="none"
                                animate={{ opacity: [0.7, 0.15, 0.7] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
                            >
                                <path d="M1 1l5 5 5-5" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </motion.svg>
                            <motion.svg
                                width="12" height="7" viewBox="0 0 12 7" fill="none"
                                animate={{ opacity: [0.35, 0.7, 0.35] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                            >
                                <path d="M1 1l5 5 5-5" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </motion.svg>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
