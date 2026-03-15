import { getTranslations } from 'next-intl/server';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { ArtworkGallery, type DriveFile } from '@/components/artwork-gallery';

async function getDriveFiles(): Promise<DriveFile[]> {
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
    const folderId = process.env.GOOGLE_DRIVE_ARTWORK_FOLDER_ID;

    if (!apiKey || apiKey === '여기에_API_키_입력' || !folderId) {
        return [];
    }

    try {
        const params = new URLSearchParams({
            q: `'${folderId}' in parents and trashed=false`,
            key: apiKey,
            fields: 'files(id,name,mimeType)',
            orderBy: 'createdTime desc',
            pageSize: '100',
        });

        const res = await fetch(
            `https://www.googleapis.com/drive/v3/files?${params}`,
            { next: { revalidate: 300 } }
        );

        if (!res.ok) return [];
        const data = await res.json();
        return data.files ?? [];
    } catch {
        return [];
    }
}

export default async function AIArtworkPage() {
    const t = await getTranslations('AIArtwork');
    const files = await getDriveFiles();

    return (
        <LayoutWrapper>
            <section className="py-12">
                <div className="mb-10 space-y-2">
                    <p className="text-xs text-muted-foreground font-medium tracking-widest uppercase">AI Artwork</p>
                    <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
                    <p className="text-muted-foreground">{t('description')}</p>
                </div>

                <ArtworkGallery files={files} />
            </section>
        </LayoutWrapper>
    );
}
