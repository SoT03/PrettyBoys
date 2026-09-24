import Link from 'next/link';
import React from 'react';

import { usePathname } from 'next/navigation';

export default function MainNavbar({ isActive }: { isActive: boolean }) {
	const pathname = usePathname();

	const navLinks = [
		{
			label: 'Home',
			href: '/',
		},

		{
			label: 'Rozgrywki',
			href: '/matches',
		},
		{
			label: 'Statystyki',
			href: '/statistics',
		},

		{
			label: 'Drużyna',
			href: '/team',
		},
		{
			label: 'Wiadomości',
			href: '/news',
		},
		{
			label: 'O Klubie ',
			href: '/about',
		},
	];

	return (
		<nav
			className={`fixed  w-screen left-0  top-16 flex  text-white flex-col  h-full bg-black bg-opacity-30  items-start text-lg   ${
				isActive ? ' lg:translate-x-0  ' : '-translate-x-full  overflow-hidden'
			} lg:static lg:bg-transparent lg:h-auto lg:translate-x-0 lg:flex-row lg:text-sm lg:overflow-visible lg:m-0 lg:items-center lg:gap-6 lg:w-auto lg:font-semibold xl:text-base  `}>
			{navLinks.map((link, index) => {
				return (
					<Link
						key={link.href}
						className={`  w-full bg-neutral-800 border-b  border-neutral-500  py-4 px-6 lg:px-3  lg:bg-transparent  lg:opacity-100 lg:translate-y-0   lg:border-0 lg:flex lg:items-center lg:w-auto  transition-all duration-700  lg:translate-x-0 lg:py-2   ${
							pathname == link.href ? 'text-pink-400  ' : 'lg:text-white'
						} ${
							isActive
								? 'opacity-100 translate-x-0'
								: 'opacity-0 translate-x-full'
						} link `}
						style={{ transitionDelay: `${index * 0.1}s` }}
						href={link.href}>
						{link.label}
					</Link>
				);
			})}
		</nav>
	);
}
