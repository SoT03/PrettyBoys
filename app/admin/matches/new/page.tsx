import Link from 'next/link';
import NewMatchForm from '@/components/admin/newMatchForm';
import { prisma } from '@/lib/prisma';

export default async function NewMatchPage() {
	const [seasons, players] = await Promise.all([
		prisma.season.findMany({ orderBy: { name: 'desc' } }),
		prisma.player.findMany({ orderBy: { number: 'asc' } }),
	]);

	return (
		<div className='min-h-screen bg-zinc-800 p-6 md:p-10'>
			<div className='max-w-2xl mx-auto'>
				<Link href='/admin/matches' className='text-pink-400 hover:underline mb-4 inline-block'>
					← Wróć do listy meczów
				</Link>

				<h1 className='text-2xl font-bold text-white mb-6'>Dodaj mecz</h1>

				<NewMatchForm players={players} seasons={seasons} />
			</div>
		</div>
	);
}
