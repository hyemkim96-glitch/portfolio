import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// We need to mock the Anthropic SDK before importing the route so the module
// initialisation (new Anthropic()) doesn't attempt a real network call.
// ---------------------------------------------------------------------------
vi.mock('@anthropic-ai/sdk', () => {
    const create = vi.fn();
    return {
        default: vi.fn().mockImplementation(() => ({
            messages: { create },
        })),
        _mockCreate: create,
    };
});

// Import after mock is in place
import { POST } from './route';
import AnthropicMock from '@anthropic-ai/sdk';

function getCreateMock() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (AnthropicMock as any)._mockCreate as ReturnType<typeof vi.fn>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeRequest(body: unknown): NextRequest {
    return new NextRequest('http://localhost/api/artwork/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

function mockImageFetch(ok = true, contentType = 'image/png') {
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
            ok,
            headers: { get: () => contentType },
            arrayBuffer: async () => new ArrayBuffer(8),
        })
    );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('POST /api/artwork/analyze', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('returns 400 when imageUrl is missing', async () => {
        const res = await POST(makeRequest({}));
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toMatch(/imageUrl is required/i);
    });

    it('returns 400 when image fetch fails', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

        const res = await POST(makeRequest({ imageUrl: 'https://example.com/img.png' }));
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toMatch(/failed to fetch image/i);
    });

    it('returns a description from Claude on success', async () => {
        mockImageFetch();

        getCreateMock().mockResolvedValue({
            content: [{ type: 'text', text: 'A beautiful sunset.' }],
        });

        const res = await POST(makeRequest({ imageUrl: 'https://example.com/img.png' }));
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.description).toBe('A beautiful sunset.');
    });

    it('returns 500 when Anthropic SDK throws', async () => {
        mockImageFetch();

        getCreateMock().mockRejectedValue(new Error('API quota exceeded'));

        const res = await POST(makeRequest({ imageUrl: 'https://example.com/img.png' }));
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json.error).toBe('API quota exceeded');
    });

    describe('getSupportedMediaType (via mimeType param)', () => {
        it.each([
            ['image/jpeg', 'image/jpeg'],
            ['image/png', 'image/png'],
            ['image/gif', 'image/gif'],
            ['image/webp', 'image/webp'],
        ])('passes %s through unchanged', async (input, expected) => {
            mockImageFetch(true, input);

            getCreateMock().mockResolvedValue({
                content: [{ type: 'text', text: 'desc' }],
            });

            await POST(makeRequest({ imageUrl: 'https://example.com/img', mimeType: input }));

            const call = getCreateMock().mock.calls[0][0];
            const mediaType = call.messages[0].content[0].source.media_type;
            expect(mediaType).toBe(expected);
        });

        it('falls back to image/jpeg for unsupported mime types', async () => {
            mockImageFetch(true, 'image/tiff');

            getCreateMock().mockResolvedValue({
                content: [{ type: 'text', text: 'desc' }],
            });

            await POST(makeRequest({ imageUrl: 'https://example.com/img', mimeType: 'image/tiff' }));

            const call = getCreateMock().mock.calls[0][0];
            const mediaType = call.messages[0].content[0].source.media_type;
            expect(mediaType).toBe('image/jpeg');
        });
    });
});
