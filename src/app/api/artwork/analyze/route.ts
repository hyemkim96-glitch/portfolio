import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic();

// Supported image media types for Claude API
type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

const SUPPORTED_MEDIA_TYPES: Set<string> = new Set([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
]);

function getSupportedMediaType(mimeType: string): ImageMediaType {
    if (SUPPORTED_MEDIA_TYPES.has(mimeType)) {
        return mimeType as ImageMediaType;
    }
    // Default to jpeg for unsupported types
    return 'image/jpeg';
}

export async function POST(req: NextRequest) {
    try {
        const { imageUrl, mimeType } = await req.json();

        if (!imageUrl) {
            return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });
        }

        // Fetch image and convert to base64
        const imageRes = await fetch(imageUrl);
        if (!imageRes.ok) {
            return NextResponse.json({ error: 'Failed to fetch image' }, { status: 400 });
        }

        const imageBuffer = await imageRes.arrayBuffer();
        const base64Data = Buffer.from(imageBuffer).toString('base64');

        // media_type is required by the Claude API for base64 images
        const mediaType = getSupportedMediaType(mimeType ?? imageRes.headers.get('content-type') ?? 'image/jpeg');

        const message = await client.messages.create({
            model: 'claude-opus-4-6',
            max_tokens: 512,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image',
                            source: {
                                type: 'base64',
                                media_type: mediaType, // required field — missing this causes 400 error
                                data: base64Data,
                            },
                        },
                        {
                            type: 'text',
                            text: 'Briefly describe this artwork in 2-3 sentences.',
                        },
                    ],
                },
            ],
        });

        const description = message.content[0].type === 'text' ? message.content[0].text : '';

        return NextResponse.json({ description });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
