import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// Jeśli użytkownik próbuje wejść na /admin/login, nie blokujemy dostępu
	if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
		const authCookie = req.cookies.get('admin_auth');

		// Jeśli użytkownik nie jest zalogowany, przekieruj na stronę logowania
		if (!authCookie || authCookie.value !== 'true') {
			return NextResponse.redirect(new URL('/admin/login', req.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: '/admin/:path*', // Middleware dla wszystkich ścieżek zaczynających się od /admin
};
