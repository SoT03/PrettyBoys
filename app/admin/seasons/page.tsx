import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
	addSeason,
	deleteSeason,
	addStandingsRow,
	updateStandingsRow,
	deleteStandingsRow,
} from '@/lib/actions/seasons';

const fields = [
	{ key: 'position', label: 'Poz.' },
	{ key: 'team', label: 'Drużyna' },
	{ key: 'played', label: 'M' },
	{ key: 'win', label: 'W' },
	{ key: 'draw', label: 'R' },
	{ key: 'loss', label: 'P' },
	{ key: 'goalsFor', label: 'Bramki+' },
	{ key: 'goalsAgainst', label: 'Bramki-' },
	{ key: 'points', label: 'Pkt' },
] as const;

export default async function AdminSeasonsPage({
	searchParams,
}: {
	searchParams: Promise<{ season?: string }>;
}) {
	const sp = await searchParams;
	const seasons = await prisma.season.findMany({
		orderBy: { name: 'desc' },
		include: { standings: { orderBy: { position: 'asc' } } },
	});

	const active = seasons.find((s) => s.id === sp.season) ?? seasons[0];

	return (
		<div className='min-h-screen bg-zinc-800 p-6 md:p-10'>
			<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6'>
				<h1 className='text-3xl font-bold text-white'>Tabela ligowa</h1>
				<Link href='/admin' className='text-pink-400 hover:underline'>
					← Powrót
				</Link>
			</div>

			<div className='flex flex-wrap items-center gap-2 mb-6'>
				{seasons.map((s) => (
					<Link
						key={s.id}
						href={`/admin/seasons?season=${s.id}`}
						className={`px-3 py-1 rounded-full text-sm border ${
							active?.id === s.id
								? 'bg-pink-500 border-pink-500 text-white'
								: 'border-zinc-500 text-zinc-300 hover:border-pink-300'
						}`}>
						{s.name}
					</Link>
				))}
				<form action={addSeason} className='flex items-center gap-2'>
					<input
						name='name'
						required
						placeholder='2026/2027'
						className='px-2 py-1 rounded text-black text-sm w-28'
					/>
					<button className='px-3 py-1 rounded-full text-sm border border-dashed border-zinc-500 text-zinc-300 hover:border-pink-300'>
						+ Nowy sezon
					</button>
				</form>
			</div>

			{active && (
				<>
					<div className='flex items-center justify-between mb-4'>
						<h2 className='text-xl font-bold text-white'>{active.name}</h2>
						{seasons.length > 1 && (
							<form action={deleteSeason.bind(null, active.id)}>
								<button className='px-3 py-1 bg-red-500 text-white rounded text-sm'>
									Usuń sezon
								</button>
							</form>
						)}
					</div>

					<div className='flex flex-col gap-4'>
						{active.standings.map((row) => (
							<div key={row.id} className='p-4 bg-zinc-900 rounded-md border-2 border-pink-300'>
								<form action={updateStandingsRow.bind(null, row.id)} className='space-y-3'>
									<div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-9'>
										{fields.map((f) => (
											<label key={f.key} className='flex flex-col text-xs text-zinc-400'>
												{f.label}
												<input
													name={f.key}
													type={f.key === 'team' ? 'text' : 'number'}
													defaultValue={row[f.key]}
													className='px-2 py-1 rounded text-black text-sm mt-1'
												/>
											</label>
										))}
									</div>
									<div className='flex items-center gap-3'>
										<button className='px-3 py-1 bg-zinc-600 text-white rounded hover:bg-zinc-500 text-sm'>
											Zapisz
										</button>
										<button
											formAction={deleteStandingsRow.bind(null, row.id)}
											className='px-3 py-1 bg-red-500 text-white rounded text-sm'>
											Usuń
										</button>
									</div>
								</form>
							</div>
						))}
						{active.standings.length === 0 && (
							<p className='text-zinc-400 text-sm'>Brak drużyn w tabeli. Dodaj pierwszą poniżej.</p>
						)}
					</div>

					<div className='mt-4 p-4 bg-zinc-900 rounded-md border border-dashed border-zinc-600'>
						<h3 className='text-sm text-zinc-400 mb-3'>Dodaj drużynę</h3>
						<form action={addStandingsRow.bind(null, active.id)} className='space-y-3'>
							<div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-9'>
								{fields.map((f) => (
									<label key={f.key} className='flex flex-col text-xs text-zinc-400'>
										{f.label}
										<input
											name={f.key}
											type={f.key === 'team' ? 'text' : 'number'}
											defaultValue={f.key === 'position' ? active.standings.length + 1 : undefined}
											className='px-2 py-1 rounded text-black text-sm mt-1'
										/>
									</label>
								))}
							</div>
							<button className='px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 text-sm'>
								+ Dodaj
							</button>
						</form>
					</div>
				</>
			)}

			{seasons.length === 0 && (
				<p className='text-zinc-400'>Brak sezonów. Dodaj pierwszy powyżej.</p>
			)}
		</div>
	);
}
