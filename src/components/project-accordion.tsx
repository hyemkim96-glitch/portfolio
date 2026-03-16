'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';
import type { DriveFile } from './artwork-gallery';

export interface ProjectItem {
    key: string;
    index: number;
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
    const [openKey, setOpenKey] = useState<string | null>(null);
    const [lightbox, setLightbox] = useState<DriveFile | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const savedScrollY = useRef<number>(0);

    const open = (key: string) => {
        savedScrollY.current = window.scrollY;
        setOpenKey(key);
    };

    const close = () => {
        setOpenKey(null);
        requestAnimationFrame(() => window.scrollTo({ top: savedScrollY.current, behavior: 'instant' }));
    };

    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (openKey && !lightbox && containerRef.current && !containerRef.current.contains(e.target as Node)) {
                close();
            }
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openKey, lightbox]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
        if (lightbox) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [lightbox]);

    return (
        <>
        <div ref={containerRef}>
            {items.map((item) => {
                const isOpen = openKey === item.key;
                const hasFiles = item.files.length > 0;

                return (
                    <BlurFade key={item.key} delay={0.05 + item.index * 0.07} inView>
                        <div className="border-t border-border">
                            {/* Row header */}
                            <div
                                className={`py-8 flex flex-col sm:flex-row sm:items-start gap-6 -mx-6 sm:-mx-8 px-6 sm:px-8 transition-colors hover:bg-muted/30 ${hasFiles ? 'cursor-pointer' : 'cursor-default'}`}
                                onClick={() => { if (hasFiles) { isOpen ? close() : open(item.key); } }}
                            >
                                <span className="text-xs text-muted-foreground font-mono w-8 shrink-0 mt-1">
                                    {String(item.index + 1).padStart(2, '0')}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                        <p className="text-base font-bold text-foreground whitespace-pre-line">{item.subtitle}</p>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-xs text-muted-foreground">{item.period}</span>
                                            {hasFiles && (
                                                <span className="text-sm text-muted-foreground select-none w-4 text-center">
                                                    {isOpen ? '−' : '+'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                                    {item.isPrivate && (
                                        <div className="mt-4">
                                            <span className="inline-flex items-center border border-border rounded-full px-4 py-1.5 text-xs text-muted-foreground">
                                                {privateNote}
                                            </span>
                                        </div>
                                    )}
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
                                            onClick={close}
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
