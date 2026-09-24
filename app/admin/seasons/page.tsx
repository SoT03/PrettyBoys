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
			<div className='flex items-center justify-between mb-6'>
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

					<div className='overflow-x-auto'>
						<table className='w-full text-white border-collapse text-sm'>
							<thead>
								<tr className='text-left text-zinc-400'>
									{fields.map((f) => (
										<th key={f.key} className='p-2'>
											{f.label}
										</th>
									))}
									<th className='p-2' />
								</tr>
							</thead>
							<tbody>
								{active.standings.map((row) => (
									<tr key={row.id} className='border-t border-zinc-700'>
										<td colSpan={fields.length + 1} className='p-0'>
											<form
												action={updateStandingsRow.bind(null, row.id)}
												className='flex items-center gap-2 p-2'>
												{fields.map((f) => (
													<input
														key={f.key}
														name={f.key}
														type={f.key === 'team' ? 'text' : 'number'}
														defaultValue={row[f.key]}
														className='px-2 py-1 rounded text-black w-20'
													/>
												))}
												<button className='px-3 py-1 bg-zinc-600 text-white rounded hover:bg-zinc-500'>
													Zapisz
												</button>
											</form>
										</td>
										<td className='p-2 text-right'>
											<form action={deleteStandingsRow.bind(null, row.id)}>
												<button className='px-3 py-1 bg-red-500 text-white rounded'>Usuń</button>
											</form>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<form
						action={addStandingsRow.bind(null, active.id)}
						className='flex flex-wrap items-center gap-2 mt-4 p-4 bg-zinc-900 rounded-md border border-dashed border-zinc-600'>
						<span className='text-sm text-zinc-400 mr-2'>Dodaj drużynę:</span>
						{fields.map((f) => (
							<input
								key={f.key}
								name={f.key}
								type={f.key === 'team' ? 'text' : 'number'}
								placeholder={f.label}
								defaultValue={f.key === 'position' ? active.standings.length + 1 : undefined}
								className='px-2 py-1 rounded text-black w-20'
							/>
						))}
						<button className='px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600'>
							+ Dodaj
						</button>
					</form>
				</>
			)}

			{seasons.length === 0 && (
				<p className='text-zinc-400'>Brak sezonów. Dodaj pierwszy powyżej.</p>
			)}
		</div>
	);
}
