'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';
import type { DriveFile } from './artwork-gallery';

export interface ProjectItem {
    key: string;
    index: number;
    title: string;
    subtitle: string;
    tags: string[];
    period: string;
    description: string;
    contribution?: string;
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

    return (
        <>
        <div ref={containerRef}>
            {items.map((item) => {
                const isOpen = openKeys.has(item.key);
                const hasFiles = item.files.length > 0;

                return (
                    <BlurFade key={item.key} delay={0.05 + item.index * 0.07} inView>
                        <div className="border-t border-border">
                            {/* Row header */}
                            <div
                                className={`py-10 -mx-6 sm:-mx-8 px-6 sm:px-8 transition-colors hover:bg-muted/30 ${hasFiles ? 'cursor-pointer' : 'cursor-default'}`}
                                onClick={() => { if (hasFiles) { isOpen ? closeItem(item.key) : openItem(item.key); } }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-6 md:gap-16">
                                    {/* Left: number + subtitle (big title) + title (badge) */}
                                    <div className="flex flex-col justify-start gap-3">
                                        <span className="text-xs text-muted-foreground font-mono">
                                            {String(item.index + 1).padStart(2, '0')}
                                        </span>
                                        <h3
                                            className="font-bold text-foreground leading-tight tracking-tight whitespace-pre-line"
                                            style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)' }}
                                        >
                                            {item.subtitle}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            {item.tags.map((tag) => (
                                                <span key={tag} className="inline-flex w-fit text-[10px] font-medium tracking-widest uppercase text-muted-foreground border border-border rounded-full px-2.5 py-1">
                                                    {tag}
                                                </span>
                                            ))}
                                            {item.contribution && (
                                                <span className="text-[10px] text-muted-foreground/70 font-mono ml-0.5">
                                                    {item.contribution}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: date + description + actions */}
                                    <div className="flex flex-col justify-start gap-3">
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
                                            <Image
                                                key={file.id}
                                                src={thumbUrl(file.id)}
                                                alt={file.name}
                                                width={1600}
                                                height={900}
                                                className="w-full h-auto cursor-zoom-in"
                                                style={{ height: 'auto' }}
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
                <Image
                    src={fullUrl(lightbox.id)}
                    alt={lightbox.name}
                    width={1920}
                    height={1080}
                    className="max-w-full max-h-screen object-contain"
                    style={{ width: 'auto', height: 'auto', maxHeight: '100vh', maxWidth: '100vw' }}
                    onClick={e => e.stopPropagation()}
                />
            </div>
        )}
    </>
    );
}
