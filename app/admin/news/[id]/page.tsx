import Link from 'next/link';
import { notFound } from 'next/navigation';
import NewsForm from '@/components/admin/newsForm';
import { prisma } from '@/lib/prisma';
import { updateNews, deleteNews } from '@/lib/actions/news';

export default async function EditNewsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const item = await prisma.newsItem.findUnique({ where: { id } });

	if (!item) {
		notFound();
	}

	return (
		<div className='min-h-screen bg-zinc-800 p-6 md:p-10'>
			<div className='max-w-2xl mx-auto'>
				<Link href='/admin/news' className='text-pink-400 hover:underline mb-4 inline-block'>
					← Wróć do listy
				</Link>
				<h1 className='text-2xl font-bold text-white mb-6'>Edytuj wiadomość</h1>
				<NewsForm action={updateNews.bind(null, id)} item={item} />

				<form action={deleteNews.bind(null, id)} className='mt-4'>
					<button className='w-full py-2 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/10'>
						Usuń wiadomość
					</button>
				</form>
			</div>
		</div>
	);
}
