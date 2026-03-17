import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Hyemin Kim — Agile UX Designer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    background: '#0a0a0a',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '72px 80px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
            >
                {/* Top badge */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.07)',
                        borderRadius: '100px',
                        padding: '8px 20px',
                        width: 'fit-content',
                    }}
                >
                    <span style={{ color: '#a3a3a3', fontSize: '14px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        UX / UI Designer · 5+ Years
                    </span>
                </div>

                {/* Main content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ color: '#ffffff', fontSize: '72px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                            Hyemin Kim,
                        </span>
                        <span style={{ color: '#ffffff', fontSize: '72px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                            Agile UX Designer.
                        </span>
                    </div>
                    <p style={{ color: '#737373', fontSize: '20px', lineHeight: 1.5, maxWidth: '680px', margin: 0 }}>
                        5+ years across Automotive HMI, Healthcare, and B2B SaaS — building design systems and collaborating globally.
                    </p>
                </div>

                {/* Bottom row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '32px' }}>
                        {['Figma', 'UX Research', 'Design Systems', 'AI Design'].map((skill) => (
                            <span key={skill} style={{ color: '#525252', fontSize: '13px', letterSpacing: '0.05em' }}>
                                {skill}
                            </span>
                        ))}
                    </div>
                    <span style={{ color: '#525252', fontSize: '14px' }}>hyemin.portfolio</span>
                </div>
            </div>
        ),
        { ...size }
    );
}
