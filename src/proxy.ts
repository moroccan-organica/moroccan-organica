import { withAuth } from 'next-auth/middleware';
import type { NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

// Define the middleware function
async function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const isAuth = !!token;

    const localePrefixedAuthApi = locales.find(
        (locale) => pathname === `/${locale}/api/auth` || pathname.startsWith(`/${locale}/api/auth/`)
    );

    if (localePrefixedAuthApi) {
        const rewrittenPath = pathname.replace(`/${localePrefixedAuthApi}`, '');
        return NextResponse.rewrite(new URL(`${rewrittenPath}${req.nextUrl.search}`, req.url));
    }

    // 1. Locale redirection logic
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (
        pathnameIsMissingLocale &&
        !pathname.startsWith('/api') &&
        !pathname.startsWith('/_next') &&
        !pathname.includes('.')
    ) {
        return NextResponse.redirect(
            new URL(`/${defaultLocale}${pathname}${req.nextUrl.search}`, req.url)
        );
    }

    const isAuthPage = pathname.includes('/login');

    // 2. Auth protection
    if (isAuthPage) {
        if (isAuth) {
            const lang = pathname.split('/')[1] || defaultLocale;
            return NextResponse.redirect(new URL(`/${lang}/admin`, req.url));
        }
        return null;
    }

    if (pathname.includes('/admin')) {
        if (!isAuth) {
            const segments = pathname.split('/');
            const lang = segments[1] || defaultLocale;
            const from = pathname + req.nextUrl.search;
            return NextResponse.redirect(
                new URL(`/${lang}/login?from=${encodeURIComponent(from)}`, req.url)
            );
        }

        if (token?.role !== 'ADMIN') {
            const segments = pathname.split('/');
            const lang = segments[1] || defaultLocale;
            return NextResponse.redirect(new URL(`/${lang}`, req.url));
        }
    }

    return NextResponse.next();
}

// Export the middleware wrapped with auth
export default withAuth(middleware, {
    callbacks: {
        authorized: () => true,
    },
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
