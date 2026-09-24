import type { NewsItem } from '@prisma/client';

const toDateInputValue = (date: Date) => date.toISOString().slice(0, 10);

export default function NewsForm({
	action,
	item,
}: {
	action: (formData: FormData) => void;
	item?: NewsItem;
}) {
	return (
		<form action={action} className='bg-zinc-900 p-6 rounded-xl space-y-4 border-2 border-pink-300'>
			<div>
				<label className='block text-sm font-medium text-white mb-1'>Tytuł</label>
				<input
					name='title'
					required
					type='text'
					defaultValue={item?.title}
					className='w-full border border-zinc-600 bg-zinc-800 text-white rounded-md p-2'
				/>
			</div>
			<div>
				<label className='block text-sm font-medium text-white mb-1'>Slug (adres URL)</label>
				<input
					name='slug'
					type='text'
					defaultValue={item?.slug}
					placeholder='zostanie wygenerowany z tytułu, jeśli puste'
					className='w-full border border-zinc-600 bg-zinc-800 text-white rounded-md p-2'
				/>
			</div>
			<div>
				<label className='block text-sm font-medium text-white mb-1'>Data</label>
				<input
					name='date'
					required
					type='date'
					defaultValue={item ? toDateInputValue(item.date) : ''}
					className='w-full border border-zinc-600 bg-zinc-800 text-white rounded-md p-2'
				/>
			</div>
			<div>
				<label className='block text-sm font-medium text-white mb-1'>Zajawka</label>
				<textarea
					name='excerpt'
					defaultValue={item?.excerpt}
					className='w-full border border-zinc-600 bg-zinc-800 text-white rounded-md p-2'
				/>
			</div>
			<div>
				<label className='block text-sm font-medium text-white mb-1'>Treść</label>
				<textarea
					name='content'
					rows={6}
					defaultValue={item?.content}
					className='w-full border border-zinc-600 bg-zinc-800 text-white rounded-md p-2'
				/>
			</div>
			<button
				type='submit'
				className='w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition'>
				Zapisz wiadomość
			</button>
		</form>
	);
}
