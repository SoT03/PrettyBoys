const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const dataDir = path.join(__dirname, '..', 'data');
const readJson = (file) =>
	JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));

async function main() {
	const standings = readJson('standings.json');
	const team = readJson('team.json');
	const matches = readJson('matches.json');
	const news = readJson('news.json');

	const seasonIdByName = new Map();
	for (const s of standings) {
		const season = await prisma.season.upsert({
			where: { name: s.season },
			update: {},
			create: { name: s.season },
		});
		seasonIdByName.set(s.season, season.id);
		for (const row of s.table) {
			await prisma.standingsRow.create({ data: { seasonId: season.id, ...row } });
		}
	}

	const playerIdByOldId = new Map();
	for (const p of team) {
		const [firstName, ...rest] = p.name.split(' ');
		const lastName = rest.join(' ') || '—';
		const player = await prisma.player.create({
			data: {
				firstName,
				lastName,
				position: p.position,
				number: p.number,
				birthDate: p.birthDate ? new Date(p.birthDate) : null,
				joined: p.joined ?? null,
				bio: p.bio ?? null,
			},
		});
		playerIdByOldId.set(p.id, player.id);
	}

	const currentSeasonId = seasonIdByName.get('2025/2026');
	const matchIdByOldId = new Map();
	for (const m of matches) {
		const ourScore = m.played ? (m.home ? m.scoreHome : m.scoreAway) : null;
		const opponentScore = m.played ? (m.home ? m.scoreAway : m.scoreHome) : null;
		const match = await prisma.match.create({
			data: {
				opponent: m.opponent,
				date: new Date(`${m.date}T${m.time}:00`),
				matchType: 'Liga',
				round: m.round,
				home: m.home,
				ourScore,
				opponentScore,
				seasonId: currentSeasonId,
			},
		});
		matchIdByOldId.set(m.id, match.id);

		if (m.played) {
			for (const newPlayerId of playerIdByOldId.values()) {
				await prisma.appearance.create({
					data: { matchId: match.id, playerId: newPlayerId },
				});
			}
		}
	}

	for (const n of news) {
		await prisma.newsItem.upsert({
			where: { slug: n.slug },
			update: {},
			create: {
				slug: n.slug,
				title: n.title,
				date: new Date(n.date),
				excerpt: n.excerpt,
				content: n.content,
			},
		});
	}

	const lewandowski = playerIdByOldId.get('6');
	const kaminski = playerIdByOldId.get('5');

	const match1 = matchIdByOldId.get('1'); // 2:1 home win
	const match2 = matchIdByOldId.get('2'); // 1:1 away draw

	if (match1) {
		await prisma.goal.create({ data: { matchId: match1, playerId: lewandowski } });
		await prisma.goal.create({ data: { matchId: match1, playerId: kaminski } });
		await prisma.assist.create({ data: { matchId: match1, playerId: kaminski } });
	}
	if (match2) {
		await prisma.goal.create({ data: { matchId: match2, playerId: lewandowski } });
		await prisma.assist.create({ data: { matchId: match2, playerId: kaminski } });
	}

	console.log('Seed complete.');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
