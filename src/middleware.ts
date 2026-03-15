import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
    localePrefix: 'always'
});

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(ko|en)/:path*']
};
