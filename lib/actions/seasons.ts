'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function refresh() {
	revalidatePath('/admin/seasons');
	revalidatePath('/statistics');
	revalidatePath('/');
}

export async function addSeason(formData: FormData) {
	await requireAdmin();
	const name = formData.get('name') as string;
	if (!name) throw new Error('Nazwa sezonu jest wymagana.');

	await prisma.season.create({ data: { name } });
	refresh();
	redirect('/admin/seasons');
}

export async function deleteSeason(id: string) {
	await requireAdmin();
	await prisma.season.delete({ where: { id } });
	refresh();
}

function readRowForm(formData: FormData) {
	return {
		position: Number(formData.get('position')),
		team: formData.get('team') as string,
		played: Number(formData.get('played')),
		win: Number(formData.get('win')),
		draw: Number(formData.get('draw')),
		loss: Number(formData.get('loss')),
		goalsFor: Number(formData.get('goalsFor')),
		goalsAgainst: Number(formData.get('goalsAgainst')),
		points: Number(formData.get('points')),
	};
}

export async function addStandingsRow(seasonId: string, formData: FormData) {
	await requireAdmin();
	await prisma.standingsRow.create({ data: { seasonId, ...readRowForm(formData) } });
	refresh();
}

export async function updateStandingsRow(id: string, formData: FormData) {
	await requireAdmin();
	await prisma.standingsRow.update({ where: { id }, data: readRowForm(formData) });
	refresh();
}

export async function deleteStandingsRow(id: string) {
	await requireAdmin();
	await prisma.standingsRow.delete({ where: { id } });
	refresh();
}
