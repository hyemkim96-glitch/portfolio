'use client'

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowUpRight } from 'lucide-react';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function ContactPage() {
    const t = useTranslations('Contact');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<Status>('idle');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus('sending');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message }),
            });
            if (res.ok) {
                setStatus('success');
                setName('');
                setEmail('');
                setMessage('');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    }

    return (
        <LayoutWrapper>
            <section className="py-12">
                <div className="mb-10 space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
                    <p className="text-muted-foreground">{t('description')}</p>
                </div>

                <div className="max-w-lg space-y-6">
                    {status === 'success' ? (
                        <div className="rounded-lg border border-border bg-muted/30 px-6 py-8 text-center space-y-2">
                            <p className="font-medium text-foreground">{t('successTitle')}</p>
                            <p className="text-sm text-muted-foreground">{t('successMessage')}</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-4 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
                            >
                                {t('sendAnother')}
                            </button>
                        </div>
                    ) : (
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="name">{t('labelName')}</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder={t('placeholderName')}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
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
                                    required
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
                                    required
                                />
                            </div>

                            {status === 'error' && (
                                <p className="text-sm text-destructive">{t('errorMessage')}</p>
                            )}

                            <Button
                                type="submit"
                                className="w-full sm:w-auto"
                                disabled={status === 'sending'}
                            >
                                {status === 'sending' ? t('sending') : t('executeSend')}
                            </Button>
                        </form>
                    )}

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
