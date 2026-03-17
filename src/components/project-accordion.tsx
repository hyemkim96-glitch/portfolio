'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';
import type { DriveFile } from './artwork-gallery';

export interface ProjectItem {
    key: string;
    index: number;
    title: string;
    subtitle: string;
    period: string;
    description: string;
    isPrivate: boolean;
    files: DriveFile[];
}

function thumbUrl(id: string) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
}

function fullUrl(id: string) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1920`;
}

function sortByName(files: DriveFile[]): DriveFile[] {
    return [...files].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

export function ProjectAccordion({
    items,
    privateNote,
}: {
    items: ProjectItem[];
    privateNote: string;
}) {
    const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());
    const [lightbox, setLightbox] = useState<DriveFile | null>(null);
    const [cursor, setCursor] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
    const containerRef = useRef<HTMLDivElement>(null);
    const savedScrollY = useRef<Map<string, number>>(new Map());

    const openItem = (key: string) => {
        savedScrollY.current.set(key, window.scrollY);
        setOpenKeys(prev => new Set([...prev, key]));
    };

    const closeItem = (key: string) => {
        const saved = savedScrollY.current.get(key) ?? window.scrollY;
        setOpenKeys(prev => { const next = new Set(prev); next.delete(key); return next; });
        requestAnimationFrame(() => window.scrollTo({ top: saved, behavior: 'instant' }));
    };

    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (openKeys.size > 0 && !lightbox && containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpenKeys(new Set());
            }
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, [openKeys, lightbox]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
        if (lightbox) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [lightbox]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        setCursor(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
    }, []);

    const handleMouseEnter = useCallback(() => {
        setCursor(prev => ({ ...prev, visible: true }));
    }, []);

    const handleMouseLeave = useCallback(() => {
        setCursor(prev => ({ ...prev, visible: false }));
    }, []);

    return (
        <>
        {/* Custom cursor */}
        {cursor.visible && (
            <div
                className="fixed z-50 pointer-events-none flex items-center justify-center rounded-full bg-foreground text-background text-[10px] font-medium tracking-widest uppercase"
                style={{
                    width: '64px',
                    height: '64px',
                    left: cursor.x - 32,
                    top: cursor.y - 32,
                    transition: 'opacity 0.15s',
                }}
            >
                click
            </div>
        )}

        <div ref={containerRef}>
            {items.map((item) => {
                const isOpen = openKeys.has(item.key);
                const hasFiles = item.files.length > 0;

                return (
                    <BlurFade key={item.key} delay={0.05 + item.index * 0.07} inView>
                        <div className="border-t border-border">
                            {/* Row header */}
                            <div
                                className={`py-10 -mx-6 sm:-mx-8 px-6 sm:px-8 transition-colors hover:bg-muted/30 ${hasFiles ? 'cursor-none' : 'cursor-default'}`}
                                onClick={() => { if (hasFiles) { isOpen ? closeItem(item.key) : openItem(item.key); } }}
                                onMouseMove={hasFiles ? handleMouseMove : undefined}
                                onMouseEnter={hasFiles ? handleMouseEnter : undefined}
                                onMouseLeave={hasFiles ? handleMouseLeave : undefined}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-6 md:gap-16">
                                    {/* Left: number + subtitle (big title) + title (badge) */}
                                    <div className="flex flex-col justify-center gap-3">
                                        <span className="text-xs text-muted-foreground font-mono">
                                            {String(item.index + 1).padStart(2, '0')}
                                        </span>
                                        <h3
                                            className="font-bold text-foreground leading-tight tracking-tight whitespace-pre-line"
                                            style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)' }}
                                        >
                                            {item.subtitle}
                                        </h3>
                                        <span className="inline-flex w-fit text-[10px] font-medium tracking-widest uppercase text-muted-foreground border border-border rounded-full px-2.5 py-1">
                                            {item.title}
                                        </span>
                                    </div>

                                    {/* Right: date + description + actions */}
                                    <div className="flex flex-col justify-center gap-3">
                                        <span className="text-xs text-muted-foreground">
                                            {item.period}
                                        </span>
                                        <p
                                            className="text-sm md:text-base text-muted-foreground leading-relaxed"
                                            style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
                                        >
                                            {item.description}
                                        </p>
                                        {item.isPrivate && (
                                            <span className="inline-flex w-fit items-center border border-border rounded-full px-4 py-1.5 text-xs text-muted-foreground">
                                                {privateNote}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded images */}
                            {isOpen && (
                                <div
                                    className="-mx-6 sm:-mx-8 px-6 sm:px-8 pb-12 border-t border-border/40"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <div className="flex flex-col gap-2 pt-4">
                                        {sortByName(item.files).map(file => (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                key={file.id}
                                                src={thumbUrl(file.id)}
                                                alt={file.name}
                                                className="w-full h-auto cursor-zoom-in"
                                                loading="lazy"
                                                onClick={e => { e.stopPropagation(); setLightbox(file); }}
                                            />
                                        ))}
                                    </div>
                                    <div className="mt-10 flex justify-center">
                                        <button
                                            onClick={() => closeItem(item.key)}
                                            className="inline-flex items-center border border-border rounded-full px-8 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                                        >
                                            닫기
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </BlurFade>
                );
            })}
            <div className="border-t border-border" />
        </div>

        {/* Lightbox */}
        {lightbox && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
                onClick={() => setLightbox(null)}
            >
                <button
                    onClick={() => setLightbox(null)}
                    className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-md transition-colors"
                    aria-label="닫기"
                >
                    <X className="h-5 w-5" />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={fullUrl(lightbox.id)}
                    alt={lightbox.name}
                    className="max-w-full max-h-screen object-contain"
                    style={{ width: '1920px', height: '1080px', objectFit: 'contain' }}
                    onClick={e => e.stopPropagation()}
                />
            </div>
        )}
    </>
    );
}
