import { getTranslations } from 'next-intl/server';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { ProjectGrid } from '@/components/project-grid';
import { Button } from '@/components/ui/button';

export default async function PortfolioPage() {
    const t = await getTranslations('Portfolio');

    return (
        <LayoutWrapper>
            <section className="py-12">
                <div className="mb-12 space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <h1 className="text-4xl font-bold text-foreground tracking-tight">{t('title')}</h1>
                        <Button asChild variant="outline" size="lg" className="transition-all">
                            <a
                                href="https://drive.google.com/file/d/1grMEbSxtnHMuoV5LpcB0nJopnkFD7dw3/view?usp=sharing"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t('viewPdf')}
                            </a>
                        </Button>
                    </div>
                    <p className="text-muted-foreground max-w-xl">
                        UX/UI 설계 및 기획 프로젝트를 통해 복합적인 문제를 해결해온 기록들입니다.
                    </p>
                </div>

                <ProjectGrid />
            </section>
        </LayoutWrapper>
    );
}
