'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, X } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';
import { cn } from '@/lib/utils';

type ProjectKey = 'm8' | 'sauna' | 'ev' | 'taste' | 'sds';

const PROJECTS: ProjectKey[] = ['m8', 'sauna', 'ev', 'taste', 'sds'];

export function ProjectGrid() {
    const t = useTranslations('Portfolio');
    const [selectedDeck, setSelectedDeck] = useState<string | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PROJECTS.map((key, index) => {
                    const isPrivate = t.raw(`projects.${key}.isPrivate`) === true;
                    const deckUrl = t.raw(`projects.${key}.deckUrl`);

                    return (
                        <BlurFade key={key} delay={0.1 * index} inView>
                            <Card className="h-full flex flex-col border-border hover:border-foreground/20 transition-all duration-300 shadow-none group">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[12px] uppercase tracking-wider text-muted-foreground font-medium">
                                                {t(`projects.${key}.period`)}
                                            </span>
                                        </div>
                                        {isPrivate && (
                                            <span className="flex items-center gap-1 text-[12px] uppercase tracking-wider text-destructive/70 font-bold">
                                                <Lock className="w-2.5 h-2.5" /> Confidential
                                            </span>
                                        )}
                                    </div>
                                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors whitespace-pre-line leading-relaxed">
                                        {t(`projects.${key}.subtitle`)}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="flex-grow">
                                    <p className={cn(
                                        "text-sm text-muted-foreground leading-relaxed transition-all duration-300",
                                        isPrivate && "blur-[4px] select-none opacity-50 bg-muted/20 rounded p-1"
                                    )}>
                                        {t(`projects.${key}.description`)}
                                    </p>
                                </CardContent>

                                <CardFooter className="pt-0 pb-6 px-6">
                                    {!isPrivate && deckUrl ? (
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="w-full transition-all"
                                            onClick={() => setSelectedDeck(deckUrl)}
                                        >
                                            {t('viewDeck')}
                                        </Button>
                                    ) : (
                                        <div className="w-full py-4 px-3 border border-dashed border-border rounded-md text-[12px] text-center text-muted-foreground/60 uppercase tracking-widest font-medium">
                                            Deck Restricted
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        </BlurFade>
                    );
                })}
            </div>

            {/* Modal for Figma Deck */}
            {selectedDeck && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm p-4 md:p-10 animate-in fade-in duration-300">
                    <div className="relative w-full h-full max-w-7xl flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-[12px] uppercase tracking-widest text-muted-foreground font-bold">Portfolio Viewer</h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-accent rounded-full"
                                onClick={() => setSelectedDeck(null)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <Card className="flex-grow overflow-hidden border-border bg-black shadow-2xl">
                            <iframe
                                src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(selectedDeck)}`}
                                className="w-full h-full border-0"
                                allowFullScreen
                            />
                        </Card>
                    </div>
                </div>
            )}
        </>
    );
}
