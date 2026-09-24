'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function readPlayerForm(formData: FormData) {
	const firstName = formData.get('firstName') as string;
	const lastName = formData.get('lastName') as string;
	const position = formData.get('position') as string;
	const number = Number(formData.get('number'));
	const imageUrl = (formData.get('imageUrl') as string) || null;
	const birthDateStr = formData.get('birthDate') as string;
	const joined = (formData.get('joined') as string) || null;
	const bio = (formData.get('bio') as string) || null;

	if (!firstName || !lastName || !position || !number) {
		throw new Error('Wypełnij wymagane pola.');
	}

	return {
		firstName,
		lastName,
		position,
		number,
		imageUrl,
		birthDate: birthDateStr ? new Date(birthDateStr) : null,
		joined,
		bio,
	};
}

export async function addPlayer(formData: FormData) {
	await requireAdmin();
	await prisma.player.create({ data: readPlayerForm(formData) });

	revalidatePath('/admin/players');
	revalidatePath('/team');
	redirect('/admin/players');
}

export async function updatePlayer(id: string, formData: FormData) {
	await requireAdmin();
	await prisma.player.update({ where: { id }, data: readPlayerForm(formData) });

	revalidatePath('/admin/players');
	revalidatePath(`/team/${id}`);
	revalidatePath('/team');
	redirect('/admin/players');
}

export async function deletePlayer(id: string) {
	await requireAdmin();
	await prisma.player.delete({ where: { id } });

	revalidatePath('/admin/players');
	revalidatePath('/team');
	redirect('/admin/players');
}
