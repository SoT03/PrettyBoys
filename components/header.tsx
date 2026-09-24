'use client';
import React from 'react';
import headerImg from '../assets/header/header.webp';
import Image from 'next/image';

export default function Header() {
	return (
		<header className='relative h-[40vh] w-full xl:h-[60vh] bg-zinc-800 '>
			<Image
				src={headerImg.src}
				alt='Header Image'
				layout='fill'
				className='object-cover lg:object-fill'
				priority
			/>
		</header>
	);
}
