import Link from 'next/link';
import { getMatches } from '@/lib/data';
import { formatDate, formatTime } from '@/lib/format';

export default async function AdminMatchesPage() {
	const matches = (await getMatches()).slice().reverse();

	return (
		<div className='min-h-screen bg-zinc-800 p-6 md:p-10'>
			<div className='flex items-center justify-between mb-6'>
				<h1 className='text-3xl font-bold text-white'>Terminarz i wyniki</h1>
				<div className='flex items-center gap-4'>
					<Link
						href='/admin/matches/new'
						className='px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600'>
						+ Dodaj mecz
					</Link>
					<Link href='/admin' className='text-pink-400 hover:underline'>
						← Powrót
					</Link>
				</div>
			</div>

			<div className='flex flex-col gap-3'>
				{matches.map((m) => {
					const isPlayed = m.ourScore !== null && m.opponentScore !== null;
					let borderColor = 'border-zinc-600';
					if (isPlayed) {
						if (m.ourScore! > m.opponentScore!) borderColor = 'border-green-500';
						else if (m.ourScore === m.opponentScore) borderColor = 'border-yellow-500';
						else borderColor = 'border-red-500';
					}

					return (
						<div
							key={m.id}
							className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border-2 ${borderColor} bg-zinc-900`}>
							<div>
								<div className='text-sm font-bold text-zinc-300'>
									{formatDate(m.date)}, {formatTime(m.date)}
								</div>
								<div className='text-xs text-zinc-500 uppercase mt-1'>
									{m.matchType} {m.round ? `• ${m.round}` : ''}
								</div>
							</div>

							<div className='flex items-center gap-3 text-xl font-bold text-white'>
								<span className='text-pink-400'>{m.home ? 'Pretty Boys' : m.opponent}</span>
								<span className='px-3 py-1 rounded bg-zinc-800 border border-zinc-600'>
									{isPlayed
										? m.home
											? `${m.ourScore} : ${m.opponentScore}`
											: `${m.opponentScore} : ${m.ourScore}`
										: '- : -'}
								</span>
								<span>{m.home ? m.opponent : 'Pretty Boys'}</span>
							</div>

							<Link
								href={`/admin/matches/${m.id}`}
								className='text-sm font-bold text-pink-400 hover:underline'>
								Zarządzaj
							</Link>
						</div>
					);
				})}

				{matches.length === 0 && (
					<p className='text-center p-8 text-zinc-400'>Brak meczów. Dodaj pierwszy!</p>
				)}
			</div>
		</div>
	);
}
