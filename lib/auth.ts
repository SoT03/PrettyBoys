import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'admin_auth';

export function isAuthed(req: NextRequest): boolean {
	return req.cookies.get(ADMIN_COOKIE)?.value === 'true';
}

export async function requireAdmin(): Promise<void> {
	const store = await cookies();
	if (store.get(ADMIN_COOKIE)?.value !== 'true') {
		throw new Error('Unauthorized');
	}
}
