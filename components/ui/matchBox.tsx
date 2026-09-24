import React from 'react';
import Image from 'next/image';
import logo from '../../assets/logo/logo-noBG.png';

interface MatchBoxProps {
	title: string;
	date?: string;
	round?: string;
	opponent?: string;
	home?: boolean;
	score?: [number, number];
}

export default function MatchBox({
	title,
	date,
	round,
	opponent,
	home = true,
	score,
}: MatchBoxProps) {
	const us = 'Pretty Boys';
	const homeLabel = home ? us : opponent ?? '—';
	const awayLabel = home ? opponent ?? '—' : us;

	return (
		<div className='p-6 border-2 border-pink-300 rounded-md shadow-sm shadow-pink-300 '>
			<h2 className='text-center text-2xl mb-6 font-bold lg:text-3xl'>
				{title}
			</h2>
			<div className='flex items-center justify-around mb-4 lg:mb-6'>
				<div className='flex flex-col items-center gap-2'>
					<Image
						width={128}
						height={128}
						src={home ? logo.src : logo.src}
						alt=''
						className={`h-20 w-20 md:w-28 md:h-28 ${home ? '' : 'opacity-40'}`}
					/>
					<span className='text-xs text-center max-w-[6rem]'>{homeLabel}</span>
				</div>
				<div className='flex flex-col items-center '>
					<span className='text-sm'>{date ?? '—'}</span>
					<span className='text-2xl font-bold lg:text-3xl'>
						{score ? `${score[0]} : ${score[1]}` : '13:30'}{' '}
					</span>
					<span className='text-sm'>{round ?? ''}</span>
				</div>
				<div className='flex flex-col items-center gap-2'>
					<Image
						src={logo.src}
						width={128}
						height={128}
						alt=''
						className={`h-20 w-20 md:w-28 md:h-28 ${home ? 'opacity-40' : ''}`}
					/>
					<span className='text-xs text-center max-w-[6rem]'>{awayLabel}</span>
				</div>
			</div>
			<hr className='lg:mb-4' />
		</div>
	);
}
