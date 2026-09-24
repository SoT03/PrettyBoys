import Link from 'next/link';
import Section from '@/components/ui/section';
import Wrapper from '@/components/wrapper';
import { getNews } from '@/lib/data';
import { formatDate } from '@/lib/format';

export const metadata = {
	title: 'Wiadomości | Pretty Boys',
};

export default async function NewsPage() {
	const news = await getNews();

	return (
		<Section>
			<Wrapper>
				<h1 className='text-3xl font-bold text-white mb-10 lg:text-4xl'>
					Wiadomości
				</h1>

				<div className='flex flex-col gap-6'>
					{news.map((item) => (
						<Link
							key={item.id}
							href={`/news/${item.slug}`}
							className='p-6 border-2 border-pink-300 rounded-md shadow-sm shadow-pink-300 hover:scale-[1.01] transition-transform duration-300'>
							<span className='text-sm text-zinc-400'>
								{formatDate(item.date)}
							</span>
							<h2 className='text-2xl font-bold text-white mb-2'>
								{item.title}
							</h2>
							<p className='text-zinc-300'>{item.excerpt}</p>
						</Link>
					))}
				</div>

				{news.length === 0 && (
					<p className='text-white'>Brak aktualności.</p>
				)}
			</Wrapper>
		</Section>
	);
}
