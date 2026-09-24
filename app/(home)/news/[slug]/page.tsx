import Link from 'next/link';
import { notFound } from 'next/navigation';
import Section from '@/components/ui/section';
import Wrapper from '@/components/wrapper';
import { getNewsBySlug } from '@/lib/data';
import { formatDate } from '@/lib/format';

export default async function NewsDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const item = await getNewsBySlug(slug);

	if (!item) {
		notFound();
	}

	return (
		<Section>
			<Wrapper>
				<Link href='/news' className='text-pink-400 hover:underline'>
					← Wszystkie wiadomości
				</Link>

				<article className='mt-6'>
					<span className='text-sm text-zinc-400'>
						{formatDate(item.date)}
					</span>
					<h1 className='text-3xl font-bold text-white mb-6 lg:text-4xl'>
						{item.title}
					</h1>
					<p className='text-zinc-200 leading-relaxed whitespace-pre-line'>
						{item.content}
					</p>
				</article>
			</Wrapper>
		</Section>
	);
}
