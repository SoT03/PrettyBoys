import React from 'react';
import Link from 'next/link';

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className='w-full bg-zinc-900 text-zinc-300 mt-10'>
			<div className='max-w-7xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-3 xl:px-0'>
				<div>
					<span className='block text-2xl font-pacifico text-pink-500 mb-2'>
						Pretty Boys
					</span>
					<p className='text-sm text-zinc-400'>
						Amatorski klub piłkarski. Gramy z pasją, walczymy o każdy punkt.
					</p>
				</div>

				<div>
					<h3 className='text-white font-bold mb-3'>Nawigacja</h3>
					<ul className='flex flex-col gap-2 text-sm'>
						<li>
							<Link className='hover:text-pink-400' href='/matches'>
								Rozgrywki
							</Link>
						</li>
						<li>
							<Link className='hover:text-pink-400' href='/statistics'>
								Statystyki
							</Link>
						</li>
						<li>
							<Link className='hover:text-pink-400' href='/team'>
								Drużyna
							</Link>
						</li>
						<li>
							<Link className='hover:text-pink-400' href='/news'>
								Wiadomości
							</Link>
						</li>
						<li>
							<Link className='hover:text-pink-400' href='/about'>
								O Klubie
							</Link>
						</li>
					</ul>
				</div>

				<div>
					<h3 className='text-white font-bold mb-3'>Kontakt</h3>
					<p className='text-sm text-zinc-400'>kontakt@prettyboys.pl</p>
					<p className='text-sm text-zinc-400'>Boisko miejskie, ul. Sportowa 1</p>
				</div>
			</div>
			<div className='border-t border-zinc-800 py-4 text-center text-xs text-zinc-500'>
				© {year} Pretty Boys. Wszelkie prawa zastrzeżone.
			</div>
		</footer>
	);
}
