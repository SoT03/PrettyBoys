import Link from 'next/link';
import { notFound } from 'next/navigation';
import PlayerForm from '@/components/admin/playerForm';
import { getPlayer } from '@/lib/data';
import { updatePlayer, deletePlayer } from '@/lib/actions/players';

export default async function EditPlayerPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const player = await getPlayer(id);

	if (!player) {
		notFound();
	}

	return (
		<div className='min-h-screen bg-zinc-800 p-6 md:p-10'>
			<div className='max-w-2xl mx-auto'>
				<Link href='/admin/players' className='text-pink-400 hover:underline mb-4 inline-block'>
					← Wróć do listy
				</Link>
				<h1 className='text-2xl font-bold text-white mb-6'>
					Edytuj zawodnika: {player.firstName} {player.lastName}
				</h1>
				<PlayerForm action={updatePlayer.bind(null, id)} player={player} />

				<form action={deletePlayer.bind(null, id)} className='mt-4'>
					<button className='w-full py-2 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/10'>
						Usuń zawodnika
					</button>
				</form>
			</div>
		</div>
	);
}
