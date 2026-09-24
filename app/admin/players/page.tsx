import Link from 'next/link';
import { getTeam } from '@/lib/data';
import { deletePlayer } from '@/lib/actions/players';

export default async function AdminPlayersPage() {
	const players = await getTeam();

	return (
		<div className='min-h-screen bg-zinc-800 p-6 md:p-10'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6'>
				<h1 className='text-3xl font-bold text-white'>Drużyna</h1>
				<div className='flex items-center gap-4'>
					<Link
						href='/admin/players/new'
						className='px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 text-sm sm:text-base'>
						+ Dodaj zawodnika
					</Link>
					<Link href='/admin' className='text-pink-400 hover:underline'>
						← Powrót
					</Link>
				</div>
			</div>

			<div className='overflow-x-auto rounded-md border-2 border-pink-300'>
				<table className='w-full text-white text-left border-collapse'>
					<thead>
						<tr className='bg-zinc-700 text-sm'>
							<th className='p-2 sm:p-3'>Nr</th>
							<th className='p-2 sm:p-3'>Imię i nazwisko</th>
							<th className='p-2 sm:p-3 hidden sm:table-cell'>Pozycja</th>
							<th className='p-2 sm:p-3' />
						</tr>
					</thead>
					<tbody>
						{players.map((p) => (
							<tr key={p.id} className='border-t border-zinc-700'>
								<td className='p-2 sm:p-3 font-bold'>#{p.number}</td>
								<td className='p-2 sm:p-3'>{p.firstName} {p.lastName}</td>
								<td className='p-2 sm:p-3 text-zinc-400 hidden sm:table-cell'>{p.position}</td>
								<td className='p-2 sm:p-3 text-right whitespace-nowrap'>
									<Link
										href={`/admin/players/${p.id}`}
										className='text-pink-400 hover:underline mr-4'>
										Edytuj
									</Link>
									<form action={deletePlayer.bind(null, p.id)} className='inline'>
										<button className='text-red-400 hover:underline'>Usuń</button>
									</form>
								</td>
							</tr>
						))}
						{players.length === 0 && (
							<tr>
								<td colSpan={4} className='p-6 text-center text-zinc-400'>
									Brak zawodników. Dodaj pierwszego!
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
