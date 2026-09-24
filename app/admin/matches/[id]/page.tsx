import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatDate, formatTime } from '@/lib/format';
import { updateOpponentScore, deleteMatch } from '@/lib/actions/matches';
import {
	addAppearance,
	removeAppearance,
	addGoal,
	removeGoal,
	addAssist,
	removeAssist,
	addCard,
	removeCard,
} from '@/lib/actions/matchEvents';

export default async function MatchDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const match = await prisma.match.findUnique({
		where: { id },
		include: {
			appearances: { include: { player: true } },
			goals: { include: { player: true } },
			assists: { include: { player: true } },
			cards: { include: { player: true } },
		},
	});

	if (!match) {
		notFound();
	}

	const allPlayers = await prisma.player.findMany({ orderBy: { number: 'asc' } });
	const squadIds = new Set(match.appearances.map((a) => a.playerId));
	const squadPlayers = allPlayers.filter((p) => squadIds.has(p.id));

	return (
		<div className='min-h-screen bg-zinc-800 p-6 md:p-10'>
			<Link href='/admin/matches' className='text-pink-400 hover:underline mb-6 inline-block'>
				← Wróć do listy
			</Link>

			<div className='bg-zinc-900 text-white p-8 rounded-2xl border-2 border-pink-300 mb-8'>
				<div className='text-center text-zinc-400 text-sm uppercase tracking-widest mb-2'>
					{match.matchType} • {formatDate(match.date)} {formatTime(match.date)}
				</div>

				<div className='flex justify-center items-center gap-8 md:gap-16'>
					<div className='text-center w-1/3'>
						<h2 className='text-2xl md:text-4xl font-bold text-pink-400'>
							{match.home ? 'Pretty Boys' : match.opponent}
						</h2>
					</div>

					<div className='bg-zinc-800 px-8 py-4 rounded-lg border border-zinc-700'>
						<span className='text-5xl md:text-6xl font-black tracking-tighter'>
							{match.home ? match.ourScore ?? 0 : match.opponentScore ?? 0}
							{' : '}
							{match.home ? match.opponentScore ?? 0 : match.ourScore ?? 0}
						</span>
					</div>

					<div className='text-center w-1/3'>
						<h2 className='text-xl md:text-3xl font-bold'>
							{match.home ? match.opponent : 'Pretty Boys'}
						</h2>
					</div>
				</div>

				<div className='mt-8 flex justify-center'>
					<form action={updateOpponentScore.bind(null, match.id)} className='flex gap-2 items-end'>
						<label className='text-xs text-zinc-400'>Gole przeciwnika:</label>
						<input
							name='opponentScore'
							type='number'
							defaultValue={match.opponentScore ?? 0}
							className='w-16 bg-zinc-800 border border-zinc-600 text-white rounded px-2 py-1 text-center'
						/>
						<button className='bg-pink-500 px-3 py-1 rounded text-xs font-bold hover:bg-pink-600'>
							Zapisz
						</button>
					</form>
				</div>
				<p className='text-center text-xs text-zinc-500 mt-2'>
					Nasze gole liczone automatycznie na podstawie strzelców poniżej.
				</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
				<div className='bg-zinc-900 p-6 rounded-xl border-2 border-pink-300'>
					<h3 className='text-lg font-bold text-white mb-4'>Skład meczowy</h3>
					<div className='space-y-2 max-h-96 overflow-y-auto pr-2'>
						{allPlayers.map((player) => {
							const appearance = match.appearances.find((a) => a.playerId === player.id);
							return (
								<form
									key={player.id}
									action={
										appearance
											? removeAppearance.bind(null, appearance.id, match.id)
											: addAppearance.bind(null, match.id, player.id)
									}>
									<button
										className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
											appearance
												? 'bg-pink-500/10 border-pink-400'
												: 'border-transparent hover:bg-zinc-800'
										}`}>
										<span className='flex items-center gap-3'>
											<span className='bg-zinc-700 text-white font-bold w-8 h-8 flex items-center justify-center rounded-full text-sm'>
												{player.number}
											</span>
											<span className='font-medium text-white'>
												{player.firstName} {player.lastName}
											</span>
										</span>
										<span className={appearance ? 'text-red-400 text-sm' : 'text-green-400 text-sm'}>
											{appearance ? 'Usuń' : 'Dodaj'}
										</span>
									</button>
								</form>
							);
						})}
					</div>
				</div>

				<div className='bg-zinc-900 p-6 rounded-xl border-2 border-pink-300'>
					<h3 className='text-lg font-bold text-white mb-4'>⚽ Gole</h3>
					{squadPlayers.length === 0 && (
						<p className='text-zinc-400 text-sm mb-4'>Najpierw dodaj zawodników do składu.</p>
					)}
					<div className='flex flex-col gap-2 mb-4'>
						{squadPlayers.map((player) => (
							<form
								key={player.id}
								action={addGoal.bind(null, match.id, player.id)}
								className='flex items-center gap-2'>
								<span className='flex-1 text-white text-sm'>
									{player.firstName} {player.lastName}
								</span>
								<input
									name='minute'
									type='number'
									min={1}
									max={130}
									placeholder="min'"
									className='w-16 px-2 py-1 rounded text-black text-sm'
								/>
								<button className='px-3 py-1 bg-zinc-800 border border-zinc-600 text-white rounded-full text-sm hover:border-pink-400'>
									+ Gol
								</button>
							</form>
						))}
					</div>
					<div className='space-y-2'>
						{[...match.goals]
							.sort((a, b) => (a.minute ?? Infinity) - (b.minute ?? Infinity))
							.map((goal) => (
								<div
									key={goal.id}
									className='flex items-center justify-between bg-zinc-800 p-2 rounded-lg border border-zinc-700'>
									<span className='text-white text-sm'>
										{goal.minute ? `${goal.minute}' ` : ''}
										{goal.player.firstName} {goal.player.lastName}
									</span>
									<form action={removeGoal.bind(null, goal.id, match.id)}>
										<button className='text-red-400 hover:text-red-300 text-xs'>Usuń</button>
									</form>
								</div>
							))}
						{match.goals.length === 0 && <p className='text-zinc-500 text-sm'>Brak bramek.</p>}
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<div className='bg-zinc-900 p-6 rounded-xl border-2 border-pink-300'>
					<h3 className='text-lg font-bold text-white mb-4'>🎯 Asysty</h3>
					{squadPlayers.length === 0 && (
						<p className='text-zinc-400 text-sm mb-4'>Najpierw dodaj zawodników do składu.</p>
					)}
					<div className='flex flex-wrap gap-2 mb-4'>
						{squadPlayers.map((player) => (
							<form key={player.id} action={addAssist.bind(null, match.id, player.id)}>
								<button className='px-3 py-1 bg-zinc-800 border border-zinc-600 text-white rounded-full text-sm hover:border-pink-400'>
									+ {player.firstName} {player.lastName}
								</button>
							</form>
						))}
					</div>
					<div className='space-y-2'>
						{match.assists.map((assist) => (
							<div
								key={assist.id}
								className='flex items-center justify-between bg-zinc-800 p-2 rounded-lg border border-zinc-700'>
								<span className='text-white text-sm'>
									{assist.player.firstName} {assist.player.lastName}
								</span>
								<form action={removeAssist.bind(null, assist.id, match.id)}>
									<button className='text-red-400 hover:text-red-300 text-xs'>Usuń</button>
								</form>
							</div>
						))}
						{match.assists.length === 0 && <p className='text-zinc-500 text-sm'>Brak asyst.</p>}
					</div>
				</div>

				<div className='bg-zinc-900 p-6 rounded-xl border-2 border-pink-300'>
					<h3 className='text-lg font-bold text-white mb-4'>🟨🟥 Kartki</h3>
					{squadPlayers.length === 0 && (
						<p className='text-zinc-400 text-sm mb-4'>Najpierw dodaj zawodników do składu.</p>
					)}
					<div className='flex flex-col gap-2 mb-4'>
						{squadPlayers.map((player) => (
							<div key={player.id} className='flex items-center justify-between gap-2'>
								<span className='text-white text-sm'>
									{player.firstName} {player.lastName}
								</span>
								<div className='flex gap-2'>
									<form action={addCard.bind(null, match.id, player.id, 'YELLOW')}>
										<button className='px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded'>
											Żółta
										</button>
									</form>
									<form action={addCard.bind(null, match.id, player.id, 'RED')}>
										<button className='px-2 py-1 bg-red-600 text-white text-xs font-bold rounded'>
											Czerwona
										</button>
									</form>
								</div>
							</div>
						))}
					</div>
					<div className='space-y-2'>
						{match.cards.map((card) => (
							<div
								key={card.id}
								className='flex items-center justify-between bg-zinc-800 p-2 rounded-lg border border-zinc-700'>
								<span className='text-white text-sm'>
									{card.type === 'YELLOW' ? '🟨' : '🟥'} {card.player.firstName} {card.player.lastName}
								</span>
								<form action={removeCard.bind(null, card.id, match.id)}>
									<button className='text-red-400 hover:text-red-300 text-xs'>Usuń</button>
								</form>
							</div>
						))}
						{match.cards.length === 0 && <p className='text-zinc-500 text-sm'>Brak kartek.</p>}
					</div>
				</div>
			</div>

			<form action={deleteMatch.bind(null, match.id)} className='mt-6'>
				<button className='w-full py-2 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/10'>
					Usuń mecz
				</button>
			</form>
		</div>
	);
}
