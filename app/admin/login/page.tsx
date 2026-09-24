'use client';
import { useState } from 'react';

import { useRouter } from 'next/navigation';

export default function AdminLogin() {
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleLogin = async () => {
		setLoading(true);
		setError('');
		try {
			const res = await fetch('/api/admin/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password }),
			});

			if (res.ok) {
				router.push('/admin');
				router.refresh();
			} else {
				setError('Nieprawidłowe hasło!');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-700'>
			<h1 className='text-2xl font-bold mb-4 text-white'>Panel Admina</h1>
			<input
				type='password'
				placeholder='Wpisz hasło'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
				className='px-4 py-2 border rounded'
			/>
			{error && <p className='mt-2 text-red-400 text-sm'>{error}</p>}
			<button
				onClick={handleLogin}
				disabled={loading}
				className='mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50'>
				{loading ? 'Logowanie...' : 'Zaloguj'}
			</button>
		</div>
	);
}
