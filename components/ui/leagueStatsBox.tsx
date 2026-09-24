import React from 'react';
import Image from 'next/image';
import logo from '../../assets/logo/logo-noBG.png';
import { Icon } from 'lucide-react';
import { soccerBall } from '@lucide/lab';
import Link from 'next/link';
import { getStandings } from '@/lib/data';

export default async function LeagueStatsBox() {
	const standings = await getStandings();
	if (standings.length === 0) return null;
	const [latest] = standings;
	const { season, table } = latest;
	const us = table.find((row) => row.team === 'Pretty Boys') ?? table[0];
	if (!us) return null;

	return (
		<Link
			target='_blank'
			href={'http://www.gl6.pl/Competition/Index/1'}
			className='p-6 border-2 border-pink-300 rounded-md shadow-sm shadow-pink-300 hover:scale-105 transition-transform duration-300'>
			<h2 className='text-center text-2xl mb-6 font-bold lg:text-3xl'>
				{season}
			</h2>
			<div className='flex items-center justify-around mb-8 lg:mb-10'>
				<Image
					width={128}
					height={128}
					src={logo.src}
					alt=''
					className='h-20 w-20 md:w-28 md:h-28'
				/>
				<div className='flex flex-col gap-x-28'>
					<div className='flex gap-2'>
						<p>
							<span className='text-xl font-bold'>{us.position}</span> miejsce{' '}
						</p>
						<p>
							<span className='text-xl font-bold'>{us.points}</span>
							pkt{' '}
						</p>
					</div>
					<div className='flex  items-center text-2xl font-bold'>
						<p>
							<span className='text-green-500'>{us.win}</span> -{' '}
							<span className='text-yellow-500'>{us.draw}</span> -{' '}
							<span className='text-red-500'>{us.loss}</span>
						</p>
					</div>
					<div className='flex text-xl gap-4 '>
						<span className='flex items-center gap-1'>
							{us.goalsFor}{' '}
							<Icon className='text-green-500 w-4' iconNode={soccerBall} />
						</span>
						<span className='flex items-center gap-1'>
							{us.goalsAgainst}{' '}
							<Icon className='text-red-500 w-4' iconNode={soccerBall} />
						</span>
					</div>
				</div>
			</div>
			<hr className='lg:mb-4' />
		</Link>
	);
}
