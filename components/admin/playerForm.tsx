import type { Player } from '@prisma/client';

const toDateInputValue = (date: Date | null) =>
	date ? date.toISOString().slice(0, 10) : '';

export default function PlayerForm({
	action,
	player,
}: {
	action: (formData: FormData) => void;
	player?: Player;
}) {
	return (
		<form action={action} className='bg-zinc-900 p-6 rounded-xl space-y-4 border-2 border-pink-300'>
			<div className='grid grid-cols-2 gap-4'>
				<div>
					<label className='block text-sm font-medium text-white mb-1'>Imię</label>
					<input
						name='firstName'
						required
						type='text'
						defaultValue={player?.firstName}
						className='w-full border border-zinc-600 bg-zinc-800 text-white rounded-md p-2 focus:ring-2 focus:ring-pink-500 outline-none'
						placeholder='Robert'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium text-white mb-1'>Nazwisko</label>
					<input
						name='lastName'
						required
						type='text'
						defaultValue={player?.lastName}
						className='w-full border border-zinc-600 bg-zinc-800 text-white rounded-md p-2 focus:ring-2 focus:ring-pink-500 outline-none'
						placeholder='Lewandowski'
					/>
				</div>
			</div>

			<div className='grid grid-cols-2 gap-4'>
				<div>
					<label className='block text-sm font-medium text-white mb-1'>Pozycja</label>
					<select
						name='position'
						defaultValue={player?.position ?? 'Bramkarz'}
						className='w-full border border-zinc-600 bg-zinc-800 text-white rounded-md p-2'>
						<option value='Bramkarz'>Bramkarz</option>
						<option value='Obrońca'>Obrońca</option>
						<option value='Pomocnik'>Pomocnik</option>
						<option value='Napastnik'>Napastnik</option>
					</select>
				</div>
				<div>
					<label className='block text-sm font-medium text-white mb-1'>Numer</label>
					<input
						name='number'
						required
						type='number'
						defaultValue={player?.number}
						className='w-full border border-zinc-600 bg-zinc-800 text-white rounded-md p-2'
						placeholder='9'
					/>
				</div>
			</div>

			<div className='grid grid-cols-2 gap-4'>
				<div>
					<label className='block text-sm font-medium text-white mb-1'>Data urodzenia</label>
					<input
						name='birthDate'
						type='date'
						defaultValue={toDateInputValue(player?.birthDate ?? null)}
						className='w-full border border-zinc-600 bg-zinc-800 text-white rounded-md p-2'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium text-white mb-1'>W klubie od</label>
					<input
						name='joined'
						type='text'
						defaultValue={player?.joined ?? ''}
						className='w-full border border-zinc-600 bg-zinc-800 text-white rounded-md p-2'
						placeholder='2023'
					/>
				</div>
			</div>

			<div>
				<label className='block text-sm font-medium text-white mb-1'>Zdjęcie (URL)</label>
				<input
					name='imageUrl'
					type='text'
					defaultValue={player?.imageUrl ?? ''}
					className='w-full border border-zinc-600 bg-zinc-800 text-white rounded-md p-2'
					placeholder='https://...'
				/>
			</div>

			<div>
				<label className='block text-sm font-medium text-white mb-1'>Opis</label>
				<textarea
					name='bio'
					defaultValue={player?.bio ?? ''}
					className='w-full border border-zinc-600 bg-zinc-800 text-white rounded-md p-2'
				/>
			</div>

			<button
				type='submit'
				className='w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition mt-4'>
				Zapisz zawodnika
			</button>
		</form>
	);
}
