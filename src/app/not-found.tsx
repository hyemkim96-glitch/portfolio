import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
            <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase mb-6">404</p>
            <h1 className="text-4xl font-bold text-foreground mb-3">Page not found</h1>
            <p className="text-muted-foreground mb-8 max-w-sm">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                href="/ko"
                className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
            >
                Go home →
            </Link>
        </div>
    );
}
