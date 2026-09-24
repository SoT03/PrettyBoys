'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface GoalInput {
	playerId: string;
	assistPlayerId?: string;
	minute?: number;
}

export interface AddMatchInput {
	opponent: string;
	date: string;
	location?: string;
	matchType: string;
	round?: string;
	home: boolean;
	seasonId?: string;
	ourScore?: number;
	opponentScore?: number;
	squad: string[];
	goals: GoalInput[];
}

export async function addMatch(input: AddMatchInput) {
	await requireAdmin();

	if (!input.opponent || !input.date) {
		throw new Error('Przeciwnik i data są wymagane.');
	}

	const match = await prisma.match.create({
		data: {
			opponent: input.opponent,
			date: new Date(input.date),
			location: input.location || null,
			matchType: input.matchType || 'Liga',
			round: input.round || null,
			home: input.home,
			seasonId: input.seasonId || null,
			ourScore: input.goals.length > 0 ? input.goals.length : input.ourScore ?? null,
			opponentScore: input.opponentScore ?? null,
		},
	});

	const squadIds = new Set(input.squad);
	for (const goal of input.goals) {
		squadIds.add(goal.playerId);
		if (goal.assistPlayerId) squadIds.add(goal.assistPlayerId);
	}

	if (squadIds.size > 0) {
		await prisma.appearance.createMany({
			data: [...squadIds].map((playerId) => ({ matchId: match.id, playerId })),
		});
	}

	for (const goal of input.goals) {
		await prisma.goal.create({
			data: { matchId: match.id, playerId: goal.playerId, minute: goal.minute ?? null },
		});
		if (goal.assistPlayerId) {
			await prisma.assist.create({
				data: { matchId: match.id, playerId: goal.assistPlayerId },
			});
		}
	}

	revalidatePath('/admin/matches');
	revalidatePath('/matches');
	revalidatePath('/statistics');
	revalidatePath('/');
	redirect('/admin/matches');
}

export async function updateOpponentScore(matchId: string, formData: FormData) {
	await requireAdmin();
	const value = formData.get('opponentScore') as string;

	await prisma.match.update({
		where: { id: matchId },
		data: { opponentScore: value === '' ? null : Number(value) },
	});

	revalidatePath(`/admin/matches/${matchId}`);
	revalidatePath('/matches');
	revalidatePath('/');
}

export async function deleteMatch(id: string) {
	await requireAdmin();
	await prisma.match.delete({ where: { id } });

	revalidatePath('/admin/matches');
	revalidatePath('/matches');
	revalidatePath('/');
	redirect('/admin/matches');
}
