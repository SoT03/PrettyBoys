import Link from 'next/link';
import PlayerForm from '@/components/admin/playerForm';
import { addPlayer } from '@/lib/actions/players';

export default function NewPlayerPage() {
	return (
		<div className='min-h-screen bg-zinc-800 p-6 md:p-10'>
			<div className='max-w-2xl mx-auto'>
				<Link href='/admin/players' className='text-pink-400 hover:underline mb-4 inline-block'>
					← Wróć do listy
				</Link>
				<h1 className='text-2xl font-bold text-white mb-6'>Dodaj nowego zawodnika</h1>
				<PlayerForm action={addPlayer} />
			</div>
		</div>
	);
}
