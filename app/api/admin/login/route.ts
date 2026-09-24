import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/auth';

export async function POST(req: NextRequest) {
	const { password } = await req.json();
	const correctPassword = process.env.ADMIN_PASSWORD;

	if (!correctPassword || password !== correctPassword) {
		return NextResponse.json({ error: 'Nieprawidłowe hasło' }, { status: 401 });
	}

	const res = NextResponse.json({ ok: true });
	res.cookies.set(ADMIN_COOKIE, 'true', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24,
		path: '/',
	});
	return res;
}

export async function DELETE() {
	const res = NextResponse.json({ ok: true });
	res.cookies.delete(ADMIN_COOKIE);
	return res;
}
