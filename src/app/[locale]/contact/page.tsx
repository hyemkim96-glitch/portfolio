'use client'

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowUpRight } from 'lucide-react';

export default function ContactPage() {
    const t = useTranslations('Contact');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const subject = encodeURIComponent(`[Portfolio] ${name}님의 문의`);
        const body = encodeURIComponent(`이름: ${name}\n이메일: ${email}\n\n${message}`);
        window.location.href = `mailto:hyem.kim96@gmail.com?subject=${subject}&body=${body}`;
    }

    return (
        <LayoutWrapper>
            <section className="py-12">
                <div className="mb-10 space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
                    <p className="text-muted-foreground">{t('description')}</p>
                </div>

                <div className="max-w-lg space-y-6">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('labelName')}</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder={t('placeholderName')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">{t('labelEmail')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={t('placeholderEmail')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">{t('labelMessage')}</Label>
                            <Textarea
                                id="message"
                                rows={5}
                                placeholder={t('placeholderMessage')}
                                className="resize-none"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full sm:w-auto"
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
