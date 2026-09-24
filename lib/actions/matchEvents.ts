'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

async function recalcOurScore(matchId: string) {
	const goals = await prisma.goal.count({ where: { matchId } });
	await prisma.match.update({ where: { id: matchId }, data: { ourScore: goals } });
}

function refreshMatch(matchId: string) {
	revalidatePath(`/admin/matches/${matchId}`);
	revalidatePath('/matches');
	revalidatePath('/statistics');
	revalidatePath('/');
	revalidatePath('/team', 'layout');
}

export async function addAppearance(matchId: string, playerId: string) {
	await requireAdmin();
	await prisma.appearance.create({ data: { matchId, playerId } });
	refreshMatch(matchId);
}

export async function removeAppearance(appearanceId: string, matchId: string) {
	await requireAdmin();
	await prisma.appearance.delete({ where: { id: appearanceId } });
	refreshMatch(matchId);
}

export async function addGoal(matchId: string, playerId: string, formData: FormData) {
	await requireAdmin();
	const minuteStr = formData.get('minute') as string;
	const minute = minuteStr !== '' ? Number(minuteStr) : null;
	await prisma.goal.create({ data: { matchId, playerId, minute } });
	await recalcOurScore(matchId);
	refreshMatch(matchId);
}

export async function removeGoal(goalId: string, matchId: string) {
	await requireAdmin();
	await prisma.goal.delete({ where: { id: goalId } });
	await recalcOurScore(matchId);
	refreshMatch(matchId);
}

export async function addAssist(matchId: string, playerId: string) {
	await requireAdmin();
	await prisma.assist.create({ data: { matchId, playerId } });
	refreshMatch(matchId);
}

export async function removeAssist(assistId: string, matchId: string) {
	await requireAdmin();
	await prisma.assist.delete({ where: { id: assistId } });
	refreshMatch(matchId);
}

export async function addCard(matchId: string, playerId: string, type: 'YELLOW' | 'RED') {
	await requireAdmin();
	await prisma.cardEvent.create({ data: { matchId, playerId, type } });
	refreshMatch(matchId);
}

export async function removeCard(cardId: string, matchId: string) {
	await requireAdmin();
	await prisma.cardEvent.delete({ where: { id: cardId } });
	refreshMatch(matchId);
}
