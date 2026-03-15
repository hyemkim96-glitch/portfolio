'use client'

import { useTranslations } from 'next-intl';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowUpRight } from 'lucide-react';

export default function ContactPage() {
    const t = useTranslations('Contact');

    return (
        <LayoutWrapper>
            <section className="py-12">
                <div className="mb-10 space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
                    <p className="text-muted-foreground">{t('description')}</p>
                </div>

                <div className="max-w-lg space-y-6">
                    <form className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('labelName')}</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder={t('placeholderName')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">{t('labelEmail')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={t('placeholderEmail')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">{t('labelMessage')}</Label>
                            <Textarea
                                id="message"
                                rows={5}
                                placeholder={t('placeholderMessage')}
                                className="resize-none"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full sm:w-auto"
                            onClick={(e) => e.preventDefault()}
                        >
                            {t('executeSend')}
                        </Button>
                    </form>

                    <div className="pt-6 border-t border-border space-y-3">
                        <p className="text-sm text-muted-foreground">{t('alternative')}</p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="https://www.linkedin.com/in/hyemin-kim-bb2a0123a"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                GitHub <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                            <a
                                href="mailto:hyem.kim96@gmail.com"
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Email <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </LayoutWrapper>
    );
}
