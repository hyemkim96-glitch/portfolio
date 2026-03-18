import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeRequest(body: unknown): NextRequest {
    return new NextRequest('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('POST /api/contact', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('returns 503 when RESEND_API_KEY is not set', async () => {
        delete process.env.RESEND_API_KEY;

        const res = await POST(makeRequest({ name: 'Alice', email: 'a@b.com', message: 'Hello' }));
        const json = await res.json();

        expect(res.status).toBe(503);
        expect(json.error).toMatch(/not configured/i);
    });

    it('returns 400 when required fields are missing', async () => {
        process.env.RESEND_API_KEY = 'test-key';

        const res = await POST(makeRequest({ name: '', email: 'a@b.com', message: 'Hello' }));
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toMatch(/required/i);
    });

    it('returns 400 when email field is absent', async () => {
        process.env.RESEND_API_KEY = 'test-key';

        const res = await POST(makeRequest({ name: 'Alice', message: 'Hello' }));
        const json = await res.json();

        expect(res.status).toBe(400);
    });

    it('returns 500 when Resend API responds with an error', async () => {
        process.env.RESEND_API_KEY = 'test-key';
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

        const res = await POST(makeRequest({ name: 'Alice', email: 'a@b.com', message: 'Hello' }));
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json.error).toMatch(/failed to send/i);
    });

    it('returns 200 with success:true on a happy-path send', async () => {
        process.env.RESEND_API_KEY = 'test-key';
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));

        const res = await POST(makeRequest({ name: 'Alice', email: 'a@b.com', message: 'Hello' }));
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
    });

    it('sends the correct payload to Resend', async () => {
        process.env.RESEND_API_KEY = 'test-key';
        const mockFetch = vi.fn().mockResolvedValue({ ok: true });
        vi.stubGlobal('fetch', mockFetch);

        await POST(makeRequest({ name: 'Alice', email: 'a@b.com', message: 'Hello world' }));

        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toBe('https://api.resend.com/emails');
        expect(options.method).toBe('POST');

        const body = JSON.parse(options.body);
        expect(body.reply_to).toBe('a@b.com');
        expect(body.subject).toContain('Alice');
        expect(body.html).toContain('Hello world');
    });
});
