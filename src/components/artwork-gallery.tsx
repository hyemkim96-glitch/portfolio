'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
}

interface Props {
    files: DriveFile[];
}

function isVideo(mimeType: string) {
    return mimeType.startsWith('video/');
}

function thumbnailUrl(id: string) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=w600`;
}

function fullUrl(id: string) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;
}

function previewUrl(id: string) {
    return `https://drive.google.com/file/d/${id}/preview`;
}

export function ArtworkGallery({ files }: Props) {
    const [selected, setSelected] = useState<number | null>(null);

    const close = useCallback(() => setSelected(null), []);
    const prev = useCallback(() =>
        setSelected(i => (i === null || i === 0 ? files.length - 1 : i - 1)), [files.length]);
    const next = useCallback(() =>
        setSelected(i => (i === null ? 0 : (i + 1) % files.length)), [files.length]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (selected === null) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [selected, close, prev, next]);

    // Lock body scroll when lightbox is open
    useEffect(() => {
        document.body.style.overflow = selected !== null ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [selected]);

    if (files.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                아직 업로드된 아트워크가 없습니다.
            </p>
        );
    }

    const current = selected !== null ? files[selected] : null;

    return (
        <>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {files.map((file, i) => (
                    <button
                        key={file.id}
                        onClick={() => setSelected(i)}
                        className="group relative aspect-square overflow-hidden rounded-md border border-border bg-muted hover:border-foreground/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={file.name}
                    >
                        {isVideo(file.mimeType) ? (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                                <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    <span className="text-xs truncate max-w-[80%]">{file.name}</span>
                                </div>
                            </div>
                        ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={thumbnailUrl(file.id)}
                                alt={file.name}
                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                                loading="lazy"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            {current && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
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

                    {/* Media */}
                    <div
                        className="max-w-5xl max-h-[90vh] w-full mx-16 flex items-center justify-center"
                        onClick={e => e.stopPropagation()}
                    >
                        {isVideo(current.mimeType) ? (
                            <iframe
                                src={previewUrl(current.id)}
                                className="w-full aspect-video rounded-md border border-border"
                                allow="autoplay"
                                allowFullScreen
                            />
                        ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={fullUrl(current.id)}
                                alt={current.name}
                                className="max-w-full max-h-[85vh] object-contain rounded-md"
                            />
                        )}
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
                    {selected !== null && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                            {selected + 1} / {files.length}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
