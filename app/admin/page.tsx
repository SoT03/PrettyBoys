'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
	const router = useRouter();

	const handleLogout = async () => {
		await fetch('/api/admin/login', { method: 'DELETE' });
		router.push('/admin/login');
		router.refresh();
	};

	const sections = [
		{ label: 'Mecze', href: '/admin/matches', description: 'Terminarz, wyniki, gole, asysty i kartki' },
		{ label: 'Tabela ligowa', href: '/admin/seasons', description: 'Sezony i pozycje w tabeli' },
		{ label: 'Drużyna', href: '/admin/players', description: 'Skład zawodników' },
		{ label: 'Wiadomości', href: '/admin/news', description: 'Aktualności klubowe' },
	];

	return (
		<div className='min-h-screen bg-zinc-800 p-6 md:p-10'>
			<div className='flex items-center justify-between mb-8'>
				<h1 className='text-3xl font-bold text-white'>Panel Admina</h1>
				<button
					onClick={handleLogout}
					className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'>
					Wyloguj
				</button>
			</div>

			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				{sections.map((s) => (
					<Link
						key={s.href}
						href={s.href}
						className='p-6 border-2 border-pink-300 rounded-md text-white hover:bg-zinc-700 transition-colors'>
						<h2 className='text-xl font-bold mb-1'>{s.label}</h2>
						<p className='text-sm text-zinc-400'>{s.description}</p>
					</Link>
				))}
			</div>
		</div>
	);
}
