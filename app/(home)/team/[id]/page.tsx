import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Section from '@/components/ui/section';
import Wrapper from '@/components/wrapper';
import {
	getPlayer,
	getPlayerCareerStats,
	getPlayerSeasonStats,
	getPlayerMatchLog,
	displayScore,
} from '@/lib/data';
import { formatDate } from '@/lib/format';
import logo from '@/assets/logo/logo-noBG.png';

export default async function PlayerPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const player = await getPlayer(id);

	if (!player) {
		notFound();
	}

	const [career, seasonStats, matchLog] = await Promise.all([
		getPlayerCareerStats(id),
		getPlayerSeasonStats(id),
		getPlayerMatchLog(id),
	]);

	return (
		<Section>
			<Wrapper>
				<Link href='/team' className='text-pink-400 hover:underline'>
					← Cała drużyna
				</Link>

				<div className='mt-6 flex flex-col gap-6 sm:flex-row sm:items-center'>
					<Image
						src={player.imageUrl || logo.src}
						width={128}
						height={128}
						alt=''
						className={`h-32 w-32 rounded-full object-cover ${player.imageUrl ? '' : 'opacity-70'}`}
					/>
					<div>
						<span className='text-pink-400 text-2xl font-bold'>#{player.number}</span>
						<h1 className='text-3xl font-bold text-white lg:text-4xl'>
							{player.firstName} {player.lastName}
						</h1>
						<p className='text-zinc-400'>{player.position}</p>
					</div>
				</div>

				<div className='grid gap-6 mt-8 md:grid-cols-3'>
					<div className='md:col-span-1 flex flex-col gap-3 p-6 border-2 border-pink-300 rounded-md text-white'>
						<h2 className='text-xl font-bold mb-2'>Informacje</h2>
						{player.birthDate && (
							<p>
								<span className='text-zinc-400'>Data urodzenia: </span>
								{formatDate(player.birthDate)}
							</p>
						)}
						{player.joined && (
							<p>
								<span className='text-zinc-400'>W klubie od: </span>
								{player.joined}
							</p>
						)}
						{player.bio && <p className='text-zinc-300 mt-2'>{player.bio}</p>}
					</div>

					<div className='md:col-span-2 p-6 border-2 border-pink-300 rounded-md text-white'>
						<h2 className='text-xl font-bold mb-4'>Statystyki karierowe</h2>
						<div className='grid grid-cols-3 gap-4 mb-6 sm:grid-cols-5'>
							<Stat label='Mecze' value={career.matchesPlayed} />
							<Stat label='Gole' value={career.goals} />
							<Stat label='Asysty' value={career.assists} />
							<Stat label='Żółte' value={career.yellowCards} />
							<Stat label='Czerwone' value={career.redCards} />
						</div>

						<h3 className='text-lg font-bold mb-2 text-pink-400'>Sezon po sezonie</h3>
						<div className='overflow-x-auto'>
							<table className='w-full text-left border-collapse'>
								<thead>
									<tr className='text-sm text-zinc-400'>
										<th className='p-2'>Sezon</th>
										<th className='p-2 text-center'>Mecze</th>
										<th className='p-2 text-center'>Gole</th>
										<th className='p-2 text-center'>Asysty</th>
										<th className='p-2 text-center'>Żółte</th>
										<th className='p-2 text-center'>Czerwone</th>
									</tr>
								</thead>
								<tbody>
									{seasonStats.map((s) => (
										<tr key={s.season} className='border-t border-zinc-700'>
											<td className='p-2 font-semibold'>{s.season}</td>
											<td className='p-2 text-center'>{s.matchesPlayed}</td>
											<td className='p-2 text-center'>{s.goals}</td>
											<td className='p-2 text-center'>{s.assists}</td>
											<td className='p-2 text-center'>{s.yellowCards}</td>
											<td className='p-2 text-center'>{s.redCards}</td>
										</tr>
									))}
								</tbody>
							</table>
							{seasonStats.length === 0 && (
								<p className='text-zinc-400'>Brak danych statystycznych.</p>
							)}
						</div>
					</div>
				</div>

				<div className='mt-6 p-6 border-2 border-pink-300 rounded-md text-white'>
					<h2 className='text-xl font-bold mb-4'>Rozegrane mecze</h2>
					<div className='overflow-x-auto'>
						<table className='w-full text-left border-collapse'>
							<thead>
								<tr className='text-sm text-zinc-400'>
									<th className='p-2'>Data</th>
									<th className='p-2'>Przeciwnik</th>
									<th className='p-2 text-center'>Wynik</th>
									<th className='p-2'>Wkład</th>
								</tr>
							</thead>
							<tbody>
								{matchLog.map(({ match, goals, assists, yellowCards, redCards }) => {
									const score = displayScore(match);
									const contribution = [
										goals > 0 ? `⚽×${goals}` : null,
										assists > 0 ? `🅰️×${assists}` : null,
										yellowCards > 0 ? '🟨'.repeat(yellowCards) : null,
										redCards > 0 ? '🟥'.repeat(redCards) : null,
									].filter(Boolean);

									return (
										<tr key={match.id} className='border-t border-zinc-700'>
											<td className='p-2 whitespace-nowrap'>{formatDate(match.date)}</td>
											<td className='p-2'>
												{match.opponent}
												<span className='text-zinc-500 text-xs ml-1'>
													({match.home ? 'dom' : 'wyjazd'})
												</span>
											</td>
											<td className='p-2 text-center whitespace-nowrap'>
												{score ? `${score[0]} : ${score[1]}` : '—'}
											</td>
											<td className='p-2 text-sm'>
												{contribution.length > 0 ? contribution.join(' ') : '—'}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{matchLog.length === 0 && (
							<p className='text-zinc-400'>Zawodnik nie rozegrał jeszcze żadnego meczu.</p>
						)}
					</div>
				</div>
			</Wrapper>
		</Section>
	);
}

function Stat({ label, value }: { label: string; value: number }) {
	return (
		<div className='flex flex-col items-center p-3 bg-zinc-700 rounded-md'>
			<span className='text-2xl font-bold text-pink-400'>{value}</span>
			<span className='text-xs text-zinc-400'>{label}</span>
		</div>
	);
}
