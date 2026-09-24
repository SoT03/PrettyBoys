export function formatDate(value: string | Date): string {
	if (!value) return '—';
	const date = typeof value === 'string' ? new Date(value) : value;
	return date.toLocaleDateString('pl-PL', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});
}

export function formatTime(value: Date): string {
	return value.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
}
