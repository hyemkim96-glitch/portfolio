'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { DriveFile } from './artwork-gallery';

interface Props {
    files: DriveFile[];
    label: string;
}

function imgUrl(id: string) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
}

export function ProjectSlideshow({ files, label }: Props) {
    const [open, setOpen] = useState(false);
    const [idx, setIdx] = useState(0);

    const close = useCallback(() => setOpen(false), []);
    const prev = useCallback(() => setIdx(i => (i === 0 ? files.length - 1 : i - 1)), [files.length]);
    const next = useCallback(() => setIdx(i => (i + 1) % files.length), [files.length]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, close, prev, next]);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    if (files.length === 0) return null;

    return (
        <>
            <button
                onClick={() => { setIdx(0); setOpen(true); }}
                className="inline-flex items-center border border-foreground/40 rounded-full px-4 py-1.5 text-xs font-medium text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
            >
                {label}
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
                    onClick={close}
                >
                    {/* Close */}
                    <button
                        onClick={close}
                        className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-md transition-colors"
                        aria-label="닫기"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Prev */}
                    {files.length > 1 && (
                        <button
                            onClick={e => { e.stopPropagation(); prev(); }}
                            className="absolute left-4 p-2 text-muted-foreground hover:text-foreground rounded-md transition-colors"
                            aria-label="이전"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                    )}

                    {/* Image */}
                    <div
                        className="max-w-5xl max-h-[90vh] w-full mx-16 flex items-center justify-center"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            key={idx}
                            src={imgUrl(files[idx].id)}
                            alt={files[idx].name}
                            className="max-w-full max-h-[85vh] object-contain"
                        />
                    </div>

                    {/* Next */}
                    {files.length > 1 && (
                        <button
                            onClick={e => { e.stopPropagation(); next(); }}
                            className="absolute right-4 p-2 text-muted-foreground hover:text-foreground rounded-md transition-colors"
                            aria-label="다음"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    )}

                    {/* Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                        {idx + 1} / {files.length}
                    </div>
                </div>
            )}
        </>
    );
}
