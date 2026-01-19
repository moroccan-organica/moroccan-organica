import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const { pathname } = req.nextUrl;

        // 1. Locale redirection logic (previously in proxy.ts)
        const pathnameIsMissingLocale = locales.every(
            (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
        );

        // If missing locale and not an internal/api path
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

        if (!isAuth && pathname.includes('/admin')) {
            let from = pathname;
            if (req.nextUrl.search) {
                from += req.nextUrl.search;
            }

            const segments = pathname.split('/');
            const lang = segments[1] || defaultLocale;

            return NextResponse.redirect(
                new URL(`/${lang}/login?from=${encodeURIComponent(from)}`, req.url)
            );
        }

        // Protection for role ADMIN
        if (pathname.includes('/admin') && token?.role !== 'ADMIN') {
            const lang = pathname.split('/')[1] || defaultLocale;
            return NextResponse.redirect(new URL(`/${lang}`, req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;
                // Only require auth for admin routes
                if (pathname.includes('/admin')) {
                    return !!token;
                }
                return true;
            },
        },
    }
);

export const config = {
    matcher: [
        // Match all paths except api, _next, and assets
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
