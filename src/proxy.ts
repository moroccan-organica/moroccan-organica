import { withAuth } from 'next-auth/middleware';
import type { NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const locales = ['en', 'ar', 'fr'];
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

    // 1. Locale redirection/rewrite logic
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (
        pathnameIsMissingLocale &&
        !pathname.startsWith('/api') &&
        !pathname.startsWith('/admin') && // Exclude admin from localized rewrite
        !pathname.startsWith('/login') && // Exclude login from localized rewrite
        !pathname.startsWith('/_next') &&
        !pathname.includes('.')
    ) {
        // Rewrite to English instead of redirecting
        const url = req.nextUrl.clone();
        url.pathname = `/${defaultLocale}${pathname}`;
        return NextResponse.rewrite(url);
    }

    const isAuthPage = pathname === '/login' || pathname.startsWith('/login/');

    // 2. Auth protection
    if (isAuthPage) {
        if (isAuth) {
            return NextResponse.redirect(new URL(`/admin`, req.url));
        }
        return null;
    }

    if (pathname.startsWith('/admin')) {
        if (!isAuth) {
            const from = pathname + req.nextUrl.search;
            // Redirect to root login directly
            return NextResponse.redirect(
                new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
            );
        }

        if (token?.role !== 'ADMIN') {
            return NextResponse.redirect(new URL(`/en`, req.url));
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
