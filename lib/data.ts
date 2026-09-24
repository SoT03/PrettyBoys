import { prisma } from './prisma';
import type { Player, Match, Season, StandingsRow, NewsItem, CardType } from '@prisma/client';

export type { Player, Match, Season, StandingsRow, NewsItem, CardType };

export const playerName = (p: Pick<Player, 'firstName' | 'lastName'>) =>
	`${p.firstName} ${p.lastName}`;

export const getTeam = () => prisma.player.findMany({ orderBy: { number: 'asc' } });

export const getPlayer = (id: string) => prisma.player.findUnique({ where: { id } });

export const getMatches = () => prisma.match.findMany({ orderBy: { date: 'asc' } });

export const getLastMatch = () =>
	prisma.match.findFirst({ where: { ourScore: { not: null } }, orderBy: { date: 'desc' } });

export const getNextMatch = () =>
	prisma.match.findFirst({ where: { ourScore: null }, orderBy: { date: 'asc' } });

export function displayScore(match: Match): [number, number] | undefined {
	if (match.ourScore === null || match.opponentScore === null) return undefined;
	return match.home ? [match.ourScore, match.opponentScore] : [match.opponentScore, match.ourScore];
}

export const getSeasonsDesc = async (): Promise<string[]> => {
	const seasons = await prisma.season.findMany({ orderBy: { name: 'desc' } });
	return seasons.map((s) => s.name);
};

export interface SeasonStandings {
	season: string;
	table: StandingsRow[];
}

export async function getStandings(): Promise<SeasonStandings[]> {
	const seasons = await prisma.season.findMany({
		orderBy: { name: 'desc' },
		include: { standings: { orderBy: { position: 'asc' } } },
	});
	return seasons.map((s) => ({ season: s.name, table: s.standings }));
}

export const getNews = () => prisma.newsItem.findMany({ orderBy: { date: 'desc' } });

export const getNewsBySlug = (slug: string) =>
	prisma.newsItem.findUnique({ where: { slug } });

async function matchIdsForSeason(season: string): Promise<string[] | undefined> {
	if (season === 'all') return undefined;
	const s = await prisma.season.findUnique({ where: { name: season } });
	if (!s) return [];
	const matches = await prisma.match.findMany({
		where: { seasonId: s.id },
		select: { id: true },
	});
	return matches.map((m) => m.id);
}

export interface LeaderboardRow {
	player: Player;
	matchesPlayed: number;
	goals: number;
	assists: number;
	yellowCards: number;
	redCards: number;
}

function countByPlayer(rows: { playerId: string }[]): Map<string, number> {
	const map = new Map<string, number>();
	for (const r of rows) map.set(r.playerId, (map.get(r.playerId) ?? 0) + 1);
	return map;
}

export async function getLeaderboard(season: string): Promise<LeaderboardRow[]> {
	const matchIds = await matchIdsForSeason(season);
	const matchFilter = matchIds ? { matchId: { in: matchIds } } : {};

	const [players, goals, assists, cards, appearances] = await Promise.all([
		prisma.player.findMany(),
		prisma.goal.findMany({ where: matchFilter }),
		prisma.assist.findMany({ where: matchFilter }),
		prisma.cardEvent.findMany({ where: matchFilter }),
		prisma.appearance.findMany({ where: matchFilter }),
	]);

	const goalsMap = countByPlayer(goals);
	const assistsMap = countByPlayer(assists);
	const appsMap = countByPlayer(appearances);
	const yellowMap = countByPlayer(cards.filter((c) => c.type === 'YELLOW'));
	const redMap = countByPlayer(cards.filter((c) => c.type === 'RED'));

	return players.map((player) => ({
		player,
		matchesPlayed: appsMap.get(player.id) ?? 0,
		goals: goalsMap.get(player.id) ?? 0,
		assists: assistsMap.get(player.id) ?? 0,
		yellowCards: yellowMap.get(player.id) ?? 0,
		redCards: redMap.get(player.id) ?? 0,
	}));
}

export interface PlayerSeasonStats {
	season: string;
	matchesPlayed: number;
	goals: number;
	assists: number;
	yellowCards: number;
	redCards: number;
}

export async function getPlayerSeasonStats(playerId: string): Promise<PlayerSeasonStats[]> {
	const seasons = await prisma.season.findMany({ orderBy: { name: 'desc' } });
	const results: PlayerSeasonStats[] = [];

	for (const season of seasons) {
		const matches = await prisma.match.findMany({
			where: { seasonId: season.id },
			select: { id: true },
		});
		const matchIds = matches.map((m) => m.id);
		const filter = { playerId, matchId: { in: matchIds } };

		const [matchesPlayed, goals, assists, yellowCards, redCards] = await Promise.all([
			prisma.appearance.count({ where: filter }),
			prisma.goal.count({ where: filter }),
			prisma.assist.count({ where: filter }),
			prisma.cardEvent.count({ where: { ...filter, type: 'YELLOW' } }),
			prisma.cardEvent.count({ where: { ...filter, type: 'RED' } }),
		]);

		if (matchesPlayed > 0 || goals > 0 || assists > 0) {
			results.push({ season: season.name, matchesPlayed, goals, assists, yellowCards, redCards });
		}
	}

	return results;
}

export interface PlayerMatchLogEntry {
	match: Match;
	goals: number;
	assists: number;
	yellowCards: number;
	redCards: number;
}

export async function getPlayerMatchLog(playerId: string): Promise<PlayerMatchLogEntry[]> {
	const appearances = await prisma.appearance.findMany({
		where: { playerId },
		include: { match: true },
		orderBy: { match: { date: 'desc' } },
	});

	const matchIds = appearances.map((a) => a.matchId);
	const filter = { playerId, matchId: { in: matchIds } };

	const [goals, assists, cards] = await Promise.all([
		prisma.goal.findMany({ where: filter }),
		prisma.assist.findMany({ where: filter }),
		prisma.cardEvent.findMany({ where: filter }),
	]);

	const countByMatch = (rows: { matchId: string }[]) => {
		const map = new Map<string, number>();
		for (const r of rows) map.set(r.matchId, (map.get(r.matchId) ?? 0) + 1);
		return map;
	};

	const goalsMap = countByMatch(goals);
	const assistsMap = countByMatch(assists);
	const yellowMap = countByMatch(cards.filter((c) => c.type === 'YELLOW'));
	const redMap = countByMatch(cards.filter((c) => c.type === 'RED'));

	return appearances.map((a) => ({
		match: a.match,
		goals: goalsMap.get(a.matchId) ?? 0,
		assists: assistsMap.get(a.matchId) ?? 0,
		yellowCards: yellowMap.get(a.matchId) ?? 0,
		redCards: redMap.get(a.matchId) ?? 0,
	}));
}

export async function getPlayerCareerStats(playerId: string) {
	const [matchesPlayed, goals, assists, yellowCards, redCards] = await Promise.all([
		prisma.appearance.count({ where: { playerId } }),
		prisma.goal.count({ where: { playerId } }),
		prisma.assist.count({ where: { playerId } }),
		prisma.cardEvent.count({ where: { playerId, type: 'YELLOW' } }),
		prisma.cardEvent.count({ where: { playerId, type: 'RED' } }),
	]);
	return { matchesPlayed, goals, assists, yellowCards, redCards };
}
