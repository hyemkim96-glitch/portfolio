'use client';

import { useEffect, useState } from 'react';

export function ScrollIndicator() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY < 60);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            aria-hidden
            className="scroll-indicator-root"
            style={{
                position: 'fixed',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.5s ease',
                pointerEvents: 'none',
                zIndex: 50,
                animation: 'svg-fade-in 0.8s ease 0.9s both',
            }}
        >
            {/* Mouse shell */}
            <div
                style={{
                    width: '24px',
                    height: '38px',
                    borderRadius: '12px',
                    border: '2px solid var(--muted-foreground)',
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: '6px',
                    opacity: 0.7,
                }}
            >
                {/* Scroll wheel dot */}
                <div
                    style={{
                        width: '4px',
                        height: '8px',
                        borderRadius: '2px',
                        backgroundColor: 'var(--muted-foreground)',
                        animation: 'scroll-wheel 1.6s ease-in-out infinite',
                    }}
                />
            </div>

            {/* Chevrons */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    animation: 'scroll-chevron 1.6s ease-in-out infinite',
                }}
            >
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" style={{ opacity: 0.6 }}>
                    <path d="M1 1l5 5 5-5" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" style={{ opacity: 0.3 }}>
                    <path d="M1 1l5 5 5-5" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}
