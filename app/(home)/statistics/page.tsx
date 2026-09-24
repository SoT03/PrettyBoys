import Link from 'next/link';
import Section from '@/components/ui/section';
import Wrapper from '@/components/wrapper';
import { getStandings, getLeaderboard, getSeasonsDesc, playerName } from '@/lib/data';

export const metadata = {
	title: 'Statystyki | Pretty Boys',
};

const TABS = [
	{ key: 'table', label: 'Tabela ligowa' },
	{ key: 'scorers', label: 'Strzelcy' },
	{ key: 'assists', label: 'Asystenci' },
	{ key: 'matches', label: 'Najwięcej meczów' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

function buildHref(tab: string, season: string) {
	const params = new URLSearchParams({ tab, season });
	return `/statistics?${params.toString()}`;
}

export default async function StatisticsPage({
	searchParams,
}: {
	searchParams: Promise<{ tab?: string; season?: string }>;
}) {
	const sp = await searchParams;
	const [standings, seasons] = await Promise.all([getStandings(), getSeasonsDesc()]);

	const activeTab: TabKey = TABS.some((t) => t.key === sp.tab)
		? (sp.tab as TabKey)
		: 'table';

	const isLeaderboard = activeTab !== 'table';
	const requestedSeason = sp.season;

	const activeSeason =
		activeTab === 'table'
			? requestedSeason && seasons.includes(requestedSeason)
				? requestedSeason
				: seasons[0]
			: requestedSeason && (requestedSeason === 'all' || seasons.includes(requestedSeason))
			? requestedSeason
			: 'all';

	const seasonTable = standings.find((s) => s.season === activeSeason)?.table ?? [];

	const leaderboard = isLeaderboard
		? (await getLeaderboard(activeSeason))
				.filter((row) => row.matchesPlayed > 0 || row.goals > 0 || row.assists > 0)
				.sort((a, b) => {
					if (activeTab === 'scorers') return b.goals - a.goals;
					if (activeTab === 'assists') return b.assists - a.assists;
					return b.matchesPlayed - a.matchesPlayed;
				})
		: [];

	const primaryStatKey: 'goals' | 'assists' | 'matchesPlayed' =
		activeTab === 'scorers' ? 'goals' : activeTab === 'assists' ? 'assists' : 'matchesPlayed';

	return (
		<Section>
			<Wrapper>
				<h1 className='text-3xl font-bold text-white mb-2 lg:text-4xl'>
					Statystyki
				</h1>
				<p className='text-pink-400 mb-8 text-lg'>Historia i statystyki klubu</p>

				<div className='flex flex-col gap-8 lg:flex-row'>
					<nav className='flex flex-row gap-2 overflow-x-auto lg:flex-col lg:w-56 lg:shrink-0'>
						{TABS.map((tab) => (
							<Link
								key={tab.key}
								href={buildHref(tab.key, tab.key === 'table' ? seasons[0] ?? 'all' : 'all')}
								className={`px-4 py-2 rounded-md whitespace-nowrap text-sm font-semibold border-2 transition-colors ${
									activeTab === tab.key
										? 'bg-pink-500 border-pink-500 text-white'
										: 'border-pink-300 text-white hover:bg-zinc-700'
								}`}>
								{tab.label}
							</Link>
						))}
					</nav>

					<div className='flex-1'>
						<div className='flex flex-wrap gap-2 mb-6'>
							{isLeaderboard && (
								<Link
									href={buildHref(activeTab, 'all')}
									className={`px-3 py-1 rounded-full text-sm border ${
										activeSeason === 'all'
											? 'bg-pink-500 border-pink-500 text-white'
											: 'border-zinc-500 text-zinc-300 hover:border-pink-300'
									}`}>
									Wszystkie sezony
								</Link>
							)}
							{seasons.map((season) => (
								<Link
									key={season}
									href={buildHref(activeTab, season)}
									className={`px-3 py-1 rounded-full text-sm border ${
										activeSeason === season
											? 'bg-pink-500 border-pink-500 text-white'
											: 'border-zinc-500 text-zinc-300 hover:border-pink-300'
									}`}>
									{season}
								</Link>
							))}
						</div>

						{activeTab === 'table' ? (
							<div className='overflow-x-auto rounded-md border-2 border-pink-300'>
								<table className='w-full text-white text-left border-collapse'>
									<thead>
										<tr className='bg-zinc-700 text-sm'>
											<th className='p-2 sm:p-3'>#</th>
											<th className='p-2 sm:p-3'>Drużyna</th>
											<th className='p-2 sm:p-3 text-center'>M</th>
											<th className='p-2 sm:p-3 text-center hidden sm:table-cell'>W</th>
											<th className='p-2 sm:p-3 text-center hidden sm:table-cell'>R</th>
											<th className='p-2 sm:p-3 text-center hidden sm:table-cell'>P</th>
											<th className='p-2 sm:p-3 text-center'>Bramki</th>
											<th className='p-2 sm:p-3 text-center'>Pkt</th>
										</tr>
									</thead>
									<tbody>
										{seasonTable.map((row) => (
											<tr
												key={row.position}
												className={`border-t border-zinc-700 ${
													row.team === 'Pretty Boys' ? 'bg-pink-500/10' : ''
												}`}>
												<td className='p-2 sm:p-3'>{row.position}</td>
												<td className='p-2 sm:p-3 font-semibold'>{row.team}</td>
												<td className='p-2 sm:p-3 text-center'>{row.played}</td>
												<td className='p-2 sm:p-3 text-center hidden sm:table-cell'>{row.win}</td>
												<td className='p-2 sm:p-3 text-center hidden sm:table-cell'>{row.draw}</td>
												<td className='p-2 sm:p-3 text-center hidden sm:table-cell'>{row.loss}</td>
												<td className='p-2 sm:p-3 text-center whitespace-nowrap'>
													{row.goalsFor}:{row.goalsAgainst}
												</td>
												<td className='p-2 sm:p-3 text-center font-bold'>{row.points}</td>
											</tr>
										))}
									</tbody>
								</table>
								{seasonTable.length === 0 && (
									<p className='text-white p-4'>Brak danych dla tego sezonu.</p>
								)}
							</div>
						) : (
							<div className='overflow-x-auto rounded-md border-2 border-pink-300'>
								<table className='w-full text-white text-left border-collapse'>
									<thead>
										<tr className='bg-zinc-700 text-sm'>
											<th className='p-2 sm:p-3'>#</th>
											<th className='p-2 sm:p-3'>Zawodnik</th>
											<th className='p-2 sm:p-3 hidden sm:table-cell'>Pozycja</th>
											<th
												className={`p-2 sm:p-3 text-center ${
													primaryStatKey === 'matchesPlayed' ? '' : 'hidden sm:table-cell'
												}`}>
												Mecze
											</th>
											<th
												className={`p-2 sm:p-3 text-center ${
													primaryStatKey === 'goals' ? '' : 'hidden sm:table-cell'
												}`}>
												Gole
											</th>
											<th
												className={`p-2 sm:p-3 text-center ${
													primaryStatKey === 'assists' ? '' : 'hidden sm:table-cell'
												}`}>
												Asysty
											</th>
											<th className='p-2 sm:p-3 text-center hidden sm:table-cell'>Żółte</th>
											<th className='p-2 sm:p-3 text-center hidden sm:table-cell'>Czerwone</th>
										</tr>
									</thead>
									<tbody>
										{leaderboard.map((row, i) => (
											<tr key={row.player.id} className='border-t border-zinc-700'>
												<td className='p-2 sm:p-3'>{i + 1}</td>
												<td className='p-2 sm:p-3 font-semibold'>
													<Link
														href={`/team/${row.player.id}`}
														className='hover:text-pink-400'>
														#{row.player.number} {playerName(row.player)}
													</Link>
												</td>
												<td className='p-2 sm:p-3 text-zinc-400 hidden sm:table-cell'>
													{row.player.position}
												</td>
												<td
													className={`p-2 sm:p-3 text-center ${
														primaryStatKey === 'matchesPlayed'
															? 'font-bold text-pink-400'
															: 'hidden sm:table-cell'
													}`}>
													{row.matchesPlayed}
												</td>
												<td
													className={`p-2 sm:p-3 text-center ${
														primaryStatKey === 'goals' ? 'font-bold text-pink-400' : 'hidden sm:table-cell'
													}`}>
													{row.goals}
												</td>
												<td
													className={`p-2 sm:p-3 text-center ${
														primaryStatKey === 'assists'
															? 'font-bold text-pink-400'
															: 'hidden sm:table-cell'
													}`}>
													{row.assists}
												</td>
												<td className='p-2 sm:p-3 text-center hidden sm:table-cell'>{row.yellowCards}</td>
												<td className='p-2 sm:p-3 text-center hidden sm:table-cell'>{row.redCards}</td>
											</tr>
										))}
									</tbody>
								</table>
								{leaderboard.length === 0 && (
									<p className='text-white p-4'>Brak danych statystycznych.</p>
								)}
							</div>
						)}
					</div>
				</div>
			</Wrapper>
		</Section>
	);
}
