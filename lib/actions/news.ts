'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const POLISH_CHARS: Record<string, string> = {
	ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
};

const slugify = (s: string) =>
	s
		.toLowerCase()
		.replace(/[ąćęłńóśźż]/g, (ch) => POLISH_CHARS[ch] ?? ch)
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');

function readNewsForm(formData: FormData) {
	const title = formData.get('title') as string;
	const date = formData.get('date') as string;
	const excerpt = formData.get('excerpt') as string;
	const content = formData.get('content') as string;
	const slugInput = (formData.get('slug') as string) || title;

	if (!title || !date) {
		throw new Error('Tytuł i data są wymagane.');
	}

	return {
		title,
		date: new Date(date),
		excerpt,
		content,
		slug: slugify(slugInput),
	};
}

export async function addNews(formData: FormData) {
	await requireAdmin();
	await prisma.newsItem.create({ data: readNewsForm(formData) });

	revalidatePath('/admin/news');
	revalidatePath('/news');
	redirect('/admin/news');
}

export async function updateNews(id: string, formData: FormData) {
	await requireAdmin();
	await prisma.newsItem.update({ where: { id }, data: readNewsForm(formData) });

	revalidatePath('/admin/news');
	revalidatePath('/news');
	redirect('/admin/news');
}

export async function deleteNews(id: string) {
	await requireAdmin();
	await prisma.newsItem.delete({ where: { id } });

	revalidatePath('/admin/news');
	revalidatePath('/news');
	redirect('/admin/news');
}
