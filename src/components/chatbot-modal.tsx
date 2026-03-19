'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'motion/react'
import { X, Send, Loader2 } from 'lucide-react'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

interface ChatbotModalProps {
    open: boolean
    onClose: () => void
}

const SUGGESTED_KO = [
    '어떤 프로젝트를 해왔나요?',
    '주요 스킬이 뭔가요?',
    '협업 제안은 어떻게 하나요?',
]

const SUGGESTED_EN = [
    'What projects have you worked on?',
    'What are your main skills?',
    'How can I collaborate with you?',
]

const GREETING_KO = '안녕하세요! 저는 혜민님의 포트폴리오 챗봇입니다. 프로젝트, 스킬, 경력 등 궁금한 점을 물어보세요 😊'
const GREETING_EN = "Hi there! I'm Hyemin's portfolio chatbot. Feel free to ask me about her projects, skills, or experience 😊"

export function ChatbotModal({ open, onClose }: ChatbotModalProps) {
    const locale = useLocale()
    const isKo = locale === 'ko'
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Reset on open
    useEffect(() => {
        if (open) {
            setMessages([{ role: 'assistant', content: isKo ? GREETING_KO : GREETING_EN }])
            setInput('')
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [open, isKo])

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Close on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        if (open) window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open, onClose])

    async function sendMessage(text: string) {
        const trimmed = text.trim()
        if (!trimmed || loading) return

        const userMessage: Message = { role: 'user', content: trimmed }
        const nextMessages = [...messages, userMessage]
        setMessages(nextMessages)
        setInput('')
        setLoading(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
                }),
            })
            const data = await res.json()
            if (data.message) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
            }
        } catch {
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: isKo
                        ? '죄송합니다, 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
                        : 'Sorry, something went wrong. Please try again.',
                },
            ])
        } finally {
            setLoading(false)
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        sendMessage(input)
    }

    const suggested = isKo ? SUGGESTED_KO : SUGGESTED_EN

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="fixed bottom-24 right-6 z-50 w-[min(420px,calc(100vw-2rem))] sm:right-8"
                    >
                        <div className="flex flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden h-[520px]">
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-semibold">
                                        H
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold leading-none">Hyemin Kim</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {isKo ? 'UX/UI 디자이너' : 'UX/UI Designer'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                    aria-label="Close"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                                msg.role === 'user'
                                                    ? 'bg-foreground text-background rounded-br-sm'
                                                    : 'bg-muted text-foreground rounded-bl-sm'
                                            }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                                            <Loader2 size={14} className="animate-spin text-muted-foreground" />
                                        </div>
                                    </div>
                                )}

                                {/* Suggested questions — shown only after greeting */}
                                {messages.length === 1 && !loading && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {suggested.map((q) => (
                                            <button
                                                key={q}
                                                onClick={() => sendMessage(q)}
                                                className="text-xs border border-border rounded-full px-3 py-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <form
                                onSubmit={handleSubmit}
                                className="px-4 py-3 border-t border-border flex gap-2 items-center"
                            >
                                <input
                                    ref={inputRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder={isKo ? '메시지를 입력하세요...' : 'Type a message...'}
                                    disabled={loading}
                                    className="flex-1 bg-muted rounded-full px-4 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-30 shrink-0"
                                    aria-label="Send"
                                >
                                    <Send size={14} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
