'use client';
import React, { useState } from 'react';
import MainNavbar from './mainNavbar';

import Link from 'next/link';

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	const burgerLines = [
		{
			openPos: 'rotate-[135deg] top-0',
			closePos: 'top-3 -rotate-0 ',
		},
		{
			openPos: 'rotate-[135deg]',
			closePos: '',
		},
		{
			openPos: '-rotate-[135deg] top-0',
			closePos: '-top-3 -rotate-0 ',
		},
	];

	return (
		<div className='w-full bg-zinc-700  sticky top-0 left-0 text-pink-500  h-16  shadow-md  z-50  '>
			<div className='h-full  flex items-center justify-between mx-6 xl:mx-20'>
				<Link
					href={'/'}
					className='relative block  text-2xl  uppercase   font-pacifico'>
					Pretty Boys
				</Link>

				<div
					className='relative ml-auto mb-1  cursor-pointer text-white  z-20 lg:hidden  '
					onClick={() => setIsOpen(!isOpen)}>
					{burgerLines.map((line) => (
						<span
							key={line.openPos}
							className={`block absolute right-1/2  h-1 w-12 bg-pink-500   border-black border-px transition-all duration-700 ${
								isOpen ? line.openPos : line.closePos
							}`}
						/>
					))}
				</div>

				<div>
					<MainNavbar isActive={isOpen} />
				</div>
			</div>
		</div>
	);
}
