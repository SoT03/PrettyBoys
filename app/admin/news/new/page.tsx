import Link from 'next/link';
import NewsForm from '@/components/admin/newsForm';
import { addNews } from '@/lib/actions/news';

export default function NewNewsPage() {
	return (
		<div className='min-h-screen bg-zinc-800 p-6 md:p-10'>
			<div className='max-w-2xl mx-auto'>
				<Link href='/admin/news' className='text-pink-400 hover:underline mb-4 inline-block'>
					← Wróć do listy
				</Link>
				<h1 className='text-2xl font-bold text-white mb-6'>Dodaj wiadomość</h1>
				<NewsForm action={addNews} />
			</div>
		</div>
	);
}
