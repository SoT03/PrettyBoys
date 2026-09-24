import Image from 'next/image';
import Link from 'next/link';
import Section from '@/components/ui/section';
import Wrapper from '@/components/wrapper';
import { getTeam } from '@/lib/data';
import logo from '@/assets/logo/logo-noBG.png';

export const metadata = {
	title: 'Drużyna | Pretty Boys',
};

export default async function TeamPage() {
	const players = await getTeam();

	return (
		<Section>
			<Wrapper>
				<h1 className='text-3xl font-bold text-white mb-10 lg:text-4xl'>
					Drużyna
				</h1>

				<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
					{players.map((p) => (
						<Link
							key={p.id}
							href={`/team/${p.id}`}
							className='flex flex-col items-center p-6 border-2 border-pink-300 rounded-md shadow-sm shadow-pink-300 hover:scale-105 transition-transform duration-300'>
							<Image
								src={p.imageUrl || logo.src}
								width={96}
								height={96}
								alt=''
								className={`h-24 w-24 mb-4 rounded-full object-cover ${p.imageUrl ? '' : 'opacity-70'}`}
							/>
							<span className='text-3xl font-bold text-pink-400'>
								#{p.number}
							</span>
							<span className='text-xl font-bold text-white text-center'>
								{p.firstName} {p.lastName}
							</span>
							<span className='text-sm text-zinc-400'>{p.position}</span>
						</Link>
					))}
				</div>

				{players.length === 0 && (
					<p className='text-white'>Skład drużyny zostanie wkrótce ogłoszony.</p>
				)}
			</Wrapper>
		</Section>
	);
}
