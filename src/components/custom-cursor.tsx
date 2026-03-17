'use client';

import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
    const [pos, setPos] = useState({ x: -100, y: -100 });
    const [visible, setVisible] = useState(false);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const isClickable = (el: Element | null): boolean => {
            if (!el || el === document.documentElement) return false;
            const tag = el.tagName.toLowerCase();
            if (['a', 'button', 'select', 'label'].includes(tag)) return true;
            if (el instanceof HTMLElement) {
                const { cursor } = getComputedStyle(el);
                if (cursor === 'pointer') return true;
                const role = el.getAttribute('role');
                if (role === 'button' || role === 'link') return true;
            }
            return isClickable(el.parentElement);
        };

        const onMove = (e: MouseEvent) => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                setPos({ x: e.clientX, y: e.clientY });
                setVisible(isClickable(e.target as Element));
            });
        };

        const onLeave = () => setVisible(false);

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseleave', onLeave);
        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseleave', onLeave);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            className="fixed z-[9999] pointer-events-none flex items-center justify-center rounded-full bg-foreground text-background text-[12px] font-medium tracking-widest uppercase select-none"
            style={{
                width: '64px',
                height: '64px',
                left: pos.x - 32,
                top: pos.y - 32,
            }}
        >
            click
        </div>
    );
}
