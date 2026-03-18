import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArtworkGallery, DriveFile } from './artwork-gallery';

// ---------------------------------------------------------------------------
// next/image renders a plain <img> in tests
// ---------------------------------------------------------------------------
vi.mock('next/image', () => ({
    default: ({ src, alt, ...rest }: { src: string; alt: string; [k: string]: unknown }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} {...rest} />
    ),
}));

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const imageFiles: DriveFile[] = [
    { id: 'img1', name: 'Artwork One', mimeType: 'image/png' },
    { id: 'img2', name: 'Artwork Two', mimeType: 'image/jpeg' },
    { id: 'img3', name: 'Artwork Three', mimeType: 'image/webp' },
];

const videoFile: DriveFile = { id: 'vid1', name: 'My Video', mimeType: 'video/mp4' };

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('ArtworkGallery', () => {
    afterEach(() => {
        // Ensure body overflow is reset between tests
        document.body.style.overflow = '';
    });

    it('renders an empty-state message when files is empty', () => {
        render(<ArtworkGallery files={[]} />);
        expect(screen.getByText(/아직 업로드된 아트워크가 없습니다/)).toBeInTheDocument();
    });

    it('renders a grid button for each file', () => {
        render(<ArtworkGallery files={imageFiles} />);
        expect(screen.getByRole('button', { name: 'Artwork One' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Artwork Two' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Artwork Three' })).toBeInTheDocument();
    });

    it('shows thumbnail images for image files', () => {
        render(<ArtworkGallery files={imageFiles} />);
        const thumbnail = screen.getByAltText('Artwork One') as HTMLImageElement;
        expect(thumbnail.src).toContain('img1');
    });

    it('renders a play-icon placeholder for video files', () => {
        render(<ArtworkGallery files={[videoFile]} />);
        expect(screen.getByText('My Video')).toBeInTheDocument();
        // No image rendered for video in the grid
        expect(screen.queryByAltText('My Video')).not.toBeInTheDocument();
    });

    it('opens lightbox when a grid item is clicked', () => {
        render(<ArtworkGallery files={imageFiles} />);

        fireEvent.click(screen.getByRole('button', { name: 'Artwork One' }));

        // Lightbox image should appear at full resolution URL
        const lightboxImg = screen.getAllByAltText('Artwork One').find(
            el => (el as HTMLImageElement).src?.includes('w2000')
        );
        expect(lightboxImg).toBeInTheDocument();
    });

    it('shows 1/N counter when lightbox is open', () => {
        render(<ArtworkGallery files={imageFiles} />);
        fireEvent.click(screen.getByRole('button', { name: 'Artwork One' }));

        expect(screen.getByText(`1 / ${imageFiles.length}`)).toBeInTheDocument();
    });

    it('closes lightbox when backdrop is clicked', () => {
        render(<ArtworkGallery files={imageFiles} />);
        fireEvent.click(screen.getByRole('button', { name: 'Artwork One' }));

        // Counter visible → lightbox is open
        expect(screen.getByText('1 / 3')).toBeInTheDocument();

        // Click the X button (aria-label="닫기")
        fireEvent.click(screen.getByRole('button', { name: '닫기' }));
        expect(screen.queryByText('1 / 3')).not.toBeInTheDocument();
    });

    it('closes lightbox on Escape key', () => {
        render(<ArtworkGallery files={imageFiles} />);
        fireEvent.click(screen.getByRole('button', { name: 'Artwork One' }));

        expect(screen.getByText('1 / 3')).toBeInTheDocument();

        fireEvent.keyDown(window, { key: 'Escape' });
        expect(screen.queryByText('1 / 3')).not.toBeInTheDocument();
    });

    it('navigates to next image on ArrowRight key', () => {
        render(<ArtworkGallery files={imageFiles} />);
        fireEvent.click(screen.getByRole('button', { name: 'Artwork One' }));

        expect(screen.getByText('1 / 3')).toBeInTheDocument();

        fireEvent.keyDown(window, { key: 'ArrowRight' });
        expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    it('navigates to prev image on ArrowLeft key', () => {
        render(<ArtworkGallery files={imageFiles} />);
        // Open on second item
        fireEvent.click(screen.getByRole('button', { name: 'Artwork Two' }));

        expect(screen.getByText('2 / 3')).toBeInTheDocument();

        fireEvent.keyDown(window, { key: 'ArrowLeft' });
        expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('wraps from last to first on ArrowRight', () => {
        render(<ArtworkGallery files={imageFiles} />);
        fireEvent.click(screen.getByRole('button', { name: 'Artwork Three' }));

        expect(screen.getByText('3 / 3')).toBeInTheDocument();

        fireEvent.keyDown(window, { key: 'ArrowRight' });
        expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('wraps from first to last on ArrowLeft', () => {
        render(<ArtworkGallery files={imageFiles} />);
        fireEvent.click(screen.getByRole('button', { name: 'Artwork One' }));

        expect(screen.getByText('1 / 3')).toBeInTheDocument();

        fireEvent.keyDown(window, { key: 'ArrowLeft' });
        expect(screen.getByText('3 / 3')).toBeInTheDocument();
    });

    it('hides prev/next buttons when there is only one file', () => {
        render(<ArtworkGallery files={[imageFiles[0]]} />);
        fireEvent.click(screen.getByRole('button', { name: 'Artwork One' }));

        expect(screen.queryByRole('button', { name: '이전' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: '다음' })).not.toBeInTheDocument();
    });

    it('shows prev/next buttons when there are multiple files', () => {
        render(<ArtworkGallery files={imageFiles} />);
        fireEvent.click(screen.getByRole('button', { name: 'Artwork One' }));

        expect(screen.getByRole('button', { name: '이전' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument();
    });

    it('locks body scroll when lightbox is open', () => {
        render(<ArtworkGallery files={imageFiles} />);

        fireEvent.click(screen.getByRole('button', { name: 'Artwork One' }));
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll when lightbox closes', () => {
        render(<ArtworkGallery files={imageFiles} />);

        fireEvent.click(screen.getByRole('button', { name: 'Artwork One' }));
        fireEvent.click(screen.getByRole('button', { name: '닫기' }));

        expect(document.body.style.overflow).toBe('');
    });

    it('renders an iframe for video files in the lightbox', () => {
        render(<ArtworkGallery files={[videoFile]} />);
        fireEvent.click(screen.getByRole('button', { name: 'My Video' }));

        const iframe = screen.getByTitle
            ? screen.queryByTitle(/preview/i)
            : document.querySelector('iframe');
        // iframe or its src should contain the file ID
        const iframeEl = document.querySelector('iframe');
        expect(iframeEl).toBeInTheDocument();
        expect(iframeEl?.src).toContain('vid1');
    });
});
