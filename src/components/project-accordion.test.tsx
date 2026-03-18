import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectAccordion, ProjectItem } from './project-accordion';

// ---------------------------------------------------------------------------
// next/image renders a plain <img> in tests
// ---------------------------------------------------------------------------
vi.mock('next/image', () => ({
    default: ({ src, alt, ...rest }: { src: string; alt: string; [k: string]: unknown }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} {...rest} />
    ),
}));

// BlurFade just renders its children in tests
vi.mock('@/components/ui/blur-fade', () => ({
    BlurFade: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const makeItem = (overrides: Partial<ProjectItem> = {}): ProjectItem => ({
    key: 'proj-1',
    index: 0,
    title: 'My Project',
    subtitle: 'Cool Project Subtitle',
    tags: ['React', 'TypeScript'],
    period: '2024',
    description: 'A nice project description.',
    isPrivate: false,
    files: [],
    ...overrides,
});

const privateNote = '비공개 프로젝트';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('ProjectAccordion', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('renders project titles and descriptions', () => {
        render(<ProjectAccordion items={[makeItem()]} privateNote={privateNote} />);

        expect(screen.getByText('Cool Project Subtitle')).toBeInTheDocument();
        expect(screen.getByText('A nice project description.')).toBeInTheDocument();
    });

    it('renders tags for each project', () => {
        render(<ProjectAccordion items={[makeItem()]} privateNote={privateNote} />);

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('shows private note badge for private projects', () => {
        render(
            <ProjectAccordion
                items={[makeItem({ isPrivate: true })]}
                privateNote={privateNote}
            />
        );

        expect(screen.getByText(privateNote)).toBeInTheDocument();
    });

    it('does not show private note for public projects', () => {
        render(
            <ProjectAccordion
                items={[makeItem({ isPrivate: false })]}
                privateNote={privateNote}
            />
        );

        expect(screen.queryByText(privateNote)).not.toBeInTheDocument();
    });

    it('does not expand when project has no files (cursor-default)', () => {
        render(<ProjectAccordion items={[makeItem({ files: [] })]} privateNote={privateNote} />);

        // Clicking the row should not reveal any images
        fireEvent.click(screen.getByText('Cool Project Subtitle'));
        expect(screen.queryByRole('button', { name: /닫기/ })).not.toBeInTheDocument();
    });

    it('expands to show images when clicked and files exist', () => {
        const files = [{ id: 'file1', name: 'screenshot.png', mimeType: 'image/png' }];
        render(
            <ProjectAccordion
                items={[makeItem({ files })]}
                privateNote={privateNote}
            />
        );

        fireEvent.click(screen.getByText('Cool Project Subtitle'));

        expect(screen.getByAltText('screenshot.png')).toBeInTheDocument();
    });

    it('closes when the close button inside the accordion is clicked', () => {
        const files = [{ id: 'file1', name: 'screenshot.png', mimeType: 'image/png' }];
        render(
            <ProjectAccordion
                items={[makeItem({ files })]}
                privateNote={privateNote}
            />
        );

        fireEvent.click(screen.getByText('Cool Project Subtitle'));
        expect(screen.getByAltText('screenshot.png')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /닫기/ }));
        expect(screen.queryByAltText('screenshot.png')).not.toBeInTheDocument();
    });

    it('opens lightbox when an image thumbnail is clicked', () => {
        const files = [{ id: 'file1', name: 'shot.png', mimeType: 'image/png' }];
        render(
            <ProjectAccordion
                items={[makeItem({ files })]}
                privateNote={privateNote}
            />
        );

        fireEvent.click(screen.getByText('Cool Project Subtitle'));

        const thumbnail = screen.getByAltText('shot.png');
        fireEvent.click(thumbnail);

        // Lightbox renders the close X button with aria-label="닫기"
        expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
    });

    it('closes lightbox on Escape key', () => {
        const files = [{ id: 'file1', name: 'shot.png', mimeType: 'image/png' }];
        render(
            <ProjectAccordion
                items={[makeItem({ files })]}
                privateNote={privateNote}
            />
        );

        fireEvent.click(screen.getByText('Cool Project Subtitle'));
        fireEvent.click(screen.getByAltText('shot.png'));

        // Confirm lightbox is open
        expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();

        fireEvent.keyDown(document, { key: 'Escape' });
        // Lightbox X button disappears after close
        expect(screen.queryByRole('button', { name: '닫기' })).not.toBeInTheDocument();
    });

    it('renders index numbers with zero-padding', () => {
        const items = [
            makeItem({ key: 'a', index: 0 }),
            makeItem({ key: 'b', index: 1, subtitle: 'Second Project' }),
        ];
        render(<ProjectAccordion items={items} privateNote={privateNote} />);

        expect(screen.getByText('01')).toBeInTheDocument();
        expect(screen.getByText('02')).toBeInTheDocument();
    });

    it('renders multiple projects', () => {
        const items = [
            makeItem({ key: 'a', subtitle: 'First Project' }),
            makeItem({ key: 'b', subtitle: 'Second Project' }),
        ];
        render(<ProjectAccordion items={items} privateNote={privateNote} />);

        expect(screen.getByText('First Project')).toBeInTheDocument();
        expect(screen.getByText('Second Project')).toBeInTheDocument();
    });
});
