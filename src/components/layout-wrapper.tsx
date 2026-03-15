import { GNB } from './gnb';
import { Footer } from './footer';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-background transition-colors duration-200">
            <GNB />
            <main className="flex-grow">
                <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}
