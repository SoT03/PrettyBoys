'use client';

import { useState, useTransition } from 'react';
import type { Player, Season } from '@prisma/client';
import { addMatch, type GoalInput } from '@/lib/actions/matches';

interface GoalRow {
	playerId: string;
	assistPlayerId: string;
	minute: string;
}

export default function NewMatchForm({
	players,
	seasons,
}: {
	players: Player[];
	seasons: Season[];
}) {
	const [squad, setSquad] = useState<string[]>([]);
	const [goals, setGoals] = useState<GoalRow[]>([]);
	const [error, setError] = useState('');
	const [pending, startTransition] = useTransition();

	const toggleSquad = (id: string) => {
		setSquad((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
	};

	const addGoalRow = () => {
		setGoals((prev) => [...prev, { playerId: players[0]?.id ?? '', assistPlayerId: '', minute: '' }]);
	};

	const updateGoalRow = (index: number, patch: Partial<GoalRow>) => {
		setGoals((prev) => prev.map((g, i) => (i === index ? { ...g, ...patch } : g)));
	};

	const removeGoalRow = (index: number) => {
		setGoals((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');
		const formData = new FormData(e.currentTarget);

		const opponent = formData.get('opponent') as string;
		const date = formData.get('date') as string;

		if (!opponent || !date) {
			setError('Przeciwnik i data są wymagane.');
			return;
		}

		const goalInputs: GoalInput[] = goals
			.filter((g) => g.playerId)
			.map((g) => ({
				playerId: g.playerId,
				assistPlayerId: g.assistPlayerId || undefined,
				minute: g.minute !== '' ? Number(g.minute) : undefined,
			}));

		const ourScoreStr = formData.get('ourScore') as string;
		const opponentScoreStr = formData.get('opponentScore') as string;

		startTransition(() => {
			addMatch({
				opponent,
				date,
				location: (formData.get('location') as string) || undefined,
				matchType: (formData.get('matchType') as string) || 'Liga',
				round: (formData.get('round') as string) || undefined,
				home: formData.get('home') === 'on',
				seasonId: (formData.get('seasonId') as string) || undefined,
				ourScore: ourScoreStr !== '' ? Number(ourScoreStr) : undefined,
				opponentScore: opponentScoreStr !== '' ? Number(opponentScoreStr) : undefined,
				squad,
				goals: goalInputs,
			});
		});
	};

	return (
		<form onSubmit={handleSubmit} className='bg-zinc-900 p-6 rounded-xl space-y-6 border-2 border-pink-300'>
			<div className='space-y-4'>
				<div>
					<label className='block text-sm font-semibold text-white mb-1'>Przeciwnik</label>
					<input
						name='opponent'
						required
						type='text'
						className='w-full border border-zinc-600 bg-zinc-800 text-white rounded-md p-2 focus:ring-2 focus:ring-pink-500 outline-none'
						placeholder='FC Rywal'
					/>
				</div>

				<div className='grid grid-cols-2 gap-4'>
					<div>
						<label className='block text-sm font-semibold text-white mb-1'>Data i godzina</label>
						<input
							name='date'
							required
							type='datetime-local'
							className='w-full border border-zinc-600 bg-zinc-800 text-white rounded-md p-2'
						/>
					</div>
					<div>
						<label className='block text-sm font-semibold text-white mb-1'>Typ meczu</label>
						<select
							name='matchType'
							defaultValue='Liga'
							className='w-full border border-zinc-600 bg-zinc-800 text-white rounded-md p-2'>
							<option value='Liga'>Liga</option>
							<option value='Sparing'>Sparing</option>
							<option value='Puchar'>Puchar</option>
							<option value='Turniej'>Turniej</option>
						</select>
					</div>
				</div>

				<div className='grid grid-cols-2 gap-4'>
					<div>
						<label className='block text-sm font-semibold text-white mb-1'>Kolejka</label>
						<input
							name='round'
							type='text'
							className='w-full border border-zinc-600 bg-zinc-800 text-white rounded-md p-2'
							placeholder='20 Kolejka'
						/>
					</div>
					<div>
						<label className='block text-sm font-semibold text-white mb-1'>Sezon</label>
						<select
							name='seasonId'
							className='w-full border border-zinc-600 bg-zinc-800 text-white rounded-md p-2'>
							<option value=''>— brak —</option>
							{seasons.map((s) => (
								<option key={s.id} value={s.id}>
									{s.name}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className='grid grid-cols-2 gap-4 items-center'>
					<label className='flex items-center gap-2 text-white'>
						<input name='home' type='checkbox' defaultChecked />
						Mecz u siebie
					</label>
					<div>
						<label className='block text-sm font-semibold text-white mb-1'>Lokalizacja</label>
						<input
							name='location'
							type='text'
							className='w-full border border-zinc-600 bg-zinc-800 text-white rounded-md p-2'
							placeholder='Orlik ul. Polna'
						/>
					</div>
				</div>
			</div>

			<hr className='border-zinc-700' />

			<div>
				<h3 className='text-sm font-bold text-zinc-400 uppercase mb-3'>Skład</h3>
				<div className='grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 sm:grid-cols-3'>
					{players.map((p) => (
						<label
							key={p.id}
							className='flex items-center gap-2 p-2 rounded-md border border-zinc-700 text-white text-sm hover:border-pink-400'>
							<input
								type='checkbox'
								checked={squad.includes(p.id)}
								onChange={() => toggleSquad(p.id)}
							/>
							#{p.number} {p.firstName} {p.lastName}
						</label>
					))}
					{players.length === 0 && <p className='text-zinc-500 text-sm'>Brak zawodników w bazie.</p>}
				</div>
				<p className='text-xs text-zinc-500 mt-2'>
					Strzelcy i asystenci dodani poniżej zostaną automatycznie dopisani do składu.
				</p>
			</div>

			<hr className='border-zinc-700' />

			<div>
				<h3 className='text-sm font-bold text-zinc-400 uppercase mb-3'>⚽ Gole</h3>
				<div className='flex flex-col gap-2 mb-3'>
					{goals.map((g, i) => (
						<div key={i} className='bg-zinc-800 p-3 rounded-md'>
							<div className='grid grid-cols-2 gap-2 sm:flex sm:items-end sm:flex-wrap'>
								<label className='flex flex-col text-xs text-zinc-400 col-span-2 sm:col-span-1'>
									Strzelec
									<select
										value={g.playerId}
										onChange={(e) => updateGoalRow(i, { playerId: e.target.value })}
										className='px-2 py-1 rounded text-black text-sm mt-1'>
										{players.map((p) => (
											<option key={p.id} value={p.id}>
												{p.firstName} {p.lastName}
											</option>
										))}
									</select>
								</label>
								<label className='flex flex-col text-xs text-zinc-400 col-span-2 sm:col-span-1'>
									Asysta
									<select
										value={g.assistPlayerId}
										onChange={(e) => updateGoalRow(i, { assistPlayerId: e.target.value })}
										className='px-2 py-1 rounded text-black text-sm mt-1'>
										<option value=''>— brak —</option>
										{players
											.filter((p) => p.id !== g.playerId)
											.map((p) => (
												<option key={p.id} value={p.id}>
													{p.firstName} {p.lastName}
												</option>
											))}
									</select>
								</label>
								<label className='flex flex-col text-xs text-zinc-400'>
									Minuta
									<input
										type='number'
										min={1}
										max={130}
										placeholder="min'"
										value={g.minute}
										onChange={(e) => updateGoalRow(i, { minute: e.target.value })}
										className='w-20 px-2 py-1 rounded text-black text-sm mt-1'
									/>
								</label>
								<button
									type='button'
									onClick={() => removeGoalRow(i)}
									className='text-red-400 hover:text-red-300 text-xs h-fit py-1 sm:ml-auto'>
									Usuń
								</button>
							</div>
						</div>
					))}
					{goals.length === 0 && <p className='text-zinc-500 text-sm'>Brak dodanych goli.</p>}
				</div>
				<button
					type='button'
					onClick={addGoalRow}
					disabled={players.length === 0}
					className='px-3 py-1 bg-zinc-800 border border-dashed border-zinc-600 text-white rounded text-sm hover:border-pink-400 disabled:opacity-50'>
					+ Dodaj gola
				</button>
			</div>

			<hr className='border-zinc-700' />

			<div className='bg-zinc-800 p-4 rounded-lg'>
				<h3 className='text-sm font-bold text-zinc-400 uppercase mb-3'>
					Wynik {goals.length > 0 ? '(nasze gole liczone automatycznie z listy powyżej)' : '(opcjonalnie, jeśli nie dodajesz goli osobno)'}
				</h3>
				<div className='flex items-center gap-4 justify-center'>
					<div className='text-center'>
						<label className='block text-sm font-bold text-green-400 mb-1'>MY</label>
						<input
							key={goals.length > 0 ? `auto-${goals.length}` : 'manual'}
							name='ourScore'
							type='number'
							disabled={goals.length > 0}
							defaultValue={goals.length > 0 ? goals.length : ''}
							className='w-20 text-center text-xl font-bold border border-zinc-600 bg-zinc-900 text-white rounded-md p-2 disabled:opacity-50'
							placeholder='-'
						/>
					</div>
					<span className='text-2xl font-bold text-zinc-500'>:</span>
					<div className='text-center'>
						<label className='block text-sm font-bold text-red-400 mb-1'>ONI</label>
						<input
							name='opponentScore'
							type='number'
							className='w-20 text-center text-xl font-bold border border-zinc-600 bg-zinc-900 text-white rounded-md p-2'
							placeholder='-'
						/>
					</div>
				</div>
			</div>

			{error && <p className='text-red-400 text-sm'>{error}</p>}

			<button
				type='submit'
				disabled={pending}
				className='w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50'>
				{pending ? 'Zapisywanie...' : 'Zapisz mecz'}
			</button>
		</form>
	);
}
