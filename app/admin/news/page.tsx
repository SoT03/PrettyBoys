import Link from 'next/link';
import { getNews } from '@/lib/data';
import { formatDate } from '@/lib/format';
import { deleteNews } from '@/lib/actions/news';

export default async function AdminNewsPage() {
	const news = await getNews();

	return (
		<div className='min-h-screen bg-zinc-800 p-6 md:p-10'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6'>
				<h1 className='text-3xl font-bold text-white'>Wiadomości</h1>
				<div className='flex items-center gap-4'>
					<Link
						href='/admin/news/new'
						className='px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 text-sm sm:text-base'>
						+ Dodaj wiadomość
					</Link>
					<Link href='/admin' className='text-pink-400 hover:underline'>
						← Powrót
					</Link>
				</div>
			</div>

			<div className='flex flex-col gap-3'>
				{news.map((n) => (
					<div
						key={n.id}
						className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 bg-zinc-900 rounded-lg border-2 border-pink-300'>
						<div>
							<span className='text-xs text-zinc-400'>{formatDate(n.date)}</span>
							<h2 className='text-lg font-bold text-white'>{n.title}</h2>
						</div>
						<div className='flex items-center gap-4'>
							<Link href={`/admin/news/${n.id}`} className='text-pink-400 hover:underline'>
								Edytuj
							</Link>
							<form action={deleteNews.bind(null, n.id)}>
								<button className='text-red-400 hover:underline'>Usuń</button>
							</form>
						</div>
					</div>
				))}

				{news.length === 0 && (
					<p className='text-center p-8 text-zinc-400'>Brak wiadomości.</p>
				)}
			</div>
		</div>
	);
}
